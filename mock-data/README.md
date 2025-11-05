# Mock Data Documentation

This directory contains organized, realistic mock data for the Unified MCP Server, based on real data patterns extracted from live JIRA, Confluence, and Outlook systems.

## 📁 Structure

```
mock-data/
├── index.js                    # Main export and utility functions
├── jira-mock-data.js          # JIRA issues, projects, users
├── confluence-mock-data.js    # Pages, spaces, documentation
├── outlook-mock-data.js       # Emails, calendar events, folders
└── README.md                  # This documentation
```

## 🎯 Data Sources

The mock data is based on real enterprise data patterns from:

- **JIRA Projects**: PORTAEH, CCACB
- **Real Users**: Abrar ul haq N, Dinesh Kumar M, Mani S, Dev Sparrow (devsparrow84@outlook.com)
- **Issue Types**: Tasks, ETL processes, database operations, data quality
- **Realistic Scenarios**: Actual business processes and workflows

## 📊 Data Statistics

### JIRA Mock Data
- **Issues**: 13 realistic issues across 2 projects (including 3 new issues from Dev Sparrow)
- **Projects**: PORTAEH (ETL/Data Processing), CCACB (Data Warehouse/DQ)
- **Users**: 4 active developers + system admin (added Dev Sparrow integration specialist)
- **Statuses**: Task Assigned, In Progress, On Hold, Closed
- **Priorities**: Highest to Lowest with realistic distribution

### Confluence Mock Data
- **Pages**: 9 comprehensive documentation pages (added 3 technical guides from Dev Sparrow)
- **Spaces**: 4 spaces (PORTAEH, CCACB, TECH, PROC)
- **Content Types**: Technical docs, process guides, standards, integration architecture
- **Rich Content**: Tables, code blocks, task lists, macros, technical diagrams

### Outlook Mock Data
- **Emails**: 8 realistic business emails with threads (added 3 integration-focused emails from Dev Sparrow)
- **Calendar Events**: 7 meetings including recurring events (added 3 development and demo sessions)
- **Folders**: Organized folder structure with project-specific folders
- **Attachments**: Technical documents, reports, spreadsheets

## 🔍 Key Features

### Cross-System Consistency
- **User Synchronization**: Same users across all systems
- **Project Alignment**: JIRA projects match Confluence spaces
- **Timeline Coherence**: Related events across systems have consistent dates
- **Content Relationships**: References between issues, documentation, and emails

### Realistic Business Scenarios
- **ETL Process Issues**: Data source availability, workflow modifications
- **Database Operations**: Schema changes, table creation, DQ rules
- **Team Collaboration**: Status updates, reviews, planning meetings
- **System Operations**: Maintenance windows, performance monitoring

### Rich Data Types
- **HTML Content**: Formatted emails and Confluence pages
- **Structured Data**: Tables, lists, code snippets
- **Metadata**: Labels, categories, priorities, statuses
- **Relationships**: Parent-child, assignee, attendee relationships

## 🚀 Usage

### Import Mock Data
```javascript
const mockData = require('./mock-data');

// Access specific system data
const jiraIssues = mockData.jira.issues;
const confluencePages = mockData.confluence.pages;
const outlookEmails = mockData.outlook.emails;

// Use utility functions
const commonUsers = mockData.utils.getCommonUsers();
const projectSummary = mockData.utils.getSystemSummary();
```

### Search and Filter
```javascript
// Find JIRA issues by assignee
const abrarsIssues = mockData.jira.searchResults.byAssignee("Abrar ul haq N");

// Find Confluence pages by space
const portaehDocs = mockData.confluence.searchResults.bySpace("PORTAEH");

// Find unread emails
const unreadEmails = mockData.outlook.searchResults.unreadEmails();
```

### Cross-System Queries
```javascript
// Find all content related to a project
const portaehContent = mockData.utils.findRelatedContent("PORTAEH", "project");
// Returns: { jira: [...], confluence: [...], outlook: [...] }

// Get user workload across all systems
const userWorkload = mockData.utils.findRelatedContent("Abrar ul haq N", "user");
```

### Test Scenarios
```javascript
// Get predefined test scenarios
const scenarios = mockData.testScenarios;

// Critical issue scenario with related content
const criticalScenario = scenarios.criticalIssueScenario;

// User workload analysis
const userScenario = scenarios.userWorkloadScenario;

// Project status overview
const projectScenario = scenarios.projectStatusScenario;
```

## 🛠 Customization

### Adding New Data
1. **JIRA Issues**: Add to `jiraMockData.issues` array
2. **Confluence Pages**: Add to `confluenceMockData.pages` array
3. **Outlook Items**: Add to `outlookMockData.emails` or `calendarEvents`

### Maintaining Consistency
- Use existing user IDs from `getCommonUsers()`
- Reference existing project keys
- Maintain realistic date relationships
- Use consistent naming conventions

### Validation
```javascript
// Check data consistency
const validation = mockData.utils.validateDataConsistency();
console.log(validation.isValid); // true/false
console.log(validation.issues);  // Array of issues found
```

## 📅 Timeline

The mock data represents a realistic timeline:
- **Historical Issues**: Closed tasks from previous months
- **Current Work**: Active tasks in progress
- **Future Events**: Upcoming meetings and deadlines
- **Recent Activity**: Fresh emails and updates

## 🎯 Real-World Mapping

### JIRA Issue Patterns
- **PORTAEH-3231**: ETL source availability (real pattern)
- **CCACB-11894**: Database table creation (real pattern)
- **Task statuses**: Match actual workflow states
- **Priorities**: Realistic business priority distribution

### Confluence Content Types
- **Technical Documentation**: Architecture, implementation guides
- **Process Documentation**: Change management, procedures
- **Standards**: Database development, coding guidelines
- **Project Spaces**: Match JIRA project structure

### Outlook Communication
- **Status Updates**: Project progress, issue resolution
- **System Alerts**: Automated monitoring notifications
- **Meeting Requests**: Sprint planning, technical reviews
- **Threaded Conversations**: Realistic email chains

## 🔧 Integration

The mock data integrates seamlessly with the MCP server:

```javascript
// In service files
const mockData = require('../mock-data');

// Use in test mode
if (process.env.USE_TEST_MODE === 'true') {
  return mockData.jira.searchResults.byAssignee(assignee);
}
```

## 📈 Health Monitoring

```javascript
// System health check
const health = mockData.healthCheck();
console.log(health.status);      // "healthy" or "warnings"
console.log(health.dataStats);   // Statistics for all systems
console.log(health.validation);  // Data consistency results
```

## 🔄 Updates and Maintenance

- **Version**: 1.0.0 (based on November 2025 data extraction)
- **Last Updated**: Matches real data extraction date
- **Refresh Cycle**: Update when adding new features or scenarios
- **Validation**: Run consistency checks after modifications

## 🎭 Testing Scenarios

The mock data supports comprehensive testing scenarios:

1. **User Story Testing**: Complete user journeys across systems
2. **Integration Testing**: Cross-system data relationships
3. **Performance Testing**: Realistic data volumes and complexity
4. **Error Handling**: Edge cases and missing data scenarios
5. **Business Logic**: Actual business rules and workflows

This mock data provides a robust foundation for development and testing while maintaining the realism and complexity of actual enterprise systems.