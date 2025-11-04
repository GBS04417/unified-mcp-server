/**
 * Read email functionality
 */
const { GraphService } = require('../services/graph-service');

// Email fields to retrieve for detailed view
const EMAIL_DETAIL_FIELDS = [
  'subject',
  'receivedDateTime',
  'from',
  'toRecipients',
  'ccRecipients',
  'bccRecipients',
  'body',
  'bodyPreview',
  'hasAttachments',
  'isRead',
  'importance',
  'conversationId'
].join(',');

/**
 * Read email handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleReadEmail(args) {
  const { id, from, subject, query } = args;

  // If no ID provided, try to search for email by criteria
  if (!id) {
    if (!from && !subject && !query) {
      return {
        content: [{
          type: "text",
          text: "Either an email ID or at least one search criterion (from, subject, or query) is required.\n\nExample 1 - Read by ID: {'id': 'AAMk...'}\nExample 2 - Search and read: {'from': 'sender@example.com'}\nExample 3 - Search and read: {'subject': 'Meeting Notes'}"
        }]
      };
    }

    // Search for email matching criteria
    return await readEmailBySearchCriteria(args);
  }

  // If email address was provided instead of ID, reject it with helpful message
  if (id.includes('@')) {
    return {
      content: [{
        type: "text",
        text: `'${id}' looks like an email address, not an email ID.\n\nTo read this email, you have two options:\n\n1. Use search criteria: {'from': '${id}'}\n2. Get the email ID first using search-emails, then use: {'id': 'AAMk...'}\n\nEmail IDs look like: AAMkAGFkODJkNzg4LWMwN2YtNDEwOC1hYjQ1LWI3ZWY3MDU3ZWMzYQBGAAA...`
      }]
    };
  }

  // Read email by ID
  return await readEmailById(id);
}

/**
 * Read email by its unique ID
 */
async function readEmailById(emailId) {
  if (!emailId) {
    return {
      content: [{
        type: "text",
        text: "Email ID is required."
      }]
    };
  }

  try {
    // Initialize GraphService
    const graphService = new GraphService();

    // Trim and validate email ID
    const trimmedId = emailId.trim();
    if (!trimmedId) {
      return {
        content: [{
          type: "text",
          text: "Email ID cannot be empty or whitespace only."
        }]
      };
    }

    // Make API call to get email details
    // Don't use encodeURIComponent - Graph API expects raw IDs
    const endpoint = `/me/messages/${trimmedId}`;
    const queryParams = {
      $select: EMAIL_DETAIL_FIELDS
    };

    try {
      const email = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(queryParams));

      if (!email) {
        return {
          content: [
            {
              type: "text",
              text: `Email with ID ${trimmedId} not found.`
            }
          ]
        };
      }

      // Format sender, recipients, etc.
      const sender = email.from ? `${email.from.emailAddress.name} (${email.from.emailAddress.address})` : 'Unknown';
      const to = email.toRecipients ? email.toRecipients.map(r => `${r.emailAddress.name} (${r.emailAddress.address})`).join(", ") : 'None';
      const cc = email.ccRecipients && email.ccRecipients.length > 0 ? email.ccRecipients.map(r => `${r.emailAddress.name} (${r.emailAddress.address})`).join(", ") : 'None';
      const bcc = email.bccRecipients && email.bccRecipients.length > 0 ? email.bccRecipients.map(r => `${r.emailAddress.name} (${r.emailAddress.address})`).join(", ") : 'None';
      const date = new Date(email.receivedDateTime).toLocaleString();

      // Extract body content
      let body = '';
      if (email.body) {
        body = email.body.contentType === 'html' ?
          // Simple HTML-to-text conversion for HTML bodies
          email.body.content.replace(/<[^>]*>/g, '') :
          email.body.content;
      } else {
        body = email.bodyPreview || 'No content';
      }

      // Format the email
      const formattedEmail = `From: ${sender}
To: ${to}
${cc !== 'None' ? `CC: ${cc}\n` : ''}${bcc !== 'None' ? `BCC: ${bcc}\n` : ''}Subject: ${email.subject}
Date: ${date}
Importance: ${email.importance || 'normal'}
Has Attachments: ${email.hasAttachments ? 'Yes' : 'No'}

${body}`;

      return {
        content: [
          {
            type: "text",
            text: formattedEmail
          }
        ]
      };
    } catch (error) {
      console.error(`Error reading email with ID '${trimmedId}': ${error.message}`);

      // Improved error handling with specific error codes
      if (error.message.includes('ErrorInvalidIdMalformed')) {
        return {
          content: [
            {
              type: "text",
              text: `Error: The email ID '${trimmedId}' is malformed or invalid. This can happen if:\n- The ID was modified or corrupted\n- The ID contains invalid characters\n- The email has been deleted\n\nPlease get a fresh email ID using the search-emails or list-emails tool.`
            }
          ]
        };
      } else if (error.message.includes("doesn't belong to the targeted mailbox")) {
        return {
          content: [
            {
              type: "text",
              text: `The email with ID '${trimmedId}' doesn't belong to your mailbox or has been deleted.`
            }
          ]
        };
      } else if (error.message.includes('ErrorItemNotFound') || error.message.includes('404')) {
        return {
          content: [
            {
              type: "text",
              text: `Email with ID '${trimmedId}' not found. It may have been deleted.`
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Failed to read email: ${error.message}\n\nEmail ID: ${trimmedId}`
            }
          ]
        };
      }
    }
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
        text: `Error accessing email: ${error.message}`
      }]
    };
  }
}

/**
 * Read email by searching for it based on criteria
 */
async function readEmailBySearchCriteria(args) {
  const { from, subject, query } = args;

  try {
    const graphService = new GraphService();
    const endpoint = '/me/messages';

    console.error(`Searching for email with criteria: from='${from}' subject='${subject}' query='${query}'`);

    // Always use fallback strategy: fetch large batch and filter client-side
    // This is more reliable than relying on Graph API search
    const fallbackParams = {
      $top: 500,
      $select: EMAIL_DETAIL_FIELDS,
      $orderby: 'receivedDateTime desc'
    };

    let emails;
    try {
      const result = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(fallbackParams));
      emails = result && result.value ? result.value : [];
    } catch (error) {
      console.error(`Failed to fetch emails: ${error.message}`);
      return {
        content: [{
          type: "text",
          text: `Failed to search for email: ${error.message}`
        }]
      };
    }

    if (!emails || emails.length === 0) {
      return {
        content: [{
          type: "text",
          text: `No emails found in mailbox.\n\nTry using list-emails to see available emails.`
        }]
      };
    }

    // Filter emails client-side based on all criteria
    let filtered = emails;

    // Filter by subject
    if (subject) {
      const subjectLower = subject.toLowerCase();
      console.error(`Filtering by subject: '${subject}'`);
      filtered = filtered.filter(e =>
        e.subject && e.subject.toLowerCase().includes(subjectLower)
      );
      console.error(`After subject filter: ${filtered.length} emails`);
    }

    // Filter by query (search in subject AND body)
    if (query) {
      const queryLower = query.toLowerCase();
      console.error(`Filtering by query: '${query}'`);
      filtered = filtered.filter(e => {
        const subjectMatch = e.subject && e.subject.toLowerCase().includes(queryLower);
        const bodyMatch = e.bodyPreview && e.bodyPreview.toLowerCase().includes(queryLower);
        return subjectMatch || bodyMatch;
      });
      console.error(`After query filter: ${filtered.length} emails`);
    }

    // Filter by sender
    if (from) {
      const fromLower = from.toLowerCase();
      console.error(`Filtering by sender: '${from}'`);
      filtered = filtered.filter(e => {
        if (e.from && e.from.emailAddress) {
          const senderEmail = e.from.emailAddress.address.toLowerCase();
          const senderName = e.from.emailAddress.name ? e.from.emailAddress.name.toLowerCase() : '';
          return senderEmail.includes(fromLower) || senderName.includes(fromLower);
        }
        return false;
      });
      console.error(`After sender filter: ${filtered.length} emails`);
    }

    // Check if we have any results
    if (filtered.length === 0) {
      return {
        content: [{
          type: "text",
          text: `No email found matching your criteria:\n${from ? `- From: ${from}\n` : ''}${subject ? `- Subject: ${subject}\n` : ''}${query ? `- Contains: ${query}\n` : ''}\n\nTry using list-emails or search-emails first to verify the email exists.`
        }]
      };
    }

    // Get the first matching email
    const email = filtered[0];

    // Format sender, recipients, etc.
    const sender = email.from ? `${email.from.emailAddress.name} (${email.from.emailAddress.address})` : 'Unknown';
    const to = email.toRecipients ? email.toRecipients.map(r => `${r.emailAddress.name} (${r.emailAddress.address})`).join(", ") : 'None';
    const cc = email.ccRecipients && email.ccRecipients.length > 0 ? email.ccRecipients.map(r => `${r.emailAddress.name} (${r.emailAddress.address})`).join(", ") : 'None';
    const bcc = email.bccRecipients && email.bccRecipients.length > 0 ? email.bccRecipients.map(r => `${r.emailAddress.name} (${r.emailAddress.address})`).join(", ") : 'None';
    const date = new Date(email.receivedDateTime).toLocaleString();

    // Extract body content
    let body = '';
    if (email.body) {
      body = email.body.contentType === 'html' ?
        email.body.content.replace(/<[^>]*>/g, '') :
        email.body.content;
    } else {
      body = email.bodyPreview || 'No content';
    }

    // Format the email
    const formattedEmail = `From: ${sender}
To: ${to}
${cc !== 'None' ? `CC: ${cc}\n` : ''}${bcc !== 'None' ? `BCC: ${bcc}\n` : ''}Subject: ${email.subject}
Date: ${date}
Importance: ${email.importance || 'normal'}
Has Attachments: ${email.hasAttachments ? 'Yes' : 'No'}
Email ID: ${email.id}

${body}`;

    return {
      content: [{
        type: "text",
        text: formattedEmail
      }]
    };

  } catch (error) {
    console.error(`Error searching for email: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Failed to search for email: ${error.message}`
      }]
    };
  }
}

module.exports = handleReadEmail;
