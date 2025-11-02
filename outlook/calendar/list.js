/**
 * List events functionality
 */
const { GraphService } = require('../services/graph-service');

// Calendar fields to retrieve
const CALENDAR_FIELDS = [
  'subject',
  'start',
  'end',
  'location',
  'bodyPreview'
].join(',');

/**
 * List events handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleListEvents(args) {
  const count = args.count || 10;
  const listToday = args.today === true;

  try {
    // Initialize GraphService
    const graphService = new GraphService();

    // Build API endpoint
    let endpoint = '/me/events';

    // Add query parameters
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const queryParams = {
      $top: count,
      $orderby: 'start/dateTime',
      $select: CALENDAR_FIELDS,
      $filter: listToday
        ? `start/dateTime ge '${today.toISOString()}' and start/dateTime lt '${tomorrow.toISOString()}'`
        : `start/dateTime ge '${new Date().toISOString()}'`
    };

    // Make API call using GraphService
    const response = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(queryParams));

    if (!response.value || response.value.length === 0) {
      return {
        content: [{
          type: "text",
          text: "No calendar events found."
        }]
      };
    }

    // Format results
    const eventList = response.value.map((event, index) => {
      const startDate = new Date(event.start.dateTime).toLocaleString(event.start.timeZone);
      const endDate = new Date(event.end.dateTime).toLocaleString(event.end.timeZone);
      const location = event.location.displayName || 'No location';

      const start = new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const end = new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return [
        `${index + 1}. ${event.subject}`,
        `⏰ ${start} - ${end}`,
        location ? `📍 ${location}` : null,
        event.bodyPreview ? `📝 ${event.bodyPreview.substring(0, 100)}${event.bodyPreview.length > 100 ? '...' : ''}` : null
      ].filter(Boolean).join('\n   ');
    }).join("\n\n");

    const title = listToday ? "Today's Events" : "Upcoming Events";
    const message = response.value.length === 0
      ? `📭 No ${listToday ? 'events scheduled for today' : 'upcoming events found'}`
      : `📋 ${title}:\n==================\n\n${eventList}`;

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
        text: `Error listing events: ${error.message}`
      }]
    };
  }
}

module.exports = handleListEvents;
