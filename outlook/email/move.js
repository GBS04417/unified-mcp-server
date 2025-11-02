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
    const {
        emailIds,
        from,
        subject,
        query,
        sourceFolder = 'inbox',
        destinationFolder,
        maxEmails = 50
    } = args;

    // Validate required parameters
    if (!destinationFolder) {
        return {
            content: [{
                type: "text",
                text: "Destination folder is required."
            }]
        };
    }

    // Check if at least one search criteria is provided
    if (!emailIds && !from && !subject && !query) {
        return {
            content: [{
                type: "text",
                text: "At least one of the following is required: emailIds, from, subject, or query."
            }]
        };
    }

    try {
        // Initialize GraphService
        const graphService = new GraphService();

        // Resolve source folder ID
        console.error(`Resolving source folder: '${sourceFolder}'`);
        const sourceFolderResponse = await graphService.graphRequest(
            `/me/mailFolders?$filter=displayName eq '${sourceFolder}'&$select=id,displayName`
        );

        if (!sourceFolderResponse.value || sourceFolderResponse.value.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: `Source folder '${sourceFolder}' not found.`
                }]
            };
        }

        const sourceFolderId = sourceFolderResponse.value[0].id;
        console.error(`Resolved source folder '${sourceFolder}' to ID: ${sourceFolderId}`);

        // Resolve destination folder ID
        console.error(`Resolving destination folder: '${destinationFolder}'`);
        const destFolderResponse = await graphService.graphRequest(
            `/me/mailFolders?$filter=displayName eq '${destinationFolder}'&$select=id,displayName`
        );

        if (!destFolderResponse.value || destFolderResponse.value.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: `Destination folder '${destinationFolder}' not found.`
                }]
            };
        }

        const destinationFolderId = destFolderResponse.value[0].id;
        console.error(`Resolved destination folder '${destinationFolder}' to ID: ${destinationFolderId}`);

        // Get emails to move
        let emailsToMove = [];

        if (emailIds) {
            // Move specific emails by ID
            emailsToMove = emailIds.split(',').map(id => ({ id: id.trim() })).filter(e => e.id);
        } else {
            // Search for emails matching criteria
            console.error('Searching for emails matching criteria...');
            const searchParams = {
                $top: Math.min(maxEmails, 200),
                $select: 'id,subject,from,receivedDateTime'
            };

            // Build filter conditions
            const filterConditions = [];

            if (subject) {
                filterConditions.push(`contains(subject, '${subject.replace(/'/g, "''")}')`);
            }
            if (from) {
                filterConditions.push(`contains(from/emailAddress/address, '${from.replace(/'/g, "''")}')`);
            }

            if (filterConditions.length > 0) {
                searchParams.$filter = filterConditions.join(' and ');
            }

            // Use $search for general query (searches subject, body, etc.)
            if (query) {
                searchParams.$search = `"${query.replace(/"/g, '\\"')}"`;
            }

            const endpoint = `/me/mailFolders/${sourceFolderId}/messages`;
            const searchResponse = await graphService.graphRequest(endpoint + '?' + new URLSearchParams(searchParams));

            emailsToMove = searchResponse.value || [];
            console.error(`Found ${emailsToMove.length} emails matching criteria`);
        }

        if (emailsToMove.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: "No emails found matching the search criteria."
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
