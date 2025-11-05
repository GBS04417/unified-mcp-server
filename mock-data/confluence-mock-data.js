/**
 * Confluence Mock Data - Enterprise Knowledge Base Content
 * Generated realistic data for development and testing
 * Simulates typical enterprise documentation, processes, and knowledge articles
 */

const confluenceMockData = {
    // Space configurations
    spaces: [
        {
            id: "space1",
            key: "PORTAEH",
            name: "PORTAEH Documentation",
            type: "global",
            status: "current",
            description: "Technical documentation and processes for PORTAEH project",
            webUrl: "https://confluence.company.com/spaces/PORTAEH"
        },
        {
            id: "space2",
            key: "CCACB",
            name: "CCACB Knowledge Base",
            type: "global",
            status: "current",
            description: "Documentation for CCACB data warehouse and ETL processes",
            webUrl: "https://confluence.company.com/spaces/CCACB"
        },
        {
            id: "space3",
            key: "TECH",
            name: "Technical Guidelines",
            type: "global",
            status: "current",
            description: "Company-wide technical guidelines and best practices",
            webUrl: "https://confluence.company.com/spaces/TECH"
        },
        {
            id: "space4",
            key: "PROC",
            name: "Process Documentation",
            type: "global",
            status: "current",
            description: "Business processes and procedures documentation",
            webUrl: "https://confluence.company.com/spaces/PROC"
        }
    ],

    // Users from JIRA data
    users: [
        {
            accountId: "user1",
            displayName: "Abrar ul haq N",
            emailAddress: "abrar.ulhaq@example.com",
            profilePicture: { path: "/avatar/user1.png" }
        },
        {
            accountId: "user2",
            displayName: "Dinesh Kumar M",
            emailAddress: "dinesh.kumar@example.com",
            profilePicture: { path: "/avatar/user2.png" }
        },
        {
            accountId: "user3",
            displayName: "Mani S",
            emailAddress: "mani.s@example.com",
            profilePicture: { path: "/avatar/user3.png" }
        },
        {
            accountId: "user4",
            displayName: "Dev Sparrow",
            emailAddress: "devsparrow84@outlook.com",
            profilePicture: { path: "/avatar/user4.png" }
        },
        {
            accountId: "system",
            displayName: "System Admin",
            emailAddress: "admin@example.com",
            profilePicture: { path: "/avatar/admin.png" }
        }
    ],

    // Page templates and content
    pages: [
        // PORTAEH Documentation
        {
            id: "page1",
            title: "PORTAEH ETL Process Overview",
            spaceKey: "PORTAEH",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>PORTAEH ETL Process Overview</h1>
<p>This document provides a comprehensive overview of the Extract, Transform, Load (ETL) processes used in the PORTAEH project.</p>

<h2>Key Components</h2>
<ul>
<li><strong>MIDATAMODEL GG:</strong> Data model for handling GG sources</li>
<li><strong>WF_COGE_DIMENSIONI:</strong> Workflow for dimensional data processing</li>
<li><strong>Session Management:</strong> RG component session handling</li>
</ul>

<h2>Data Sources</h2>
<p>The ETL process handles multiple data sources including:</p>
<ul>
<li>Internal database systems</li>
<li>External vendor feeds</li>
<li>Real-time data streams</li>
<li>Historical data archives</li>
</ul>

<h2>Error Handling</h2>
<p>The system implements robust error handling for unavailable data sources, with automatic notifications and fallback procedures.</p>

<h2>Monitoring and Alerts</h2>
<p>Real-time monitoring is in place for all ETL processes with automated alerts for failures or performance issues.</p>`,
                    representation: "storage"
                }
            },
            version: { number: 3 },
            createdDate: "2025-10-01T09:00:00.000Z",
            lastModified: "2025-11-04T14:30:00.000Z",
            createdBy: { accountId: "user1", displayName: "Abrar ul haq N" },
            lastModifiedBy: { accountId: "user1", displayName: "Abrar ul haq N" },
            webUrl: "https://confluence.company.com/spaces/PORTAEH/pages/page1",
            labels: ["ETL", "process", "documentation"]
        },

        {
            id: "page2",
            title: "MIDATAMODEL GG Implementation Guide",
            spaceKey: "PORTAEH",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>MIDATAMODEL GG Implementation Guide</h1>
<p>Detailed implementation guide for the MIDATAMODEL GG component handling data source availability notifications.</p>

<h2>Architecture</h2>
<p>The MIDATAMODEL GG follows a microservices architecture with the following components:</p>
<ul>
<li>Source Monitor Service</li>
<li>Notification Engine</li>
<li>Data Validation Layer</li>
<li>Logging and Audit Trail</li>
</ul>

<h2>Configuration</h2>
<ac:structured-macro ac:name="code" ac:schema-version="1">
<ac:parameter ac:name="language">json</ac:parameter>
<ac:plain-text-body><![CDATA[{
  "sources": {
    "primary": ["DB1", "DB2", "FEED1"],
    "secondary": ["BACKUP_DB", "ARCHIVE"]
  },
  "notifications": {
    "email": ["admin@company.com"],
    "slack": "#alerts-channel"
  },
  "retry": {
    "attempts": 3,
    "delay": "5m"
  }
}]]></ac:plain-text-body>
</ac:structured-macro>

<h2>Deployment Checklist</h2>
<ac:task-list>
<ac:task>
<ac:task-id>1</ac:task-id>
<ac:task-status>complete</ac:task-status>
<ac:task-body>Configure data source connections</ac:task-body>
</ac:task>
<ac:task>
<ac:task-id>2</ac:task-id>
<ac:task-status>incomplete</ac:task-status>
<ac:task-body>Set up monitoring dashboards</ac:task-body>
</ac:task>
<ac:task>
<ac:task-id>3</ac:task-id>
<ac:task-status>incomplete</ac:task-status>
<ac:task-body>Configure alert notifications</ac:task-body>
</ac:task>
</ac:task-list>`,
                    representation: "storage"
                }
            },
            version: { number: 5 },
            createdDate: "2025-10-15T10:00:00.000Z",
            lastModified: "2025-11-04T16:45:00.000Z",
            createdBy: { accountId: "user1", displayName: "Abrar ul haq N" },
            lastModifiedBy: { accountId: "user1", displayName: "Abrar ul haq N" },
            webUrl: "https://confluence.company.com/spaces/PORTAEH/pages/page2",
            labels: ["MIDATAMODEL", "implementation", "guide"]
        },

        // CCACB Documentation
        {
            id: "page3",
            title: "Data Warehouse Schema Design - CCACB",
            spaceKey: "CCACB",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>Data Warehouse Schema Design - CCACB</h1>
<p>Comprehensive documentation for the CCACB data warehouse schema design and table structures.</p>

<h2>Core Tables</h2>

<h3>DW_HS_GAG_STOCK_ESG_APE</h3>
<p>ESG APE stock tracking table for daily aggregations.</p>
<ac:structured-macro ac:name="table">
<ac:parameter ac:name="sortable">true</ac:parameter>
<table>
<thead>
<tr>
<th>Column Name</th>
<th>Data Type</th>
<th>Description</th>
<th>Constraints</th>
</tr>
</thead>
<tbody>
<tr>
<td>ID_RECORD</td>
<td>BIGINT</td>
<td>Primary key identifier</td>
<td>NOT NULL, PRIMARY KEY</td>
</tr>
<tr>
<td>DATA_RIFERIMENTO</td>
<td>DATE</td>
<td>Reference date for the record</td>
<td>NOT NULL</td>
</tr>
<tr>
<td>COD_STOCK</td>
<td>VARCHAR(50)</td>
<td>Stock identifier code</td>
<td>NOT NULL</td>
</tr>
<tr>
<td>VALORE_ESG</td>
<td>DECIMAL(15,2)</td>
<td>ESG rating value</td>
<td>CHECK (VALORE_ESG >= 0)</td>
</tr>
</tbody>
</table>
</ac:structured-macro>

<h3>DW_HS_AR_TITOLARE_EFFETTIVO</h3>
<p>Effective ownership tracking for regulatory compliance.</p>

<h2>Monthly Aggregation Tables</h2>
<p>All core tables have corresponding monthly aggregation views with _MM suffix for performance optimization.</p>

<h2>Data Quality Rules</h2>
<ul>
<li>All monetary values must be non-negative</li>
<li>Reference dates must be within valid business date ranges</li>
<li>Foreign key relationships must be maintained</li>
<li>Duplicate records are not allowed within same reference date</li>
</ul>

<h2>ETL Process</h2>
<p>The ETL process for these tables follows a strict schedule:</p>
<ul>
<li><strong>Daily Load:</strong> 02:00 AM CET</li>
<li><strong>Monthly Aggregation:</strong> 1st day of month, 06:00 AM CET</li>
<li><strong>Data Validation:</strong> After each load</li>
</ul>`,
                    representation: "storage"
                }
            },
            version: { number: 7 },
            createdDate: "2025-10-20T08:00:00.000Z",
            lastModified: "2025-11-04T12:00:00.000Z",
            createdBy: { accountId: "user2", displayName: "Dinesh Kumar M" },
            lastModifiedBy: { accountId: "user2", displayName: "Dinesh Kumar M" },
            webUrl: "https://confluence.company.com/spaces/CCACB/pages/page3",
            labels: ["database", "schema", "DW", "design"]
        },

        {
            id: "page4",
            title: "Data Quality Framework and Rules",
            spaceKey: "CCACB",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>Data Quality Framework and Rules</h1>
<p>Comprehensive framework for maintaining data quality across all CCACB systems and processes.</p>

<h2>DQ Rules Overview</h2>
<p>Data Quality (DQ) rules are implemented at multiple levels to ensure data integrity and compliance.</p>

<h3>AIRB Product Portfolio Rules</h3>
<p>Specific rules for DW_HS_SPC_AIRB_PP_PRODOTTO table:</p>
<ul>
<li><strong>Completeness:</strong> All mandatory fields must be populated</li>
<li><strong>Validity:</strong> Product codes must exist in reference data</li>
<li><strong>Consistency:</strong> Portfolio values must balance to control totals</li>
<li><strong>Timeliness:</strong> Data must be updated within SLA timeframes</li>
</ul>

<h3>Subject Grouping Rules</h3>
<p>Rules for DW_HS_AN_RAGGRUPPA_SOGG_GR_NEW:</p>
<ul>
<li>Subject groupings must follow regulatory classification</li>
<li>No circular references in group hierarchies</li>
<li>Group assignments must be mutually exclusive</li>
</ul>

<h2>DU (Data Update) Procedures</h2>
<p>Standardized procedures for data updates ensure consistency and auditability.</p>

<h3>Update Process Flow</h3>
<ac:structured-macro ac:name="flowchart">
<ac:parameter ac:name="diagramName">DU Process Flow</ac:parameter>
</ac:structured-macro>

<h2>Monitoring and Reporting</h2>
<p>Automated monitoring reports are generated daily showing:</p>
<ul>
<li>Rule violation counts by table</li>
<li>Data quality score trends</li>
<li>Exception handling statistics</li>
<li>Performance metrics</li>
</ul>

<h2>Exception Handling</h2>
<p>When DQ rules fail, the following process is triggered:</p>
<ol>
<li>Immediate alert to data stewards</li>
<li>Automatic quarantine of affected records</li>
<li>Root cause analysis initiation</li>
<li>Corrective action implementation</li>
<li>Re-validation and release</li>
</ol>`,
                    representation: "storage"
                }
            },
            version: { number: 4 },
            createdDate: "2025-10-25T14:00:00.000Z",
            lastModified: "2025-11-03T09:30:00.000Z",
            createdBy: { accountId: "user3", displayName: "Mani S" },
            lastModifiedBy: { accountId: "user3", displayName: "Mani S" },
            webUrl: "https://confluence.company.com/spaces/CCACB/pages/page4",
            labels: ["data-quality", "DQ", "rules", "framework"]
        },

        // Technical Guidelines
        {
            id: "page5",
            title: "Database Development Standards",
            spaceKey: "TECH",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>Database Development Standards</h1>
<p>Company-wide standards for database development, naming conventions, and best practices.</p>

<h2>Naming Conventions</h2>

<h3>Table Names</h3>
<ul>
<li><strong>Prefix:</strong> DW_HS_ for data warehouse historical tables</li>
<li><strong>Suffix:</strong> _MM for monthly aggregation tables</li>
<li><strong>Format:</strong> UPPERCASE with underscores</li>
<li><strong>Example:</strong> DW_HS_GAG_STOCK_ESG_APE</li>
</ul>

<h3>Column Names</h3>
<ul>
<li>Use descriptive names in UPPERCASE</li>
<li>Separate words with underscores</li>
<li>Include data type hints where appropriate</li>
<li>Examples: ID_RECORD, DATA_RIFERIMENTO, COD_STOCK</li>
</ul>

<h2>Data Types</h2>
<ac:structured-macro ac:name="table">
<table>
<thead>
<tr><th>Purpose</th><th>Data Type</th><th>Guidelines</th></tr>
</thead>
<tbody>
<tr><td>Identifiers</td><td>BIGINT</td><td>Use for all ID fields</td></tr>
<tr><td>Dates</td><td>DATE</td><td>Use for business dates</td></tr>
<tr><td>Timestamps</td><td>TIMESTAMP</td><td>Include timezone info</td></tr>
<tr><td>Currency</td><td>DECIMAL(15,2)</td><td>Fixed precision for money</td></tr>
<tr><td>Codes</td><td>VARCHAR(n)</td><td>Size based on requirements</td></tr>
</tbody>
</table>
</ac:structured-macro>

<h2>Performance Guidelines</h2>
<ul>
<li>Index all foreign key columns</li>
<li>Create composite indexes for multi-column searches</li>
<li>Partition large tables by date ranges</li>
<li>Use appropriate statistics for query optimization</li>
</ul>

<h2>Security Standards</h2>
<ul>
<li>All tables must have defined access controls</li>
<li>Sensitive data requires encryption at rest</li>
<li>Audit trails mandatory for all DML operations</li>
<li>Regular security assessments required</li>
</ul>`,
                    representation: "storage"
                }
            },
            version: { number: 2 },
            createdDate: "2025-09-15T10:00:00.000Z",
            lastModified: "2025-10-30T15:00:00.000Z",
            createdBy: { accountId: "system", displayName: "System Admin" },
            lastModifiedBy: { accountId: "user2", displayName: "Dinesh Kumar M" },
            webUrl: "https://confluence.company.com/spaces/TECH/pages/page5",
            labels: ["standards", "database", "development", "guidelines"]
        },

        // Process Documentation
        {
            id: "page6",
            title: "Change Management Process",
            spaceKey: "PROC",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>Change Management Process</h1>
<p>Standardized process for managing changes to production systems, databases, and applications.</p>

<h2>Change Categories</h2>

<h3>Database Changes</h3>
<ul>
<li><strong>Schema Changes:</strong> New tables, columns, indexes</li>
<li><strong>Data Changes:</strong> Updates to reference data</li>
<li><strong>Performance Changes:</strong> Query optimization, partitioning</li>
</ul>

<h3>ETL Changes</h3>
<ul>
<li><strong>Process Logic:</strong> Transformation rule changes</li>
<li><strong>Data Sources:</strong> New source connections</li>
<li><strong>Scheduling:</strong> Job timing modifications</li>
</ul>

<h2>Approval Workflow</h2>
<ol>
<li><strong>Request Submission:</strong> Developer creates change request</li>
<li><strong>Technical Review:</strong> Architecture team assessment</li>
<li><strong>Business Approval:</strong> Business owner sign-off</li>
<li><strong>Testing Phase:</strong> UAT and performance testing</li>
<li><strong>Production Deployment:</strong> Scheduled implementation</li>
<li><strong>Post-Implementation Review:</strong> Validation and monitoring</li>
</ol>

<h2>Risk Assessment</h2>
<p>All changes must be assessed for:</p>
<ul>
<li>Impact on existing functionality</li>
<li>Data integrity risks</li>
<li>Performance implications</li>
<li>Regulatory compliance requirements</li>
<li>Rollback procedures</li>
</ul>

<h2>Documentation Requirements</h2>
<ul>
<li>Detailed change description</li>
<li>Impact analysis</li>
<li>Testing results</li>
<li>Rollback plan</li>
<li>Communication plan</li>
</ul>

<h2>Emergency Changes</h2>
<p>For critical production issues, expedited process available with post-implementation review required within 24 hours.</p>`,
                    representation: "storage"
                }
            },
            version: { number: 3 },
            createdDate: "2025-09-01T08:00:00.000Z",
            lastModified: "2025-10-15T12:00:00.000Z",
            createdBy: { accountId: "system", displayName: "System Admin" },
            lastModifiedBy: { accountId: "user1", displayName: "Abrar ul haq N" },
            webUrl: "https://confluence.company.com/spaces/PROC/pages/page6",
            labels: ["change-management", "process", "governance"]
        },

        // Dev Sparrow's technical documentation
        {
            id: "page_devsparrow1",
            title: "Outlook Integration Architecture Guide",
            spaceKey: "TECH",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>Outlook Integration Architecture Guide</h1>
<p><strong>Document Purpose:</strong> Technical documentation for the Outlook Integration Module in the unified MCP server (PORTAEH-3305).</p>

<h2>Architecture Overview</h2>
<p>The Outlook Integration Module provides seamless connectivity between Microsoft Outlook and the unified MCP server, enabling cross-system data synchronization and workflow automation.</p>

<h3>Core Components</h3>
<ul>
<li><strong>Authentication Service:</strong> OAuth 2.0 implementation with Microsoft Graph API</li>
<li><strong>Email Synchronization Engine:</strong> Real-time email processing and data extraction</li>
<li><strong>Calendar Integration:</strong> Meeting and event synchronization with team planning systems</li>
<li><strong>Cross-System Linking:</strong> Automatic correlation with JIRA tickets and Confluence pages</li>
</ul>

<h2>Technical Implementation</h2>

<h3>Authentication Flow</h3>
<ac:structured-macro ac:name="code" ac:schema-version="1" ac:macro-id="auth-flow">
<ac:parameter ac:name="language">javascript</ac:parameter>
<ac:plain-text-body><![CDATA[
// OAuth 2.0 Authentication with Microsoft Graph
const authConfig = {
  clientId: process.env.OUTLOOK_CLIENT_ID,
  clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  authority: 'https://login.microsoftonline.com/common',
  redirectUri: process.env.OUTLOOK_REDIRECT_URI
};

// Token management with automatic refresh
class TokenManager {
  async getAccessToken() {
    if (this.isTokenExpired()) {
      await this.refreshToken();
    }
    return this.accessToken;
  }
}
]]></ac:plain-text-body>
</ac:structured-macro>

<h3>Email Processing Pipeline</h3>
<ol>
<li><strong>Webhook Reception:</strong> Microsoft Graph webhooks for real-time notifications</li>
<li><strong>Delta Queries:</strong> Efficient synchronization using change tracking</li>
<li><strong>Content Analysis:</strong> Extract JIRA ticket references and project information</li>
<li><strong>Cross-System Updates:</strong> Update related systems with email context</li>
</ol>

<h2>Integration Points</h2>

<h3>JIRA Integration</h3>
<ul>
<li>Automatic detection of JIRA ticket references in email subjects and bodies</li>
<li>Bi-directional synchronization of comments and updates</li>
<li>Email notifications for ticket status changes</li>
</ul>

<h3>Team Planner Integration</h3>
<ul>
<li>Calendar event synchronization with planning schedules</li>
<li>Meeting room booking integration</li>
<li>Availability status updates</li>
</ul>

<h2>Performance Considerations</h2>
<ul>
<li><strong>Rate Limiting:</strong> Microsoft Graph API throttling management</li>
<li><strong>Caching Strategy:</strong> 15-minute intelligent caching for frequently accessed data</li>
<li><strong>Error Recovery:</strong> Exponential backoff retry mechanisms</li>
<li><strong>Scalability:</strong> Horizontal scaling support for enterprise deployments</li>
</ul>

<h2>Security Features</h2>
<ul>
<li><strong>Token Security:</strong> Secure token storage with encryption</li>
<li><strong>Data Privacy:</strong> Minimal data retention policies</li>
<li><strong>Audit Logging:</strong> Comprehensive activity tracking</li>
<li><strong>Compliance:</strong> GDPR and enterprise security standards</li>
</ul>

<h2>Related Issues</h2>
<ul>
<li><a href="https://svil.bansel.it/jira/browse/PORTAEH-3305">PORTAEH-3305</a>: Outlook Integration Module Implementation</li>
<li><a href="https://svil.bansel.it/jira/browse/PORTAEH-3312">PORTAEH-3312</a>: Cross-System Data Synchronization Enhancement</li>
</ul>`
                }
            },
            version: { number: 1 },
            createdDate: "2025-11-05T09:00:00.000Z",
            lastModified: "2025-11-05T14:30:00.000Z",
            createdBy: { accountId: "user4", displayName: "Dev Sparrow" },
            lastModifiedBy: { accountId: "user4", displayName: "Dev Sparrow" },
            webUrl: "https://confluence.company.com/spaces/TECH/pages/page_devsparrow1",
            labels: ["integration", "outlook", "architecture", "oauth", "microsoft-graph"]
        },

        {
            id: "page_devsparrow2",
            title: "Cross-System Synchronization Best Practices",
            spaceKey: "TECH",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>Cross-System Synchronization Best Practices</h1>
<p><strong>Author:</strong> Dev Sparrow | <strong>Related Issue:</strong> <a href="https://svil.bansel.it/jira/browse/PORTAEH-3312">PORTAEH-3312</a></p>

<h2>Introduction</h2>
<p>This document outlines best practices for implementing cross-system data synchronization in enterprise environments, with specific focus on JIRA, Confluence, and Outlook integration patterns.</p>

<h2>Synchronization Patterns</h2>

<h3>1. Event-Driven Architecture</h3>
<ul>
<li><strong>Webhooks:</strong> Real-time notifications for system changes</li>
<li><strong>Message Queues:</strong> Reliable event processing and delivery</li>
<li><strong>Event Sourcing:</strong> Maintain complete audit trail of all changes</li>
</ul>

<h3>2. Data Consistency Models</h3>
<ul>
<li><strong>Eventual Consistency:</strong> Acceptable for most business scenarios</li>
<li><strong>Strong Consistency:</strong> Required for critical financial data</li>
<li><strong>Conflict Resolution:</strong> Last-write-wins with timestamp precedence</li>
</ul>

<h2>Implementation Guidelines</h2>

<h3>API Rate Limiting Strategy</h3>
<ac:structured-macro ac:name="info" ac:schema-version="1">
<ac:rich-text-body>
<p>Different systems have varying rate limits:</p>
<ul>
<li><strong>Microsoft Graph:</strong> 10,000 requests per 10 minutes per application</li>
<li><strong>Atlassian APIs:</strong> 10 requests per second per user</li>
<li><strong>Custom APIs:</strong> Varies by implementation</li>
</ul>
</ac:rich-text-body>
</ac:structured-macro>

<h3>Error Handling Framework</h3>
<ol>
<li><strong>Transient Errors:</strong> Automatic retry with exponential backoff</li>
<li><strong>Rate Limit Errors:</strong> Intelligent queuing and throttling</li>
<li><strong>Authentication Errors:</strong> Token refresh and re-authentication</li>
<li><strong>System Errors:</strong> Fallback to offline mode with later synchronization</li>
</ol>

<h2>Monitoring and Alerting</h2>
<ul>
<li><strong>Sync Lag Monitoring:</strong> Track synchronization delays across systems</li>
<li><strong>Error Rate Thresholds:</strong> Alert on unusual error patterns</li>
<li><strong>Performance Metrics:</strong> Monitor API response times and throughput</li>
<li><strong>Data Quality Checks:</strong> Validate synchronization accuracy</li>
</ul>

<h2>Testing Strategies</h2>

<h3>Integration Testing</h3>
<ul>
<li><strong>End-to-End Scenarios:</strong> Complete workflow testing across all systems</li>
<li><strong>Failure Simulation:</strong> Test error handling and recovery mechanisms</li>
<li><strong>Load Testing:</strong> Validate performance under peak conditions</li>
</ul>

<h3>Mock Data Management</h3>
<ul>
<li><strong>Realistic Test Data:</strong> Production-like scenarios for comprehensive testing</li>
<li><strong>Cross-System Consistency:</strong> Maintain data relationships across mock systems</li>
<li><strong>Automated Data Generation:</strong> Scripts for generating test scenarios</li>
</ul>

<h2>Security Considerations</h2>
<ul>
<li><strong>Data Encryption:</strong> In-transit and at-rest encryption for sensitive data</li>
<li><strong>Access Controls:</strong> Role-based permissions for synchronization operations</li>
<li><strong>Audit Trails:</strong> Complete logging of all synchronization activities</li>
<li><strong>Data Retention:</strong> Policies for temporary and permanent data storage</li>
</ul>

<h2>Related Documentation</h2>
<ul>
<li><a href="#page_devsparrow1">Outlook Integration Architecture Guide</a></li>
<li><a href="https://confluence.company.com/spaces/TECH/pages/page1">API Rate Limiting Guidelines</a></li>
</ul>`
                }
            },
            version: { number: 2 },
            createdDate: "2025-11-04T10:30:00.000Z",
            lastModified: "2025-11-05T16:15:00.000Z",
            createdBy: { accountId: "user4", displayName: "Dev Sparrow" },
            lastModifiedBy: { accountId: "user4", displayName: "Dev Sparrow" },
            webUrl: "https://confluence.company.com/spaces/TECH/pages/page_devsparrow2",
            labels: ["synchronization", "integration", "best-practices", "cross-system", "enterprise"]
        },

        {
            id: "page_devsparrow3",
            title: "Mock Data System Enhancement - CCACB-11801",
            spaceKey: "PORTAEH",
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `<h1>Mock Data System Enhancement - CCACB-11801</h1>
<p><strong>Project:</strong> Mock Data System Optimization | <strong>Status:</strong> ✅ Completed | <strong>Issue:</strong> <a href="https://svil.bansel.it/jira/browse/CCACB-11801">CCACB-11801</a></p>

<h2>Project Summary</h2>
<p>Enhancement of the unified MCP server mock data system to provide more realistic testing scenarios with improved performance and cross-system data consistency.</p>

<h2>Achievements</h2>

<h3>Performance Improvements</h3>
<ul>
<li><strong>Initialization Time:</strong> Reduced from 2.3s to 1.4s (39% improvement)</li>
<li><strong>Query Performance:</strong> Cross-system queries improved from 450ms to 280ms (38% improvement)</li>
<li><strong>Memory Usage:</strong> Reduced memory footprint by 25%</li>
</ul>

<h3>Enhanced Data Quality</h3>
<ul>
<li><strong>Cross-System References:</strong> JIRA issues now automatically reference related Confluence pages</li>
<li><strong>Email-JIRA Linking:</strong> Outlook mock emails include realistic JIRA ticket references</li>
<li><strong>Calendar Integration:</strong> Meeting events correlated with project milestones</li>
<li><strong>User Consistency:</strong> Unified user data across all mock systems</li>
</ul>

<h2>Technical Implementation</h2>

<h3>Data Structure Optimization</h3>
<ac:structured-macro ac:name="code" ac:schema-version="1" ac:macro-id="data-structure">
<ac:parameter ac:name="language">javascript</ac:parameter>
<ac:plain-text-body><![CDATA[
// Optimized mock data structure with cross-references
const mockDataStructure = {
  users: [
    // Consistent users across all systems
    { id: "user1", name: "Abrar ul haq N", email: "abrar.ulhaq@example.com" },
    { id: "user2", name: "Dinesh Kumar M", email: "dinesh.kumar@example.com" },
    { id: "user3", name: "Mani S", email: "mani.s@example.com" },
    { id: "user4", name: "Dev Sparrow", email: "devsparrow84@outlook.com" }
  ],
  crossReferences: {
    // JIRA issues linked to Confluence pages
    "PORTAEH-3305": ["page_devsparrow1"],
    "CCACB-11801": ["page_devsparrow3"],
    // Emails linked to JIRA issues
    "email_devsparrow1": ["PORTAEH-3305"],
    // Calendar events linked to projects
    "event_devsparrow1": ["PORTAEH-3305"]
  }
};
]]></ac:plain-text-body>
</ac:structured-macro>

<h3>Performance Optimizations</h3>
<ol>
<li><strong>Lazy Loading:</strong> Mock data loaded on-demand to reduce startup time</li>
<li><strong>Indexing:</strong> Pre-computed indexes for frequently accessed data</li>
<li><strong>Caching:</strong> Intelligent caching of cross-system queries</li>
<li><strong>Memory Management:</strong> Optimized data structures to reduce memory usage</li>
</ol>

<h2>Testing Results</h2>

<h3>Before vs After Comparison</h3>
<ac:structured-macro ac:name="table" ac:schema-version="1">
<ac:parameter ac:name="sortable">true</ac:parameter>
<ac:rich-text-body>
<table>
<tr><th>Metric</th><th>Before</th><th>After</th><th>Improvement</th></tr>
<tr><td>Initialization Time</td><td>2.3s</td><td>1.4s</td><td>39%</td></tr>
<tr><td>Cross-System Queries</td><td>450ms</td><td>280ms</td><td>38%</td></tr>
<tr><td>Memory Usage</td><td>45MB</td><td>34MB</td><td>25%</td></tr>
<tr><td>Data Consistency Score</td><td>72%</td><td>95%</td><td>32%</td></tr>
</table>
</ac:rich-text-body>
</ac:structured-macro>

<h2>Implementation Details</h2>
<ul>
<li><strong>Cross-Reference Engine:</strong> Automatic linking between related data across systems</li>
<li><strong>Realistic Email Content:</strong> Generated emails reference actual JIRA issues and project activities</li>
<li><strong>Calendar Synchronization:</strong> Meeting events aligned with project timelines and milestones</li>
<li><strong>User Data Harmonization:</strong> Consistent user profiles across JIRA, Confluence, and Outlook mock data</li>
</ul>

<h2>Next Steps</h2>
<ul>
<li>✅ Document enhancements in technical guides</li>
<li>✅ Update team on new mock data capabilities</li>
<li>🔄 Monitor performance in development environment</li>
<li>📋 Plan additional enhancements based on user feedback</li>
</ul>

<h2>Related Documentation</h2>
<ul>
<li><a href="#page_devsparrow2">Cross-System Synchronization Best Practices</a></li>
<li><a href="https://confluence.company.com/spaces/TECH/pages/testing-guidelines">Testing Guidelines</a></li>
</ul>`
                }
            },
            version: { number: 1 },
            createdDate: "2025-11-02T16:00:00.000Z",
            lastModified: "2025-11-03T10:30:00.000Z",
            createdBy: { accountId: "user4", displayName: "Dev Sparrow" },
            lastModifiedBy: { accountId: "user4", displayName: "Dev Sparrow" },
            webUrl: "https://confluence.company.com/spaces/PORTAEH/pages/page_devsparrow3",
            labels: ["mock-data", "optimization", "testing", "performance", "ccacb-11801"]
        }
    ],

    // Search functionality
    searchResults: {
        bySpace: (spaceKey, query = "", maxResults = 25) => {
            let filtered = confluenceMockData.pages.filter(page => page.spaceKey === spaceKey);
            if (query) {
                filtered = filtered.filter(page =>
                    page.title.toLowerCase().includes(query.toLowerCase()) ||
                    page.body.storage.value.toLowerCase().includes(query.toLowerCase()) ||
                    page.labels.some(label => label.toLowerCase().includes(query.toLowerCase()))
                );
            }
            return {
                results: filtered.slice(0, maxResults),
                start: 0,
                limit: maxResults,
                size: filtered.length
            };
        },
        byText: (query, maxResults = 25) => {
            const filtered = confluenceMockData.pages.filter(page =>
                page.title.toLowerCase().includes(query.toLowerCase()) ||
                page.body.storage.value.toLowerCase().includes(query.toLowerCase()) ||
                page.labels.some(label => label.toLowerCase().includes(query.toLowerCase()))
            );
            return {
                results: filtered.slice(0, maxResults),
                start: 0,
                limit: maxResults,
                size: filtered.length
            };
        },
        byLabel: (label, maxResults = 25) => {
            const filtered = confluenceMockData.pages.filter(page =>
                page.labels.some(pageLabel => pageLabel.toLowerCase().includes(label.toLowerCase()))
            );
            return {
                results: filtered.slice(0, maxResults),
                start: 0,
                limit: maxResults,
                size: filtered.length
            };
        }
    },

    // Content templates
    templates: {
        technicalDoc: {
            title: "Technical Documentation Template",
            body: `<h1>{{title}}</h1>
<p>Brief description of the technical component or process.</p>

<h2>Overview</h2>
<p>High-level overview and purpose.</p>

<h2>Architecture</h2>
<p>Technical architecture and components.</p>

<h2>Implementation Details</h2>
<p>Step-by-step implementation guidance.</p>

<h2>Configuration</h2>
<p>Configuration parameters and settings.</p>

<h2>Troubleshooting</h2>
<p>Common issues and solutions.</p>`
        },
        processDoc: {
            title: "Process Documentation Template",
            body: `<h1>{{title}}</h1>
<p>Process overview and objectives.</p>

<h2>Scope</h2>
<p>What is covered by this process.</p>

<h2>Roles and Responsibilities</h2>
<p>Who is involved and their responsibilities.</p>

<h2>Process Steps</h2>
<ol>
<li>Step 1</li>
<li>Step 2</li>
<li>Step 3</li>
</ol>

<h2>Escalation Procedures</h2>
<p>When and how to escalate issues.</p>

<h2>Review and Updates</h2>
<p>Process review schedule and update procedures.</p>`
        }
    }
};

module.exports = confluenceMockData;