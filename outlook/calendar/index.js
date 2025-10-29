/**
 * Calendar tools for Outlook integration
 */

const { GraphService } = require('../services/graph-service');

const graphService = new GraphService();

async function handleListEvents(args) {
  const { maxResults = 10, startDate, endDate } = args;

  try {
    const events = await graphService.listEvents(maxResults, startDate, endDate);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          totalEvents: events.length,
          events: events.map(event => ({
            id: event.id,
            subject: event.subject,
            start: event.start,
            end: event.end,
            location: event.location?.displayName,
            attendees: event.attendees?.map(a => a.emailAddress?.address) || []
          }))
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error listing events: ${error.message}`
      }]
    };
  }
}

async function handleCreateEvent(args) {
  const { title, startDateTime, endDateTime, attendees, location, body, timeZone } = args;

  if (!title || !startDateTime || !endDateTime) {
    throw new Error('Title, start date/time, and end date/time are required');
  }

  try {
    const event = await graphService.createEvent({
      title,
      startDateTime,
      endDateTime,
      attendees,
      location,
      body,
      timeZone
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: 'Event created successfully',
          eventId: event.id,
          subject: event.subject
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error creating event: ${error.message}`
      }]
    };
  }
}

const calendarTools = [
  {
    name: 'outlook_list_events',
    description: 'List calendar events with optional date filtering',
    inputSchema: {
      type: 'object',
      properties: {
        maxResults: {
          type: 'number',
          description: 'Maximum number of events to return',
          default: 10
        },
        startDate: {
          type: 'string',
          description: 'Start date in ISO format (optional)'
        },
        endDate: {
          type: 'string',
          description: 'End date in ISO format (optional)'
        }
      },
      additionalProperties: false
    },
    handler: handleListEvents
  },

  {
    name: 'outlook_create_event',
    description: 'Create a new calendar event',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Event title/subject'
        },
        startDateTime: {
          type: 'string',
          description: 'Start date and time in ISO format'
        },
        endDateTime: {
          type: 'string',
          description: 'End date and time in ISO format'
        },
        attendees: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of attendee email addresses'
        },
        location: {
          type: 'string',
          description: 'Event location'
        },
        body: {
          type: 'string',
          description: 'Event description/body'
        },
        timeZone: {
          type: 'string',
          description: 'Time zone (default: UTC)'
        }
      },
      required: ['title', 'startDateTime', 'endDateTime'],
      additionalProperties: false
    },
    handler: handleCreateEvent
  }
];

module.exports = { calendarTools };