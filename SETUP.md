# Unified MCP Server Setup Guide

## Prerequisites Checklist

- [ ] **Node.js 18.0+** installed
- [ ] **JIRA access** (username/password or API token)
- [ ] **Confluence access** (username/password or API token) 
- [ ] **Azure App Registration** for Outlook (optional)
- [ ] **MCP-compatible client** (VS Code, Claude Desktop, etc.)

## Step-by-Step Setup

### 1. Project Setup

```bash
# Clone or create project directory
mkdir unified-mcp-server
cd unified-mcp-server

# Copy all files from this project
# Install dependencies
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:

#### For JIRA & Confluence:
```env
# Atlassian Configuration
JIRA_URL=https://your-company.atlassian.net
JIRA_USERNAME=your.email@company.com
JIRA_PASSWORD=your-api-token-or-password

CONFLUENCE_URL=https://your-company.atlassian.net/wiki
CONFLUENCE_USERNAME=your.email@company.com
CONFLUENCE_PASSWORD=your-api-token-or-password
```

#### For Microsoft Outlook:
```env
# Azure App Registration
AZURE_CLIENT_ID=12345678-1234-1234-1234-123456789abc
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 3. Atlassian Setup (JIRA/Confluence)

#### Option A: Username/Password
- Use your regular Atlassian account credentials
- Make sure 2FA is disabled or use app-specific passwords

#### Option B: API Tokens (Recommended)
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Create API token
3. Use your email as username, API token as password

#### Option C: Base64 Encoded (Legacy)
```env
USER_NAME=your.email@company.com
SYSTEM_PASSWORD=base64-encoded-password
```

### 4. Microsoft Outlook Setup

#### Create Azure App Registration:
1. Go to https://portal.azure.com
2. Navigate to "App registrations"
3. Click "New registration"
4. Fill in details:
   - **Name**: "Unified MCP Server"
   - **Supported account types**: "Accounts in this organizational directory only"
   - **Redirect URI**: "Web" → `http://localhost:3000/auth/callback`

#### Configure API Permissions:
1. Go to "API permissions"
2. Add permissions → Microsoft Graph → Delegated permissions
3. Add these scopes:
   - `Mail.Read`
   - `Mail.Send` 
   - `Mail.ReadWrite`
   - `Calendars.Read`
   - `Calendars.ReadWrite`
   - `MailboxSettings.Read`
   - `User.Read`
4. Grant admin consent

#### Get Client Secret:
1. Go to "Certificates & secrets"
2. Create new client secret
3. Copy the secret value (not the ID)

### 5. Test Mode Setup (Optional)

For development/testing without real credentials:
```env
USE_TEST_MODE=true
```

This enables mock data for all services.

### 6. Client Configuration

#### VS Code Setup
Create `.vscode/settings.json`:
```json
{
  "mcp.servers": {
    "unified-mcp-server": {
      "command": "node",
      "args": ["index.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

#### Claude Desktop Setup
Edit your Claude Desktop configuration:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "unified-mcp-server": {
      "command": "node",
      "args": ["C:\\absolute\\path\\to\\unified-mcp-server\\index.js"]
    }
  }
}
```

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "unified-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/unified-mcp-server/index.js"]
    }
  }
}
```

### 7. Start the Server

```bash
npm start
```

Expected output:
```
🚀 STARTING UNIFIED MCP SERVER v1.0.0
📊 JIRA Integration: ENABLED
📄 Confluence Integration: ENABLED  
📧 Outlook Integration: ENABLED
✅ JIRA: 15 tools loaded
✅ Confluence: 5 tools loaded
✅ Outlook: 16 tools loaded
🔧 Total tools available: 36
🎯 unified-mcp-server connected and ready
📡 Listening on STDIO transport
```

### 8. Test the Installation

Test configuration:
```bash
npm run test
```

Or manually test a tool:
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node index.js
```

## Troubleshooting

### Common Issues

#### JIRA/Confluence Authentication Errors
```
❌ Failed to fetch JIRA issue: HTTP 401
```
**Solutions:**
- Verify username and password/API token
- Check base URL format
- Ensure API access is enabled
- Try base64 encoding password

#### Outlook Authentication Issues  
```
❌ Azure Client ID required
```
**Solutions:**
- Complete Azure App Registration
- Add all required Graph API permissions
- Grant admin consent for permissions
- Check client secret is not expired

#### Module Loading Errors
```
❌ Cannot find module
```
**Solutions:**
- Run `npm install`
- Check Node.js version (18.0+ required)
- Verify file paths and permissions

#### Corporate Network Issues
```
❌ Network error / SSL certificate issues
```
**Solutions:**
- Set `NODE_TLS_REJECT_UNAUTHORIZED=0` for SSL issues
- Configure corporate proxy if needed
- Check firewall settings
- Verify VPN connection

### Debug Mode

Enable detailed logging:
```bash
# Windows
$env:DEBUG='*'; npm start

# macOS/Linux  
DEBUG=* npm start
```

### Selective Service Testing

Test individual services:
```bash
# Only JIRA
DISABLE_CONFLUENCE=true DISABLE_OUTLOOK=true npm start

# Only Outlook
DISABLE_JIRA=true DISABLE_CONFLUENCE=true npm start
```

## Verification Checklist

After setup, verify these work:

### JIRA Tests
- [ ] `jira_fetch` with real issue key
- [ ] `jira_fetch_by_assignee` with real username
- [ ] `jira_add_comment` (with confirm=false first)

### Confluence Tests  
- [ ] `confluence_fetch` with real page URL
- [ ] `confluence_search` with valid query
- [ ] `confluence_create_page` (test space)

### Outlook Tests
- [ ] `outlook_authenticate` 
- [ ] `outlook_list_emails`
- [ ] `outlook_list_events`
- [ ] `outlook_token_status`

## Support

If you encounter issues:

1. **Check logs** - Server outputs detailed error information
2. **Verify credentials** - Test API access outside MCP server
3. **Test mode** - Use `USE_TEST_MODE=true` to isolate issues
4. **Individual services** - Disable other services to isolate problems
5. **Update dependencies** - Ensure latest MCP SDK version

## Security Notes

- Never commit `.env` files to version control
- Use API tokens instead of passwords when possible
- Regularly rotate credentials
- Monitor access logs for suspicious activity
- Use least-privilege principles for service accounts