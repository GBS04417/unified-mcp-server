# Unified MCP Server v2.1.0

A comprehensive Model Context Protocol (MCP) server that provides seamless integration with **JIRA**, **Confluence**, **Microsoft Outlook**, and **Team Planning** enhanced with **AI-Powered Chat Assistant**, **Live JIRA Integration**, and **Service-Specific Configuration Management**. This unified server combines multiple specialized services into a single, intelligent, and highly configurable solution with real-time data synchronization.

## 🌟 Features

### 🤖 **AI Chat Assistant** ⭐ **NEW IN v2.0!**
- **🧠 Multi-Provider LLM Support**: Google Gemini 2.5 Flash, OpenAI GPT-4, Anthropic Claude, Azure OpenAI, Ollama, GitHub Copilot, VSCode Copilot
- **🔗 Cross-System Intelligence**: Understands and correlates data from JIRA, Confluence, and Outlook
- **💬 Natural Language Interface**: Ask questions like "What are my urgent JIRA tasks?" or "Show me emails about project X"
- **🎯 Context-Aware Responses**: Maintains conversation history and learns from your work patterns
- **⚡ Real-Time Integration**: Direct access to live data from all connected services
- **🛠️ Interactive Workflows**: Can perform actions across systems based on conversational requests

### 🔧 **Service-Specific Test Mode Configuration** ⭐ **NEW IN v2.0!**
- **🎛️ Granular Control**: Individual test/live mode settings per service (`JIRA_USE_TEST_MODE`, `CONFLUENCE_USE_TEST_MODE`, `OUTLOOK_USE_TEST_MODE`)
- **🔄 Mixed Mode Operation**: Run JIRA with live data while Outlook uses mock data for safe testing
- **📁 Organized Mock Data System**: Realistic test data based on actual production patterns from PORTAEH and CCACB projects
- **✅ Configuration Validation**: Smart validation that adapts to mixed live/mock environments
- **🧪 Advanced Testing Scenarios**: Sophisticated development and testing workflows with real-world data patterns

### 🧠 AI-Powered Priority System ⭐ **ENHANCED IN v2.0!**
- **🎯 Smart Priority Scoring**: Advanced AI algorithms analyze tasks across JIRA, Confluence, and Outlook with 0-100 scoring
- **📊 Intelligent Workload Analysis**: Real-time capacity indicators (OPTIMAL/MODERATE/HIGH/OVERLOADED) with personalized recommendations  
- **🔗 Multi-Source Data Aggregation**: Unified dashboard combining JIRA tasks, Confluence pages, and Outlook emails with 15-minute intelligent caching
- **🚨 Dynamic Urgency Levels**: Color-coded priority system (🔴 URGENT 80-100, 🟠 HIGH 60-79, 🟡 MEDIUM 40-59, 🟢 LOW 20-39)
- **🤖 AI Keyword Detection**: Automatically detects urgency indicators like "ASAP", "critical", "deadline", "urgent"
- **📈 Comprehensive Analytics**: Replaces traditional static reports with dynamic, AI-powered priority insights
- **⚡ Quick Commands**: `npm run smart-daily`, `npm run full-priority`, `npm run dashboard`, `npm run workload-analysis`
- **🎨 Dashboard Integration**: Chart-ready data with urgency badges, capacity indicators, and visual analytics

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

### 👥 Team Planner Integration (10 Tools) ⭐ **FULLY ENHANCED!**
- **📊 Excel-Based Planning**: Load and manage team planner data from Excel files (NEW_CHENNAI_PLAN_2025.xlsx)
- **📅 Leave Management**: Update member availability, mark holidays and weekends automatically  
- **🔄 Task Reassignment**: Smart task reassignment with conflict detection and JIRA synchronization
- **📈 Capacity Analysis**: Real-time team capacity calculation with utilization metrics
- **📋 Calendar Updates**: Automated calendar view updates with holiday/weekend visualization
- **⚠️ Conflict Detection**: Identify scheduling conflicts during leave periods
- **🔗 **LIVE JIRA INTEGRATION**: **Real-time JIRA status fetching with cross-project support (CCACB, PORTAEH, etc.)**
- **📊 Planning Reports**: Generate comprehensive planning analytics and team reports with live JIRA data
- **🎯 **Enhanced Task Analysis**: **Detailed task breakdown with live JIRA status, priorities, assignees, and URLs**
- **✅ **Excel-to-JIRA Bridge**: **Seamlessly connects Excel planning with live JIRA project management**

### 🤖 **Chat Assistant Integration (3 Tools)** ⭐ **NEW IN v2.0!**
- **💬 chat.chat**: Interactive AI assistant with access to all system data (JIRA, Confluence, Outlook, Team Planner)
- **📝 chat.chat_history**: Retrieve conversation history and context from previous interactions
- **🗑️ chat.clear_chat_history**: Reset conversation context for fresh sessions

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
```bash
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

# AI Chat Assistant Configuration
GOOGLE_API_KEY=your-google-gemini-api-key
# Optional: Configure other LLM providers
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
AZURE_OPENAI_API_KEY=your-azure-openai-key

# Service-Specific Test Mode Configuration (NEW!)
JIRA_USE_TEST_MODE=false          # Use live JIRA data
CONFLUENCE_USE_TEST_MODE=false    # Use live Confluence data  
OUTLOOK_USE_TEST_MODE=true        # Use mock data for Outlook

# Legacy Global Test Mode (for backward compatibility)
USE_TEST_MODE=false
```

4. **Start the server:**
```bash
node index.js
```

The server will output connection details and confirm all services are running:
```
⚠️ Outlook using mock data - skipping configuration validation
🚀 STARTING UNIFIED MCP SERVER v2.1.0  
📊 JIRA Integration: ENABLED (LIVE DATA)
📄 Confluence Integration: ENABLED (LIVE DATA)
📧 Outlook Integration: ENABLED (MOCK DATA)  
👥 Team Planner Integration: ENABLED (WITH LIVE JIRA SYNC)
🤖 Chat Assistant: ENABLED (Google Gemini 2.5 Flash)
✅ Total tools available: 60+ (JIRA: 15, Confluence: 5, Outlook: 22, Priority: 5, Team Planner: 10, Chat: 3, Auth: 3)
🎯 unified-mcp-server connected and ready
📡 Listening on STDIO transport
```

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

### 📧 Outlook Tools (22 Tools)

#### Authentication & Status
- outlook_about - Server information
- outlook_authenticate - OAuth authentication
- outlook_token_status - Check auth status
- outlook_refresh_tokens - Refresh access tokens

#### Email Management
- list-emails - List emails in a folder with filtering
- search-emails - Search emails across mailbox by subject, from, or content
- read-email - Read full email content
- send-email - Send new emails with CC/BCC support
- reply-email - Reply to emails (interactive two-mode: search then reply)
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

### � Chat Assistant Tools (3 Tools) ⭐ **NEW!**

- **chat.chat** - Interactive AI assistant with multi-provider LLM support and cross-system intelligence
- **chat.chat_history** - Get conversation history and context from previous sessions  
- **chat.clear_chat_history** - Clear conversation context for fresh interactions

### �🧠 Priority System Tools (5 Tools)

#### Core Priority Analysis
- **priority.generate_priority_report** - Generate comprehensive AI-powered priority analysis across all sources
- **priority.get_urgent_items** - Get filtered view of urgent and high-priority items only
- **priority.dashboard_data** - Retrieve dashboard-ready data with charts and visualizations
- **priority.workload_analysis** - Analyze current workload capacity and get recommendations

#### Quick Access NPM Scripts
```bash
# Daily priority check (urgent/high items only)
npm run smart-daily

# Complete priority analysis with all items
npm run full-priority  

# Dashboard data for UI integration
npm run dashboard

# Workload capacity analysis
npm run workload-analysis

# Backward compatibility aliases
npm run urgent-items    # → smart-daily
npm run full-report     # → full-priority  
npm run daily-check     # → smart-daily
```

#### Architecture Components
- **DataFetcher**: Multi-source parallel data collection with intelligent caching
- **ScoringEngine**: AI algorithms for priority scoring with configurable weights  
- **DataAggregator**: Combines data sources and generates comprehensive analytics
- **15-minute Caching**: Performance optimization with graceful degradation

## 🎯 Latest Updates (v2.1.0) ⭐ **ENHANCED INTEGRATION!**

### 🎯 **Team Planner JIRA Integration**
- **Live Data Enrichment**: Real-time JIRA status fetching for Excel-based planning with cross-project support (CCACB, PORTAEH)
- **Enhanced Task Analysis**: Team planner now provides comprehensive task analysis with live assignee verification and priority synchronization
- **Robust Excel Processing**: Improved Excel parsing with better CCACB issue detection and enhanced error handling
- **Cross-System Validation**: Validates team planner data against live JIRA systems for accurate project tracking
- **Production-Ready Integration**: Successfully tested with live Sella JIRA environment for real-world validation

### 👥 **Updated Team Data & Project Cleanup**
- **Current Team Members**: Updated all mock data with current team (Mani S replaces Sankar ks, Ramesh replaces Kamesh)
- **Folder Structure**: Renamed team-planning to team-planner with comprehensive cross-reference updates throughout codebase
- **Service Registration**: Fixed team-planner service discovery in CLI tools and main server for proper integration
- **Project Cleanup**: Removed redundant backup files and consolidated documentation for cleaner repository structure
- **Documentation Consolidation**: All enhancements properly documented with real-world usage examples

### 🔧 **Enhanced Service Architecture**
- **Improved CLI Integration**: Enhanced run-tool.js with proper team-planner service initialization and JIRA connectivity
- **Better Error Handling**: Robust Excel file processing with comprehensive error recovery and validation
- **Cross-Project Support**: Team planner now handles multiple JIRA projects seamlessly with unified status reporting
- **Performance Optimization**: Streamlined Excel processing and JIRA API integration for faster response times

## 🎯 Previous Updates (v2.0.0) - AI Chat Assistant & Service-Specific Configuration

### 🤖 **AI Chat Assistant Integration**
- **Multi-Provider LLM Support**: Google Gemini 2.5 Flash (primary), OpenAI GPT-4, Anthropic Claude, Azure OpenAI, Ollama, GitHub Copilot, VSCode Copilot
- **Cross-System Intelligence**: Natural language interface for JIRA, Confluence, Outlook, and Team Planner operations
- **Conversation Memory**: Maintains context across sessions with chat history and learning capabilities
- **Real-Time Integration**: Direct access to live data with immediate response capabilities
- **Provider Flexibility**: Easy switching between LLM providers with unified interface

### 🔧 **Service-Specific Test Mode Configuration**
- **Granular Control**: Individual test mode settings per service (`JIRA_USE_TEST_MODE`, `CONFLUENCE_USE_TEST_MODE`, `OUTLOOK_USE_TEST_MODE`)
- **Mixed Mode Operation**: Run some services with live data while others use mock data for safe development
- **Organized Mock Data System**: Realistic test data based on actual production patterns from PORTAEH and CCACB projects
- **Enhanced Validation**: Smart configuration validation that adapts to mixed live/mock environments
- **Advanced Testing**: Sophisticated development workflows with real-world data consistency

### 📁 **Organized Mock Data System** ⭐ **UPDATED!**
- **Structured Mock Data**: Dedicated `mock-data/` folder with realistic data based on live JIRA extractions
- **Cross-System Consistency**: Shared users and project references across JIRA, Confluence, and Outlook mock data
- **Real-World Patterns**: Mock emails reference actual JIRA issues, realistic project codes and user interactions
- **Easy Maintenance**: Centralized mock data management with comprehensive documentation
- **🔄 **Updated User Data**: **Refreshed mock data with current team members (Mani S, Ramesh, etc.)**
- **📊 **Excel Integration**: **Mock data now aligns with team planner Excel file structure and naming**

### 🛠️ **Enhanced Development Tools**
- **Configuration Debugging**: New utilities for testing and validating service-specific configurations
- **Mixed Mode Testing**: Comprehensive test scripts for validating live/mock data combinations
- **Development Efficiency**: Faster development cycles with reliable, realistic test data

## 🎯 Previous Updates (v1.2.0)

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

### � **AI Chat Assistant (Recommended Starting Point)** ⭐ **NEW!**

**Start a conversation:**
```javascript
{
  "name": "chat.chat",
  "arguments": {
    "message": "What are my urgent JIRA tasks and any related emails?"
  }
}
```

**Ask for insights:**
```javascript
{
  "name": "chat.chat", 
  "arguments": {
    "message": "Show me a summary of my workload across all systems"
  }
}
```

**Get system help:**
```javascript
{
  "name": "chat.chat",
  "arguments": {
    "message": "What can you help me with across JIRA, Confluence, and Outlook?"
  }
}
```

**Command Line Usage:**
```bash
node run-tool.js chat.chat --message "What are my current tasks?"
node run-tool.js chat.chat --message "Show me emails about project PORTAEH"
node run-tool.js chat.chat --message "Help me prioritize my work today"
```

### 🎯 **Team Planner with Live JIRA Integration** ⭐ **NEW!**

**Analyze team member tasks with live JIRA status:**
```javascript
{
  "name": "team-planner.analyze_member_tasks",
  "arguments": {
    "memberName": "Dinesh",
    "month": "2025-11"
  }
}
```

**Get comprehensive team workload analysis:**
```javascript
{
  "name": "team-planner.get_team_workload_analysis",
  "arguments": {
    "month": "2025-11"
  }
}
```

**Find tasks by status with live JIRA validation:**
```javascript
{
  "name": "team-planner.find_tasks_by_status",
  "arguments": {
    "status": "In Progress"
  }
}
```

**Command Line Usage:**
```bash
node run-tool.js team-planner.analyze_member_tasks --memberName "Dinesh" --month "2025-11"
node run-tool.js team-planner.get_team_workload_analysis --month "2025-11"
node run-tool.js team-planner.find_tasks_by_status --status "In Progress"
```

**Live JIRA Integration Features:**
- ✅ **Real-time Status**: Fetches current task status directly from JIRA (e.g., "Task In Progress")
- ✅ **Assignee Validation**: Verifies current assignee matches team planner data 
- ✅ **Priority Sync**: Shows live priority levels (High, Medium, Low) from JIRA
- ✅ **Cross-Project Support**: Works with CCACB, PORTAEH, and all configured JIRA projects
- ✅ **Working URLs**: Provides direct links to JIRA issues for immediate access

### � Priority System (Comprehensive Reporting)

**Quick Daily Check:**
```bash
npm run smart-daily
```

**Complete Priority Analysis:**
```bash
npm run full-priority
```

**Generate Custom Priority Report:**
```javascript
{
  "name": "priority.generate_priority_report",
  "arguments": {
    "focusUser": "Your Name"
  }
}
```

**Get Dashboard Data:**
```bash
npm run dashboard
```

**Workload Analysis:**
```bash
npm run workload-analysis
```

### 🔧 **Service-Specific Configuration Examples** ⭐ **NEW!**

**Mixed Mode Development:**
```bash
# .env configuration for mixed live/mock data
JIRA_USE_TEST_MODE=false          # Use live JIRA data
CONFLUENCE_USE_TEST_MODE=false    # Use live Confluence data  
OUTLOOK_USE_TEST_MODE=true        # Use mock data for safe email testing
```

**Test Different Configurations:**
```bash
# Full live data mode
JIRA_USE_TEST_MODE=false
CONFLUENCE_USE_TEST_MODE=false
OUTLOOK_USE_TEST_MODE=false

# Full mock data mode for development
JIRA_USE_TEST_MODE=true
CONFLUENCE_USE_TEST_MODE=true
OUTLOOK_USE_TEST_MODE=true

# Safe demo mode (live read-only, mock write operations)
JIRA_USE_TEST_MODE=false
CONFLUENCE_USE_TEST_MODE=false
OUTLOOK_USE_TEST_MODE=true
```

**Verify Configuration:**
```bash
node debug-config.js              # Check current configuration
node test-service-modes.js        # Test service-specific modes
node test-mixed-mode.js           # Test mixed live/mock operation
```

> **💡 Pro Tip**: Start with the **AI Chat Assistant** for natural language interaction, then use the **Priority System** for comprehensive analytics. The **Service-Specific Configuration** allows safe development and testing with realistic data patterns.

### 🚀 **Quick Start with Priority System**

1. **Daily Priority Check** (recommended for morning routine):
   ```bash
   npm run smart-daily
   ```

2. **Complete Analysis** (for planning sessions):
   ```bash
   npm run full-priority
   ```

3. **Dashboard Integration** (for UI/reporting tools):
   ```bash
   npm run dashboard
   ```

4. **Workload Assessment** (for capacity planning):
   ```bash
   npm run workload-analysis
   ```

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
- DISABLE_OUTLOOK=true - Disable Outlook module
- DISABLE_TEAM_PLANNING=true - Disable Team Planner module

**Test Mode Configuration:**
- USE_TEST_MODE=true - Legacy global test mode (for backward compatibility)
- JIRA_USE_TEST_MODE=true - Use mock data for JIRA (overrides global setting)
- CONFLUENCE_USE_TEST_MODE=true - Use mock data for Confluence (overrides global setting)  
- OUTLOOK_USE_TEST_MODE=true - Use mock data for Outlook (overrides global setting)

**AI Chat Assistant:**
- GOOGLE_API_KEY - Required for Google Gemini (recommended primary provider)
- OPENAI_API_KEY - Optional for OpenAI GPT models
- ANTHROPIC_API_KEY - Optional for Claude models
- AZURE_OPENAI_ENDPOINT - Optional for Azure OpenAI
- AZURE_OPENAI_API_KEY - Optional for Azure OpenAI

### Test Specific Service Configurations
```bash
# Test with mixed live/mock data
JIRA_USE_TEST_MODE=false OUTLOOK_USE_TEST_MODE=true node index.js

# Test with only JIRA enabled
DISABLE_CONFLUENCE=true DISABLE_OUTLOOK=true node index.js

# Test full mock data mode
JIRA_USE_TEST_MODE=true CONFLUENCE_USE_TEST_MODE=true OUTLOOK_USE_TEST_MODE=true node index.js
```

## 🔧 Priority System Troubleshooting

### Common Issues & Solutions

**🚨 "Priority system initialization failed"**
```bash
# Check if all services are running
node run-tool.js outlook.outlook_about
node run-tool.js jira.jira_get_editable_fields  
node run-tool.js confluence.confluence_search --query "test"
```

**📊 "No urgent items found" but tasks exist**
- Priority scoring may be working correctly - items below HIGH threshold (60/100)
- Use `npm run full-priority` to see all items with scores
- Check if assignee name matches exactly in JIRA

**⚡ Performance issues with large datasets**
- Priority system uses 15-minute caching automatically
- For immediate refresh: restart the server
- Outlook parsing issues are handled gracefully (won't block JIRA/Confluence)

**🎯 Customizing Priority Weights**
```javascript
// Edit priority-system/scoring-engine.js
this.weights = {
  jira: { priority: 0.3, overdue: 0.25, dependencies: 0.15 },
  confluence: { recentActivity: 0.4, mentions: 0.3 },
  outlook: { senderImportance: 0.25, flagged: 0.2 }
};
```

## 📁 Project Structure

```
unified-mcp-server/
├── index.js                 # Main server entry point  
├── config.js                # Unified configuration with service-specific test modes
├── run-tool.js              # Command-line tool runner
├── package.json             # Dependencies and scripts
├── .env                     # Environment configuration
├── .env.example             # Environment template
│
├── utils/
│   └── index.js             # HTTP client utilities
│
├── chat-assistant/          # 🤖 NEW: AI Chat Assistant
│   ├── index.js             # Chat assistant tools
│   ├── llm-provider.js      # Multi-provider LLM interface  
│   └── vscode-copilot-provider.js # VSCode Copilot integration
│
├── mock-data/               # 🔧 NEW: Organized Mock Data System
│   ├── index.js             # Central mock data utilities
│   ├── jira-mock-data.js    # Realistic JIRA test data
│   ├── confluence-mock-data.js # Confluence test pages
│   ├── outlook-mock-data.js # Email and calendar test data
│   └── README.md            # Mock data documentation
│
├── jira/
│   ├── index.js             # JIRA tools (15 tools)
│   └── service.js           # JIRA API with service-specific test mode
│
├── confluence/
│   ├── index.js             # Confluence tools (5 tools)
│   └── service.js           # Confluence API with service-specific test mode
│
├── outlook/
│   ├── index.js             # Main Outlook aggregator (22 tools)
│   ├── auth/
│   │   ├── index.js         # Auth tools
│   │   └── token-manager.js # OAuth token management
│   ├── email/
│   │   ├── index.js         # Email tools definition
│   │   ├── list.js          # List emails implementation
│   │   ├── read.js          # Read email implementation
│   │   ├── send.js          # Send email implementation
│   │   ├── search.js        # Search emails implementation
│   │   ├── reply.js         # Reply email implementation  
│   │   ├── mark-as-read.js  # Mark as read implementation
│   │   ├── move.js          # Move email implementation
│   │   └── folder-utils.js  # Folder resolution utilities
│   ├── calendar/
│   │   ├── index.js         # Calendar tools
│   │   └── [operations].js  # Calendar operations
│   ├── folder/
│   │   ├── index.js         # Folder tools definition
│   │   ├── list.js          # List folders implementation
│   │   ├── create.js        # Create folder implementation
│   │   └── move.js          # Move folder implementation
│   ├── rules/
│   │   └── index.js         # Mail rules tools
│   └── services/
│       └── graph-service.js # Microsoft Graph API with service-specific test mode
│
├── priority-system/
│   ├── index.js             # Priority system tools (5 tools)
│   ├── data-fetcher.js      # Multi-source data collection
│   ├── scoring-engine.js    # AI-powered priority scoring
│   └── data-aggregator.js   # Unified analytics and reporting
│
├── team-planner/
│   ├── index.js             # Team planner tools (10 tools)
│   └── excel-manager.js     # Excel file management
│
└── 🛠️ Development & Testing Tools:
    ├── debug-config.js      # 🔧 NEW: Configuration debugging utility
    ├── test-service-modes.js # 🔧 NEW: Service-specific mode testing
    └── test-mixed-mode.js   # 🔧 NEW: Mixed live/mock data testing
```

## 🔐 Security Considerations

- **Environment Variables**: Never commit .env files to version control
- **Token Storage**: Outlook tokens are stored locally in .outlook-tokens.json
- **Network Security**: Configure firewalls and proxies as needed
- **Credential Rotation**: Regularly rotate API keys and passwords
- **Permissions**: Use least-privilege principles for service accounts
- **OAuth Scopes**: Minimal required scopes requested during authentication

## � Documentation Consolidation

All documentation has been consolidated into this comprehensive README.md file. The following redundant files have been removed in v2.0:

- ❌ `SETUP.md` - Setup instructions integrated into Quick Start section
- ❌ `CHAT-ASSISTANT-SETUP.md` - Chat assistant setup integrated into configuration section  
- ❌ `PRIORITY-SYSTEM-GUIDE.md` - Priority system documentation integrated into features section
- ❌ `CLEANUP-SUMMARY.md` - Cleanup information integrated into version history
- ❌ `SERVICE-SPECIFIC-TEST-MODE-COMPLETE.md` - Configuration details integrated into main documentation
- ❌ `test-service-modes.js`, `test-mixed-mode.js`, `debug-config.js` - Development test files no longer needed
- ❌ `claude-config-sample.json` - Outdated configuration sample

**All functionality and information from these files is now available in this single, comprehensive README.md.**

## �🤝 Contributing

1. **Fork** the repository
2. **Create feature branch**: git checkout -b feature/new-tool
3. **Add implementation** in appropriate service directory
4. **Update documentation** in this README.md file
5. **Test thoroughly** in both test and production modes with service-specific configurations
6. **Submit pull request** with comprehensive testing results

## 📄 License

Centrico India Team

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

### v2.1.0 ⭐ **LATEST** - Team Planner JIRA Integration & Project Cleanup
- **🎯 Enhanced Team Planner**: Full JIRA integration with cross-project support (CCACB, PORTAEH) and real-time status synchronization
- **📊 Live Data Enrichment**: Team planner now fetches live JIRA status, assignees, and priorities directly from production systems
- **🔍 Improved Excel Processing**: Enhanced Excel parsing with better CCACB issue detection and robust data handling
- **👥 Updated Team Data**: Refreshed mock data with current team members (Mani S replaces Sankar ks, Ramesh replaces Kamesh)
- **🏗️ Service Architecture**: Fixed team-planner service registration and CLI tool integration for proper discovery
- **🧹 Project Cleanup**: Removed redundant backup files and consolidated documentation for cleaner repository
- **📁 Folder Structure**: Renamed team-planning to team-planner with comprehensive cross-reference updates
- **🔧 Enhanced CLI Tools**: Improved run-tool.js with proper service initialization and JIRA integration
- **📝 Complete Documentation**: Updated README with all enhancements and real-world usage examples

### v2.0.0 - AI Chat Assistant & Service-Specific Configuration
- **🤖 AI Chat Assistant**: Multi-provider LLM support with Google Gemini 2.5 Flash, cross-system intelligence, and conversation memory
- **🔧 Service-Specific Test Modes**: Granular control with `JIRA_USE_TEST_MODE`, `CONFLUENCE_USE_TEST_MODE`, `OUTLOOK_USE_TEST_MODE` for mixed live/mock operation
- **📁 Organized Mock Data System**: Realistic test data based on production patterns with cross-system consistency and JIRA issue references  
- **🛠️ Enhanced Development Tools**: Configuration debugging, mixed mode testing, and comprehensive validation utilities
- **📊 Expanded Tool Count**: Now 63+ tools with chat assistant integration (3 new tools: chat.chat, chat.chat_history, chat.clear_chat_history)
- **🎯 Improved User Experience**: Natural language interface as primary entry point with AI-guided feature discovery
- **📝 Complete Documentation**: Comprehensive README update with new features, configuration guides, and best practices

### v1.2.0 - AI-Powered Priority System
- **🧠 Advanced Priority System**: Complete AI-powered priority analysis with 0-100 scoring algorithms
- **🎯 Multi-Source Intelligence**: Unified view of JIRA tasks, Confluence pages, and Outlook emails with smart aggregation  
- **📊 Workload Analytics**: Real-time capacity analysis (OPTIMAL/MODERATE/HIGH/OVERLOADED) with personalized recommendations
- **🚨 Dynamic Urgency Detection**: 4-level urgency system with AI keyword analysis and color-coded dashboard
- **⚡ Performance Optimization**: 15-minute intelligent caching with parallel data processing and error recovery
- **🎨 Dashboard Integration**: Chart-ready data with urgency badges, visual indicators, and analytics
- **🧹 Codebase Cleanup**: Removed legacy comprehensive-report.js (~700 lines) in favor of advanced priority system
- **📝 Enhanced Documentation**: Complete README update with latest features, usage examples, and migration guides
- **🔄 Backward Compatibility**: Old report commands automatically redirect to priority system tools

### v1.1.0 - Enhanced Email & Folder Management  
- **Email Reply Tool**: Interactive two-mode email reply functionality
- **Enhanced Email Move**: Search-based email filtering and batch operations
- **Folder Management**: Clear source/target parameter distinction
- **Improved Error Handling**: Better error messages and folder discovery
- **Outlook Limitations**: Documented folder move constraints clearly
- **Performance**: Optimized folder lookup with $top=500
- **Removed Deprecated Parameters**: folderName and destinationFolder replaced with sourceFolder/targetFolder

### v1.0.0 - Foundation Release
- **Initial Release**: Unified JIRA, Confluence, and Outlook integration
- **25+ Tools**: Comprehensive productivity suite
- **Test Mode**: Complete mock data support
- **Modular Architecture**: Independently deployable services
- **Enterprise Ready**: Security and compliance features

---

**Built for enterprise productivity and intelligent automation**

*The most advanced MCP server with AI Chat Assistant, live JIRA integration, and intelligent cross-system automation!* 

🤖 **Natural language interface** with multi-provider LLM support  
🎯 **Live JIRA integration** with team planner real-time status synchronization  
🔧 **Granular configuration control** with mixed live/mock data modes  
📊 **Enhanced team planning** with Excel integration and cross-project support  
� **Updated production data** with current team members and realistic workflows  
⚡ **Realistic testing environment** with organized production-based mock data  
🛠️ **Advanced development tools** for sophisticated testing scenarios  
🧹 **Clean architecture** with consolidated documentation and optimized structure

**Experience the future of intelligent productivity automation with live data integration!**
