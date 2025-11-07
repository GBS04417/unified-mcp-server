/**
 * Project and JIRA Integration Dataset
 * Maps employees to projects and JIRA issues based on organizational structure
 */

const projectsAndJiraData = {
    // Enhanced project definitions with realistic assignments
    projects: [
        {
            projectId: "STRATEGIC-2025",
            name: "Strategic Initiative 2025",
            description: "Company-wide strategic planning and execution",
            department: "Executive",
            lead: "EMP001", // Sarah Johnson - CEO
            members: ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"],
            status: "In Progress",
            priority: "Highest",
            startDate: "2025-01-01T00:00:00.000Z",
            endDate: "2025-12-31T00:00:00.000Z"
        },
        {
            projectId: "PORTAEH", // Existing from mock data
            name: "PORTAEH Project",
            description: "Enterprise data integration and ETL optimization project",
            department: "Data Management",
            lead: "EMP006", // Robert Wilson - PM
            members: ["EMP006", "GBS04417", "EMP031", "EMP032", "EMP033", "EMP034"],
            status: "In Progress",
            priority: "High",
            startDate: "2024-10-01T00:00:00.000Z",
            endDate: "2025-06-30T00:00:00.000Z"
        },
        {
            projectId: "CCACB", // Existing from mock data
            name: "CCACB Project",
            description: "Database architecture modernization and table creation",
            department: "Data Management",
            lead: "EMP007", // Amanda Rodriguez - PM
            members: ["EMP007", "EMP015", "EMP035", "EMP036", "EMP037", "EMP038"],
            status: "In Progress",
            priority: "High",
            startDate: "2024-09-15T00:00:00.000Z",
            endDate: "2025-05-31T00:00:00.000Z"
        },
        {
            projectId: "DATA-GOVERNANCE-2025",
            name: "Data Governance Framework 2025",
            description: "Comprehensive data governance and compliance framework",
            department: "Data Management",
            lead: "EMP008", // James Parker - PM
            members: ["EMP008", "EMP019", "EMP049", "EMP050", "EMP051"],
            status: "Planning",
            priority: "Medium",
            startDate: "2025-02-01T00:00:00.000Z",
            endDate: "2025-08-31T00:00:00.000Z"
        },
        {
            projectId: "MICROSERVICES-MIGRATION",
            name: "Microservices Architecture Migration",
            description: "Migration from monolithic to microservices architecture",
            department: "IT Architecture",
            lead: "EMP009", // Kevin Zhang - PM
            members: ["EMP009", "EMP021", "EMP022", "EMP055", "EMP056", "EMP057", "EMP058", "EMP059", "EMP060", "EMP061"],
            status: "In Progress",
            priority: "High",
            startDate: "2024-11-01T00:00:00.000Z",
            endDate: "2025-09-30T00:00:00.000Z"
        },
        {
            projectId: "CLOUD-NATIVE-APPS",
            name: "Cloud Native Application Development",
            description: "Development of cloud-native applications and services",
            department: "IT Architecture",
            lead: "EMP010", // Rachel Green - PM
            members: ["EMP010", "EMP024", "EMP025", "EMP064", "EMP065", "EMP066", "EMP067", "EMP068"],
            status: "In Progress",
            priority: "Medium",
            startDate: "2025-01-15T00:00:00.000Z",
            endDate: "2025-07-31T00:00:00.000Z"
        },
        {
            projectId: "INFRASTRUCTURE-2025",
            name: "Infrastructure Modernization 2025",
            description: "Complete infrastructure overhaul and modernization",
            department: "IT Operations",
            lead: "EMP011", // Thomas Anderson - PM
            members: ["EMP011", "EMP026", "EMP027", "EMP069", "EMP070", "EMP071", "EMP072", "EMP073"],
            status: "In Progress",
            priority: "High",
            startDate: "2024-12-01T00:00:00.000Z",
            endDate: "2025-11-30T00:00:00.000Z"
        },
        {
            projectId: "MONITORING-UPGRADE",
            name: "Monitoring and Alerting System Upgrade",
            description: "Comprehensive monitoring system modernization",
            department: "IT Operations",
            lead: "EMP012", // Maria Gonzalez - PM
            members: ["EMP012", "EMP028", "EMP029", "EMP074", "EMP075", "EMP076", "EMP077", "EMP078"],
            status: "Planning",
            priority: "Medium",
            startDate: "2025-03-01T00:00:00.000Z",
            endDate: "2025-10-31T00:00:00.000Z"
        },
        {
            projectId: "SECURITY-COMPLIANCE",
            name: "Security and Compliance Framework",
            description: "Enhanced security framework and compliance management",
            department: "IT Operations",
            lead: "EMP013", // Daniel Lee - PM
            members: ["EMP013", "EMP030", "EMP079", "EMP080", "EMP081"],
            status: "In Progress",
            priority: "Highest",
            startDate: "2024-10-15T00:00:00.000Z",
            endDate: "2025-08-15T00:00:00.000Z"
        }
    ],

    // Expanded JIRA issues with realistic distribution
    jiraIssues: [
        // PORTAEH Project Issues (continuing existing pattern)
        {
            key: "PORTAEH-3305", // Existing from mock data
            summary: "Outlook Integration Module - Progress Update",
            assignee: "EMP021", // Dev Sparrow
            reporter: "EMP006", // Robert Wilson
            project: "PORTAEH",
            issueType: "Task",
            status: "In Progress",
            priority: "High",
            created: "2025-10-15T00:00:00.000Z",
            updated: "2025-11-05T00:00:00.000Z",
            dueDate: "2025-11-20T00:00:00.000Z",
            labels: ["integration", "outlook", "api", "progress-update"]
        },
        {
            key: "PORTAEH-3231", // Existing from mock data
            summary: "ETL Source Unavailable Alert",
            assignee: "GBS04417", // Abrar ul haq N
            reporter: "EMP089", // System Admin
            project: "PORTAEH",
            issueType: "Bug",
            status: "Open",
            priority: "Highest",
            created: "2025-11-04T00:00:00.000Z",
            updated: "2025-11-04T00:00:00.000Z",
            dueDate: "2025-11-06T00:00:00.000Z",
            labels: ["etl", "critical", "system-alert", "data-pipeline"]
        },
        {
            key: "PORTAEH-3340",
            summary: "Data Pipeline Performance Optimization",
            assignee: "EMP031", // Priya Sharma
            reporter: "GBS04417", // Abrar ul haq N
            project: "PORTAEH",
            issueType: "Task",
            status: "Task Assigned",
            priority: "Medium",
            created: "2025-11-01T00:00:00.000Z",
            updated: "2025-11-03T00:00:00.000Z",
            dueDate: "2025-11-25T00:00:00.000Z",
            labels: ["performance", "optimization", "data-pipeline", "etl"]
        },
        {
            key: "PORTAEH-3341",
            summary: "Real-time Data Streaming Implementation",
            assignee: "EMP032", // Raj Patel
            reporter: "EMP006", // Robert Wilson
            project: "PORTAEH",
            issueType: "Story",
            status: "Task In Progress",
            priority: "High",
            created: "2025-10-28T00:00:00.000Z",
            updated: "2025-11-02T00:00:00.000Z",
            dueDate: "2025-12-01T00:00:00.000Z",
            labels: ["streaming", "real-time", "kafka", "data-processing"]
        },

        // CCACB Project Issues (continuing existing pattern)
        {
            key: "CCACB-11845", // Existing from mock data
            summary: "Add new columns in DW_HS_AR_TITOLARE_EFFETTIVO, DW_HS_AR_TITOLARE_EFFETTIVO_MM for the issue CCACB-11700",
            assignee: "EMP015", // Dinesh Kumar M
            reporter: "EMP007", // Amanda Rodriguez
            project: "CCACB",
            issueType: "Task",
            status: "Task Assigned",
            priority: "Highest",
            created: "2025-10-30T00:00:00.000Z",
            updated: "2025-11-03T00:00:00.000Z",
            dueDate: "2025-11-15T00:00:00.000Z",
            labels: ["database", "schema", "ownership", "DW"]
        },
        {
            key: "CCACB-11894", // Existing from mock data
            summary: "Create New table DW_HS_GAG_STOCK_ESG_APE,DW_HS_GAG_STOCK_ESG_APE_MM for the issue CCACB-11445",
            assignee: "EMP015", // Dinesh Kumar M
            reporter: "EMP007", // Amanda Rodriguez
            project: "CCACB",
            issueType: "Task",
            status: "Task Assigned",
            priority: "Medium",
            created: "2025-11-04T00:00:00.000Z",
            updated: "2025-11-04T00:00:00.000Z",
            dueDate: "2025-11-30T00:00:00.000Z",
            labels: ["database", "ESG", "stock", "DW"]
        },
        {
            key: "CCACB-11724", // Existing from mock data
            summary: "Create new table DW_HS_LIMITI_EM_TY_LO for the issue CCACB-11628",
            assignee: "EMP015", // Dinesh Kumar M
            reporter: "EMP007", // Amanda Rodriguez
            project: "CCACB",
            issueType: "Task",
            status: "Task In Progress",
            priority: "Medium",
            created: "2025-10-15T00:00:00.000Z",
            updated: "2025-10-31T00:00:00.000Z",
            dueDate: "2025-11-10T00:00:00.000Z",
            labels: ["database", "limits", "electronic-money", "DW"]
        },
        {
            key: "CCACB-11950",
            summary: "Database Performance Tuning for ESG Tables",
            assignee: "EMP037", // Kamesh Reddy
            reporter: "EMP015", // Dinesh Kumar M
            project: "CCACB",
            issueType: "Task",
            status: "Task Assigned",
            priority: "Medium",
            created: "2025-11-02T00:00:00.000Z",
            updated: "2025-11-04T00:00:00.000Z",
            dueDate: "2025-12-05T00:00:00.000Z",
            labels: ["performance", "database", "tuning", "ESG"]
        },

        // Microservices Migration Issues
        {
            key: "ARCH-1001",
            summary: "API Gateway Implementation",
            assignee: "EMP055", // Megan Clark
            reporter: "EMP021", // Dev Sparrow
            project: "MICROSERVICES-MIGRATION",
            issueType: "Story",
            status: "Task In Progress",
            priority: "High",
            created: "2025-10-20T00:00:00.000Z",
            updated: "2025-11-01T00:00:00.000Z",
            dueDate: "2025-11-30T00:00:00.000Z",
            labels: ["api-gateway", "microservices", "integration"]
        },
        {
            key: "ARCH-1002",
            summary: "Service Registry and Discovery",
            assignee: "EMP056", // Jacob Rodriguez
            reporter: "EMP022", // Emily Carter
            project: "MICROSERVICES-MIGRATION",
            issueType: "Task",
            status: "Task Assigned",
            priority: "High",
            created: "2025-10-25T00:00:00.000Z",
            updated: "2025-11-02T00:00:00.000Z",
            dueDate: "2025-12-10T00:00:00.000Z",
            labels: ["service-registry", "discovery", "architecture"]
        },

        // Infrastructure Issues
        {
            key: "INFRA-2001",
            summary: "Network Infrastructure Upgrade",
            assignee: "EMP069", // Laura Carter
            reporter: "EMP026", // Patricia Davis
            project: "INFRASTRUCTURE-2025",
            issueType: "Task",
            status: "Task In Progress",
            priority: "High",
            created: "2025-10-18T00:00:00.000Z",
            updated: "2025-11-01T00:00:00.000Z",
            dueDate: "2025-12-15T00:00:00.000Z",
            labels: ["network", "infrastructure", "upgrade"]
        },
        {
            key: "INFRA-2002",
            summary: "Server Virtualization Migration",
            assignee: "EMP070", // Kevin Mitchell
            reporter: "EMP011", // Thomas Anderson
            project: "INFRASTRUCTURE-2025",
            issueType: "Story",
            status: "Task Assigned",
            priority: "Medium",
            created: "2025-10-22T00:00:00.000Z",
            updated: "2025-11-03T00:00:00.000Z",
            dueDate: "2025-12-20T00:00:00.000Z",
            labels: ["virtualization", "migration", "vmware"]
        },

        // Security Issues
        {
            key: "SEC-3001",
            summary: "Zero Trust Architecture Implementation",
            assignee: "EMP064", // Raymond Scott
            reporter: "EMP024", // Sandra Liu
            project: "SECURITY-COMPLIANCE",
            issueType: "Story",
            status: "Task In Progress",
            priority: "Highest",
            created: "2025-10-16T00:00:00.000Z",
            updated: "2025-11-04T00:00:00.000Z",
            dueDate: "2025-11-30T00:00:00.000Z",
            labels: ["zero-trust", "security", "architecture"]
        },
        {
            key: "SEC-3002",
            summary: "Security Incident Response Plan Update",
            assignee: "EMP080", // Wayne Morris
            reporter: "EMP030", // Helen Zhang
            project: "SECURITY-COMPLIANCE",
            issueType: "Task",
            status: "Task Assigned",
            priority: "High",
            created: "2025-10-28T00:00:00.000Z",
            updated: "2025-11-02T00:00:00.000Z",
            dueDate: "2025-11-25T00:00:00.000Z",
            labels: ["incident-response", "security", "procedures"]
        }
    ],

    // Employee workload distribution (tasks per employee)
    employeeWorkloads: {
        // Leadership (1-2 strategic tasks)
        "EMP001": { totalTasks: 2, inProgress: 1, assigned: 1, completed: 0 }, // CEO
        "EMP002": { totalTasks: 2, inProgress: 1, assigned: 1, completed: 0 }, // CTO

        // BU Managers (2-3 oversight tasks)
        "EMP003": { totalTasks: 3, inProgress: 2, assigned: 1, completed: 0 }, // Data Management
        "EMP004": { totalTasks: 3, inProgress: 1, assigned: 2, completed: 0 }, // IT Architecture
        "EMP005": { totalTasks: 2, inProgress: 1, assigned: 1, completed: 0 }, // IT Operations

        // Project Managers (3-4 project tasks)
        "EMP006": { totalTasks: 4, inProgress: 2, assigned: 2, completed: 0 }, // PORTAEH PM
        "EMP007": { totalTasks: 4, inProgress: 2, assigned: 2, completed: 0 }, // CCACB PM
        "EMP008": { totalTasks: 3, inProgress: 1, assigned: 2, completed: 0 }, // Data Governance PM
        "EMP009": { totalTasks: 4, inProgress: 2, assigned: 2, completed: 0 }, // Microservices PM
        "EMP010": { totalTasks: 3, inProgress: 1, assigned: 2, completed: 0 }, // Cloud Native PM
        "EMP011": { totalTasks: 4, inProgress: 2, assigned: 2, completed: 0 }, // Infrastructure PM
        "EMP012": { totalTasks: 3, inProgress: 1, assigned: 2, completed: 0 }, // Monitoring PM
        "EMP013": { totalTasks: 3, inProgress: 2, assigned: 1, completed: 0 }, // Security PM

        // Team Leads (4-5 technical tasks)
        "GBS04417": { totalTasks: 5, inProgress: 2, assigned: 3, completed: 0 }, // Abrar - ETL Lead
        "EMP015": { totalTasks: 5, inProgress: 1, assigned: 4, completed: 0 }, // Dinesh - DB Lead  
        "EMP016": { totalTasks: 4, inProgress: 2, assigned: 2, completed: 0 }, // Mani - DQ Lead
        "EMP021": { totalTasks: 5, inProgress: 2, assigned: 3, completed: 0 }, // Dev Sparrow - Integration Lead

        // Team Members (2-3 individual tasks)
        "EMP031": { totalTasks: 3, inProgress: 1, assigned: 2, completed: 0 }, // Priya - Data Engineer
        "EMP032": { totalTasks: 3, inProgress: 1, assigned: 2, completed: 0 }, // Raj - Data Engineer
        "EMP035": { totalTasks: 2, inProgress: 1, assigned: 1, completed: 0 }, // Suresh - DBA
        "EMP037": { totalTasks: 2, inProgress: 0, assigned: 2, completed: 0 }, // Kamesh - DBA
        "EMP055": { totalTasks: 3, inProgress: 1, assigned: 2, completed: 0 }, // Megan - Integration Dev
        "EMP056": { totalTasks: 2, inProgress: 0, assigned: 2, completed: 0 }, // Jacob - Integration Dev
        "EMP064": { totalTasks: 3, inProgress: 1, assigned: 2, completed: 0 }, // Raymond - Security
        "EMP069": { totalTasks: 2, inProgress: 1, assigned: 1, completed: 0 }, // Laura - Infrastructure
        "EMP070": { totalTasks: 2, inProgress: 0, assigned: 2, completed: 0 }, // Kevin - Infrastructure
        "EMP080": { totalTasks: 2, inProgress: 0, assigned: 2, completed: 0 }  // Wayne - Security
    }
};

module.exports = projectsAndJiraData;