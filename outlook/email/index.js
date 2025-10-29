/**
 * Email tools for Outlook integration
 * Provides email management functionality through Microsoft Graph API
 */

const { GraphService } = require('../services/graph-service');

// Initialize Graph service
const graphService = new GraphService();

/**
 * List emails with filtering options
 */
async function handleListEmails(args) {
  const {
    folder = 'inbox',
    maxResults = 10,
    filter,
    search,
    unreadOnly = false
  } = args;

  try {
    const emails = await graphService.listEmails(folder, maxResults, filter, search, unreadOnly);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          folder,
          totalEmails: emails.length,
          emails: emails.map(email => ({
            id: email.id,
            subject: email.subject,
            from: email.from?.emailAddress?.address,
            receivedDateTime: email.receivedDateTime,
            isRead: email.isRead,
            importance: email.importance,
            hasAttachments: email.hasAttachments
          }))
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error listing emails: ${error.message}`
      }]
    };
  }
}

/**
 * Read a specific email
 */
async function handleReadEmail(args) {
  const { emailId } = args;
  
  if (!emailId) {
    throw new Error('Email ID is required');
  }

  try {
    const email = await graphService.getEmail(emailId);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          id: email.id,
          subject: email.subject,
          from: email.from,
          to: email.toRecipients,
          cc: email.ccRecipients,
          bcc: email.bccRecipients,
          receivedDateTime: email.receivedDateTime,
          sentDateTime: email.sentDateTime,
          importance: email.importance,
          isRead: email.isRead,
          hasAttachments: email.hasAttachments,
          body: {
            contentType: email.body?.contentType,
            content: email.body?.content
          },
          attachments: email.attachments?.map(att => ({
            id: att.id,
            name: att.name,
            size: att.size,
            contentType: att.contentType
          })) || []
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error reading email: ${error.message}`
      }]
    };
  }
}

/**
 * Send an email
 */
async function handleSendEmail(args) {
  const {
    to,
    subject,
    body,
    cc,
    bcc,
    importance = 'normal',
    attachments
  } = args;

  if (!to || !subject || !body) {
    throw new Error('To, subject, and body are required fields');
  }

  try {
    const result = await graphService.sendEmail({
      to,
      subject,
      body,
      cc,
      bcc,
      importance,
      attachments
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: 'Email sent successfully',
          messageId: result.id
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error sending email: ${error.message}`
      }]
    };
  }
}

/**
 * Mark email as read/unread
 */
async function handleMarkAsRead(args) {
  const { emailId, isRead = true } = args;
  
  if (!emailId) {
    throw new Error('Email ID is required');
  }

  try {
    await graphService.updateEmail(emailId, { isRead });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: `Email marked as ${isRead ? 'read' : 'unread'}`,
          emailId
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error updating email: ${error.message}`
      }]
    };
  }
}

/**
 * Search emails
 */
async function handleSearchEmails(args) {
  const {
    query,
    folder = 'inbox',
    maxResults = 25
  } = args;

  if (!query) {
    throw new Error('Search query is required');
  }

  try {
    const results = await graphService.searchEmails(query, folder, maxResults);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          query,
          folder,
          totalResults: results.length,
          results: results.map(email => ({
            id: email.id,
            subject: email.subject,
            from: email.from?.emailAddress?.address,
            receivedDateTime: email.receivedDateTime,
            snippet: email.bodyPreview,
            isRead: email.isRead
          }))
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error searching emails: ${error.message}`
      }]
    };
  }
}

// Define email tools
const emailTools = [
  {
    name: 'outlook_list_emails',
    description: 'List emails from a specific folder with filtering options',
    inputSchema: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          description: 'Email folder name (e.g., inbox, sent, drafts)',
          default: 'inbox'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of emails to return',
          default: 10
        },
        filter: {
          type: 'string',
          description: 'OData filter expression'
        },
        search: {
          type: 'string',
          description: 'Search query'
        },
        unreadOnly: {
          type: 'boolean',
          description: 'Only return unread emails',
          default: false
        }
      },
      additionalProperties: false
    },
    handler: handleListEmails
  },

  {
    name: 'outlook_read_email',
    description: 'Read a specific email by ID',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: {
          type: 'string',
          description: 'The ID of the email to read'
        }
      },
      required: ['emailId'],
      additionalProperties: false
    },
    handler: handleReadEmail
  },

  {
    name: 'outlook_send_email',
    description: 'Send a new email',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of recipient email addresses'
        },
        subject: {
          type: 'string',
          description: 'Email subject'
        },
        body: {
          type: 'string',
          description: 'Email body content'
        },
        cc: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of CC recipient email addresses'
        },
        bcc: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of BCC recipient email addresses'
        },
        importance: {
          type: 'string',
          enum: ['low', 'normal', 'high'],
          description: 'Email importance level',
          default: 'normal'
        }
      },
      required: ['to', 'subject', 'body'],
      additionalProperties: false
    },
    handler: handleSendEmail
  },

  {
    name: 'outlook_mark_as_read',
    description: 'Mark an email as read or unread',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: {
          type: 'string',
          description: 'The ID of the email to update'
        },
        isRead: {
          type: 'boolean',
          description: 'Whether to mark as read (true) or unread (false)',
          default: true
        }
      },
      required: ['emailId'],
      additionalProperties: false
    },
    handler: handleMarkAsRead
  },

  {
    name: 'outlook_search_emails',
    description: 'Search for emails using a query string',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query string'
        },
        folder: {
          type: 'string',
          description: 'Folder to search in (default: inbox)',
          default: 'inbox'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 25
        }
      },
      required: ['query'],
      additionalProperties: false
    },
    handler: handleSearchEmails
  }
];

module.exports = { emailTools };