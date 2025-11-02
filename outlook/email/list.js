/**
 * List emails functionality
 */
const { GraphService } = require('../services/graph-service');

// Email fields to retrieve
const EMAIL_SELECT_FIELDS = [
  'subject',
  'receivedDateTime',
  'from',
  'toRecipients',
  'bodyPreview',
  'hasAttachments',
  'isRead'
].join(',');

/**
 * List emails handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleListEmails(args) {
  const folder = args.folder || "inbox";
  const count = args.count || 10;

  try {
    // Initialize GraphService
    const graphService = new GraphService();

    // Build API endpoint - always resolve the folder ID for consistency
    let endpoint = '/me/messages';
    let resolvedFolderName = folder;

    // Get the folder ID - this ensures we get emails from the specific folder only
    const folderLower = folder.toLowerCase();

    if (folderLower === 'inbox') {
      // For inbox, we can use the special 'inbox' folder ID or resolve it
      const folderResponse = await graphService.graphRequest(
        `/me/mailFolders?$filter=displayName eq 'Inbox'&$select=id,displayName`
      );

      if (folderResponse.value && folderResponse.value.length > 0) {
        endpoint = `/me/mailFolders/${folderResponse.value[0].id}/messages`;
        console.error(`Resolved Inbox to folder ID: ${folderResponse.value[0].id}`);
      }
    } else {
      // For other folders, resolve by display name
      const folderResponse = await graphService.graphRequest(
        `/me/mailFolders?$filter=displayName eq '${folder}'&$select=id,displayName`
      );

      if (folderResponse.value && folderResponse.value.length > 0) {
        endpoint = `/me/mailFolders/${folderResponse.value[0].id}/messages`;
        console.error(`Resolved '${folder}' to folder ID: ${folderResponse.value[0].id}`);
      } else {
        // If folder not found, inform user
        return {
          content: [{
            type: "text",
            text: `Folder '${folder}' not found. Please check the folder name and try again.`
          }]
        };
      }
    }

    // Add query parameters
    const queryParams = {
      $top: count,
      $orderby: 'receivedDateTime desc',
      $select: EMAIL_SELECT_FIELDS
    };

    console.error(`Listing ${count} emails from: ${endpoint}`);

    // Make API call
    const response = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(queryParams)); if (!response.value || response.value.length === 0) {
      return {
        content: [{
          type: "text",
          text: `No emails found in ${folder}.`
        }]
      };
    }

    // Format results
    const emailList = response.value.map((email, index) => {
      const sender = email.from ? email.from.emailAddress : { name: 'Unknown', address: 'unknown' };
      const date = new Date(email.receivedDateTime).toLocaleString();
      const readStatus = email.isRead ? '' : '[UNREAD] ';

      return `${index + 1}. ${readStatus}${date} - From: ${sender.name} (${sender.address})\nSubject: ${email.subject}\nID: ${email.id}\n`;
    }).join("\n");

    return {
      content: [{
        type: "text",
        text: `Found ${response.value.length} emails in ${folder}:\n\n${emailList}`
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
        text: `Error listing emails: ${error.message}`
      }]
    };
  }
}

module.exports = handleListEmails;
