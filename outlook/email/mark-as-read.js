/**
 * Mark email as read functionality
 */
const { GraphService } = require('../services/graph-service');

/**
 * Mark email as read handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleMarkAsRead(args) {
  const emailId = args.id;
  const isRead = args.isRead !== undefined ? args.isRead : true; // Default to true

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

    // Make API call to update email read status
    const endpoint = `/me/messages/${encodeURIComponent(emailId)}`;
    const updateData = {
      isRead: isRead
    };

    try {
      const result = await graphService.graphRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });

      const status = isRead ? 'read' : 'unread';

      return {
        content: [
          {
            type: "text",
            text: `Email successfully marked as ${status}.`
          }
        ]
      };
    } catch (error) {
      console.error(`Error marking email as ${isRead ? 'read' : 'unread'}: ${error.message}`);

      // Improved error handling with more specific messages
      if (error.message.includes("doesn't belong to the targeted mailbox")) {
        return {
          content: [
            {
              type: "text",
              text: `The email ID seems invalid or doesn't belong to your mailbox. Please try with a different email ID.`
            }
          ]
        };
      } else if (error.message.includes("UNAUTHORIZED")) {
        return {
          content: [
            {
              type: "text",
              text: "Authentication failed. Please re-authenticate and try again."
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Failed to mark email as ${isRead ? 'read' : 'unread'}: ${error.message}`
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

module.exports = handleMarkAsRead;
