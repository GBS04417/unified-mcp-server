/**
 * Decline event functionality
 */
const { GraphService } = require('../services/graph-service');

/**
 * Get upcoming events for selection (only future events)
 */
async function getUpcomingEvents(maxResults = 50) {
  const graphService = new GraphService();
  const endpoint = '/me/events';

  // Get today's date at start of day
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayISO = now.toISOString();

  const queryParams = {
    $top: maxResults,
    $orderby: 'start/dateTime',
    $select: 'id,subject,start,end',
    $filter: `start/dateTime ge '${todayISO}'`
  };

  const response = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(queryParams));
  return response.value || [];
}

/**
 * Decline event handler
 * Supports both direct eventId and eventSubject-based selection
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleDeclineEvent(args) {
  const { eventId, eventSubject, comment, maxResults = 50 } = args;

  try {
    let actualEventId = eventId;

    // If eventSubject is provided, search for the event
    if (eventSubject && !eventId) {
      const events = await getUpcomingEvents(maxResults);

      if (!events || events.length === 0) {
        return {
          content: [{
            type: "text",
            text: "No upcoming events found to decline."
          }]
        };
      }

      // Find event by subject (exact case-insensitive match)
      const matchingEvents = events.filter(e =>
        e.subject.toLowerCase() === eventSubject.toLowerCase()
      );

      if (matchingEvents.length === 0) {
        let eventList = "Available upcoming events:\n";
        events.slice(0, 10).forEach((event) => {
          eventList += `• ${event.subject} (${event.start.dateTime})\n`;
        });

        return {
          content: [{
            type: "text",
            text: `No event found matching "${eventSubject}". ${eventList}`
          }]
        };
      }

      if (matchingEvents.length > 1) {
        let eventList = "Multiple matching events found (same name, different dates):\n";
        matchingEvents.slice(0, 10).forEach((event) => {
          eventList += `• ${event.subject} (${event.start.dateTime})\n`;
        });

        return {
          content: [{
            type: "text",
            text: `Multiple events match "${eventSubject}". Please specify by date or provide eventId:\n${eventList}`
          }]
        };
      }

      actualEventId = matchingEvents[0].id;
    }

    if (!actualEventId) {
      return {
        content: [{
          type: "text",
          text: "Please provide either eventId or eventSubject to decline an event."
        }]
      };
    }

    // Initialize GraphService
    const graphService = new GraphService();

    // Build API endpoint
    const endpoint = `/me/events/${actualEventId}/decline`;

    // Request body
    const requestData = {
      comment: comment || "Declined via API"
    };

    // Make API call
    await graphService.graphRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    return {
      content: [{
        type: "text",
        text: `Event has been successfully declined.`
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
        text: `Error declining event: ${error.message}`
      }]
    };
  }
}

module.exports = handleDeclineEvent;