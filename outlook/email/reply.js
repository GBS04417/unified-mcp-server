/**
 * Reply to email functionality
 */
const { GraphService } = require('../services/graph-service');

/**
 * Reply to email handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleReplyEmail(args) {
    const {
        from,
        subject,
        query,
        folder = 'inbox',
        body,
        cc,
        bcc,
        importance = 'normal',
        includeOriginalMessage = false,
        saveToSentItems = true
    } = args;

    // Validate that at least one search criteria is provided if no body
    const isSearchMode = !body;

    if (isSearchMode) {
        // Search mode - user is looking for emails to reply to
        if (!from && !subject && !query) {
            return {
                content: [{
                    type: "text",
                    text: "To reply to an email, please provide one of the following:\n" +
                        "- from: Email address or name of the sender\n" +
                        "- subject: Email subject text to search for\n" +
                        "- query: General search text\n" +
                        "\nOr provide 'body' parameter with all search criteria (from/subject/query) to directly compose a reply."
                }]
            };
        }

        // Search for matching emails
        return await searchAndDisplayEmails(from, subject, query, folder);
    } else {
        // Reply mode - user is replying with body content
        // In this mode, we need at least from or subject to identify which email to reply to
        if (!from && !subject && !query) {
            return {
                content: [{
                    type: "text",
                    text: "To reply to an email with body content, please also provide at least one of:\n" +
                        "- from: Email address or name of the sender\n" +
                        "- subject: Email subject text\n" +
                        "- query: General search text\n" +
                        "\nThis helps identify which email to reply to."
                }]
            };
        }

        // Find and reply to the matching email
        return await findAndReplyToEmail(from, subject, query, folder, body, cc, bcc, importance, includeOriginalMessage, saveToSentItems);
    }
}

/**
 * Search for emails and display them for user selection
 * @param {string} from - Sender filter
 * @param {string} subject - Subject filter
 * @param {string} query - Search query
 * @param {string} folder - Folder to search in
 * @returns {object} - MCP response with email list
 */
async function searchAndDisplayEmails(from, subject, query, folder) {
    try {
        const graphService = new GraphService();

        // Resolve folder ID
        console.error(`Resolving folder: '${folder}'`);
        const folderResponse = await graphService.graphRequest(
            `/me/mailFolders?$filter=displayName eq '${folder}'&$select=id,displayName`
        );

        let folderId = 'inbox';
        if (folderResponse.value && folderResponse.value.length > 0) {
            folderId = folderResponse.value[0].id;
        }

        // Build filter conditions
        const filterConditions = [];

        if (subject) {
            filterConditions.push(`contains(subject, '${subject.replace(/'/g, "''")}')`);
        }
        if (from) {
            filterConditions.push(`contains(from/emailAddress/address, '${from.replace(/'/g, "''")}')`);
        }

        // Search for emails
        const searchParams = {
            $top: 20,
            $select: 'id,subject,from,receivedDateTime,preview'
        };

        // Use $filter for specific criteria, but avoid combining with $orderby and $search
        if (filterConditions.length > 0) {
            searchParams.$filter = filterConditions.join(' and ');
            // Don't add $orderby with $filter - it's too complex
        } else if (query) {
            // Use only $search if no $filter
            searchParams.$search = `"${query.replace(/"/g, '\\"')}"`;
        }

        const endpoint = `/me/mailFolders/${folderId}/messages`;
        const searchResponse = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(searchParams));

        let emails = searchResponse.value || [];

        // Sort emails by date (client-side instead of server-side to avoid complexity)
        emails.sort((a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime));

        if (emails.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: "No emails found matching your search criteria. Please try different search terms."
                }]
            };
        }

        // Format email list for display
        let emailList = `Found ${emails.length} matching email(s). Here are your options:\n\n`;
        emails.forEach((email, index) => {
            const fromName = email.from?.emailAddress?.name || email.from?.emailAddress?.address || 'Unknown';
            const subject = email.subject || '(No subject)';
            const date = new Date(email.receivedDateTime).toLocaleString();
            const preview = email.preview ? email.preview.substring(0, 100) : 'No preview';

            emailList += `${index + 1}. From: ${fromName}\n`;
            emailList += `   Subject: ${subject}\n`;
            emailList += `   Date: ${date}\n`;
            emailList += `   Preview: ${preview}...\n`;
            emailList += `   Email ID: ${email.id}\n\n`;
        });

        emailList += `To reply to one of these emails, call reply-email again with:\n`;
        emailList += `- Use the exact "from", "subject", or "query" criteria to identify the email\n`;
        emailList += `- Add "body" parameter with your reply message\n`;
        emailList += `- Optionally add cc, bcc, importance, or includeOriginalMessage parameters\n\n`;
        emailList += `Example:\n`;
        emailList += `reply-email with:\n`;
        emailList += `  from: "${emails[0].from?.emailAddress?.address || 'sender@example.com'}"\n`;
        emailList += `  subject: "${emails[0].subject || 'Subject'}"\n`;
        emailList += `  body: "Your reply message here"\n`;
        emailList += `  cc: "optional@example.com"\n`;
        emailList += `  saveToSentItems: true`;

        return {
            content: [{
                type: "text",
                text: emailList
            }]
        };

    } catch (error) {
        console.error('Error searching for emails:', error);
        return {
            content: [{
                type: "text",
                text: `Error searching for emails: ${error.message}`
            }]
        };
    }
}

/**
 * Find and reply to a matching email
 * @param {string} from - Sender filter
 * @param {string} subject - Subject filter
 * @param {string} query - Search query
 * @param {string} folder - Folder to search in
 * @param {string} body - Reply body
 * @param {string} cc - CC recipients
 * @param {string} bcc - BCC recipients
 * @param {string} importance - Email importance
 * @param {boolean} includeOriginalMessage - Include original message
 * @param {boolean} saveToSentItems - Send or save as draft
 * @returns {object} - MCP response
 */
async function findAndReplyToEmail(from, subject, query, folder, body, cc, bcc, importance, includeOriginalMessage, saveToSentItems) {
    try {
        const graphService = new GraphService();

        // Resolve folder ID
        console.error(`Resolving folder: '${folder}'`);
        const folderResponse = await graphService.graphRequest(
            `/me/mailFolders?$filter=displayName eq '${folder}'&$select=id,displayName`
        );

        let folderId = 'inbox';
        if (folderResponse.value && folderResponse.value.length > 0) {
            folderId = folderResponse.value[0].id;
        }

        // Build filter conditions
        const filterConditions = [];

        if (subject) {
            filterConditions.push(`contains(subject, '${subject.replace(/'/g, "''")}')`);
        }
        if (from) {
            filterConditions.push(`contains(from/emailAddress/address, '${from.replace(/'/g, "''")}')`);
        }

        // Search for emails
        const searchParams = {
            $top: 20,
            $select: 'id,subject,from,toRecipients,receivedDateTime'
        };

        // Use $filter for specific criteria, but avoid combining with $orderby and $search
        if (filterConditions.length > 0) {
            searchParams.$filter = filterConditions.join(' and ');
            // Don't add $orderby with $filter - it's too complex
        } else if (query) {
            // Use only $search if no $filter
            searchParams.$search = `"${query.replace(/"/g, '\\"')}"`;
        }

        const endpoint = `/me/mailFolders/${folderId}/messages`;
        const searchResponse = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(searchParams));

        let emails = searchResponse.value || [];

        // Sort emails by date (client-side instead of server-side to avoid complexity)
        emails.sort((a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime));

        if (emails.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: "No emails found matching your search criteria to reply to."
                }]
            };
        }

        // Use the first matching email
        const emailToReplyTo = emails[0];
        console.error(`Found email to reply to: ${emailToReplyTo.subject}`);

        // Format CC recipients if provided
        const ccRecipients = cc ? cc.split(',').map(email => {
            email = email.trim();
            return {
                emailAddress: {
                    address: email
                }
            };
        }) : [];

        // Format BCC recipients if provided
        const bccRecipients = bcc ? bcc.split(',').map(email => {
            email = email.trim();
            return {
                emailAddress: {
                    address: email
                }
            };
        }) : [];

        // Create reply draft
        console.error(`Creating reply for email: ${emailToReplyTo.id}`);
        const draftResponse = await graphService.graphRequest(
            `/me/messages/${emailToReplyTo.id}/createReply`,
            {
                method: 'POST',
                body: JSON.stringify({
                    message: {
                        body: {
                            contentType: 'text',
                            content: body
                        },
                        ccRecipients: ccRecipients,
                        bccRecipients: bccRecipients,
                        importance: importance
                    }
                })
            }
        );

        if (!draftResponse.id) {
            return {
                content: [{
                    type: "text",
                    text: "Reply created but encountered an issue. Please check your drafts folder."
                }]
            };
        }

        // If saveToSentItems is true, send the reply; otherwise leave as draft
        if (saveToSentItems) {
            console.error(`Sending reply: ${draftResponse.id}`);
            await graphService.graphRequest(
                `/me/messages/${draftResponse.id}/send`,
                {
                    method: 'POST',
                    body: JSON.stringify({})
                }
            );

            return {
                content: [{
                    type: "text",
                    text: `✅ Reply sent successfully!\n\n` +
                        `Original Email:\n` +
                        `  From: ${emailToReplyTo.from?.emailAddress?.name || emailToReplyTo.from?.emailAddress?.address}\n` +
                        `  Subject: ${emailToReplyTo.subject}\n` +
                        `  Date: ${new Date(emailToReplyTo.receivedDateTime).toLocaleString()}\n\n` +
                        `Your Reply:\n` +
                        `  Body: ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}\n` +
                        `  Status: Sent\n` +
                        `  Reply ID: ${draftResponse.id}`
                }]
            };
        } else {
            return {
                content: [{
                    type: "text",
                    text: `✅ Reply saved as draft!\n\n` +
                        `Original Email:\n` +
                        `  From: ${emailToReplyTo.from?.emailAddress?.name || emailToReplyTo.from?.emailAddress?.address}\n` +
                        `  Subject: ${emailToReplyTo.subject}\n` +
                        `  Date: ${new Date(emailToReplyTo.receivedDateTime).toLocaleString()}\n\n` +
                        `Your Reply:\n` +
                        `  Body: ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}\n` +
                        `  Status: Draft\n` +
                        `  Draft ID: ${draftResponse.id}`
                }]
            };
        }

    } catch (error) {
        // Handle authentication errors
        if (error.message === 'Authentication required') {
            return {
                content: [{
                    type: "text",
                    text: "Authentication required. Please use the 'authenticate' tool first."
                }]
            };
        }

        // General error response
        console.error('Error in handleReplyEmail:', error);
        return {
            content: [{
                type: "text",
                text: `Error replying to email: ${error.message}`
            }]
        };
    }
}

module.exports = handleReplyEmail;
