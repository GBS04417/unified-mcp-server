/**
 * Authentication tools for Outlook integration
 * Manages Microsoft Graph API authentication and token handling
 */

const config = require('../../config');
const { TokenManager } = require('./token-manager');

// Initialize token manager
const tokenManager = new TokenManager();

/**
 * About tool handler - provides information about the server
 */
async function handleAbout() {
  return {
    content: [{
      type: "text",
      text: `📧 Unified MCP Server - Outlook Integration v${config.SERVER_VERSION} 📧\n\nProvides access to Microsoft Outlook email, calendar, and contacts through Microsoft Graph API.\nIntegrated with JIRA and Confluence for comprehensive productivity management.`
    }]
  };
}

/**
 * Authentication tool handler
 */
async function handleAuthenticate(args) {
  const force = args && args.force === true;
  
  // For test mode, create a test token
  if (config.OUTLOOK_USE_TEST_MODE) {
    tokenManager.createTestTokens();
    
    return {
      content: [{
        type: "text",
        text: 'Successfully authenticated with Microsoft Graph API (test mode)'
      }]
    };
  }
  
  // Check if we already have valid tokens
  if (!force && tokenManager.hasValidTokens()) {
    return {
      content: [{
        type: "text",
        text: 'Already authenticated with Microsoft Graph API. Use force=true to re-authenticate.'
      }]
    };
  }
  
  // Generate authentication URL
  const authUrl = `${config.OUTLOOK_CONFIG.authServerUrl}/auth?client_id=${config.OUTLOOK_CONFIG.clientId}`;
  
  return {
    content: [{
      type: "text",
      text: `Authentication required. Please visit the following URL to authenticate with Microsoft:\n\n${authUrl}\n\nAfter authentication, you will be redirected back and tokens will be stored automatically.`
    }]
  };
}

/**
 * Token status tool handler
 */
async function handleTokenStatus() {
  const status = tokenManager.getTokenStatus();
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        hasAccessToken: !!status.accessToken,
        hasRefreshToken: !!status.refreshToken,
        tokenExpiry: status.expiry,
        isValid: status.isValid,
        testMode: config.OUTLOOK_USE_TEST_MODE
      }, null, 2)
    }]
  };
}

/**
 * Refresh tokens tool handler
 */
async function handleRefreshTokens() {
  if (config.OUTLOOK_USE_TEST_MODE) {
    tokenManager.createTestTokens();
    return {
      content: [{
        type: "text",
        text: 'Test tokens refreshed successfully'
      }]
    };
  }

  try {
    await tokenManager.refreshTokens();
    return {
      content: [{
        type: "text",
        text: 'Tokens refreshed successfully'
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Failed to refresh tokens: ${error.message}`
      }]
    };
  }
}

/**
 * Ensure user is authenticated
 * @returns {string} - Access token
 * @throws {Error} - If authentication is required
 */
async function ensureAuthenticated() {
  // Check if we have valid tokens
  if (tokenManager.hasValidTokens()) {
    return tokenManager.getAccessToken();
  }
  
  // Throw error if not authenticated
  throw new Error('Authentication required');
}

// Define authentication tools
const authTools = [
  {
    name: 'outlook_about',
    description: 'Get information about the Outlook MCP server and its capabilities',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    handler: handleAbout
  },

  {
    name: 'outlook_authenticate',
    description: 'Authenticate with Microsoft Graph API to access Outlook data',
    inputSchema: {
      type: 'object',
      properties: {
        force: {
          type: 'boolean',
          description: 'Force re-authentication even if tokens exist'
        }
      },
      additionalProperties: false
    },
    handler: handleAuthenticate
  },

  {
    name: 'outlook_token_status',
    description: 'Check the status of authentication tokens',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    handler: handleTokenStatus
  },

  {
    name: 'outlook_refresh_tokens',
    description: 'Refresh the authentication tokens',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    handler: handleRefreshTokens
  }
];

module.exports = { authTools, ensureAuthenticated, tokenManager };
