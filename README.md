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

### 📧 Microsoft Outlook Integration (15+ Tools)
- **Email Management**: List, read, send, search, reply to emails with advanced filtering
- **Email Organization**: Move emails by criteria, mark as read/unread
- **Calendar Operations**: Create events, manage meetings, accept/decline invitations
- **Folder Management**: Create folders, list hierarchy, move folders between locations
- **Mail Rules**: Create and manage mail automation rules
- **Authentication**: OAuth 2.0 with Microsoft Graph API
- **Advanced Features**: Interactive email reply mode, batch email operations

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
Create a .env file with your credentials:
`ash
# JIRA Configuration
JIRA_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your-email@example.com
JIRA_PASSWORD=your-api-token

# Confluence Configuration
CONFLUENCE_URL=https://your-domain.atlassian.net/wiki
CONFLUENCE_USERNAME=your-email@example.com
CONFLUENCE_PASSWORD=your-api-token

# Azure/Outlook Configuration (for OAuth)
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_REDIRECT_URI=http://localhost:3000/auth/callback
`

4. **Start the server:**
`ash
node index.js
`

The server will output connection details and confirm all services are running.

## 📋 Available Tools

### 🎫 JIRA Tools

#### Core Operations
- jira_fetch - Get issue details by key
- jira_fetch_by_assignee - Find issues by assignee
- jira_fetch_by_label - Find issues by label
- jira_search - Advanced JQL search
- jira_create - Create new issue
- jira_update - Update issue fields
- jira_add_comment - Add comment to issue (with confirmation)

#### Workflow Management
- jira_list_transitions - List available status transitions
- jira_update_transition - Transition issue status
- jira_tested_to_task_closed - Specific workflow transition
- jira_batch_tested_to_task_closed - Batch workflow operations

#### Testing & Analytics
- jira_find_test_cases - Extract test cases from comments
- jira_aggregate_test_cases - Aggregate test metrics
- jira_csv_report - Generate CSV reports
- jira_get_editable_fields - Check editable fields

### ?? Confluence Tools

- confluence_fetch - Get page content and metadata
- confluence_detailed - Detailed page analysis
- confluence_create_page - Create new pages
- confluence_update_page - Update existing pages
- confluence_search - Search pages with CQL

### 📧 Outlook Tools

#### Authentication & Status
- outlook_about - Server information
- outlook_authenticate - OAuth authentication
- outlook_token_status - Check auth status
- outlook_refresh_tokens - Refresh access tokens

#### Email Management
- list-emails - List emails in a folder with filtering
- search-emails - Search emails across mailbox by subject, from, or content
- 
ead-email - Read full email content
- send-email - Send new emails with CC/BCC support
- 
eply-email - Reply to emails (interactive two-mode: search then reply)
- mark-as-read - Mark emails as read/unread
- move-email - Move emails by search criteria between folders

#### Folder Management
- list-folders - List all mail folders in hierarchy
- create-folder - Create new mail folders
- `move-folder` - Move folders between locations (⚠️ see limitations below)

#### Calendar Operations
- outlook_list_events - List calendar events
- outlook_create_event - Create meetings/events
- outlook_accept_event - Accept calendar invitation
- outlook_decline_event - Decline calendar invitation
- outlook_cancel_event - Cancel calendar event

#### Other Tools
- outlook_list_rules - List mail automation rules
- outlook_create_rule - Create mail automation rules

## 🎯 Recent Enhancements (v1.1.0)

### Email Reply Tool
- **Interactive two-mode operation**:
  - **Search Mode**: Search for emails to reply to (without body parameter)
  - **Reply Mode**: Compose and send reply (with body parameter)
- **Features**: CC, BCC support, importance levels, option to include original message
- **Default Behavior**: Sends reply by default (can save as draft with saveToSentItems parameter)

### Email Move Tool Enhancements
- **Search-based filtering**: Move multiple emails matching criteria
- **Flexible parameters**: Filter by subject, from, or custom query
- **Folder-specific**: Specify source and destination folders explicitly
- **Batch operations**: Process multiple emails at once (configurable limit)

### Folder Management Improvements
- **Clear Parameters**: sourceFolder and 	argetFolder parameters for clarity
- **Complete Folder Discovery**: Lists all available folders on errors (up to 500 folders)
- **Helpful Error Messages**: Shows available folder names when target not found
- **Better Organization**: Separate folder and email move operations

### ⚠️ Important: Outlook Folder Move Limitation
**Note**: Due to Microsoft Outlook's folder hierarchy constraints, folder move requests may succeed (matching Outlook UI behavior) but may not change the visual position of folders in your mailbox. This is an Outlook API design limitation, not a tool issue. The tool correctly sends move requests, but Outlook's internal hierarchy prevents custom folder moves between locations. The move operation will show as successful to match Outlook UI behavior.

## 💡 Usage Examples

### Email Operations

**Send an email:**
`javascript
{
  "name": "send-email",
  "arguments": {
    "to": "recipient@example.com",
    "subject": "Hello",
    "body": "This is my email",
    "cc": "cc@example.com"
  }
}
`

**Search emails:**
`javascript
{
  "name": "search-emails",
  "arguments": {
    "query": "important deadline",
    "folder": "Inbox",
    "maxResults": 10
  }
}
`

**Move emails:**
`javascript
{
  "name": "move-email",
  "arguments": {
    "sourceFolder": "Inbox",
    "destinationFolder": "Archive",
    "subject": "Old emails",
    "maxEmails": 5
  }
}
`

**Reply to email (Search mode):**
`javascript
{
  "name": "reply-email",
  "arguments": {
    "folder": "Inbox",
    "from": "sender@example.com"
  }
}
`

**Reply to email (Reply mode):**
`javascript
{
  "name": "reply-email",
  "arguments": {
    "folder": "Inbox",
    "from": "sender@example.com",
    "body": "Thanks for your email!",
    "saveToSentItems": true
  }
}
`

### Folder Operations

**Create folder:**
`javascript
{
  "name": "create-folder",
  "arguments": {
    "name": "Project Files"
  }
}
`

**Move folder:**
`javascript
{
  "name": "move-folder",
  "arguments": {
    "sourceFolder": "OldProject",
    "targetFolder": "Archive"
  }
}
`

### JIRA Operations
`javascript
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
`

### Confluence Operations
`javascript
// Search pages
{"name": "confluence_search", "arguments": {
  "query": "API Documentation",
  "limit": 5
}}

// Fetch page
{"name": "confluence_fetch", "arguments": {
  "pageId": "12345"
}}

// Create page
{"name": "confluence_create_page", "arguments": {
  "title": "New Documentation",
  "content": "<p>Page content</p>",
  "parentId": "9876"
}}
`

## 🧪 Testing

### Run Tests
`ash
npm test
`

### Test Specific Module
`ash
node test-move-folder.js
node test-subfolder-move.js
node test-move-email-availability.js
`

### Enable Test Mode
`ash
USE_TEST_MODE=true node index.js
`

## 🔧 Configuration

### Environment Variables

**JIRA:**
- JIRA_URL - Base URL of your JIRA instance
- JIRA_USERNAME - Email or username
- JIRA_PASSWORD - API token or password

**Confluence:**
- CONFLUENCE_URL - Base URL of your Confluence instance
- CONFLUENCE_USERNAME - Email or username
- CONFLUENCE_PASSWORD - API token or password

**Outlook:**
- AZURE_CLIENT_ID - Azure application client ID
- AZURE_CLIENT_SECRET - Azure application secret
- AZURE_TENANT_ID - Azure tenant ID
- AZURE_REDIRECT_URI - OAuth redirect URI

**Service Control:**
- DISABLE_JIRA=true - Disable JIRA module
- DISABLE_CONFLUENCE=true - Disable Confluence module
- USE_TEST_MODE=true - Enable mock data for testing

### Test Specific Service
`ash
DISABLE_JIRA=true DISABLE_CONFLUENCE=true node index.js
`

## 📁 Project Structure

`
unified-mcp-server/
+-- index.js                 # Main server entry point
+-- config.js                # Unified configuration
+-- package.json             # Dependencies
+-- .env.example             # Environment template
�
+-- utils/
�   +-- index.js             # HTTP client utilities
�
+-- jira/
�   +-- index.js             # JIRA tools
�   +-- service.js           # JIRA API implementation
�
+-- confluence/
�   +-- index.js             # Confluence tools
�   +-- service.js           # Confluence API implementation
�
+-- outlook/
    +-- index.js             # Main Outlook aggregator
    +-- auth/
    �   +-- index.js         # Auth tools
    �   +-- token-manager.js # OAuth token management
    +-- email/
    �   +-- index.js         # Email tools definition
    �   +-- list.js          # List emails implementation
    �   +-- read.js          # Read email implementation
    �   +-- send.js          # Send email implementation
    �   +-- search.js        # Search emails implementation
    �   +-- reply.js         # Reply email implementation
    �   +-- mark-as-read.js  # Mark as read implementation
    �   +-- move.js          # Move email implementation
    �   +-- folder-utils.js  # Folder resolution utilities
    +-- calendar/
    �   +-- index.js         # Calendar tools
    �   +-- [operation].js   # Calendar operations
    +-- folder/
    �   +-- index.js         # Folder tools definition
    �   +-- list.js          # List folders implementation
    �   +-- create.js        # Create folder implementation
    �   +-- move.js          # Move folder implementation
    +-- rules/
    �   +-- index.js         # Mail rules tools
    +-- services/
        +-- graph-service.js # Microsoft Graph API client
`

## 🔐 Security Considerations

- **Environment Variables**: Never commit .env files to version control
- **Token Storage**: Outlook tokens are stored locally in .outlook-tokens.json
- **Network Security**: Configure firewalls and proxies as needed
- **Credential Rotation**: Regularly rotate API keys and passwords
- **Permissions**: Use least-privilege principles for service accounts
- **OAuth Scopes**: Minimal required scopes requested during authentication

## 🤝 Contributing

1. **Fork** the repository
2. **Create feature branch**: git checkout -b feature/new-tool
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
- **Zero Dependencies**: Minimal external dependencies for security
- **Configuration Management**: Environment-based credential handling
- **High Availability**: Stateless design for horizontal scaling
- **Folder Hierarchy Support**: Handle complex folder structures
- **Batch Operations**: Efficient processing of multiple items

## 🆕 Version History

### v1.1.0
- **Email Reply Tool**: Interactive two-mode email reply functionality
- **Enhanced Email Move**: Search-based email filtering and batch operations
- **Folder Management**: Clear source/target parameter distinction
- **Improved Error Handling**: Better error messages and folder discovery
- **Outlook Limitations**: Documented folder move constraints clearly
- **Performance**: Optimized folder lookup with $top=500
- **Removed Deprecated Parameters**: folderName and destinationFolder replaced with sourceFolder/targetFolder

### v1.0.0
- **Initial Release**: Unified JIRA, Confluence, and Outlook integration
- **25+ Tools**: Comprehensive productivity suite
- **Test Mode**: Complete mock data support
- **Modular Architecture**: Independently deployable services
- **Enterprise Ready**: Security and compliance features

---

**Built for enterprise productivity and automation**

*A single MCP server to rule them all - JIRA, Confluence, and Outlook integration made simple!*
