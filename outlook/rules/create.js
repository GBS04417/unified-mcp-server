/**
 * Create rule functionality
 */
const { GraphService } = require('../services/graph-service');
const { getFolderIdByName } = require('../email/folder-utils');
const { getInboxRules } = require('./list');
const { ensureAuthenticated } = require('../auth/index');

/**
 * Create rule handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleCreateRule(args) {
  const {
    name,
    fromAddresses,
    containsSubject,
    hasAttachments,
    moveToFolder,
    markAsRead,
    isEnabled = true,
    sequence
  } = args;

  // Add validation for sequence parameter
  if (sequence !== undefined && (isNaN(sequence) || sequence < 1)) {
    return {
      content: [{
        type: "text",
        text: "Sequence must be a positive number greater than zero."
      }]
    };
  }

  if (!name) {
    return {
      content: [{
        type: "text",
        text: "Rule name is required."
      }]
    };
  }

  // Validate that at least one condition or action is specified
  const hasCondition = fromAddresses || containsSubject || hasAttachments === true;
  const hasAction = moveToFolder || markAsRead === true;

  if (!hasCondition) {
    return {
      content: [{
        type: "text",
        text: "At least one condition is required. Specify fromAddresses, containsSubject, or hasAttachments."
      }]
    };
  }

  if (!hasAction) {
    return {
      content: [{
        type: "text",
        text: "At least one action is required. Specify moveToFolder or markAsRead."
      }]
    };
  }

  try {
    // Get access token
    const accessToken = await ensureAuthenticated();

    // Create rule
    const result = await createInboxRule(accessToken, {
      name,
      fromAddresses,
      containsSubject,
      hasAttachments,
      moveToFolder,
      markAsRead,
      isEnabled,
      sequence
    });

    let responseText = result.message;

    // Add a tip about sequence if it wasn't provided
    if (!sequence && !result.error) {
      responseText += "\n\nTip: You can specify a 'sequence' parameter when creating rules to control their execution order. Lower sequence numbers run first.";
    }

    return {
      content: [{
        type: "text",
        text: responseText
      }]
    };
  } catch (error) {
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }

    return {
      content: [{
        type: "text",
        text: `Error creating rule: ${error.message}`
      }]
    };
  }
}

/**
 * Create a new inbox rule
 * @param {string} accessToken - Access token
 * @param {object} ruleOptions - Rule creation options
 * @returns {Promise<object>} - Result object with status and message
 */
async function createInboxRule(accessToken, ruleOptions) {
  try {
    const {
      name,
      fromAddresses,
      containsSubject,
      hasAttachments,
      moveToFolder,
      markAsRead,
      isEnabled,
      sequence
    } = ruleOptions;

    // Get existing rules to determine sequence if not provided
    let ruleSequence = sequence;
    if (!ruleSequence) {
      try {
        // Default to 100 if we can't get existing rules
        ruleSequence = 100;

        // Get existing rules to find highest sequence
        const existingRules = await getInboxRules(accessToken);
        if (existingRules && existingRules.length > 0) {
          // Find the highest sequence
          const highestSequence = Math.max(...existingRules.map(r => r.sequence || 0));
          // Set new rule sequence to be higher
          ruleSequence = Math.max(highestSequence + 1, 100);
          console.error(`Auto-generated sequence: ${ruleSequence} (based on highest existing: ${highestSequence})`);
        }
      } catch (sequenceError) {
        console.error(`Error determining rule sequence: ${sequenceError.message}`);
        // Fall back to default value
        ruleSequence = 100;
      }
    }

    console.error(`Using rule sequence: ${ruleSequence}`);

    // Make sure sequence is a positive integer
    ruleSequence = Math.max(1, Math.floor(ruleSequence));

    // Build conditions object
    const conditions = {};

    // Add conditions
    if (fromAddresses) {
      // Parse email addresses
      const emailAddresses = fromAddresses.split(',')
        .map(email => email.trim())
        .filter(email => email)
        .map(email => ({
          emailAddress: {
            address: email
          }
        }));

      if (emailAddresses.length > 0) {
        conditions.fromAddresses = emailAddresses;
      }
    }

    if (containsSubject) {
      conditions.subjectContains = [containsSubject];
    }

    if (hasAttachments === true) {
      conditions.hasAttachment = true;
    }

    // Build actions object
    const actions = {};

    // Add actions
    if (moveToFolder) {
      // Get folder ID
      try {
        const folderId = await getFolderIdByName(accessToken, moveToFolder);
        if (!folderId) {
          return {
            success: false,
            message: `Target folder "${moveToFolder}" not found. Please specify a valid folder name.`
          };
        }

        actions.moveToFolder = folderId;
      } catch (folderError) {
        console.error(`Error resolving folder "${moveToFolder}": ${folderError.message}`);
        return {
          success: false,
          message: `Error resolving folder "${moveToFolder}": ${folderError.message}`
        };
      }
    }

    if (markAsRead === true) {
      actions.markAsRead = true;
    }

    // Validate we have at least one condition and one action
    if (Object.keys(conditions).length === 0) {
      return {
        success: false,
        message: "At least one condition must be specified (fromAddresses, containsSubject, or hasAttachments)."
      };
    }

    if (Object.keys(actions).length === 0) {
      return {
        success: false,
        message: "At least one action must be specified (moveToFolder or markAsRead)."
      };
    }

    // Build rule object according to Microsoft Graph API specification
    const rule = {
      displayName: name,
      isEnabled: isEnabled === true,
      sequence: ruleSequence,
      conditions: conditions,
      actions: actions
    };

    // Debug: Log the rule object being sent
    console.error('Creating rule with payload:', JSON.stringify(rule, null, 2));

    // Initialize GraphService
    const graphService = new GraphService();

    // Create the rule
    const response = await graphService.graphRequest(
      'me/mailFolders/inbox/messageRules',
      {
        method: 'POST',
        body: JSON.stringify(rule)
      }
    );

    if (response && response.id) {
      return {
        success: true,
        message: `Successfully created rule "${name}" with sequence ${ruleSequence}.`,
        ruleId: response.id
      };
    } else {
      return {
        success: false,
        message: "Failed to create rule. The server didn't return a rule ID."
      };
    }
  } catch (error) {
    console.error(`Error creating rule: ${error.message}`);
    throw error;
  }
}

module.exports = handleCreateRule;
