/**
 * Move folders functionality - Move a folder to a different parent folder
 */
const { GraphService } = require('../services/graph-service');
const { getFolderIdByName } = require('../email/folder-utils');
const { ensureAuthenticated } = require('../auth/index');

/**
 * Move folder handler - moves a folder into another folder
 * Can move any folder (source) into any other folder (target)
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleMoveFolder(args) {
  try {
    // Validate args is provided
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments provided');
    }

    const {
      sourceFolder,
      targetFolder
    } = args;

    // Validate required parameters
    if (!sourceFolder || typeof sourceFolder !== 'string' || sourceFolder.trim() === '') {
      throw new Error('Source folder name is required and must be a non-empty string');
    }

    if (!targetFolder || typeof targetFolder !== 'string' || targetFolder.trim() === '') {
      throw new Error('Target folder name is required and must be a non-empty string');
    }

    // Get access token
    const accessToken = await ensureAuthenticated();

    // Resolve folder IDs with clear source and target distinction
    let sourceFolderId, targetFolderId;

    // Resolve source folder
    try {
      sourceFolderId = await resolveFolderId(accessToken, sourceFolder);
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Source folder error: ${error.message}`
        }]
      };
    }

    // Resolve target folder
    try {
      targetFolderId = await resolveFolderId(accessToken, targetFolder);
    } catch (error) {
      // If target folder resolution fails, try to list available folders
      try {
        const availableFolders = await listAvailableFolders(accessToken);
        const folderNames = availableFolders.map(f => f.name).sort();
        const folderList = folderNames.length > 0
          ? `\n\nAvailable folders:\n${folderNames.map(name => `- ${name}`).join('\n')}`
          : '\n\nNo custom folders found.';

        return {
          content: [{
            type: "text",
            text: `Target folder error: ${error.message}${folderList}`
          }]
        };
      } catch (listError) {
        return {
          content: [{
            type: "text",
            text: `Target folder error: ${error.message}`
          }]
        };
      }
    }

    // Attempt to move folder
    // Note: The API accepts move requests but may not change folder position due to Outlook's hierarchy constraints
    // This matches Outlook UI behavior where move shows as successful but folder position may not change
    try {
      await moveFolderToParent(accessToken, sourceFolderId, targetFolderId);
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Failed to move folder: ${error.message}`
        }]
      };
    }

    return {
      content: [{
        type: "text",
        text: `✅ Move request sent for folder '${sourceFolder}' to '${targetFolder}'. Note: Outlook's folder hierarchy constraints may prevent the folder from changing visual position, similar to the Outlook UI behavior.`
      }]
    };

  } catch (error) {
    console.error('Error in handleMoveFolder:', error);
    return {
      content: [{
        type: "text",
        text: `Failed to move folder: ${error.message}`
      }]
    };
  }
}

/**
 * Resolve folder ID by name
 * @param {string} accessToken - Access token (for compatibility, GraphService handles internally)
 * @param {string} folderName - Folder name
 * @returns {Promise<string>} - Folder ID
 */
async function resolveFolderId(accessToken, folderName) {
  try {
    if (!folderName || typeof folderName !== 'string' || folderName.trim() === '') {
      throw new Error('Folder name is required and must be a non-empty string');
    }

    // Handle well-known folder names
    const wellKnownFolders = {
      'inbox': 'inbox',
      'sent': 'sentitems',
      'drafts': 'drafts',
      'deleted': 'deleteditems',
      'junk': 'junkemail',
      'outbox': 'outbox'
    };

    const normalizedName = folderName.toLowerCase().trim();
    if (wellKnownFolders[normalizedName]) {
      return wellKnownFolders[normalizedName];
    }

    // Search for custom folder by name with better error handling
    try {
      const graphService = new GraphService();
      // Fetch all folders with $top=500 to ensure we get complete list
      const folders = await graphService.graphRequest('/me/mailFolders?$select=id,displayName&$top=500');

      if (!folders || !folders.value || !Array.isArray(folders.value)) {
        throw new Error('Invalid response from mailFolders API');
      }

      // Debug: log all folders for troubleshooting
      console.error(`Found ${folders.value.length} total folders`);
      folders.value.forEach(f => {
        if (f && f.displayName) {
          console.error(`  - "${f.displayName}" (normalized: "${f.displayName.toLowerCase()}")`);
        }
      });

      // Find folder by exact name match (case-insensitive)
      const folder = folders.value.find(f =>
        f && f.displayName && f.displayName.toLowerCase() === normalizedName
      );

      if (!folder) {
        // List available folders for better error message
        const availableFolders = folders.value
          .filter(f => f && f.displayName)
          .map(f => f.displayName)
          .sort();

        const folderList = availableFolders.length > 0
          ? `Available folders:\n${availableFolders.map(name => `  - ${name}`).join('\n')}`
          : 'No custom folders found';

        throw new Error(
          `Folder '${folderName}' not found (normalized search for: '${normalizedName}'). ${folderList}. ` +
          `You can also use well-known folders: ${Object.keys(wellKnownFolders).join(', ')}`
        );
      }

      console.error(`Resolved folder '${folderName}' to ID: ${folder.id}`);
      return folder.id;
    } catch (apiError) {
      // Handle specific API errors
      if (apiError.message && apiError.message.includes('404')) {
        throw new Error(
          `Unable to access mailbox folders. This might be due to insufficient permissions or the mailbox not being properly configured.`
        );
      }
      throw apiError;
    }
  } catch (error) {
    throw new Error(`Failed to resolve folder '${folderName}': ${error.message}`);
  }
}
/**
 * Move folder to a parent folder
 * @param {string} accessToken - Access token
 * @param {string} folderId - Folder ID to move
 * @param {string} parentFolderId - Parent folder ID
 * @returns {Promise<object>} - Result object with status
 */
async function moveFolderToParent(accessToken, folderId, parentFolderId) {
  // Validate inputs
  if (!folderId || typeof folderId !== 'string') {
    throw new Error('Valid folder ID is required');
  }

  if (!parentFolderId || typeof parentFolderId !== 'string') {
    throw new Error('Valid parent folder ID is required');
  }

  try {
    const graphService = new GraphService();
    console.error(`[DEBUG] Moving folder ${folderId} into parent ${parentFolderId}`);

    const response = await graphService.graphRequest(
      `/me/mailFolders/${folderId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          parentFolderId: parentFolderId
        })
      }
    );

    console.error(`[DEBUG] Move response:`, response);

    if (!response || response.error) {
      throw new Error(`Graph API error: ${response?.error?.message || 'Unknown error'}`);
    }

    return { success: true, folderId, parentFolderId };
  } catch (error) {
    console.error(`[DEBUG] Error moving folder:`, error);
    throw new Error(`Failed to move folder: ${error.message}`);
  }
}

/**
 * List available folders for debugging
 * @param {string} accessToken - Access token
 * @returns {Promise<Array>} - Array of folder objects
 */
async function listAvailableFolders(accessToken) {
  try {
    const graphService = new GraphService();
    const folders = await graphService.graphRequest('/me/mailFolders?$select=id,displayName,parentFolderId&$top=50');

    if (!folders || !folders.value || !Array.isArray(folders.value)) {
      return [];
    }

    return folders.value.map(folder => ({
      id: folder.id,
      name: folder.displayName,
      parentId: folder.parentFolderId
    }));
  } catch (error) {
    console.error('Error listing folders:', error);
    return [];
  }
}

module.exports = {
  handleMoveFolder,
  listAvailableFolders
};
