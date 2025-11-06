# SmartStart AI v2.2.0

A comprehensive AI-powered productivity platform that provides seamless integration with **JIRA**, **Confluence**, **Microsoft Outlook**, and **Team Planning** enhanced with **AI-Powered Chat Assistant**, **Enhanced Rule-Based Assistant**, **Live JIRA Integration**, and **Advanced Configuration Management**. SmartStart AI combines multiple specialized services into a single, intelligent, and highly configurable solution with real-time data synchronization and advanced natural language processing.

## 🎯 **Key Highlights**

- **🤖 Dual AI Architecture**: LLM-powered + Enhanced rule-based assistants with intelligent routing
- **👥 Employee Intelligence**: 83 employees with fuzzy matching, team structure, and calendar integration  
- **🔍 Advanced NLP**: Sophisticated intent recognition with 82.9% test success rate
- **📊 Live Data Integration**: Real-time JIRA, Outlook, and team planning synchronization
- **🎛️ Flexible Configuration**: Granular service control with mixed test/live mode operation
- **🧪 Production Ready**: Comprehensive testing infrastructure with 70+ test files
- **⚡ Performance Optimized**: 15-minute caching, parallel processing, efficient pattern matching
- **🔄 Adaptive Responses**: Context-aware routing between different assistant types based on query complexity

## 🌟 Features

### 🤖 **Dual AI Chat Assistant System** ⭐ **ENHANCED IN v2.2!**

#### 🧠 **LLM-Powered Assistant** (Primary)
- **🔮 Multi-Provider LLM Support**: OpenAI GPT-4, Anthropic Claude, Google Gemini, Azure OpenAI, Ollama, GitHub Copilot, VSCode Copilot
- **🔗 Cross-System Intelligence**: Understands and correlates data from JIRA, Confluence, Outlook, and Team Planning
- **💬 Advanced Natural Language Processing**: Intent analysis with sophisticated tool mapping
- **🎯 Context-Aware Responses**: Maintains conversation history with intelligent context management
- **⚡ Real-Time Integration**: Direct access to live data from all connected services
- **🛠️ Interactive Workflows**: Can perform complex actions across systems based on conversational requests

#### 🎯 **Enhanced Rule-Based Assistant** (Fallback/Specialized) ⭐ **NEW IN v2.2!**
- **🔍 Advanced Fuzzy Matching**: Levenshtein distance, partial name matching, phonetic similarity, initials matching
- **👥 Employee Intelligence**: Smart employee lookup with confidence scoring (85%+ direct answers, 60-85% suggestions)
- **📋 Task & Project Management**: Employee task assignments, project queries with dual ID/name matching
- **🏢 Team Structure Intelligence**: Direct reports, manager lookup, organizational hierarchy with proper pattern priority
- **📅 Calendar Integration**: Employee calendar viewing with upcoming events and meeting details
- **🎨 Rich Response Formatting**: Structured responses with emojis, badges, and clear information hierarchy
- **🔄 Intent Pattern System**: Sophisticated pattern matching with negative lookaheads and priority ordering
- **📊 Confidence-Based Responses**: Intelligent disambiguation with confidence thresholds

### 🔧 **Advanced Configuration Management** ⭐ **ENHANCED IN v2.2!**
- **🎛️ Granular Service Control**: Individual test/live mode settings per service (`JIRA_USE_TEST_MODE`, `CONFLUENCE_USE_TEST_MODE`, `OUTLOOK_USE_TEST_MODE`)
- **🔄 Mixed Mode Operation**: Run JIRA with live data while Outlook uses mock data for safe testing
- **📁 Comprehensive Mock Data System**: Realistic test data with 83 employees, 14 JIRA issues, 9 projects based on PORTAEH and CCACB patterns
- **✅ Smart Configuration Validation**: Adaptive validation that supports mixed live/mock environments
- **🧪 Advanced Testing Infrastructure**: Complete test suite with 82.9% success rate (34/41 tests passed)
- **⚙️ Environment-Based Toggles**: Easy service disable/enable via environment variables
- **🔐 Flexible Authentication**: Support for both plain text and base64 encoded credentials

### 🧠 Priority System Tools (8 Tools)
- **🎯 Smart Priority Scoring**: Advanced AI algorithms analyze tasks across JIRA, Confluence, and Outlook with 0-100 scoring
- **📊 Intelligent Workload Analysis**: Real-time capacity indicators (OPTIMAL/MODERATE/HIGH/OVERLOADED) with personalized recommendations  
- **🔗 Multi-Source Data Aggregation**: Unified dashboard combining JIRA tasks, Confluence pages, and Outlook emails with 15-minute intelligent caching
- **🚨 Dynamic Urgency Levels**: Color-coded priority system (🔴 URGENT 80-100, 🟠 HIGH 60-79, 🟡 MEDIUM 40-59, 🟢 LOW 20-39)
- **🤖 AI Keyword Detection**: Automatically detects urgency indicators like "ASAP", "critical", "deadline", "urgent"
- **📈 Comprehensive Analytics**: Replaces traditional static reports with dynamic, AI-powered priority insights
- **⚡ Quick Commands**: `npm run smart-daily`, `npm run full-priority`, `npm run dashboard`, `npm run workload-analysis`
- **🎨 Dashboard Integration**: Chart-ready data with urgency badges, capacity indicators, and visual analytics
- **👥 Team Workload Analysis**: ⭐ **NEW!** Comprehensive team analysis with graphical charts (bar, pie, gauge), skill distribution, and actionable recommendations
- **📊 BU Portfolio Analysis**: ⭐ **NEW!** Business Unit portfolio performance with project health, timeline tracking, resource metrics, and strategic insights

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

### 🤖 **Chat Assistant Integration (6 Tools)** ⭐ **ENHANCED IN v2.2!**
- **💬 chat.chat**: Advanced LLM-powered assistant with cross-system intelligence and tool integration
- **📝 chat.chat_history**: Retrieve conversation history and context from previous interactions
- **🗑️ chat.clear_chat_history**: Reset conversation context for fresh sessions
- **🎯 chat.rule_chat**: Enhanced rule-based assistant with fuzzy matching and specialized employee/task intelligence
- **📊 chat.rule_debug**: Debug and analyze rule-based intent detection and pattern matching
- **🔄 chat.adaptive**: Adaptive assistant that intelligently switches between LLM and rule-based responses

### 📈 **Testing & Quality Assurance** ⭐ **NEW IN v2.2!**
- **🧪 Comprehensive Test Suite**: 70+ test files covering all functionality aspects
- **📊 Performance Metrics**: 82.9% success rate with detailed categorized testing
- **🎯 Edge Case Testing**: Comprehensive edge case handling and validation
- **⚡ Stress Testing**: Performance testing for high-load scenarios
- **🔍 Intent Detection Testing**: Specialized tests for natural language processing accuracy
- **📋 Organizational Data Testing**: Complete validation of employee, team, and project data integration

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
🚀 STARTING SMARTSTART AI v2.2.0  
📊 JIRA Integration: ENABLED (LIVE DATA)
📄 Confluence Integration: ENABLED (LIVE DATA)
📧 Outlook Integration: ENABLED (MOCK DATA)  
👥 Team Planner Integration: ENABLED (WITH LIVE JIRA SYNC)
🤖 Chat Assistant: ENABLED (Google Gemini 2.5 Flash)
✅ Total tools available: 80+ (JIRA: 20+, Confluence: 6, Outlook: 25+, Priority: 8, Team Planner: 10+, Chat: 6, Auth: 3, Testing: 70+)
🎯 SmartStart AI connected and ready
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

### 📧 Outlook Tools (25+ Tools)

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

### 🤖 Chat Assistant Tools (6 Tools) ⭐ **ENHANCED IN v2.2!**

#### LLM-Powered Assistant
- **chat.chat** - Advanced AI assistant with multi-provider LLM support, intent analysis, and cross-system tool integration
- **chat.chat_history** - Retrieve conversation history with intelligent context management
- **chat.clear_chat_history** - Clear conversation context for fresh interactions

#### Enhanced Rule-Based Assistant
- **chat.rule_chat** - Specialized assistant with fuzzy matching, employee intelligence, and structured responses
- **chat.rule_debug** - Debug intent detection, pattern matching, and confidence scoring
- **chat.adaptive** - Intelligent routing between LLM and rule-based responses based on query type

### �🧠 Priority System Tools (7 Tools)

#### Core Priority Analysis
- **priority.generate_priority_report** - Generate comprehensive AI-powered priority analysis across all sources
- **priority.get_urgent_items** - Get filtered view of urgent and high-priority items only
- **priority.dashboard_data** - Retrieve dashboard-ready data with charts and visualizations
- **priority.workload_analysis** - Analyze current workload capacity and get recommendations
- **priority.get_team_workload_analysis** - ⭐ **NEW!** Generate comprehensive team workload analysis with graphical representation data
- **priority.get_bu_portfolio_analysis** - ⭐ **NEW!** Business Unit portfolio performance analysis with project metrics and strategic insights
- **priority.get_project_performance_analysis** - ⭐ **NEW!** Individual project performance analysis for Project Managers with detailed KPIs, team velocity, and risk assessment (single project focus vs BU cross-project view)

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

#### SmartStart AI Architecture Components
- **DataFetcher**: Multi-source parallel data collection with intelligent caching
- **ScoringEngine**: AI algorithms for priority scoring with configurable weights  
- **DataAggregator**: Combines data sources and generates comprehensive analytics
- **15-minute Caching**: Performance optimization with graceful degradation

## 🎯 Latest Updates (v2.2.0) ⭐ **ENHANCED AI & RULE-BASED INTELLIGENCE!**

### 🧠 **Dual Assistant Architecture**
- **Enhanced Rule-Based Assistant**: Advanced natural language processing with fuzzy matching, employee intelligence, and sophisticated intent pattern recognition
- **Intelligent LLM Integration**: Smart routing between rule-based and LLM responses based on query complexity and type
- **Adaptive Response System**: Automatic fallback mechanisms with confidence-based query handling

### 🔍 **Advanced Natural Language Processing**
- **Fuzzy Matching Engine**: Levenshtein distance, partial name matching, phonetic similarity, and initials matching for robust employee lookup
- **Intent Pattern System**: Sophisticated regex patterns with negative lookaheads, priority ordering, and context-aware matching
- **Confidence Scoring**: 85%+ confidence for direct answers, 60-85% for suggestions, with intelligent disambiguation
- **Entity Extraction**: Advanced name, project, department, and role entity recognition with context preservation

### 👥 **Employee & Organizational Intelligence** ⭐ **NEW FEATURE!**
- **Employee Database**: Complete employee lookup with 83 employees, roles, locations, and contact information
- **Team Structure Intelligence**: Direct reports, manager relationships, organizational hierarchy navigation
- **Task & Project Management**: Employee task assignments with dual ID/name matching, project queries with confidence scoring
- **Calendar Integration**: Employee calendar viewing with upcoming meetings, events, and availability insights

### 🎯 **Enhanced Query Handling**
- **Multi-Intent Recognition**: "Who queries", task lookups, team structure, project information, calendar requests
- **Pattern Priority System**: Ordered pattern matching to prevent conflicts between employee lookup and task queries
- **Rich Response Formatting**: Structured responses with emojis, badges, clear information hierarchy, and actionable insights
- **Edge Case Management**: Comprehensive handling of empty queries, ambiguous names, and missing data

### 📊 **Management Analytics Suite** ⭐ **NEW!**
- **Project Performance Analysis**: Individual project deep-dive analysis for Project Managers with KPIs, team velocity, and risk assessment
- **Clear Role-Based Analytics**: Team-level (workload), BU-level (portfolio), and Project-level (individual project) analysis tools
- **Comprehensive Visualizations**: Charts for task completion, burndown, velocity trends, team productivity, and health gauges  
- **Strategic Insights**: Risk analysis, mitigation strategies, resource optimization, and actionable recommendations
- **Multiple Analysis Depths**: Summary, detailed, and comprehensive modes with budget analysis and stakeholder engagement metrics

### 🧪 **Comprehensive Testing Infrastructure**
- **82.9% Success Rate**: 34/41 tests passed across all categories with detailed performance metrics
- **Categorized Testing**: Basic functionality, employee lookup, task management, team structure, edge cases, natural language, performance
- **70+ Test Files**: Comprehensive test coverage including stress testing, edge cases, and organizational data validation
- **Quality Assurance**: Structured test organization with detailed reporting and performance benchmarking

## 🎯 Previous Updates (v2.1.0) - Enhanced Integration & Team Planning

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

**Enhanced Rule-Based Assistant Examples:**
```javascript
// Employee lookup with fuzzy matching
{
  "name": "chat.rule_chat",
  "arguments": {
    "message": "who is Abrar ul haq N"
  }
}

// Team structure queries
{
  "name": "chat.rule_chat", 
  "arguments": {
    "message": "who are all reporting to Abrar ul haq N"
  }
}

// Employee calendar viewing
{
  "name": "chat.rule_chat",
  "arguments": {
    "message": "give me the Abrar ul Haq N calendar"
  }
}

// Project and task queries
{
  "name": "chat.rule_chat",
  "arguments": {
    "message": "what are the project names Abrar ul Haq N working on"
  }
}
```

**Command Line Usage:**
```bash
# LLM-powered assistant (primary)
node run-tool.js chat.chat --message "What are my current tasks?"
node run-tool.js chat.chat --message "Show me emails about project PORTAEH"
node run-tool.js chat.chat --message "Help me prioritize my work today"

# Enhanced rule-based assistant (specialized)  
node run-tool.js chat.rule_chat --message "who is Abrar ul haq N"
node run-tool.js chat.rule_chat --message "who reports to Abrar ul haq N"
node run-tool.js chat.rule_chat --message "give me Abrar's calendar"

# Adaptive assistant (intelligent routing)
node run-tool.js chat.adaptive --message "show me team structure for data engineering"

# Debug and analysis tools
node run-tool.js chat.rule_debug --message "analyze intent patterns for employee queries"
```

**Chat Assistant Capabilities:**
- ✅ **Employee Intelligence**: 83 employees with fuzzy name matching, role/location lookup, team structure navigation
- ✅ **Calendar Integration**: View upcoming meetings, events, and availability for any team member
- ✅ **Task & Project Management**: Employee assignments, project participation, workload analysis
- ✅ **Confidence Scoring**: 85%+ direct answers, 60-85% suggestions, intelligent disambiguation
- ✅ **Rich Formatting**: Structured responses with emojis, badges, and clear information hierarchy
- ✅ **Intent Analysis**: Advanced pattern matching with debug capabilities for troubleshooting

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

**Team Workload Analysis with Graphical Data:** ⭐ **NEW!**
```javascript
{
  "name": "priority.get_team_workload_analysis",
  "arguments": {
    "teamLeadName": "Abrar ul haq N"
  }
}
```

```bash
# Command line usage
node run-tool.js priority.get_team_workload_analysis --teamLeadName "Abrar ul haq N"
node run-tool.js priority.get_team_workload_analysis --teamLeadId "EMP014"
```

**BU Portfolio Performance Analysis:** ⭐ **NEW!**
```javascript
{
  "name": "priority.get_bu_portfolio_analysis",
  "arguments": {
    "department": "Data Management"
  }
}
```

```bash
# Command line usage
node run-tool.js priority.get_bu_portfolio_analysis --department "Data Management"
node run-tool.js priority.get_bu_portfolio_analysis --buManagerName "Jennifer Martinez"
node run-tool.js priority.get_bu_portfolio_analysis --buManagerId "EMP003"
```

**Project Performance Analysis:** ⭐ **NEW!**
```javascript
{
  "name": "priority.get_project_performance_analysis",
  "arguments": {
    "projectId": "MICROSERVICES-MIGRATION",
    "analysisDepth": "detailed"
  }
}
```

```bash
# Command line usage - Individual Project Analysis (PM Focus)
node run-tool.js priority.get_project_performance_analysis --projectId "PORTAEH"
node run-tool.js priority.get_project_performance_analysis --projectId "MICROSERVICES-MIGRATION" --analysisDepth "comprehensive"
node run-tool.js priority.get_project_performance_analysis --projectId "CCACB" --projectManagerName "Amanda Rodriguez"

# Available Projects:
# - MICROSERVICES-MIGRATION (Kevin Zhang, IT Architecture)
# - PORTAEH (Robert Wilson, Data Management)  
# - CCACB (Amanda Rodriguez, Data Management)
# - CLOUD-NATIVE-APPS (Sarah Wilson, IT Architecture)
# - DEVOPS-AUTOMATION (Michael Thompson, IT Operations)
```

## 📋 **Complete Parameter Reference** ⭐ **NEW!**

### 🎯 **Quick Reference Summary**
- **Priority System**: 8 tools for workload analysis, team management, and project performance
- **JIRA**: 20+ tools for issue management, analysis, and workflow operations  
- **Confluence**: 6 tools for page management, creation, and content analysis
- **Outlook**: 15+ tools for email, calendar, and folder management
- **Team Planner**: 10+ tools for Excel-based planning and task management
- **Chat Assistant**: 3+ tools for natural language interaction and adaptive responses

💡 **Parameter Syntax**: Use `--parameterName value` format. Boolean values: `true`/`false`. Arrays: `["item1","item2"]`

### 🧠 **Priority System Tools Parameters**

#### **priority.generate_priority_report**
```bash
--focusUser "username"              # Focus on specific user (optional)
--includeGreeting true/false        # Include personalized greeting (default: true)
--maxItems 50                       # Maximum items to return (default: 50)
--minScore 20                       # Minimum priority score 0-100 (default: 20)
```

#### **priority.get_urgent_items**
```bash
--focusUser "username"              # Focus on specific user (optional)
--urgencyLevels ["URGENT","HIGH"]   # Urgency levels to include (default: URGENT,HIGH)
```

#### **priority.workload_analysis**
```bash
--focusUser "username"              # Focus on specific user (optional)
```

#### **priority.dashboard_data**
```bash
--focusUser "username"              # Focus on specific user (optional)
--includeCharts true/false          # Include chart data (default: true)
```

#### **priority.clear_cache**
```bash
# No parameters required - clears all cached data
```

#### **priority.get_team_workload_analysis**
```bash
--teamLeadId "EMP014"               # Team Lead Employee ID
--teamLeadName "Abrar ul haq N"     # Team Lead Name (alternative)
--department "Data Management"      # Department filter (alternative)
--includeChartData true/false       # Include chart data (default: true)
--includeRecommendations true/false # Include recommendations (default: true)
```

#### **priority.get_bu_portfolio_analysis**
```bash
--buManagerId "EMP003"              # BU Manager Employee ID
--buManagerName "Jennifer Martinez" # BU Manager Name (alternative)
--department "Data Management"      # Department filter (alternative)
--includeProjectTimelines true/false    # Include timelines (default: true)
--includeResourceMetrics true/false     # Include resource metrics (default: true)
--includeChartData true/false           # Include chart data (default: true)
--includeRecommendations true/false     # Include recommendations (default: true)
```

#### **priority.get_project_performance_analysis**
```bash
--projectId "PORTAEH"               # Project ID (required)
--projectManagerId "EMP006"         # Project Manager Employee ID (optional)
--projectManagerName "Robert Wilson" # Project Manager Name (optional)
--analysisDepth "detailed"          # Analysis depth: summary|detailed|comprehensive
--includeTeamVelocity true/false    # Include team velocity metrics (default: true)
--includeTaskMetrics true/false     # Include task metrics (default: true)
--includeRiskAnalysis true/false    # Include risk analysis (default: true)
--includeChartData true/false       # Include chart data (default: true)
--includeRecommendations true/false # Include recommendations (default: true)
```

### 📋 **JIRA Tools Parameters**

#### **jira_fetch**
```bash
--issueKey "PROJ-123"               # JIRA issue key (required)
```

#### **jira_analyze**
```bash
--issueKey "PROJ-123"               # JIRA issue key to analyze (required)
```

#### **jira_fetch_by_label**
```bash
--label "bug"                       # JIRA label to search (required)
--maxResults 50                     # Maximum results to return (optional)
```

#### **jira_fetch_by_assignee**
```bash
--assignee "username"               # Username of assignee (required)
--status "Open"                     # Filter by status (optional)
--maxResults 500                    # Maximum results from JIRA (default: 500)
```

### 📄 **Confluence Tools Parameters**

#### **confluence_fetch**
```bash
--url "https://domain/wiki/display/SPACE/Page" # Confluence URL (required)
```

#### **confluence_detailed**
```bash
--url "https://domain/wiki/display/SPACE/Page" # Confluence URL (required)
```

#### **confluence_create_page**
```bash
--spaceKey "PROJ"                   # Confluence space key (required)
--title "Page Title"                # Page title (required)
--content "Page content"            # Page content (required)
--parentPageId "123456"             # Parent page ID (optional)
```

#### **confluence_update_page**
```bash
--pageId "123456"                   # Page ID to update (required if no URL)
--url "https://domain/wiki/..."     # Page URL (alternative to pageId)
--title "New Title"                 # New page title (optional)
--content "New content"             # New page content (required)
```

### 📧 **Outlook Email Tools Parameters**

#### **list-emails**
```bash
--folder "inbox"                    # Email folder (default: inbox)
--count 10                          # Number of emails (default: 10, max: 50)
```

#### **search-emails**
```bash
--query "search text"               # Search query text
--folder "inbox"                    # Email folder (default: inbox)
--from "sender@email.com"           # Filter by sender
--to "recipient@email.com"          # Filter by recipient
--subject "subject text"            # Filter by subject
--hasAttachments true/false         # Filter emails with attachments
--unreadOnly true/false             # Filter unread emails only
--count 10                          # Number of results (default: 10, max: 50)
```

#### **read-email**
```bash
--id "email-id"                     # Unique email ID (required if no search params)
--from "sender@email.com"           # Search by sender (alternative)
--subject "subject text"            # Search by subject (alternative)
--query "search text"               # Search by content (alternative)
```

#### **send-email**
```bash
--to "recipient@email.com"          # Recipients (required)
--cc "cc@email.com"                 # CC recipients (optional)
--bcc "bcc@email.com"               # BCC recipients (optional)
--subject "Email Subject"           # Email subject (required)
--body "Email content"              # Email body (required)
--importance "normal"               # Importance: normal|high|low
--saveToSentItems true/false        # Save to sent items
```

#### **mark-as-read**
```bash
--id "email-id"                     # Email ID (required)
--isRead true/false                 # Mark as read/unread (default: true)
```

### 👥 **Team Planner Tools Parameters**

#### **load_team_plan**
```bash
--filePath "path/to/plan.xlsx"      # Excel file path (required)
```

#### **update_member_availability**
```bash
--memberName "John Doe"             # Team member name (required)
--startDate "2025-01-01"            # Leave start date (required)
--endDate "2025-01-05"              # Leave end date (required)
--leaveType "vacation"              # Leave type: vacation|sick|personal|holiday
```

#### **check_task_conflicts**
```bash
--memberName "John Doe"             # Team member name (required)
--dateRange.start "2025-01-01"      # Check start date
--dateRange.end "2025-01-05"        # Check end date
```

#### **reassign_tasks**
```bash
--fromMember "John Doe"             # Member who is unavailable (required)
--toMember "Jane Smith"             # Target member (optional - auto-assign)
--taskIds ["TASK-1","TASK-2"]       # Specific task IDs (optional - all tasks)
--dateRange.start "2025-01-01"      # Date range start
--dateRange.end "2025-01-05"        # Date range end
```

### 🤖 **Chat Assistant Tools Parameters**

#### **chat.ask**
```bash
--query "Your question here"        # Natural language query (required)
--context "additional context"      # Additional context (optional)
--includeHistory true/false         # Include conversation history (default: true)
```

#### **chat.rule_based**
```bash
--query "Your question here"        # Natural language query (required)
--confidence 0.85                   # Minimum confidence threshold (0-1)
--includeDebug true/false           # Include debug information
```

#### **chat.adaptive**
```bash
--query "Your question here"        # Natural language query (required)
--preferredMode "llm"               # Preferred mode: llm|rule_based|auto
--fallback true/false               # Enable fallback between modes (default: true)
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
│   ├── index.js             # Priority system tools (8 tools)
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

## 🧪 Testing & Quality Assurance

### 📊 **Test Coverage & Performance Metrics**
- **Overall Success Rate**: 82.9% (34/41 tests passed) - **70.4 percentage point improvement** over original assistant
- **Test Categories Performance**:
  - Basic Functionality: 40.0% success (2/5 tests)
  - Employee Lookup: 85.7% success (6/7 tests)  
  - Task Management: 100% success (5/5 tests) ✅
  - Project Status: 80.0% success (4/5 tests)
  - Team Structure: 60.0% success (3/5 tests)
  - Edge Cases: 100% success (4/4 tests) ✅
  - Natural Language: 100% success (5/5 tests) ✅
  - Performance: 100% success (5/5 tests) ✅

### 🎯 **Test Infrastructure**
- **70+ Test Files**: Comprehensive coverage across all functionality
- **Organized Test Directory**: `test-cases/` with categorized test suites
- **Main Test Suites**:
  - `ENHANCED_ASSISTANT_TEST.js` - Primary comprehensive test suite
  - `COMPREHENSIVE_AI_ASSISTANT_TEST.js` - AI assistant validation
  - `test-chat-stress-performance.js` - Performance and load testing
  - `test-chat-intent-edge-cases.js` - Edge case and error handling
  - `test-organizational-data.js` - Employee and team data validation

### 🔍 **Quality Features**
- **Intent Detection Testing**: Specialized validation for natural language processing accuracy
- **Fuzzy Matching Validation**: Employee name matching with confidence scoring verification
- **Cross-System Integration Testing**: JIRA, Confluence, Outlook data synchronization validation
- **Performance Benchmarking**: Response time and throughput measurement
- **Edge Case Coverage**: Empty queries, malformed inputs, missing data scenarios
- **Regression Testing**: Automated validation of existing functionality during updates

### 🚀 **Performance Optimization**
- **15-Minute Intelligent Caching**: Priority system optimization with graceful degradation
- **Parallel Data Fetching**: Multi-source data aggregation for faster response times
- **Efficient Pattern Matching**: Optimized regex patterns with priority ordering
- **Lazy Service Initialization**: Services initialized only when needed for faster startup
- **Memory Management**: Conversation history trimming and efficient data structures

### 📈 **Continuous Improvement**
- **Automated Testing**: Integration with development workflow
- **Performance Monitoring**: Real-time metrics collection and analysis  
- **User Experience Metrics**: Response quality and accuracy measurement
- **Error Tracking**: Comprehensive error logging and analysis
- **Feature Usage Analytics**: Understanding of most-used functionality for optimization priorities

## 🤝 Contributing

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

### v2.2.0 ⭐ **LATEST** - Enhanced AI & Rule-Based Intelligence
- **🧠 Dual Assistant Architecture**: LLM-powered assistant with enhanced rule-based fallback for specialized queries
- **🔍 Advanced Fuzzy Matching**: Levenshtein distance, partial name matching, phonetic similarity for robust employee lookup
- **👥 Employee Intelligence System**: Complete employee database with team structure, calendar integration, and task management
- **🎯 Sophisticated Intent Recognition**: Pattern-based matching with confidence scoring and intelligent disambiguation
- **📅 Calendar Integration**: Employee calendar viewing with upcoming meetings, events, and availability insights
- **🧪 Comprehensive Testing**: 82.9% success rate (34/41 tests) with 70+ test files and performance benchmarking
- **📊 Quality Assurance**: Structured test organization, edge case coverage, and regression testing
- **🚀 Performance Optimization**: 15-minute caching, parallel processing, and efficient pattern matching
- **🔄 Intelligent Routing**: Adaptive assistant that switches between LLM and rule-based responses
- **🧹 Project Cleanup**: Removed 29+ redundant test files while maintaining organized test infrastructure

### v2.1.0 - Team Planner JIRA Integration & Project Cleanup  
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
