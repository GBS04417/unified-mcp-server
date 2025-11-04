/**
 * Move emails functionality - Move one or more emails matching criteria to a different folder
 */
const { GraphService } = require('../services/graph-service');

/**
 * Move emails handler - moves emails matching specific criteria
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleMoveEmail(args) {
    // Debug: Log all received arguments from MCP inspector
    console.error('🔍 DEBUG: handleMoveEmail called with args:', JSON.stringify(args, null, 2));

    // Helper function to normalize string "null", "undefined", empty strings to actual null
    const normalizeParam = (value) => {
        if (value === null || value === undefined || value === 'null' || value === 'undefined' || value === '') {
            return null;
        }
        return value;
    };

    const {
        id: rawId,
        emailIds: rawEmailIds,
        from: rawFrom,
        subject: rawSubject,
        query: rawQuery,
        sourceFolder = 'inbox',
        destinationFolder,
        maxEmails = 50
    } = args;

    // Normalize all parameters to handle MCP inspector string "null" values
    const id = normalizeParam(rawId);
    const emailIds = normalizeParam(rawEmailIds);
    const from = normalizeParam(rawFrom);
    const subject = normalizeParam(rawSubject);
    const query = normalizeParam(rawQuery);

    // Debug: Log normalized values
    console.error('🔍 DEBUG: Normalized values:', {
        id, emailIds, from, subject, query, sourceFolder, destinationFolder, maxEmails
    });

    // Validate required parameters
    if (!destinationFolder) {
        console.error('❌ ERROR: Destination folder is required');
        return {
            content: [{
                type: "text",
                text: "Destination folder is required."
            }]
        };
    }

    // Support both 'id' and 'emailIds' parameters
    const emailIdList = id || emailIds;
    if (!emailIdList && !from && !subject && !query) {
        console.error('❌ ERROR: No search criteria provided');
        return {
            content: [{
                type: "text",
                text: "At least one of the following is required: id, emailIds, from, subject, or query."
            }]
        };
    }

    try {
        // Initialize GraphService
        const graphService = new GraphService();

        // Helper function to resolve folder ID with case-insensitive matching
        const resolveFolderId = async (folderName) => {
            console.error(`Resolving folder: '${folderName}'`);

            // Fetch all folders to do case-insensitive matching
            let folderResponse = await graphService.graphRequest(
                `/me/mailFolders?$top=500&$select=id,displayName`
            );

            if (!folderResponse.value || folderResponse.value.length === 0) {
                throw new Error(`Could not fetch folders from mailbox`);
            }

            // Case-insensitive matching
            const folder = folderResponse.value.find(f =>
                f.displayName.toLowerCase() === folderName.toLowerCase()
            );

            if (!folder) {
                const availableFolders = folderResponse.value.map(f => f.displayName).join(', ');
                throw new Error(`Folder '${folderName}' not found. Available folders: ${availableFolders}`);
            }

            console.error(`Resolved folder '${folderName}' to ID: ${folder.id}`);
            return folder.id;
        };

        // Resolve source and destination folder IDs
        const sourceFolderId = await resolveFolderId(sourceFolder);
        const destinationFolderId = await resolveFolderId(destinationFolder);

        // Get emails to move
        let emailsToMove = [];

        if (emailIdList) {
            // Move specific emails by ID
            const ids = emailIdList.split(',').map(str => str.trim()).filter(str => str);
            emailsToMove = ids.map(id => ({ id }));
            console.error(`Moving ${emailsToMove.length} specific email(s) by ID`);
        } else {
            // Search for emails matching criteria
            console.error('Searching for emails matching criteria...');
            console.error(`Search criteria: from='${from}' subject='${subject}' query='${query}'`);

            const endpoint = `/me/mailFolders/${sourceFolderId}/messages`;

            // Always use fallback strategy: fetch large batch and filter client-side
            // This is more reliable than relying on Graph API search or $filter with bodyPreview
            const fallbackParams = {
                $top: Math.min(maxEmails * 2, 500),
                $select: 'id,subject,from,bodyPreview,receivedDateTime',
                $orderby: 'receivedDateTime desc'
            };

            console.error(`Fetching from endpoint: ${endpoint}`);

            try {
                const fallbackResponse = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(fallbackParams));
                let allEmails = fallbackResponse.value || [];

                console.error(`Fetched ${allEmails.length} emails from source folder`);

                // Client-side filtering - apply all criteria
                let filtered = allEmails;

                // Filter by subject
                if (subject) {
                    const subjectLower = subject.toLowerCase();
                    console.error(`Filtering by subject: '${subject}'`);
                    filtered = filtered.filter(email =>
                        email.subject && email.subject.toLowerCase().includes(subjectLower)
                    );
                    console.error(`After subject filter: ${filtered.length} emails`);
                }

                // Filter by query (search in subject AND body)
                if (query) {
                    const queryLower = query.toLowerCase();
                    console.error(`🔍 DEBUG: Filtering by query: '${query}' (lowercase: '${queryLower}')`);

                    // Show sample emails before filtering
                    console.error(`🔍 DEBUG: Sample emails before query filter (first 3):`);
                    filtered.slice(0, 3).forEach((email, idx) => {
                        console.error(`  ${idx + 1}. Subject: "${email.subject || 'No subject'}"`);
                        console.error(`     Body: "${(email.bodyPreview || 'No preview').substring(0, 50)}..."`);
                    });

                    filtered = filtered.filter(email => {
                        const subjectMatch = email.subject && email.subject.toLowerCase().includes(queryLower);
                        const bodyMatch = (email.bodyPreview || '').toLowerCase().includes(queryLower);
                        const matches = subjectMatch || bodyMatch;

                        if (matches) {
                            console.error(`  ✅ MATCH: "${email.subject}" (subject: ${subjectMatch}, body: ${bodyMatch})`);
                        }

                        return matches;
                    });
                    console.error(`🔍 DEBUG: After query filter: ${filtered.length} emails`);
                }

                // Filter by sender
                if (from) {
                    const fromLower = from.toLowerCase();
                    console.error(`Filtering by sender: '${from}'`);
                    filtered = filtered.filter(email => {
                        if (email.from && email.from.emailAddress) {
                            const senderEmail = (email.from.emailAddress.address || '').toLowerCase();
                            const senderName = (email.from.emailAddress.name || '').toLowerCase();
                            return senderEmail.includes(fromLower) || senderName.includes(fromLower);
                        }
                        return false;
                    });
                    console.error(`After sender filter: ${filtered.length} emails`);
                }

                emailsToMove = filtered.slice(0, maxEmails);
                console.error(`Final search found ${emailsToMove.length} emails matching all criteria`);
            } catch (error) {
                console.error(`Failed to fetch and filter emails: ${error.message}`);
                throw error;
            }
        }

        if (emailsToMove.length === 0) {
            console.error('❌ DEBUG: No emails found! Summary:');
            console.error(`   - Source folder: ${sourceFolder}`);
            console.error(`   - Destination folder: ${destinationFolder}`);
            console.error(`   - Query: "${query}"`);
            console.error(`   - Subject: "${subject}"`);
            console.error(`   - From: "${from}"`);
            console.error(`   - Max emails: ${maxEmails}`);

            return {
                content: [{
                    type: "text",
                    text: `No emails found matching the search criteria.\n\nDebug info:\n- Source: ${sourceFolder}\n- Query: "${query}"\n- Subject: "${subject}"\n- From: "${from}"\n\nTry using list-emails to see what emails are available in the source folder.`
                }]
            };
        }

        // Move emails one by one
        let successCount = 0;
        let failedCount = 0;
        const failedEmails = [];

        for (const email of emailsToMove) {
            try {
                console.error(`Moving email ${email.id}...`);
                await graphService.graphRequest(`/me/messages/${email.id}/move`, {
                    method: 'POST',
                    body: JSON.stringify({
                        destinationId: destinationFolderId
                    })
                });
                successCount++;
            } catch (error) {
                failedCount++;
                failedEmails.push({ id: email.id, error: error.message });
                console.error(`Failed to move email ${email.id}: ${error.message}`);
            }
        }

        const summary = `Successfully moved ${successCount} email(s) to '${destinationFolder}'.`;
        const failureInfo = failedCount > 0 ? `\n\nFailed to move ${failedCount} email(s).` : '';

        return {
            content: [{
                type: "text",
                text: `${summary}${failureInfo}`
            }]
        };
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
        return {
            content: [{
                type: "text",
                text: `Error moving emails: ${error.message}`
            }]
        };
    }
}

module.exports = handleMoveEmail;
