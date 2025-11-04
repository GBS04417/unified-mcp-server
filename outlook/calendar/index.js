/**
 * Calendar module for Outlook MCP server
 */
const handleListEvents = require('./list');
const handleDeclineEvent = require('./decline');
const handleCreateEvent = require('./create');
const handleCancelEvent = require('./cancel');
const handleDeleteEvent = require('./delete');

// Calendar tool definitions
const calendarTools = [
  {
    name: "list-events",
    description: "Lists upcoming events from your calendar",
    inputSchema: {
      type: "object",
      properties: {
        count: {
          type: "number",
          description: "Number of events to retrieve (default: 10, max: 50)"
        }
      },
      required: []
    },
    handler: handleListEvents
  },
  {
    name: "decline-event",
    description: "Declines a calendar event. You can either provide eventId directly, or use eventSubject to search for and select the event",
    inputSchema: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "The ID of the event to decline (optional if using eventSubject)"
        },
        eventSubject: {
          type: "string",
          description: "The subject/title of the event to decline (optional if using eventId)"
        },
        comment: {
          type: "string",
          description: "Optional comment for declining the event"
        },
        maxResults: {
          type: "number",
          description: "Maximum number of upcoming events to search through (default: 50)",
          default: 50
        }
      },
      required: []
    },
    handler: handleDeclineEvent
  },
  {
    name: "create-event",
    description: "Creates a new calendar event and automatically sends invitations to attendees",
    inputSchema: {
      type: "object",
      properties: {
        subject: {
          type: "string",
          description: "The subject of the event"
        },
        start: {
          type: "string",
          description: "The start time of the event in ISO 8601 format (e.g., '2025-10-27T14:00:00')"
        },
        end: {
          type: "string",
          description: "The end time of the event in ISO 8601 format (e.g., '2025-10-27T15:00:00')"
        },
        attendees: {
          type: "array",
          items: {
            oneOf: [
              {
                type: "string",
                description: "Email address of attendee"
              },
              {
                type: "object",
                properties: {
                  email: { type: "string", description: "Email address" },
                  name: { type: "string", description: "Display name" },
                  type: { type: "string", enum: ["required", "optional"], description: "Attendee type" }
                },
                required: ["email"]
              }
            ]
          },
          description: "List of attendees (email addresses or objects with email, name, and type)"
        },
        body: {
          type: "string",
          description: "Optional body content for the event"
        },
        location: {
          type: "string",
          description: "Optional location for the event"
        },
        sendInvitations: {
          type: "boolean",
          description: "Whether to send invitations to attendees (default: true)",
          default: true
        },
        isOnlineMeeting: {
          type: "boolean",
          description: "Whether to create as an online meeting (default: false)",
          default: false
        },
        importance: {
          type: "string",
          enum: ["low", "normal", "high"],
          description: "Importance level of the event (default: normal)",
          default: "normal"
        }
      },
      required: ["subject", "start", "end"]
    },
    handler: handleCreateEvent
  },
  {
    name: "cancel-event",
    description: "Cancels a calendar event and sends cancellation notifications to attendees. You can either provide eventId directly, or use eventSubject to search for and select the event",
    inputSchema: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "The ID of the event to cancel (optional if using eventSubject)"
        },
        eventSubject: {
          type: "string",
          description: "The subject/title of the event to cancel (optional if using eventId)"
        },
        startDate: {
          type: "string",
          description: "Filter events by start date (YYYY-MM-DD format, e.g., '2025-11-03'). Use when multiple events have the same subject."
        },
        comment: {
          type: "string",
          description: "Optional comment explaining the cancellation reason"
        },
        sendNotifications: {
          type: "boolean",
          description: "Whether to send cancellation notifications to attendees (default: true)",
          default: true
        },
        maxResults: {
          type: "number",
          description: "Maximum number of upcoming events to search through (default: 50)",
          default: 50
        }
      },
      required: []
    },
    handler: handleCancelEvent
  },
  {
    name: "delete-event",
    description: "Deletes a calendar event. You can either provide eventId directly, or use eventSubject to search for and select the event",
    inputSchema: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "The ID of the event to delete (optional if using eventSubject)"
        },
        eventSubject: {
          type: "string",
          description: "The subject/title of the event to delete (optional if using eventId)"
        },
        startDate: {
          type: "string",
          description: "Filter events by start date (YYYY-MM-DD format, e.g., '2025-11-03'). Use when multiple events have the same subject."
        },
        maxResults: {
          type: "number",
          description: "Maximum number of upcoming events to search through (default: 50)",
          default: 50
        }
      },
      required: []
    },
    handler: handleDeleteEvent
  }
];

module.exports = {
  calendarTools,
  handleListEvents,
  handleDeclineEvent,
  handleCreateEvent,
  handleCancelEvent,
  handleDeleteEvent
};
