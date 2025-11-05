/**
 * JIRA Mock Data - Based on Real PORTAEH and CCACB Project Data
 * Generated from live JIRA instances for realistic development and testing
 * Users: Abrar ul haq N, Dinesh Kumar M, Mani S, Dev Sparrow
 * Projects: PORTAEH, CCACB
 */

const jiraMockData = {
    // Project configurations
    projects: {
        PORTAEH: {
            key: "PORTAEH",
            name: "PORTAEH Project",
            projectTypeKey: "software",
            id: "10001"
        },
        CCACB: {
            key: "CCACB",
            name: "CCACB Project",
            projectTypeKey: "software",
            id: "10002"
        }
    },

    // Issue types from real data
    issueTypes: [
        { id: "1", name: "Task", iconUrl: "https://svil.bansel.it/jira/images/icons/issuetypes/task.png" },
        { id: "2", name: "Bug", iconUrl: "https://svil.bansel.it/jira/images/icons/issuetypes/bug.png" },
        { id: "3", name: "Story", iconUrl: "https://svil.bansel.it/jira/images/icons/issuetypes/story.png" }
    ],

    // Status categories from real data
    statuses: [
        { id: "1", name: "Task Assigned", categoryKey: "new" },
        { id: "2", name: "Task In Progress", categoryKey: "indeterminate" },
        { id: "3", name: "Task On Hold", categoryKey: "indeterminate" },
        { id: "4", name: "Task Closed", categoryKey: "done" },
        { id: "5", name: "Task Cancelled", categoryKey: "done" },
        { id: "6", name: "Open", categoryKey: "new" },
        { id: "7", name: "Closed", categoryKey: "done" }
    ],

    // Priority levels from real data
    priorities: [
        { id: "1", name: "Highest", iconUrl: "https://svil.bansel.it/jira/images/icons/priorities/highest.svg" },
        { id: "2", name: "High", iconUrl: "https://svil.bansel.it/jira/images/icons/priorities/high.svg" },
        { id: "3", name: "Medium", iconUrl: "https://svil.bansel.it/jira/images/icons/priorities/medium.svg" },
        { id: "4", name: "Low", iconUrl: "https://svil.bansel.it/jira/images/icons/priorities/low.svg" },
        { id: "5", name: "Lowest", iconUrl: "https://svil.bansel.it/jira/images/icons/priorities/lowest.svg" }
    ],

    // Users from real data
    users: [
        {
            accountId: "user1",
            displayName: "Abrar ul haq N",
            emailAddress: "abrar.ulhaq@example.com",
            active: true,
            timeZone: "Europe/Rome"
        },
        {
            accountId: "user2",
            displayName: "Dinesh Kumar M",
            emailAddress: "dinesh.kumar@example.com",
            active: true,
            timeZone: "Europe/Rome"
        },
        {
            accountId: "user3",
            displayName: "Mani S",
            emailAddress: "mani.s@example.com",
            active: true,
            timeZone: "Europe/Rome"
        },
        {
            accountId: "user4",
            displayName: "Dev Sparrow",
            emailAddress: "devsparrow84@outlook.com",
            active: true,
            timeZone: "Europe/Rome"
        }
    ],

    // Mock issues based on real JIRA data
    issues: [
        // PORTAEH Issues (from Abrar ul haq N)
        {
            id: "10001",
            key: "PORTAEH-3231",
            summary: "EETL - MIDATAMODEL GG Implement Logic to send list of sources unavailable",
            description: "Implementation of logic to handle and send notifications for unavailable data sources in the ETL process for MIDATAMODEL GG component.",
            issueType: { id: "1", name: "Task" },
            status: { id: "1", name: "Task Assigned" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user1",
                displayName: "Abrar ul haq N"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "PORTAEH", name: "PORTAEH Project" },
            created: "2025-11-04T08:35:21.000+0100",
            updated: "2025-11-04T12:45:31.000+0100",
            resolutionDate: null,
            dueDate: null,
            labels: ["ETL", "MIDATAMODEL", "data-sources"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/PORTAEH-3231"
        },
        {
            id: "10002",
            key: "PORTAEH-3211",
            summary: "modify WF_COGE_DIMENSIONI",
            description: "Modifications required for the WF_COGE_DIMENSIONI workflow to handle new dimensional data processing requirements.",
            issueType: { id: "1", name: "Task" },
            status: { id: "3", name: "Task On Hold" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user1",
                displayName: "Abrar ul haq N"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "PORTAEH", name: "PORTAEH Project" },
            created: "2025-10-28T14:22:15.000+0100",
            updated: "2025-11-02T09:33:42.000+0100",
            resolutionDate: null,
            dueDate: null,
            labels: ["workflow", "COGE", "dimensions"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/PORTAEH-3211"
        },
        {
            id: "10003",
            key: "PORTAEH-3042",
            summary: "RG - move session",
            description: "Session migration task for RG component to handle new session management requirements.",
            issueType: { id: "1", name: "Task" },
            status: { id: "3", name: "Task On Hold" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user1",
                displayName: "Abrar ul haq N"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "PORTAEH", name: "PORTAEH Project" },
            created: "2025-09-15T11:18:33.000+0200",
            updated: "2025-10-20T16:27:19.000+0200",
            resolutionDate: null,
            dueDate: null,
            labels: ["RG", "session", "migration"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/PORTAEH-3042"
        },

        // CCACB Issues (from Dinesh Kumar M)
        {
            id: "10004",
            key: "CCACB-11894",
            summary: "Create New table DW_HS_GAG_STOCK_ESG_APE,DW_HS_GAG_STOCK_ESG_APE_MM for the issue CCACB-11445",
            description: "Database table creation task for ESG APE stock tracking tables including daily and monthly aggregation views.",
            issueType: { id: "1", name: "Task" },
            status: { id: "1", name: "Task Assigned" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user2",
                displayName: "Dinesh Kumar M"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "CCACB", name: "CCACB Project" },
            created: "2025-11-04T08:37:16.000+0100",
            updated: "2025-11-04T12:48:31.000+0100",
            resolutionDate: null,
            dueDate: null,
            labels: ["database", "ESG", "stock", "DW"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/CCACB-11894"
        },
        {
            id: "10005",
            key: "CCACB-11845",
            summary: "Add new columns in DW_HS_AR_TITOLARE_EFFETTIVO, DW_HS_AR_TITOLARE_EFFETTIVO_MM for the issue CCACB-11700",
            description: "Schema modification to add new columns for effective ownership tracking in both daily and monthly aggregation tables.",
            issueType: { id: "1", name: "Task" },
            status: { id: "1", name: "Task Assigned" },
            priority: { id: "1", name: "Highest" },
            assignee: {
                accountId: "user2",
                displayName: "Dinesh Kumar M"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "CCACB", name: "CCACB Project" },
            created: "2025-10-30T15:53:52.000+0100",
            updated: "2025-11-03T10:19:55.000+0100",
            resolutionDate: null,
            dueDate: null,
            labels: ["database", "schema", "ownership", "DW"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/CCACB-11845"
        },
        {
            id: "10006",
            key: "CCACB-11724",
            summary: "Create new table DW_HS_LIMITI_EM_TY_LO for the issue CCACB-11628",
            description: "New database table creation for electronic money limits tracking by type and location.",
            issueType: { id: "1", name: "Task" },
            status: { id: "2", name: "Task In Progress" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user2",
                displayName: "Dinesh Kumar M"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "CCACB", name: "CCACB Project" },
            created: "2025-10-15T15:46:26.000+0200",
            updated: "2025-10-31T03:27:22.000+0100",
            resolutionDate: null,
            dueDate: null,
            labels: ["database", "limits", "electronic-money", "DW"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/CCACB-11724"
        },

        // CCACB Issues (from Mani S)
        {
            id: "10007",
            key: "CCACB-11885",
            summary: "Add / Modify DQ Rule for the table DW_HS_SPC_AIRB_PP_PRODOTTO for the issue CCACB-11831",
            description: "Data quality rule modifications for AIRB product portfolio table to ensure compliance and data integrity.",
            issueType: { id: "1", name: "Task" },
            status: { id: "1", name: "Task Assigned" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user3",
                displayName: "Mani S"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "CCACB", name: "CCACB Project" },
            created: "2025-10-31T19:40:43.000+0100",
            updated: "2025-10-31T19:42:06.000+0100",
            resolutionDate: null,
            dueDate: null,
            labels: ["data-quality", "AIRB", "product", "DQ"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/CCACB-11885"
        },
        {
            id: "10008",
            key: "CCACB-11884",
            summary: "Add DU for the table DW_HS_AN_RAGGRUPPA_SOGG_GR_NEW for the issue CCACB-11835",
            description: "Data update procedures for new subject grouping table to handle analytical reporting requirements.",
            issueType: { id: "1", name: "Task" },
            status: { id: "1", name: "Task Assigned" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user3",
                displayName: "Mani S"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "CCACB", name: "CCACB Project" },
            created: "2025-10-31T19:30:32.000+0100",
            updated: "2025-10-31T19:35:23.000+0100",
            resolutionDate: null,
            dueDate: null,
            labels: ["data-update", "analytics", "grouping", "DU"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/CCACB-11884"
        },
        {
            id: "10009",
            key: "CCACB-11779",
            summary: "Create new table DW_HS_TIPILIMITIEMONEY for the issue CCACB-11623",
            description: "Database table creation for electronic money limit types to support new regulatory requirements.",
            issueType: { id: "1", name: "Task" },
            status: { id: "3", name: "Task On Hold" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user3",
                displayName: "Mani S"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "CCACB", name: "CCACB Project" },
            created: "2025-10-21T19:01:15.000+0200",
            updated: "2025-11-03T14:48:00.000+0100",
            resolutionDate: null,
            dueDate: null,
            labels: ["database", "limits", "electronic-money", "regulatory"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/CCACB-11779"
        },

        // Additional closed issues for variety
        {
            id: "10010",
            key: "PORTAEH-3001",
            summary: "Database migration completed for Q4 requirements",
            description: "Successfully completed database migration to support Q4 business requirements and reporting needs.",
            issueType: { id: "1", name: "Task" },
            status: { id: "4", name: "Task Closed" },
            priority: { id: "2", name: "High" },
            assignee: {
                accountId: "user1",
                displayName: "Abrar ul haq N"
            },
            reporter: {
                accountId: "system",
                displayName: "System Reporter"
            },
            project: { key: "PORTAEH", name: "PORTAEH Project" },
            created: "2025-10-01T09:00:00.000+0200",
            updated: "2025-10-15T17:30:00.000+0200",
            resolutionDate: "2025-10-15T17:30:00.000+0200",
            dueDate: "2025-10-15T23:59:59.000+0200",
            labels: ["database", "migration", "Q4"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/PORTAEH-3001"
        },

        // PORTAEH Issues (from Dev Sparrow)
        {
            id: "10021",
            key: "PORTAEH-3305",
            summary: "Email Integration API - Outlook Connection Module",
            description: "Develop and implement the Outlook email integration module for the unified MCP server. This includes OAuth authentication, email retrieval, and real-time synchronization with team planning systems.",
            issueType: { id: "1", name: "Task" },
            status: { id: "2", name: "Task In Progress" },
            priority: { id: "2", name: "High" },
            assignee: {
                accountId: "user4",
                displayName: "Dev Sparrow"
            },
            reporter: {
                accountId: "user2",
                displayName: "Dinesh Kumar M"
            },
            project: { key: "PORTAEH", name: "PORTAEH Project" },
            created: "2025-11-01T10:15:00.000+0100",
            updated: "2025-11-05T14:22:10.000+0100",
            resolutionDate: null,
            dueDate: "2025-11-15T23:59:59.000+0100",
            labels: ["email", "integration", "outlook", "api"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/PORTAEH-3305"
        },
        {
            id: "10022",
            key: "PORTAEH-3312",
            summary: "Cross-System Data Synchronization Enhancement",
            description: "Enhance the data synchronization mechanism between JIRA, Confluence, and Outlook systems to ensure real-time consistency across all platforms in the unified MCP server.",
            issueType: { id: "3", name: "Story" },
            status: { id: "1", name: "Task Assigned" },
            priority: { id: "3", name: "Medium" },
            assignee: {
                accountId: "user4",
                displayName: "Dev Sparrow"
            },
            reporter: {
                accountId: "user1",
                displayName: "Abrar ul haq N"
            },
            project: { key: "PORTAEH", name: "PORTAEH Project" },
            created: "2025-11-03T09:30:15.000+0100",
            updated: "2025-11-04T16:45:22.000+0100",
            resolutionDate: null,
            dueDate: "2025-11-20T23:59:59.000+0100",
            labels: ["synchronization", "cross-system", "enhancement"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/PORTAEH-3312"
        },

        // CCACB Issues (from Dev Sparrow)
        {
            id: "10023",
            key: "CCACB-11801",
            summary: "Mock Data System Optimization",
            description: "Optimize the mock data system for better performance and more realistic test scenarios. Include cross-references between JIRA, Confluence, and Outlook mock data.",
            issueType: { id: "1", name: "Task" },
            status: { id: "4", name: "Task Closed" },
            priority: { id: "4", name: "Low" },
            assignee: {
                accountId: "user4",
                displayName: "Dev Sparrow"
            },
            reporter: {
                accountId: "user4",
                displayName: "Dev Sparrow"
            },
            project: { key: "CCACB", name: "CCACB Project" },
            created: "2025-10-28T11:20:30.000+0100",
            updated: "2025-11-02T15:10:45.000+0100",
            resolutionDate: "2025-11-02T15:10:45.000+0100",
            dueDate: "2025-11-05T23:59:59.000+0100",
            labels: ["mock-data", "testing", "optimization"],
            components: [],
            fixVersions: [],
            webUrl: "https://svil.bansel.it/jira/browse/CCACB-11801"
        }
    ],

    // Search results templates
    searchResults: {
        byAssignee: (assigneeName, maxResults = 50) => {
            const filtered = jiraMockData.issues.filter(issue =>
                issue.assignee && issue.assignee.displayName.includes(assigneeName)
            );
            return {
                expand: "names,schema",
                startAt: 0,
                maxResults: maxResults,
                total: filtered.length,
                issues: filtered.slice(0, maxResults)
            };
        },
        byProject: (projectKey, maxResults = 50) => {
            const filtered = jiraMockData.issues.filter(issue =>
                issue.project.key === projectKey
            );
            return {
                expand: "names,schema",
                startAt: 0,
                maxResults: maxResults,
                total: filtered.length,
                issues: filtered.slice(0, maxResults)
            };
        },
        byStatus: (statusName, maxResults = 50) => {
            const filtered = jiraMockData.issues.filter(issue =>
                issue.status.name === statusName
            );
            return {
                expand: "names,schema",
                startAt: 0,
                maxResults: maxResults,
                total: filtered.length,
                issues: filtered.slice(0, maxResults)
            };
        }
    },

    // JQL query templates
    jqlTemplates: {
        activeTasksByAssignee: (assignee) => `assignee = "${assignee}" AND status IN ("Task Assigned", "Task In Progress", "Task On Hold") ORDER BY created DESC`,
        projectIssues: (project) => `project = "${project}" ORDER BY created DESC`,
        highPriorityOpen: () => `priority IN ("High", "Highest") AND status NOT IN ("Task Closed", "Task Cancelled") ORDER BY priority DESC, created DESC`,
        recentlyUpdated: () => `updated >= -7d ORDER BY updated DESC`
    }
};

module.exports = jiraMockData;
