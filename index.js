#!/usr/bin/env node
/**
 * Unified MCP Server - Main Entry Point
 * 
 * A comprehensive Model Context Protocol server that provides access to:
 * - JIRA (Issue management, transitions, reporting)
 * - Confluence (Page management, content creation, search)
 * - Microsoft Outlook (Email, calendar, contacts via Graph API)
 */

// Load environment variables
require('dotenv').config();

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

// Import configuration
const config = require('./config');

// Import all tool modules
const { jiraTools } = require('./jira');
const { confluenceTools } = require('./confluence');
const { outlookTools } = require('./outlook');

// Log startup information
console.error(`🚀 STARTING UNIFIED MCP SERVER v${config.SERVER_VERSION}`);
console.error(`📊 JIRA Integration: ${config.JIRA_ENABLED ? 'ENABLED' : 'DISABLED'}`);
console.error(`📄 Confluence Integration: ${config.CONFLUENCE_ENABLED ? 'ENABLED' : 'DISABLED'}`);
console.error(`📧 Outlook Integration: ${config.OUTLOOK_ENABLED ? 'ENABLED' : 'DISABLED'}`);

// Combine all tools based on enabled services
const ALL_TOOLS = [];

if (config.JIRA_ENABLED) {
  ALL_TOOLS.push(...jiraTools);
  console.error(`✅ JIRA: ${jiraTools.length} tools loaded`);
}

if (config.CONFLUENCE_ENABLED) {
  ALL_TOOLS.push(...confluenceTools);
  console.error(`✅ Confluence: ${confluenceTools.length} tools loaded`);
}

if (config.OUTLOOK_ENABLED) {
  ALL_TOOLS.push(...outlookTools);
  console.error(`✅ Outlook: ${outlookTools.length} tools loaded`);
}

console.error(`🔧 Total tools available: ${ALL_TOOLS.length}`);

// Create server instance
const server = new Server(
  { name: config.SERVER_NAME, version: config.SERVER_VERSION },
  { 
    capabilities: { 
      tools: ALL_TOOLS.reduce((acc, tool) => {
        acc[tool.name] = {};
        return acc;
      }, {})
    } 
  }
);

// Handle all MCP requests
server.fallbackRequestHandler = async (request) => {
  try {
    const { method, params, id } = request;
    console.error(`📥 REQUEST: ${method} [${id}]`);
    
    // Initialize handler
    if (method === "initialize") {
      console.error(`🔄 INITIALIZE REQUEST: ID [${id}]`);
      return {
        protocolVersion: "2024-11-05",
        capabilities: { 
          tools: ALL_TOOLS.reduce((acc, tool) => {
            acc[tool.name] = {};
            return acc;
          }, {})
        },
        serverInfo: { 
          name: config.SERVER_NAME, 
          version: config.SERVER_VERSION,
          description: "Unified MCP server for JIRA, Confluence, and Outlook integration"
        }
      };
    }
    
    // Tools list handler
    if (method === "tools/list") {
      console.error(`📋 TOOLS LIST REQUEST: ID [${id}] - ${ALL_TOOLS.length} tools`);
      
      return {
        tools: ALL_TOOLS.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      };
    }
    
    // Empty responses for other capabilities
    if (method === "resources/list") return { resources: [] };
    if (method === "prompts/list") return { prompts: [] };
    
    // Tool call handler
    if (method === "tools/call") {
      try {
        const { name, arguments: args = {} } = params || {};
        
        console.error(`🔧 TOOL CALL: ${name}`);
        
        // Find the tool handler
        const tool = ALL_TOOLS.find(t => t.name === name);
        
        if (tool && tool.handler) {
          const startTime = Date.now();
          const result = await tool.handler(args);
          const duration = Date.now() - startTime;
          
          console.error(`✅ TOOL COMPLETED: ${name} (${duration}ms)`);
          return result;
        }
        
        // Tool not found
        console.error(`❌ TOOL NOT FOUND: ${name}`);
        return {
          error: {
            code: -32601,
            message: `Tool not found: ${name}`
          }
        };
      } catch (error) {
        console.error(`💥 Error in tools/call:`, error);
        return {
          error: {
            code: -32603,
            message: `Error processing tool call: ${error.message}`
          }
        };
      }
    }
    
    // Method not found
    return {
      error: {
        code: -32601,
        message: `Method not found: ${method}`
      }
    };
  } catch (error) {
    console.error(`💥 Error in fallbackRequestHandler:`, error);
    return {
      error: {
        code: -32603,
        message: `Error processing request: ${error.message}`
      }
    };
  }
};

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.error('📴 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.error('📴 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport)
  .then(() => {
    console.error(`🎯 ${config.SERVER_NAME} connected and ready`);
    console.error(`📡 Listening on STDIO transport`);
  })
  .catch(error => {
    console.error(`💥 Connection error: ${error.message}`);
    process.exit(1);
  });