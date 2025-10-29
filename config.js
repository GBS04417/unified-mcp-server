/**
 * Unified MCP Server Configuration
 * 
 * Manages configuration for JIRA, Confluence, and Outlook integrations
 */

// Server configuration
const SERVER_NAME = 'unified-mcp-server';
const SERVER_VERSION = '1.0.0';

// Service enablement (can be controlled via environment variables)
const JIRA_ENABLED = process.env.DISABLE_JIRA !== 'true';
const CONFLUENCE_ENABLED = process.env.DISABLE_CONFLUENCE !== 'true';
const OUTLOOK_ENABLED = process.env.DISABLE_OUTLOOK !== 'true';

// Test mode configuration
const USE_TEST_MODE = process.env.USE_TEST_MODE === 'true';

// JIRA Configuration
const JIRA_CONFIG = {
  baseUrl: process.env.JIRA_URL || 'https://your-domain.atlassian.net',
  username: process.env.JIRA_USERNAME || process.env.USER_NAME,
  password: process.env.JIRA_PASSWORD || process.env.SYSTEM_PASSWORD,
  // Support for base64 encoded passwords (from original JIRA server)
  get decodedPassword() {
    if (!this.password) return null;
    try {
      // Try to decode base64, if it fails, use as plain text
      return Buffer.from(this.password, 'base64').toString('utf-8');
    } catch {
      return this.password;
    }
  }
};

// Confluence Configuration
const CONFLUENCE_CONFIG = {
  baseUrl: process.env.CONFLUENCE_URL || 'https://your-domain.atlassian.net/wiki',
  username: process.env.CONFLUENCE_USERNAME || process.env.USER_NAME,
  password: process.env.CONFLUENCE_PASSWORD || process.env.SYSTEM_PASSWORD,
  // Support for base64 encoded passwords (from original Confluence server)
  get decodedPassword() {
    if (!this.password) return null;
    try {
      return Buffer.from(this.password, 'base64').toString('utf-8');
    } catch {
      return this.password;
    }
  }
};

// Outlook Configuration (Microsoft Graph API)
const OUTLOOK_CONFIG = {
  clientId: process.env.AZURE_CLIENT_ID || 'your-azure-app-client-id',
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  tenantId: process.env.AZURE_TENANT_ID || 'common',
  redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  scopes: [
    'https://graph.microsoft.com/Mail.Read',
    'https://graph.microsoft.com/Mail.Send',
    'https://graph.microsoft.com/Mail.ReadWrite',
    'https://graph.microsoft.com/Calendars.Read',
    'https://graph.microsoft.com/Calendars.ReadWrite',
    'https://graph.microsoft.com/MailboxSettings.Read',
    'https://graph.microsoft.com/User.Read'
  ],
  authServerUrl: process.env.AUTH_SERVER_URL || 'http://localhost:3000'
};

// HTTP Configuration (for JIRA/Confluence API calls)
const HTTP_CONFIG = {
  timeout: parseInt(process.env.HTTP_TIMEOUT) || 30000,
  retries: parseInt(process.env.HTTP_RETRIES) || 3,
  rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'
};

// Validation functions
function validateJiraConfig() {
  if (!JIRA_ENABLED) return true;
  
  const required = ['baseUrl', 'username'];
  const missing = required.filter(key => !JIRA_CONFIG[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing JIRA configuration: ${missing.join(', ')}`);
    return false;
  }
  
  if (!JIRA_CONFIG.password && !USE_TEST_MODE) {
    console.error('❌ JIRA password required (set JIRA_PASSWORD or SYSTEM_PASSWORD)');
    return false;
  }
  
  return true;
}

function validateConfluenceConfig() {
  if (!CONFLUENCE_ENABLED) return true;
  
  const required = ['baseUrl', 'username'];
  const missing = required.filter(key => !CONFLUENCE_CONFIG[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing Confluence configuration: ${missing.join(', ')}`);
    return false;
  }
  
  if (!CONFLUENCE_CONFIG.password && !USE_TEST_MODE) {
    console.error('❌ Confluence password required (set CONFLUENCE_PASSWORD or SYSTEM_PASSWORD)');
    return false;
  }
  
  return true;
}

function validateOutlookConfig() {
  if (!OUTLOOK_ENABLED) return true;
  
  if (!OUTLOOK_CONFIG.clientId || OUTLOOK_CONFIG.clientId === 'your-azure-app-client-id') {
    console.error('❌ Azure Client ID required (set AZURE_CLIENT_ID)');
    return false;
  }
  
  return true;
}

// Validate all configurations on load
function validateConfiguration() {
  const validations = [
    validateJiraConfig(),
    validateConfluenceConfig(),
    validateOutlookConfig()
  ];
  
  const isValid = validations.every(v => v);
  
  if (!isValid) {
    console.error('❌ Configuration validation failed. Please check your environment variables.');
    if (!USE_TEST_MODE) {
      process.exit(1);
    }
  }
  
  return isValid;
}

// Run validation
validateConfiguration();

module.exports = {
  SERVER_NAME,
  SERVER_VERSION,
  JIRA_ENABLED,
  CONFLUENCE_ENABLED,
  OUTLOOK_ENABLED,
  USE_TEST_MODE,
  JIRA_CONFIG,
  CONFLUENCE_CONFIG,
  OUTLOOK_CONFIG,
  HTTP_CONFIG
};