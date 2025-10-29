<<<<<<< HEAD
# Unified MCP Server

A comprehensive Model Context Protocol (MCP) server that provides seamless integration with **JIRA**, **Confluence**, and **Microsoft Outlook**. This unified server combines the functionality of multiple specialized MCP servers into a single, easy-to-deploy solution.

## 🌟 Features

### 🎫 JIRA Integration (15+ Tools)
- **Issue Management**: Fetch, analyze, create, and update JIRA tickets
- **Workflow Automation**: Transition issues, batch operations
- **Search & Filtering**: Find issues by labels, assignees, JQL queries
- **Comments & Updates**: Add comments, update fields with confirmation
- **Testing & QA**: Test case tracking, effort reporting
- **Analytics**: CSV reports, worklog analysis

### 📄 Confluence Integration (5 Tools)
- **Page Management**: Create, read, update Confluence pages
- **Content Analysis**: Extract and analyze business content
- **Search**: Find pages using CQL (Confluence Query Language)
- **Content Intelligence**: Automatic content categorization and insights

### 📧 Microsoft Outlook Integration (10+ Tools)
- **Email Management**: List, read, send, search emails
- **Calendar Operations**: Create events, manage meetings
- **Folder Organization**: Create folders, move emails
- **Mail Rules**: Automate email processing
- **Authentication**: OAuth 2.0 with Microsoft Graph API

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0+ (for native fetch API support)
- **Access credentials** for JIRA, Confluence, and/or Outlook
- **VS Code** or compatible MCP client

### Installation

1. **Clone or create the project:**
```bash
mkdir unified-mcp-server
cd unified-mcp-server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

4. **Start the server:**
```bash
npm start
```

### Configuration

Create a `.env` file based on `.env.example`:

```env
# Service Control (optional)
USE_TEST_MODE=false
DISABLE_JIRA=false
DISABLE_CONFLUENCE=false
DISABLE_OUTLOOK=false

# JIRA Settings
JIRA_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your.username@company.com
JIRA_PASSWORD=your-password-or-token

# Confluence Settings
CONFLUENCE_URL=https://your-domain.atlassian.net/wiki
CONFLUENCE_USERNAME=your.username@company.com
CONFLUENCE_PASSWORD=your-password-or-token

# Microsoft Outlook Settings
AZURE_CLIENT_ID=your-azure-app-client-id
AZURE_CLIENT_SECRET=your-azure-app-client-secret
AZURE_TENANT_ID=your-tenant-id
```

## 🛠️ Available Tools

### 🎫 JIRA Tools (15 tools)

#### Core Operations
- `jira_fetch` - Get complete ticket information
- `jira_analyze` - Analyze ticket with business insights
- `jira_fetch_by_label` - Find issues by label
- `jira_fetch_by_assignee` - Find issues by assignee
- `jira_add_comment` - Add comments (with confirmation)
- `jira_update_fields` - Update issue fields

#### Workflow Management
- `jira_list_transitions` - List available status transitions
- `jira_update_transition` - Transition issue status
- `jira_tested_to_task_closed` - Specific workflow transition
- `jira_batch_tested_to_task_closed` - Batch workflow operations

#### Testing & Analytics
- `jira_find_test_cases` - Extract test cases from comments
- `jira_aggregate_test_cases` - Aggregate test metrics
- `jira_csv_report` - Generate CSV reports
- `jira_get_editable_fields` - Check editable fields

### 📄 Confluence Tools (5 tools)

- `confluence_fetch` - Get page content and metadata
- `confluence_detailed` - Detailed page analysis
- `confluence_create_page` - Create new pages
- `confluence_update_page` - Update existing pages
- `confluence_search` - Search pages with CQL

### 📧 Outlook Tools (10+ tools)

#### Authentication
- `outlook_about` - Server information
- `outlook_authenticate` - OAuth authentication
- `outlook_token_status` - Check auth status
- `outlook_refresh_tokens` - Refresh access tokens

#### Email Management
- `outlook_list_emails` - List emails with filtering
- `outlook_read_email` - Read specific emails
- `outlook_send_email` - Send new emails
- `outlook_search_emails` - Search email content
- `outlook_mark_as_read` - Update read status

#### Calendar & Organization
- `outlook_list_events` - List calendar events
- `outlook_create_event` - Create meetings/events
- `outlook_list_folders` - List mail folders
- `outlook_create_folder` - Create new folders
- `outlook_move_email` - Organize emails
- `outlook_list_rules` - List mail rules
- `outlook_create_rule` - Create automation rules

## 📱 Client Integration

### VS Code Integration

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

### Claude Desktop Integration

Add to `claude_desktop_config.json`:
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

**Configuration file locations:**
- **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## 💡 Usage Examples

### JIRA Operations
```javascript
// Get ticket details
{"name": "jira_fetch", "arguments": {"issueKey": "PROJ-123"}}

// Search by assignee
{"name": "jira_fetch_by_assignee", "arguments": {
  "assignee": "john.doe", 
  "status": "In Progress"
}}

// Add comment (requires confirmation)
{"name": "jira_add_comment", "arguments": {
  "issueKey": "PROJ-123", 
  "comment": "Updated based on review",
  "confirm": true
}}
```

### Confluence Operations
```javascript
// Fetch page content
{"name": "confluence_fetch", "arguments": {
  "url": "https://company.atlassian.net/wiki/display/DOCS/API+Documentation"
}}

// Create new page
{"name": "confluence_create_page", "arguments": {
  "spaceKey": "DOCS", 
  "title": "New Process Document", 
  "content": "<p>Process details here...</p>"
}}
```

### Outlook Operations
```javascript
// Authenticate first
{"name": "outlook_authenticate", "arguments": {}}

// List recent emails
{"name": "outlook_list_emails", "arguments": {
  "folder": "inbox", 
  "maxResults": 10, 
  "unreadOnly": true
}}

// Send email
{"name": "outlook_send_email", "arguments": {
  "to": ["recipient@company.com"], 
  "subject": "Project Update", 
  "body": "Here is the latest update..."
}}

// Create calendar event
{"name": "outlook_create_event", "arguments": {
  "title": "Team Meeting", 
  "startDateTime": "2024-12-01T10:00:00Z", 
  "endDateTime": "2024-12-01T11:00:00Z",
  "attendees": ["team@company.com"]
}}
```

## 🏗️ Architecture

### Project Structure
```
unified-mcp-server/
├── index.js                 # Main server entry point
├── config.js                # Unified configuration
├── package.json             # Dependencies and scripts
├── .env.example             # Environment template
│
├── utils/
│   └── index.js             # HTTP client & text processing
│
├── jira/
│   ├── index.js             # JIRA tools definitions
│   └── service.js           # JIRA API implementation
│
├── confluence/
│   ├── index.js             # Confluence tools definitions
│   └── service.js           # Confluence API implementation
│
└── outlook/
    ├── index.js             # Outlook tools aggregator
    ├── auth/
    │   ├── index.js         # Auth tools
    │   └── token-manager.js # Token management
    ├── email/
    │   └── index.js         # Email tools
    ├── calendar/
    │   └── index.js         # Calendar tools
    ├── folder/
    │   └── index.js         # Folder tools
    ├── rules/
    │   └── index.js         # Rules tools
    └── services/
        └── graph-service.js # Microsoft Graph API client
```

### Design Principles
- **Zero External Dependencies** (except MCP SDK and dotenv)
- **Modular Architecture** - Each service is independently implementable
- **Unified Configuration** - Single configuration system for all services
- **Test Mode Support** - Mock data for development and testing
- **Graceful Degradation** - Services can be disabled individually
- **Security First** - Credential isolation and secure token management

## 🔧 Development

### Test Mode
```bash
USE_TEST_MODE=true npm start
```

In test mode, all services return mock data without requiring actual credentials.

### Selective Service Enablement
```bash
# Disable specific services
DISABLE_JIRA=true npm start
DISABLE_OUTLOOK=true npm start
```

### Debugging
```bash
# The server logs detailed information to stderr
npm start 2> server.log
```

### Adding New Tools

1. **Create tool definition** in appropriate service module
2. **Implement handler function** with proper error handling
3. **Add tool to exports** array
4. **Test with mock data** in test mode

## 🚨 Troubleshooting

### Common Issues

**Authentication Errors:**
- Verify credentials in `.env` file
- Check API endpoint URLs
- Ensure proper permissions for service accounts

**JIRA/Confluence Connection Issues:**
- Verify base64 encoding of passwords if using encoded format
- Check corporate firewall settings
- Try setting `NODE_TLS_REJECT_UNAUTHORIZED=0` for SSL issues

**Outlook Authentication:**
- Ensure Azure app registration is correct
- Check redirect URI matches configuration
- Verify required Graph API permissions are granted

**MCP Client Issues:**
- Confirm client is using correct server path
- Check that Node.js version is 18.0+
- Verify MCP protocol compatibility

### Debug Commands

```bash
# Test server startup
node index.js --help

# Check configuration
USE_TEST_MODE=true node index.js

# Test specific service
DISABLE_JIRA=true DISABLE_CONFLUENCE=true node index.js
```

## 🔐 Security Considerations

- **Environment Variables**: Never commit `.env` files to version control
- **Token Storage**: Outlook tokens are stored locally in `.outlook-tokens.json`
- **Network Security**: Configure firewalls and proxies as needed
- **Credential Rotation**: Regularly rotate API keys and passwords
- **Permissions**: Use least-privilege principles for service accounts

## 🤝 Contributing

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/new-tool`
3. **Add implementation** in appropriate service directory
4. **Update documentation** including tool descriptions
5. **Test thoroughly** in both test and production modes
6. **Submit pull request**

## 📄 License

MIT License - See LICENSE file for details

## 🏢 Enterprise Features

- **Corporate Proxy Support**: Works through corporate firewalls
- **SSO Compatibility**: Handles enterprise authentication flows
- **Audit Logging**: Comprehensive request/response logging
- **Zero Dependencies**: Minimal attack surface for security compliance
- **Configuration Management**: Environment-based credential handling
- **High Availability**: Stateless design for horizontal scaling

## 🆕 Version History

### v1.0.0
- **Initial Release**: Unified JIRA, Confluence, and Outlook integration
- **25+ Tools**: Comprehensive productivity suite
- **Test Mode**: Complete mock data support
- **Modular Architecture**: Independently deployable services
- **Enterprise Ready**: Security and compliance features

---

**Built with ❤️ for enterprise productivity and automation**

*A single MCP server to rule them all - JIRA, Confluence, and Outlook integration made simple!*
=======
# Unified_MCP_Server
this mcp server connects to Jira, confluence and outlook (currently personal outlook email) and performs actions
>>>>>>> 2f737a2e472785fe5f60d32f6ab8b89dd6bb4380
