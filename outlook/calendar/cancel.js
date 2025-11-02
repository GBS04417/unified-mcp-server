/**
 * Cancel event functionality
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
    $select: 'id,subject,start,end,attendees',
    $filter: `start/dateTime ge '${todayISO}'`
  };

  const response = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(queryParams));
  return response.value || [];
}

/**
 * Cancel event handler with attendee notification
 * Supports both direct eventId and eventSubject-based selection
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleCancelEvent(args) {
  const { eventId, eventSubject, comment, sendNotifications = true, maxResults = 50 } = args;

  try {
    let actualEventId = eventId;

    // If eventSubject is provided, search for the event
    if (eventSubject && !eventId) {
      const events = await getUpcomingEvents(maxResults);

      if (!events || events.length === 0) {
        return {
          content: [{
            type: "text",
            text: "No upcoming events found to cancel."
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
          text: "Please provide either eventId or eventSubject to cancel an event."
        }]
      };
    }

    // Initialize GraphService
    const graphService = new GraphService();

    // First, get the event details to see if there are attendees
    const eventResponse = await graphService.graphRequest(
      `/me/events/${actualEventId}?$select=subject,attendees`
    );

    // Build API endpoint
    const endpoint = `/me/events/${actualEventId}/cancel`;

    // Request body
    const cancelData = {
      comment: comment || "Event cancelled"
    };

    // Make API call
    await graphService.graphRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(cancelData)
    });

    // Prepare response message
    let message = `Event '${eventResponse.subject}' has been successfully cancelled.`;

    if (eventResponse.attendees && eventResponse.attendees.length > 0) {
      if (sendNotifications) {
        message += `\nCancellation notifications have been sent to ${eventResponse.attendees.length} attendee(s):`;
        eventResponse.attendees.forEach(attendee => {
          message += `\n  - ${attendee.emailAddress.address}`;
        });
      } else {
        message += `\nEvent had ${eventResponse.attendees.length} attendee(s) but no notifications were sent.`;
      }
    } else {
      message += `\nNo attendees were associated with this event.`;
    }

    if (comment) {
      message += `\nCancellation reason: ${comment}`;
    }

    return {
      content: [{
        type: "text",
        text: message
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
        text: `Error cancelling event: ${error.message}`
      }]
    };
  }
}

module.exports = handleCancelEvent;