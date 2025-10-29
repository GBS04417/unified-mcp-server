/**
 * Folder tools for Outlook integration
 */

const { GraphService } = require('../services/graph-service');

const graphService = new GraphService();

async function handleListFolders(args) {
  try {
    const folders = await graphService.listFolders();
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          totalFolders: folders.length,
          folders: folders.map(folder => ({
            id: folder.id,
            displayName: folder.displayName,
            totalItemCount: folder.totalItemCount,
            unreadItemCount: folder.unreadItemCount
          }))
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error listing folders: ${error.message}`
      }]
    };
  }
}

async function handleCreateFolder(args) {
  const { name, parentFolderId } = args;

  if (!name) {
    throw new Error('Folder name is required');
  }

  try {
    const folder = await graphService.createFolder(name, parentFolderId);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: 'Folder created successfully',
          folderId: folder.id,
          displayName: folder.displayName
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error creating folder: ${error.message}`
      }]
    };
  }
}

async function handleMoveEmail(args) {
  const { emailId, destinationFolderId } = args;

  if (!emailId || !destinationFolderId) {
    throw new Error('Email ID and destination folder ID are required');
  }

  try {
    await graphService.moveEmail(emailId, destinationFolderId);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: 'Email moved successfully',
          emailId,
          destinationFolderId
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error moving email: ${error.message}`
      }]
    };
  }
}

const folderTools = [
  {
    name: 'outlook_list_folders',
    description: 'List all mail folders',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    handler: handleListFolders
  },

  {
    name: 'outlook_create_folder',
    description: 'Create a new mail folder',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the new folder'
        },
        parentFolderId: {
          type: 'string',
          description: 'ID of parent folder (optional, creates at root level if not specified)'
        }
      },
      required: ['name'],
      additionalProperties: false
    },
    handler: handleCreateFolder
  },

  {
    name: 'outlook_move_email',
    description: 'Move an email to a different folder',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: {
          type: 'string',
          description: 'ID of the email to move'
        },
        destinationFolderId: {
          type: 'string',
          description: 'ID of the destination folder'
        }
      },
      required: ['emailId', 'destinationFolderId'],
      additionalProperties: false
    },
    handler: handleMoveEmail
  }
];

module.exports = { folderTools };