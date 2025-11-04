/**
 * Outlook Tools for Unified MCP Server
 * 
 * Provides comprehensive Microsoft Outlook integration including:
 * - Authentication and authorization
 * - Email management (read, send, search, organize)
 * - Calendar operations (events, meetings, scheduling)
 * - Folder management
 * - Mail rules and automation
 */

// Import all Outlook modules
const { authTools } = require('./auth/index.js');
const { calendarTools } = require('./calendar/index.js');
const { emailTools } = require('./email/index.js');
const { folderTools } = require('./folder/index.js');
const { rulesTools } = require('./rules/index.js');

// Combine all Outlook tools
const outlookTools = [
  ...authTools,
  ...calendarTools,
  ...emailTools,
  ...folderTools,
  ...rulesTools
];

// Export service instance for priority system
const { OutlookService } = require('./service');
const outlookService = new OutlookService();

module.exports = { outlookTools, outlookService };