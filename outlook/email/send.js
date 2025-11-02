/**
 * Send email functionality
 */
const { GraphService } = require('../services/graph-service');

/**
 * Send email handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleSendEmail(args) {
  const { to, cc, bcc, subject, body, importance = 'normal', saveToSentItems = true } = args;

  // Validate required parameters
  if (!to) {
    return {
      content: [{
        type: "text",
        text: "Recipient (to) is required."
      }]
    };
  }

  if (!subject) {
    return {
      content: [{
        type: "text",
        text: "Subject is required."
      }]
    };
  }

  if (!body) {
    return {
      content: [{
        type: "text",
        text: "Body content is required."
      }]
    };
  }

  try {
    // Initialize GraphService
    const graphService = new GraphService();

    // Format recipients
    const toRecipients = to.split(',').map(email => {
      email = email.trim();
      return {
        emailAddress: {
          address: email
        }
      };
    });

    const ccRecipients = cc ? cc.split(',').map(email => {
      email = email.trim();
      return {
        emailAddress: {
          address: email
        }
      };
    }) : [];

    const bccRecipients = bcc ? bcc.split(',').map(email => {
      email = email.trim();
      return {
        emailAddress: {
          address: email
        }
      };
    }) : [];

    // Prepare email object
    const emailObject = {
      message: {
        subject,
        body: {
          contentType: 'text',  // Always use 'text' for plain text content
          content: body
        },
        toRecipients,
        importance: importance || 'normal'
      },
      saveToSentItems: saveToSentItems !== false
    };

    // Only add CC/BCC if they have recipients
    if (ccRecipients.length > 0) {
      emailObject.message.ccRecipients = ccRecipients;
    }
    if (bccRecipients.length > 0) {
      emailObject.message.bccRecipients = bccRecipients;
    }

    // Make API call to send email
    await graphService.graphRequest('/me/sendMail', {
      method: 'POST',
      body: JSON.stringify(emailObject)
    });

    return {
      content: [{
        type: "text",
        text: `Email sent successfully!\n\nSubject: ${subject}\nRecipients: ${toRecipients.length}${ccRecipients.length > 0 ? ` + ${ccRecipients.length} CC` : ''}${bccRecipients.length > 0 ? ` + ${bccRecipients.length} BCC` : ''}\nMessage Length: ${body.length} characters`
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
        text: `Error sending email: ${error.message}`
      }]
    };
  }
}

module.exports = handleSendEmail;
