# Unified MCP Server - Tool Reference

## Quick Reference

**Total Tools: 36**
- 🎫 **JIRA**: 15 tools
- 📄 **Confluence**: 5 tools  
- 📧 **Outlook**: 16 tools

## 🎫 JIRA Tools (15)

### Core Operations
| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `jira_fetch` | Get complete ticket information with worklog | `issueKey` | - |
| `jira_analyze` | Analyze ticket with business insights | `issueKey` | - |
| `jira_fetch_by_label` | Find issues by label | `label` | `maxResults` |
| `jira_fetch_by_assignee` | Find issues by assignee | `assignee` | `status`, `maxResults` |
| `jira_add_comment` | Add comment with confirmation | `issueKey`, `comment` | `confirm` |
| `jira_update_fields` | Update multiple issue fields | `issueKey` | `summary`, `description`, `assignee`, `priority` |

### Workflow Management
| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `jira_list_transitions` | List available status transitions | `issueKey` | - |
| `jira_update_transition` | Transition issue status | `issueKey`, `transitionId` | `comment`, `assignee`, `resolution` |
| `jira_tested_to_task_closed` | Specific workflow transition | `issueKey` | `comment` |
| `jira_batch_tested_to_task_closed` | Batch workflow operations | `issueKeys[]` | `comment` |

### Testing & Analytics
| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `jira_find_test_cases` | Extract test cases from comments | `issueKey` | - |
| `jira_aggregate_test_cases` | Aggregate test metrics by label | `label` | - |
| `jira_generate_test_case_effort_csv` | Generate CSV test report | `label`, `filePath` | - |
| `jira_csv_report` | Generate CSV report for issues | `label`, `filePath` | - |
| `jira_get_editable_fields` | Check editable fields | `issueKey` | - |

## 📄 Confluence Tools (5)

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `confluence_fetch` | Get page content and metadata | `url` | - |
| `confluence_detailed` | Detailed page analysis with insights | `url` | - |
| `confluence_create_page` | Create new page | `spaceKey`, `title`, `content` | `parentPageId` |
| `confluence_update_page` | Update existing page | `content` + (`pageId` OR `url`) | `title`, `versionComment` |
| `confluence_search` | Search pages with CQL | `query` | `spaceKey`, `maxResults` |

## 📧 Outlook Tools (16)

### Authentication (4 tools)
| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `outlook_about` | Server information | - | - |
| `outlook_authenticate` | OAuth authentication | - | `force` |
| `outlook_token_status` | Check auth status | - | - |
| `outlook_refresh_tokens` | Refresh access tokens | - | - |

### Email Management (5 tools)
| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `outlook_list_emails` | List emails with filtering | - | `folder`, `maxResults`, `filter`, `search`, `unreadOnly` |
| `outlook_read_email` | Read specific email | `emailId` | - |
| `outlook_send_email` | Send new email | `to[]`, `subject`, `body` | `cc[]`, `bcc[]`, `importance` |
| `outlook_mark_as_read` | Update read status | `emailId` | `isRead` |
| `outlook_search_emails` | Search email content | `query` | `folder`, `maxResults` |

### Calendar (2 tools)
| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `outlook_list_events` | List calendar events | - | `maxResults`, `startDate`, `endDate` |
| `outlook_create_event` | Create meeting/event | `title`, `startDateTime`, `endDateTime` | `attendees[]`, `location`, `body`, `timeZone` |

### Organization (5 tools)
| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `outlook_list_folders` | List mail folders | - | - |
| `outlook_create_folder` | Create new folder | `name` | `parentFolderId` |
| `outlook_move_email` | Move email to folder | `emailId`, `destinationFolderId` | - |
| `outlook_list_rules` | List mail rules | - | - |
| `outlook_create_rule` | Create automation rule | `name`, `conditions`, `actions` | `enabled` |

## 💡 Common Usage Patterns

### JIRA Workflow
```javascript
// 1. Find issues
{"name": "jira_fetch_by_assignee", "arguments": {"assignee": "john.doe"}}

// 2. Analyze specific issue
{"name": "jira_analyze", "arguments": {"issueKey": "PROJ-123"}}

// 3. Add comment
{"name": "jira_add_comment", "arguments": {
  "issueKey": "PROJ-123", 
  "comment": "Work completed", 
  "confirm": true
}}

// 4. Transition issue
{"name": "jira_tested_to_task_closed", "arguments": {
  "issueKey": "PROJ-123", 
  "comment": "Closing after testing"
}}
```

### Confluence Documentation
```javascript
// 1. Search for existing docs
{"name": "confluence_search", "arguments": {
  "query": "API documentation", 
  "spaceKey": "DEV"
}}

// 2. Create new page
{"name": "confluence_create_page", "arguments": {
  "spaceKey": "DEV", 
  "title": "New API Docs", 
  "content": "<p>Documentation content...</p>"
}}

// 3. Update existing page
{"name": "confluence_update_page", "arguments": {
  "url": "https://company.atlassian.net/wiki/display/DEV/API+Docs", 
  "content": "<p>Updated content...</p>", 
  "versionComment": "Added new endpoints"
}}
```

### Outlook Email Management
```javascript
// 1. Authenticate
{"name": "outlook_authenticate", "arguments": {}}

// 2. Check unread emails
{"name": "outlook_list_emails", "arguments": {
  "folder": "inbox", 
  "unreadOnly": true, 
  "maxResults": 20
}}

// 3. Read specific email
{"name": "outlook_read_email", "arguments": {"emailId": "email-id-here"}}

// 4. Send response
{"name": "outlook_send_email", "arguments": {
  "to": ["sender@company.com"], 
  "subject": "Re: Original Subject", 
  "body": "Thanks for your message..."
}}

// 5. Organize email
{"name": "outlook_move_email", "arguments": {
  "emailId": "email-id-here", 
  "destinationFolderId": "folder-id"
}}
```

### Calendar Scheduling
```javascript
// 1. Check calendar
{"name": "outlook_list_events", "arguments": {
  "startDate": "2024-12-01T00:00:00Z", 
  "endDate": "2024-12-07T23:59:59Z"
}}

// 2. Create meeting
{"name": "outlook_create_event", "arguments": {
  "title": "Team Standup", 
  "startDateTime": "2024-12-02T09:00:00Z", 
  "endDateTime": "2024-12-02T09:30:00Z", 
  "attendees": ["team@company.com"], 
  "location": "Conference Room A"
}}
```

## 🚨 Error Handling

### Common Error Responses
```javascript
// Authentication required
{
  "error": {
    "code": -32603,
    "message": "Authentication required. Please call outlook_authenticate first."
  }
}

// Invalid parameters
{
  "error": {
    "code": -32602,
    "message": "Invalid params: issueKey is required"
  }
}

// API error
{
  "error": {
    "code": -32603,
    "message": "JIRA API error: Issue not found"
  }
}
```

### Confirmation Required (JIRA Comments)
```javascript
// First call without confirmation
{
  "content": [{
    "type": "text",
    "text": {
      "confirmationRequired": true,
      "issueKey": "PROJ-123",
      "message": "Confirmation required to post comment",
      "instruction": "Call again with 'confirm: true'"
    }
  }]
}
```