/**
 * Folder management module for Outlook MCP server
 */
const handleListFolders = require('./list');
const handleCreateFolder = require('./create');
const { handleMoveFolder } = require('./move');

// Folder management tool definitions
const folderTools = [
  {
    name: "list-folders",
    description: "Lists mail folders in your Outlook account",
    inputSchema: {
      type: "object",
      properties: {
        includeItemCounts: {
          type: "boolean",
          description: "Include counts of total and unread items"
        },
        includeChildren: {
          type: "boolean",
          description: "Include child folders in hierarchy"
        }
      },
      required: []
    },
    handler: handleListFolders
  },
  {
    name: "create-folder",
    description: "Creates a new mail folder",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the folder to create"
        },
        parentFolder: {
          type: "string",
          description: "Optional parent folder name (default is root)"
        }
      },
      required: ["name"]
    },
    handler: handleCreateFolder
  },
  {
    name: "move-folder",
    description: "Sends a move request for a folder to another folder. Note: Due to Outlook's folder hierarchy constraints, the folder may not change visual position in your mailbox, similar to Outlook UI behavior.",
    inputSchema: {
      type: "object",
      properties: {
        sourceFolder: {
          type: "string",
          description: "Name of the SOURCE folder you want to move (use exact folder name)"
        },
        targetFolder: {
          type: "string",
          description: "Name of the TARGET folder where you want to move it to (use exact folder name). Can be any folder."
        }
      },
      required: ["sourceFolder", "targetFolder"]
    },
    handler: handleMoveFolder
  }
];

module.exports = {
  folderTools,
  handleListFolders,
  handleCreateFolder,
  handleMoveFolder
};
