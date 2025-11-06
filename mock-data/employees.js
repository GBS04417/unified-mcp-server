/**
 * Comprehensive Employee Dataset for Unified MCP Server
 * 
 * Organizational Structure:
 * - 1 CEO
 * - 1 CTO  
 * - 3 BU Managers (Data Management, IT Architecture, IT Operations)
 * - 8 Project Managers (distributed across BUs)
 * - 15 Team Leads (2-3 per PM)
 * - 60 Team Members (4-5 per team lead)
 * - 2 Admin users
 * 
 * Total: 90 employees
 */

const organizationData = {
    // CEO Level
    employees: [
        {
            employeeId: "EMP001",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            role: "CEO",
            department: "Executive",
            reportsTo: null,
            directReports: ["EMP002"],
            projectIds: ["STRATEGIC-2025", "BOARD-OVERSIGHT"],
            skillSet: ["Strategic Leadership", "Corporate Governance", "Business Development"],
            location: "New York, NY",
            timezone: "America/New_York",
            startDate: "2020-01-15T00:00:00.000Z"
        },

        // CTO Level
        {
            employeeId: "EMP002",
            name: "Michael Chen",
            email: "michael.chen@company.com",
            role: "CTO",
            department: "Technology",
            reportsTo: "EMP001",
            directReports: ["EMP003", "EMP004", "EMP005"],
            projectIds: ["TECH-STRATEGY-2025", "PLATFORM-MODERNIZATION"],
            skillSet: ["Technology Strategy", "Enterprise Architecture", "Cloud Platforms", "AI/ML"],
            location: "San Francisco, CA",
            timezone: "America/Los_Angeles",
            startDate: "2020-03-10T00:00:00.000Z"
        },

        // BU Managers (3)
        {
            employeeId: "EMP003",
            name: "Jennifer Martinez",
            email: "jennifer.martinez@company.com",
            role: "BU_MANAGER",
            department: "Data Management",
            reportsTo: "EMP002",
            directReports: ["EMP006", "EMP007", "EMP008"],
            projectIds: ["DATA-GOVERNANCE-2025", "DW-MODERNIZATION"],
            skillSet: ["Data Strategy", "Data Governance", "Analytics", "ETL Processes"],
            location: "Austin, TX",
            timezone: "America/Chicago",
            startDate: "2021-02-01T00:00:00.000Z"
        },
        {
            employeeId: "EMP004",
            name: "David Kim",
            email: "david.kim@company.com",
            role: "BU_MANAGER",
            department: "IT Architecture",
            reportsTo: "EMP002",
            directReports: ["EMP009", "EMP010"],
            projectIds: ["ARCH-EVOLUTION", "MICROSERVICES-MIGRATION"],
            skillSet: ["Solution Architecture", "Cloud Architecture", "Microservices", "DevOps"],
            location: "Seattle, WA",
            timezone: "America/Los_Angeles",
            startDate: "2020-11-15T00:00:00.000Z"
        },
        {
            employeeId: "EMP005",
            name: "Lisa Thompson",
            email: "lisa.thompson@company.com",
            role: "BU_MANAGER",
            department: "IT Operations",
            reportsTo: "EMP002",
            directReports: ["EMP011", "EMP012", "EMP013"],
            projectIds: ["INFRASTRUCTURE-2025", "MONITORING-UPGRADE"],
            skillSet: ["Infrastructure Management", "Cloud Operations", "Security", "Monitoring"],
            location: "Denver, CO",
            timezone: "America/Denver",
            startDate: "2021-04-20T00:00:00.000Z"
        },

        // Project Managers (8 total, distributed across BUs)
        // Data Management BU - 3 PMs
        {
            employeeId: "EMP006",
            name: "Robert Wilson",
            email: "robert.wilson@company.com",
            role: "PROJECT_MANAGER",
            department: "Data Management",
            reportsTo: "EMP003",
            directReports: ["EMP014", "EMP015", "EMP016"],
            projectIds: ["PORTAEH", "DATA-PIPELINE-V2"],
            skillSet: ["Project Management", "Agile", "Data Projects", "Stakeholder Management"],
            location: "Austin, TX",
            timezone: "America/Chicago",
            startDate: "2021-06-15T00:00:00.000Z"
        },
        {
            employeeId: "EMP007",
            name: "Amanda Rodriguez",
            email: "amanda.rodriguez@company.com",
            role: "PROJECT_MANAGER",
            department: "Data Management",
            reportsTo: "EMP003",
            directReports: ["EMP017", "EMP018"],
            projectIds: ["CCACB", "ANALYTICS-PLATFORM"],
            skillSet: ["Project Management", "Scrum Master", "Data Analytics", "Business Intelligence"],
            location: "Chicago, IL",
            timezone: "America/Chicago",
            startDate: "2022-01-10T00:00:00.000Z"
        },
        {
            employeeId: "EMP008",
            name: "James Parker",
            email: "james.parker@company.com",
            role: "PROJECT_MANAGER",
            department: "Data Management",
            reportsTo: "EMP003",
            directReports: ["EMP019", "EMP020"],
            projectIds: ["DATA-QUALITY-INITIATIVE", "MDM-PROJECT"],
            skillSet: ["Project Management", "Data Quality", "Master Data Management", "Governance"],
            location: "Austin, TX",
            timezone: "America/Chicago",
            startDate: "2022-03-15T00:00:00.000Z"
        },

        // IT Architecture BU - 2 PMs  
        {
            employeeId: "EMP009",
            name: "Kevin Zhang",
            email: "kevin.zhang@company.com",
            role: "PROJECT_MANAGER",
            department: "IT Architecture",
            reportsTo: "EMP004",
            directReports: ["EMP021", "EMP022", "EMP023"],
            projectIds: ["MICROSERVICES-MIGRATION", "API-GATEWAY"],
            skillSet: ["Technical Project Management", "Architecture", "API Management", "Integration"],
            location: "Seattle, WA",
            timezone: "America/Los_Angeles",
            startDate: "2021-09-20T00:00:00.000Z"
        },
        {
            employeeId: "EMP010",
            name: "Rachel Green",
            email: "rachel.green@company.com",
            role: "PROJECT_MANAGER",
            department: "IT Architecture",
            reportsTo: "EMP004",
            directReports: ["EMP024", "EMP025"],
            projectIds: ["CLOUD-NATIVE-APPS", "SECURITY-FRAMEWORK"],
            skillSet: ["Cloud Project Management", "Security Architecture", "DevSecOps", "Compliance"],
            location: "Portland, OR",
            timezone: "America/Los_Angeles",
            startDate: "2022-05-01T00:00:00.000Z"
        },

        // IT Operations BU - 3 PMs
        {
            employeeId: "EMP011",
            name: "Thomas Anderson",
            email: "thomas.anderson@company.com",
            role: "PROJECT_MANAGER",
            department: "IT Operations",
            reportsTo: "EMP005",
            directReports: ["EMP026", "EMP027"],
            projectIds: ["INFRASTRUCTURE-2025", "DISASTER-RECOVERY"],
            skillSet: ["Infrastructure Projects", "Disaster Recovery", "Business Continuity", "Risk Management"],
            location: "Denver, CO",
            timezone: "America/Denver",
            startDate: "2021-07-12T00:00:00.000Z"
        },
        {
            employeeId: "EMP012",
            name: "Maria Gonzalez",
            email: "maria.gonzalez@company.com",
            role: "PROJECT_MANAGER",
            department: "IT Operations",
            reportsTo: "EMP005",
            directReports: ["EMP028", "EMP029"],
            projectIds: ["MONITORING-UPGRADE", "AUTOMATION-INITIATIVE"],
            skillSet: ["Operations Management", "Monitoring", "Automation", "Performance Optimization"],
            location: "Phoenix, AZ",
            timezone: "America/Phoenix",
            startDate: "2022-02-28T00:00:00.000Z"
        },
        {
            employeeId: "EMP013",
            name: "Daniel Lee",
            email: "daniel.lee@company.com",
            role: "PROJECT_MANAGER",
            department: "IT Operations",
            reportsTo: "EMP005",
            directReports: ["EMP030"],
            projectIds: ["SECURITY-COMPLIANCE", "BACKUP-MODERNIZATION"],
            skillSet: ["Security Projects", "Compliance Management", "Backup Systems", "Audit Management"],
            location: "Salt Lake City, UT",
            timezone: "America/Denver",
            startDate: "2022-08-15T00:00:00.000Z"
        },

        // Team Leads (15 total, 2-3 per PM)
        // Under Robert Wilson (EMP006) - Data Management
        {
            employeeId: "EMP014",
            name: "Abrar ul haq N", // Existing from mock data
            email: "abrar.ulhaq@company.com",
            role: "TEAM_LEAD",
            department: "Data Engineering",
            reportsTo: "EMP006",
            directReports: ["EMP031", "EMP032", "EMP033", "EMP034"],
            projectIds: ["PORTAEH", "ETL-OPTIMIZATION"],
            skillSet: ["ETL Development", "Data Engineering", "Python", "SQL", "Apache Spark"],
            location: "Austin, TX",
            timezone: "America/Chicago",
            startDate: "2022-04-01T00:00:00.000Z"
        },
        {
            employeeId: "EMP015",
            name: "Dinesh Kumar M", // Existing from mock data
            email: "dinesh.kumar@company.com",
            role: "TEAM_LEAD",
            department: "Database Administration",
            reportsTo: "EMP006",
            directReports: ["EMP035", "EMP036", "EMP037", "EMP038"],
            projectIds: ["CCACB", "DATABASE-MODERNIZATION"],
            skillSet: ["Database Architecture", "Oracle", "PostgreSQL", "Database Performance", "Data Modeling"],
            location: "Chennai, India",
            timezone: "Asia/Kolkata",
            startDate: "2021-10-15T00:00:00.000Z"
        },
        {
            employeeId: "EMP016",
            name: "Mani S", // Existing from mock data
            email: "mani.s@company.com",
            role: "TEAM_LEAD",
            department: "Data Quality",
            reportsTo: "EMP006",
            directReports: ["EMP039", "EMP040", "EMP041"],
            projectIds: ["DATA-QUALITY-INITIATIVE", "DATA-VALIDATION"],
            skillSet: ["Data Quality", "Data Validation", "Testing", "Quality Assurance", "Metrics"],
            location: "Bangalore, India",
            timezone: "Asia/Kolkata",
            startDate: "2022-01-20T00:00:00.000Z"
        },

        // Under Amanda Rodriguez (EMP007) - Data Management  
        {
            employeeId: "EMP017",
            name: "Jennifer Wu",
            email: "jennifer.wu@company.com",
            role: "TEAM_LEAD",
            department: "Business Intelligence",
            reportsTo: "EMP007",
            directReports: ["EMP042", "EMP043", "EMP044", "EMP045"],
            projectIds: ["ANALYTICS-PLATFORM", "BI-DASHBOARD"],
            skillSet: ["Business Intelligence", "Tableau", "Power BI", "Data Visualization", "Analytics"],
            location: "Chicago, IL",
            timezone: "America/Chicago",
            startDate: "2022-06-10T00:00:00.000Z"
        },
        {
            employeeId: "EMP018",
            name: "Carlos Mendoza",
            email: "carlos.mendoza@company.com",
            role: "TEAM_LEAD",
            department: "Data Science",
            reportsTo: "EMP007",
            directReports: ["EMP046", "EMP047", "EMP048"],
            projectIds: ["ML-PLATFORM", "PREDICTIVE-ANALYTICS"],
            skillSet: ["Data Science", "Machine Learning", "Python", "R", "Statistical Analysis"],
            location: "Miami, FL",
            timezone: "America/New_York",
            startDate: "2022-09-05T00:00:00.000Z"
        },

        // Under James Parker (EMP008) - Data Management
        {
            employeeId: "EMP019",
            name: "Susan Taylor",
            email: "susan.taylor@company.com",
            role: "TEAM_LEAD",
            department: "Data Governance",
            reportsTo: "EMP008",
            directReports: ["EMP049", "EMP050", "EMP051"],
            projectIds: ["DATA-GOVERNANCE-2025", "PRIVACY-COMPLIANCE"],
            skillSet: ["Data Governance", "Data Privacy", "Compliance", "Policy Management", "GDPR"],
            location: "Boston, MA",
            timezone: "America/New_York",
            startDate: "2022-11-15T00:00:00.000Z"
        },
        {
            employeeId: "EMP020",
            name: "Andrew Kim",
            email: "andrew.kim@company.com",
            role: "TEAM_LEAD",
            department: "Master Data Management",
            reportsTo: "EMP008",
            directReports: ["EMP052", "EMP053", "EMP054"],
            projectIds: ["MDM-PROJECT", "REFERENCE-DATA"],
            skillSet: ["Master Data Management", "Data Integration", "Data Stewardship", "Data Quality"],
            location: "Dallas, TX",
            timezone: "America/Chicago",
            startDate: "2023-01-08T00:00:00.000Z"
        },

        // Under Kevin Zhang (EMP009) - IT Architecture
        {
            employeeId: "EMP021",
            name: "Dev Sparrow", // Existing from mock data
            email: "devsparrow84@outlook.com",
            role: "TEAM_LEAD",
            department: "Integration Development",
            reportsTo: "EMP009",
            directReports: ["EMP055", "EMP056", "EMP057", "EMP058"],
            projectIds: ["API-GATEWAY", "INTEGRATION-HUB"],
            skillSet: ["Integration Development", "API Design", "Microservices", "Node.js", "REST APIs"],
            location: "Seattle, WA",
            timezone: "America/Los_Angeles",
            startDate: "2021-12-01T00:00:00.000Z"
        },
        {
            employeeId: "EMP022",
            name: "Emily Carter",
            email: "emily.carter@company.com",
            role: "TEAM_LEAD",
            department: "Solution Architecture",
            reportsTo: "EMP009",
            directReports: ["EMP059", "EMP060", "EMP061"],
            projectIds: ["MICROSERVICES-MIGRATION", "ARCHITECTURE-STANDARDS"],
            skillSet: ["Solution Architecture", "Enterprise Architecture", "Design Patterns", "Technical Leadership"],
            location: "San Francisco, CA",
            timezone: "America/Los_Angeles",
            startDate: "2022-02-14T00:00:00.000Z"
        },
        {
            employeeId: "EMP023",
            name: "Mark Johnson",
            email: "mark.johnson@company.com",
            role: "TEAM_LEAD",
            department: "Platform Engineering",
            reportsTo: "EMP009",
            directReports: ["EMP062", "EMP063"],
            projectIds: ["PLATFORM-MODERNIZATION", "CONTAINER-PLATFORM"],
            skillSet: ["Platform Engineering", "Kubernetes", "Docker", "CI/CD", "Infrastructure as Code"],
            location: "Portland, OR",
            timezone: "America/Los_Angeles",
            startDate: "2022-07-18T00:00:00.000Z"
        },

        // Under Rachel Green (EMP010) - IT Architecture
        {
            employeeId: "EMP024",
            name: "Sandra Liu",
            email: "sandra.liu@company.com",
            role: "TEAM_LEAD",
            department: "Security Architecture",
            reportsTo: "EMP010",
            directReports: ["EMP064", "EMP065", "EMP066"],
            projectIds: ["SECURITY-FRAMEWORK", "ZERO-TRUST"],
            skillSet: ["Security Architecture", "Cybersecurity", "Zero Trust", "Identity Management", "Compliance"],
            location: "Portland, OR",
            timezone: "America/Los_Angeles",
            startDate: "2022-10-03T00:00:00.000Z"
        },
        {
            employeeId: "EMP025",
            name: "Brian Mitchell",
            email: "brian.mitchell@company.com",
            role: "TEAM_LEAD",
            department: "Cloud Architecture",
            reportsTo: "EMP010",
            directReports: ["EMP067", "EMP068"],
            projectIds: ["CLOUD-NATIVE-APPS", "MULTI-CLOUD"],
            skillSet: ["Cloud Architecture", "AWS", "Azure", "GCP", "Serverless", "Cloud Security"],
            location: "Vancouver, BC",
            timezone: "America/Los_Angeles",
            startDate: "2023-01-30T00:00:00.000Z"
        },

        // Under Thomas Anderson (EMP011) - IT Operations
        {
            employeeId: "EMP026",
            name: "Patricia Davis",
            email: "patricia.davis@company.com",
            role: "TEAM_LEAD",
            department: "Infrastructure Operations",
            reportsTo: "EMP011",
            directReports: ["EMP069", "EMP070", "EMP071"],
            projectIds: ["INFRASTRUCTURE-2025", "NETWORK-UPGRADE"],
            skillSet: ["Infrastructure Operations", "Network Management", "System Administration", "Virtualization"],
            location: "Denver, CO",
            timezone: "America/Denver",
            startDate: "2022-04-25T00:00:00.000Z"
        },
        {
            employeeId: "EMP027",
            name: "Richard Brown",
            email: "richard.brown@company.com",
            role: "TEAM_LEAD",
            department: "Disaster Recovery",
            reportsTo: "EMP011",
            directReports: ["EMP072", "EMP073"],
            projectIds: ["DISASTER-RECOVERY", "BACKUP-STRATEGY"],
            skillSet: ["Disaster Recovery", "Business Continuity", "Backup Systems", "Recovery Planning"],
            location: "Colorado Springs, CO",
            timezone: "America/Denver",
            startDate: "2022-08-22T00:00:00.000Z"
        },

        // Under Maria Gonzalez (EMP012) - IT Operations
        {
            employeeId: "EMP028",
            name: "Nancy Wilson",
            email: "nancy.wilson@company.com",
            role: "TEAM_LEAD",
            department: "Monitoring & Performance",
            reportsTo: "EMP012",
            directReports: ["EMP074", "EMP075", "EMP076"],
            projectIds: ["MONITORING-UPGRADE", "PERFORMANCE-OPTIMIZATION"],
            skillSet: ["System Monitoring", "Performance Tuning", "Analytics", "Alerting", "SRE"],
            location: "Phoenix, AZ",
            timezone: "America/Phoenix",
            startDate: "2022-12-05T00:00:00.000Z"
        },
        {
            employeeId: "EMP029",
            name: "George Martinez",
            email: "george.martinez@company.com",
            role: "TEAM_LEAD",
            department: "Automation Engineering",
            reportsTo: "EMP012",
            directReports: ["EMP077", "EMP078"],
            projectIds: ["AUTOMATION-INITIATIVE", "WORKFLOW-AUTOMATION"],
            skillSet: ["Automation Engineering", "Scripting", "Workflow Automation", "Process Improvement"],
            location: "Tucson, AZ",
            timezone: "America/Phoenix",
            startDate: "2023-02-13T00:00:00.000Z"
        },

        // Under Daniel Lee (EMP013) - IT Operations  
        {
            employeeId: "EMP030",
            name: "Helen Zhang",
            email: "helen.zhang@company.com",
            role: "TEAM_LEAD",
            department: "Security Operations",
            reportsTo: "EMP013",
            directReports: ["EMP079", "EMP080", "EMP081"],
            projectIds: ["SECURITY-COMPLIANCE", "SOC-MODERNIZATION"],
            skillSet: ["Security Operations", "Incident Response", "Threat Detection", "SIEM", "Forensics"],
            location: "Salt Lake City, UT",
            timezone: "America/Denver",
            startDate: "2023-03-20T00:00:00.000Z"
        }
    ],

    // Organizational hierarchy mappings
    hierarchy: {
        "CEO": ["EMP001"],
        "CTO": ["EMP002"],
        "BU_MANAGER": ["EMP003", "EMP004", "EMP005"],
        "PROJECT_MANAGER": ["EMP006", "EMP007", "EMP008", "EMP009", "EMP010", "EMP011", "EMP012", "EMP013"],
        "TEAM_LEAD": ["EMP014", "EMP015", "EMP016", "EMP017", "EMP018", "EMP019", "EMP020", "EMP021", "EMP022", "EMP023", "EMP024", "EMP025", "EMP026", "EMP027", "EMP028", "EMP029", "EMP030"],
        "TEAM_MEMBER": [], // Will be populated with EMP031-EMP090
        "ADMIN": [] // Will be populated with admin users
    },

    // Department structure
    departments: {
        "Executive": {
            employees: ["EMP001"],
            head: "EMP001"
        },
        "Technology": {
            employees: ["EMP002"],
            head: "EMP002"
        },
        "Data Management": {
            employees: ["EMP003", "EMP006", "EMP007", "EMP008", "EMP014", "EMP015", "EMP016", "EMP017", "EMP018", "EMP019", "EMP020"],
            head: "EMP003"
        },
        "IT Architecture": {
            employees: ["EMP004", "EMP009", "EMP010", "EMP021", "EMP022", "EMP023", "EMP024", "EMP025"],
            head: "EMP004"
        },
        "IT Operations": {
            employees: ["EMP005", "EMP011", "EMP012", "EMP013", "EMP026", "EMP027", "EMP028", "EMP029", "EMP030"],
            head: "EMP005"
        }
    }
};

module.exports = organizationData;