/**
 * Accept event functionality
 */
const { GraphService } = require('../services/graph-service');

/**
 * Accept event handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleAcceptEvent(args) {
  const { eventId, comment } = args;

  if (!eventId) {
    return {
      content: [{
        type: "text",
        text: "Event ID is required to accept an event."
      }]
    };
  }

  try {
    // Initialize GraphService
    const graphService = new GraphService();

    // Build API endpoint
    const endpoint = `/me/events/${eventId}/accept`;

    // Request body
    const requestData = {
      comment: comment || "Accepted via API"
    };

    // Make API call
    await graphService.graphRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    return {
      content: [{
        type: "text",
        text: `Event with ID ${eventId} has been successfully accepted.`
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
        text: `Error accepting event: ${error.message}`
      }]
    };
  }
}

module.exports = handleAcceptEvent;