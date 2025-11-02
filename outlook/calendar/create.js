/**
 * Create event functionality
 */
const { GraphService } = require('../services/graph-service');

// Default timezone for events
const DEFAULT_TIMEZONE = 'UTC';

/**
 * Create event handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleCreateEvent(args) {
  const { subject, start, end, attendees, body, location, importance, isOnlineMeeting, sendInvitations } = args;

  // Set default values for optional parameters
  const eventImportance = importance || "normal";
  const eventIsOnlineMeeting = isOnlineMeeting || false;
  const eventSendInvitations = sendInvitations !== undefined ? sendInvitations : true;

  if (!subject || !start || !end) {
    return {
      content: [{
        type: "text",
        text: "Subject, start, and end times are required to create an event."
      }]
    };
  }

  try {
    // Initialize GraphService
    const graphService = new GraphService();

    // Build attendees array with proper structure
    const formattedAttendees = attendees?.map(attendee => {
      // Handle both string emails and object format
      if (typeof attendee === 'string') {
        return {
          emailAddress: { address: attendee },
          type: "required"
        };
      } else {
        return {
          emailAddress: {
            address: attendee.email || attendee.address,
            name: attendee.name || ""
          },
          type: attendee.type || "required"
        };
      }
    }) || [];

    // Request body
    const eventData = {
      subject,
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: DEFAULT_TIMEZONE
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: DEFAULT_TIMEZONE
      },
      body: {
        contentType: "HTML",
        content: body || ""
      },
      importance: eventImportance,
      isOnlineMeeting: eventIsOnlineMeeting
    };

    // Add attendees if provided
    if (formattedAttendees.length > 0) {
      eventData.attendees = formattedAttendees;
    }

    // Add location if provided
    if (location) {
      eventData.location = {
        displayName: location
      };
    }

    // Microsoft Graph automatically sends invitations when creating events with attendees
    // To control this behavior, we need to use different approaches

    let endpoint = `/me/events`;
    let response;

    if (formattedAttendees.length > 0 && eventSendInvitations) {
      // Create event with attendees - Microsoft Graph automatically sends invitations
      console.error('Creating event with attendees - invitations will be sent automatically by Microsoft Graph');
      console.error('Attendees being added:', JSON.stringify(formattedAttendees, null, 2));

      // Ensure the event is created as a meeting (not an appointment)
      eventData.isOrganizer = true;
      eventData.responseRequested = true;

      response = await graphService.graphRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(eventData)
      });

      // Verify the event was created with attendees
      if (response.attendees && response.attendees.length > 0) {
        console.error('✅ Event created successfully with attendees. Invitations should be sent automatically.');
      } else {
        console.error('⚠️ Event created but no attendees found in response. This may indicate an issue.');
      }

    } else if (formattedAttendees.length > 0 && !eventSendInvitations) {
      // Create event without automatically sending invitations
      console.error('Creating event without sending invitations');

      // Create event without attendees first
      const eventWithoutAttendees = { ...eventData };
      delete eventWithoutAttendees.attendees;

      response = await graphService.graphRequest(endpoint, {
        method: 'POST',
        data: eventWithoutAttendees
      });

      // Update event to add attendees (this typically doesn't send notifications for existing events)
      const updateEndpoint = `/me/events/${response.id}`;
      const updateData = { attendees: formattedAttendees };

      try {
        await graphService.graphRequest(updateEndpoint, {
          method: 'PATCH',
          body: JSON.stringify(updateData)
        });
        // Get updated event data
        response = await graphService.graphRequest(`/me/events/${response.id}`);
        console.error('Event updated with attendees without sending invitations');
      } catch (updateError) {
        console.error('Failed to add attendees without notifications:', updateError.message);
        // Fallback: return the event without attendees
      }
    } else {
      // No attendees - simple event creation
      response = await graphService.graphRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(eventData)
      });
    }

    // Prepare response message
    let message = `Event '${subject}' has been successfully created.`;

    if (response.id) {
      message += `\nEvent ID: ${response.id}`;
    }

    if (formattedAttendees.length > 0) {
      if (eventSendInvitations) {
        message += `\n📧 Invitations have been automatically sent to ${formattedAttendees.length} attendee(s):`;
        formattedAttendees.forEach(attendee => {
          message += `\n  ✉️  ${attendee.emailAddress.address} (${attendee.type})`;
        });
        message += `\n\n💡 Note: If attendees don't receive invitations, use the 'send-invitation' tool with Event ID: ${response.id}`;
      } else {
        message += `\nEvent created with ${formattedAttendees.length} attendee(s) (no invitations sent):`;
        formattedAttendees.forEach(attendee => {
          message += `\n  👤 ${attendee.emailAddress.address} (${attendee.type})`;
        });
        message += `\n\n💡 To send invitations later, use: send-invitation tool with Event ID: ${response.id}`;
      }
    }

    if (location) {
      message += `\nLocation: ${location}`;
    }

    if (isOnlineMeeting) {
      message += `\nOnline meeting: Yes`;
      if (response.onlineMeeting?.joinUrl) {
        message += `\nJoin URL: ${response.onlineMeeting.joinUrl}`;
      }
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
        text: `Error creating event: ${error.message}`
      }]
    };
  }
}

module.exports = handleCreateEvent;