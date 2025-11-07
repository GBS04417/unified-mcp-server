/**
 * Team Members and Admin Users for Organizational Dataset
 * Completes the 90-employee organizational structure
 */

const teamMembersAndAdmins = {
    // Team Members (60 total - EMP031 to EMP090)
    teamMembers: [
        // Under Abrar ul haq N (GBS04417) - 4 members
        {
            employeeId: "EMP031",
            name: "Priya Sharma",
            email: "priya.sharma@company.com",
            role: "TEAM_MEMBER",
            department: "Data Engineering",
            reportsTo: "GBS04417",
            directReports: [],
            projectIds: ["PORTAEH", "DATA-PIPELINE-V2"],
            skillSet: ["Python", "Apache Airflow", "ETL", "Data Processing"],
            location: "Pune, India",
            timezone: "Asia/Kolkata",
            startDate: "2023-01-15T00:00:00.000Z"
        },
        {
            employeeId: "EMP032",
            name: "Raj Patel",
            email: "raj.patel@company.com",
            role: "TEAM_MEMBER",
            department: "Data Engineering",
            reportsTo: "GBS04417",
            directReports: [],
            projectIds: ["ETL-OPTIMIZATION", "DATA-VALIDATION"],
            skillSet: ["Scala", "Apache Spark", "Kafka", "Data Streaming"],
            location: "Mumbai, India",
            timezone: "Asia/Kolkata",
            startDate: "2023-02-20T00:00:00.000Z"
        },
        {
            employeeId: "EMP033",
            name: "Alex Thompson",
            email: "alex.thompson@company.com",
            role: "TEAM_MEMBER",
            department: "Data Engineering",
            reportsTo: "GBS04417",
            directReports: [],
            projectIds: ["PORTAEH", "REAL-TIME-ANALYTICS"],
            skillSet: ["Java", "Spring Boot", "Microservices", "Database Design"],
            location: "Austin, TX",
            timezone: "America/Chicago",
            startDate: "2023-03-10T00:00:00.000Z"
        },
        {
            employeeId: "EMP034",
            name: "Emma Rodriguez",
            email: "emma.rodriguez@company.com",
            role: "TEAM_MEMBER",
            department: "Data Engineering",
            reportsTo: "GBS04417",
            directReports: [],
            projectIds: ["DATA-PIPELINE-V2", "MONITORING-AUTOMATION"],
            skillSet: ["Python", "Docker", "Kubernetes", "CI/CD"],
            location: "San Antonio, TX",
            timezone: "America/Chicago",
            startDate: "2023-04-05T00:00:00.000Z"
        },

        // Under Dinesh Kumar M (EMP015) - 4 members
        {
            employeeId: "EMP035",
            name: "Suresh Kumar",
            email: "suresh.kumar@company.com",
            role: "TEAM_MEMBER",
            department: "Database Administration",
            reportsTo: "EMP015",
            directReports: [],
            projectIds: ["CCACB", "DATABASE-MODERNIZATION"],
            skillSet: ["Oracle DBA", "Performance Tuning", "Backup Recovery", "SQL"],
            location: "Chennai, India",
            timezone: "Asia/Kolkata",
            startDate: "2023-01-25T00:00:00.000Z"
        },
        {
            employeeId: "EMP036",
            name: "Architha Nair",
            email: "architha.nair@company.com",
            role: "TEAM_MEMBER",
            department: "Database Administration",
            reportsTo: "EMP015",
            directReports: [],
            projectIds: ["DATA-MIGRATION", "SCHEMA-OPTIMIZATION"],
            skillSet: ["PostgreSQL", "Data Migration", "Database Security", "Monitoring"],
            location: "Bangalore, India",
            timezone: "Asia/Kolkata",
            startDate: "2023-02-28T00:00:00.000Z"
        },
        {
            employeeId: "EMP037",
            name: "Kamesh Reddy",
            email: "kamesh.reddy@company.com",
            role: "TEAM_MEMBER",
            department: "Database Administration",
            reportsTo: "EMP015",
            directReports: [],
            projectIds: ["CCACB", "PERFORMANCE-TUNING"],
            skillSet: ["MySQL", "Database Clustering", "Replication", "High Availability"],
            location: "Hyderabad, India",
            timezone: "Asia/Kolkata",
            startDate: "2023-03-15T00:00:00.000Z"
        },
        {
            employeeId: "EMP038",
            name: "Arunkumar Singh",
            email: "arunkumar.singh@company.com",
            role: "TEAM_MEMBER",
            department: "Database Administration",
            reportsTo: "EMP015",
            directReports: [],
            projectIds: ["DATABASE-AUTOMATION", "COMPLIANCE-AUDIT"],
            skillSet: ["Database Automation", "Scripting", "Compliance", "Data Governance"],
            location: "Delhi, India",
            timezone: "Asia/Kolkata",
            startDate: "2023-04-12T00:00:00.000Z"
        },

        // Under Mani S (EMP016) - 3 members
        {
            employeeId: "EMP039",
            name: "Lisa Wang",
            email: "lisa.wang@company.com",
            role: "TEAM_MEMBER",
            department: "Data Quality",
            reportsTo: "EMP016",
            directReports: [],
            projectIds: ["DATA-QUALITY-INITIATIVE", "VALIDATION-FRAMEWORK"],
            skillSet: ["Data Testing", "Quality Metrics", "Validation Rules", "Reporting"],
            location: "Seattle, WA",
            timezone: "America/Los_Angeles",
            startDate: "2023-02-08T00:00:00.000Z"
        },
        {
            employeeId: "EMP040",
            name: "Marcus Johnson",
            email: "marcus.johnson@company.com",
            role: "TEAM_MEMBER",
            department: "Data Quality",
            reportsTo: "EMP016",
            directReports: [],
            projectIds: ["DATA-PROFILING", "ANOMALY-DETECTION"],
            skillSet: ["Data Profiling", "Statistical Analysis", "Anomaly Detection", "Python"],
            location: "Portland, OR",
            timezone: "America/Los_Angeles",
            startDate: "2023-03-22T00:00:00.000Z"
        },
        {
            employeeId: "EMP041",
            name: "Sophia Chen",
            email: "sophia.chen@company.com",
            role: "TEAM_MEMBER",
            department: "Data Quality",
            reportsTo: "EMP016",
            directReports: [],
            projectIds: ["QUALITY-DASHBOARD", "DATA-LINEAGE"],
            skillSet: ["Data Visualization", "Dashboard Development", "Data Lineage", "Tableau"],
            location: "San Francisco, CA",
            timezone: "America/Los_Angeles",
            startDate: "2023-04-18T00:00:00.000Z"
        },

        // Under Jennifer Wu (EMP017) - 4 members
        {
            employeeId: "EMP042",
            name: "Nathan Miller",
            email: "nathan.miller@company.com",
            role: "TEAM_MEMBER",
            department: "Business Intelligence",
            reportsTo: "EMP017",
            directReports: [],
            projectIds: ["BI-DASHBOARD", "EXECUTIVE-REPORTING"],
            skillSet: ["Power BI", "DAX", "Report Development", "Business Analysis"],
            location: "Chicago, IL",
            timezone: "America/Chicago",
            startDate: "2023-01-30T00:00:00.000Z"
        },
        {
            employeeId: "EMP043",
            name: "Jessica Lopez",
            email: "jessica.lopez@company.com",
            role: "TEAM_MEMBER",
            department: "Business Intelligence",
            reportsTo: "EMP017",
            directReports: [],
            projectIds: ["ANALYTICS-PLATFORM", "SELF-SERVICE-BI"],
            skillSet: ["Tableau", "Data Modeling", "ETL", "Business Requirements"],
            location: "Milwaukee, WI",
            timezone: "America/Chicago",
            startDate: "2023-02-15T00:00:00.000Z"
        },
        {
            employeeId: "EMP044",
            name: "Ryan Garcia",
            email: "ryan.garcia@company.com",
            role: "TEAM_MEMBER",
            department: "Business Intelligence",
            reportsTo: "EMP017",
            directReports: [],
            projectIds: ["DATA-WAREHOUSE-REPORTING", "KPI-FRAMEWORK"],
            skillSet: ["SQL", "SSRS", "Data Analysis", "Performance Metrics"],
            location: "Indianapolis, IN",
            timezone: "America/New_York",
            startDate: "2023-03-08T00:00:00.000Z"
        },
        {
            employeeId: "EMP045",
            name: "Olivia Davis",
            email: "olivia.davis@company.com",
            role: "TEAM_MEMBER",
            department: "Business Intelligence",
            reportsTo: "EMP017",
            directReports: [],
            projectIds: ["MOBILE-ANALYTICS", "REAL-TIME-DASHBOARDS"],
            skillSet: ["Mobile BI", "Real-time Analytics", "Data Visualization", "UX Design"],
            location: "Detroit, MI",
            timezone: "America/New_York",
            startDate: "2023-04-02T00:00:00.000Z"
        },

        // Under Carlos Mendoza (EMP018) - 3 members
        {
            employeeId: "EMP046",
            name: "Benjamin Lee",
            email: "benjamin.lee@company.com",
            role: "TEAM_MEMBER",
            department: "Data Science",
            reportsTo: "EMP018",
            directReports: [],
            projectIds: ["ML-PLATFORM", "PREDICTIVE-MODELS"],
            skillSet: ["Machine Learning", "Python", "TensorFlow", "Statistical Modeling"],
            location: "Miami, FL",
            timezone: "America/New_York",
            startDate: "2023-02-20T00:00:00.000Z"
        },
        {
            employeeId: "EMP047",
            name: "Victoria Zhang",
            email: "victoria.zhang@company.com",
            role: "TEAM_MEMBER",
            department: "Data Science",
            reportsTo: "EMP018",
            directReports: [],
            projectIds: ["NLP-PROJECT", "TEXT-ANALYTICS"],
            skillSet: ["Natural Language Processing", "Deep Learning", "PyTorch", "R"],
            location: "Tampa, FL",
            timezone: "America/New_York",
            startDate: "2023-03-12T00:00:00.000Z"
        },
        {
            employeeId: "EMP048",
            name: "Christopher Taylor",
            email: "christopher.taylor@company.com",
            role: "TEAM_MEMBER",
            department: "Data Science",
            reportsTo: "EMP018",
            directReports: [],
            projectIds: ["COMPUTER-VISION", "IMAGE-PROCESSING"],
            skillSet: ["Computer Vision", "Image Processing", "OpenCV", "Deep Learning"],
            location: "Orlando, FL",
            timezone: "America/New_York",
            startDate: "2023-04-25T00:00:00.000Z"
        },

        // Under Susan Taylor (EMP019) - 3 members
        {
            employeeId: "EMP049",
            name: "Amanda White",
            email: "amanda.white@company.com",
            role: "TEAM_MEMBER",
            department: "Data Governance",
            reportsTo: "EMP019",
            directReports: [],
            projectIds: ["DATA-GOVERNANCE-2025", "POLICY-FRAMEWORK"],
            skillSet: ["Data Governance", "Policy Development", "Compliance", "Risk Assessment"],
            location: "Boston, MA",
            timezone: "America/New_York",
            startDate: "2023-01-18T00:00:00.000Z"
        },
        {
            employeeId: "EMP050",
            name: "Joshua Martin",
            email: "joshua.martin@company.com",
            role: "TEAM_MEMBER",
            department: "Data Governance",
            reportsTo: "EMP019",
            directReports: [],
            projectIds: ["PRIVACY-COMPLIANCE", "GDPR-IMPLEMENTATION"],
            skillSet: ["Privacy Law", "GDPR", "Data Protection", "Legal Compliance"],
            location: "Cambridge, MA",
            timezone: "America/New_York",
            startDate: "2023-02-14T00:00:00.000Z"
        },
        {
            employeeId: "EMP051",
            name: "Sarah Wilson",
            email: "sarah.wilson2@company.com",
            role: "TEAM_MEMBER",
            department: "Data Governance",
            reportsTo: "EMP019",
            directReports: [],
            projectIds: ["DATA-CATALOG", "METADATA-MANAGEMENT"],
            skillSet: ["Metadata Management", "Data Cataloging", "Business Glossary", "Lineage"],
            location: "Worcester, MA",
            timezone: "America/New_York",
            startDate: "2023-03-28T00:00:00.000Z"
        },

        // Under Andrew Kim (EMP020) - 3 members
        {
            employeeId: "EMP052",
            name: "Tyler Anderson",
            email: "tyler.anderson@company.com",
            role: "TEAM_MEMBER",
            department: "Master Data Management",
            reportsTo: "EMP020",
            directReports: [],
            projectIds: ["MDM-PROJECT", "CUSTOMER-MDM"],
            skillSet: ["Master Data Management", "Data Integration", "Informatica", "Data Quality"],
            location: "Dallas, TX",
            timezone: "America/Chicago",
            startDate: "2023-02-06T00:00:00.000Z"
        },
        {
            employeeId: "EMP053",
            name: "Ashley Thomas",
            email: "ashley.thomas@company.com",
            role: "TEAM_MEMBER",
            department: "Master Data Management",
            reportsTo: "EMP020",
            directReports: [],
            projectIds: ["REFERENCE-DATA", "PRODUCT-MDM"],
            skillSet: ["Reference Data", "Product Information Management", "Data Stewardship"],
            location: "Fort Worth, TX",
            timezone: "America/Chicago",
            startDate: "2023-03-13T00:00:00.000Z"
        },
        {
            employeeId: "EMP054",
            name: "Brandon Moore",
            email: "brandon.moore@company.com",
            role: "TEAM_MEMBER",
            department: "Master Data Management",
            reportsTo: "EMP020",
            directReports: [],
            projectIds: ["DATA-MATCHING", "DEDUPLICATION"],
            skillSet: ["Data Matching", "Deduplication", "Fuzzy Logic", "Algorithm Development"],
            location: "Plano, TX",
            timezone: "America/Chicago",
            startDate: "2023-04-17T00:00:00.000Z"
        },

        // Under Dev Sparrow (EMP021) - 4 members
        {
            employeeId: "EMP055",
            name: "Megan Clark",
            email: "megan.clark@company.com",
            role: "TEAM_MEMBER",
            department: "Integration Development",
            reportsTo: "EMP021",
            directReports: [],
            projectIds: ["API-GATEWAY", "MICROSERVICES-API"],
            skillSet: ["REST APIs", "GraphQL", "API Design", "Node.js"],
            location: "Seattle, WA",
            timezone: "America/Los_Angeles",
            startDate: "2023-01-23T00:00:00.000Z"
        },
        {
            employeeId: "EMP056",
            name: "Jacob Rodriguez",
            email: "jacob.rodriguez@company.com",
            role: "TEAM_MEMBER",
            department: "Integration Development",
            reportsTo: "EMP021",
            directReports: [],
            projectIds: ["INTEGRATION-HUB", "MESSAGE-QUEUES"],
            skillSet: ["Message Queues", "Event Streaming", "Apache Kafka", "RabbitMQ"],
            location: "Bellevue, WA",
            timezone: "America/Los_Angeles",
            startDate: "2023-02-27T00:00:00.000Z"
        },
        {
            employeeId: "EMP057",
            name: "Nicole Lewis",
            email: "nicole.lewis@company.com",
            role: "TEAM_MEMBER",
            department: "Integration Development",
            reportsTo: "EMP021",
            directReports: [],
            projectIds: ["ETL-SERVICES", "DATA-CONNECTORS"],
            skillSet: ["ETL Development", "Data Connectors", "Integration Patterns", "Java"],
            location: "Tacoma, WA",
            timezone: "America/Los_Angeles",
            startDate: "2023-03-16T00:00:00.000Z"
        },
        {
            employeeId: "EMP058",
            name: "Austin Walker",
            email: "austin.walker@company.com",
            role: "TEAM_MEMBER",
            department: "Integration Development",
            reportsTo: "EMP021",
            directReports: [],
            projectIds: ["API-DOCUMENTATION", "DEVELOPER-PORTAL"],
            skillSet: ["API Documentation", "Developer Tools", "OpenAPI", "Technical Writing"],
            location: "Spokane, WA",
            timezone: "America/Los_Angeles",
            startDate: "2023-04-09T00:00:00.000Z"
        },

        // Under Emily Carter (EMP022) - 3 members
        {
            employeeId: "EMP059",
            name: "Samantha Hall",
            email: "samantha.hall@company.com",
            role: "TEAM_MEMBER",
            department: "Solution Architecture",
            reportsTo: "EMP022",
            directReports: [],
            projectIds: ["ARCHITECTURE-STANDARDS", "DESIGN-PATTERNS"],
            skillSet: ["Enterprise Patterns", "Solution Design", "Technical Documentation", "Architecture Review"],
            location: "San Francisco, CA",
            timezone: "America/Los_Angeles",
            startDate: "2023-02-13T00:00:00.000Z"
        },
        {
            employeeId: "EMP060",
            name: "Jonathan Allen",
            email: "jonathan.allen@company.com",
            role: "TEAM_MEMBER",
            department: "Solution Architecture",
            reportsTo: "EMP022",
            directReports: [],
            projectIds: ["SYSTEM-INTEGRATION", "ARCHITECTURE-ASSESSMENT"],
            skillSet: ["System Integration", "Architecture Assessment", "Technology Evaluation", "Proof of Concepts"],
            location: "Oakland, CA",
            timezone: "America/Los_Angeles",
            startDate: "2023-03-07T00:00:00.000Z"
        },
        {
            employeeId: "EMP061",
            name: "Stephanie Young",
            email: "stephanie.young@company.com",
            role: "TEAM_MEMBER",
            department: "Solution Architecture",
            reportsTo: "EMP022",
            directReports: [],
            projectIds: ["REFERENCE-ARCHITECTURE", "BEST-PRACTICES"],
            skillSet: ["Reference Architecture", "Best Practices", "Standards Development", "Governance"],
            location: "San Jose, CA",
            timezone: "America/Los_Angeles",
            startDate: "2023-04-03T00:00:00.000Z"
        },

        // Under Mark Johnson (EMP023) - 2 members
        {
            employeeId: "EMP062",
            name: "Gregory King",
            email: "gregory.king@company.com",
            role: "TEAM_MEMBER",
            department: "Platform Engineering",
            reportsTo: "EMP023",
            directReports: [],
            projectIds: ["CONTAINER-PLATFORM", "ORCHESTRATION"],
            skillSet: ["Kubernetes", "Container Orchestration", "Helm", "Service Mesh"],
            location: "Portland, OR",
            timezone: "America/Los_Angeles",
            startDate: "2023-03-20T00:00:00.000Z"
        },
        {
            employeeId: "EMP063",
            name: "Kelly Wright",
            email: "kelly.wright@company.com",
            role: "TEAM_MEMBER",
            department: "Platform Engineering",
            reportsTo: "EMP023",
            directReports: [],
            projectIds: ["PLATFORM-MODERNIZATION", "INFRASTRUCTURE-CODE"],
            skillSet: ["Infrastructure as Code", "Terraform", "Ansible", "CI/CD Pipelines"],
            location: "Eugene, OR",
            timezone: "America/Los_Angeles",
            startDate: "2023-04-14T00:00:00.000Z"
        },

        // Under Sandra Liu (EMP024) - 3 members
        {
            employeeId: "EMP064",
            name: "Raymond Scott",
            email: "raymond.scott@company.com",
            role: "TEAM_MEMBER",
            department: "Security Architecture",
            reportsTo: "EMP024",
            directReports: [],
            projectIds: ["ZERO-TRUST", "IDENTITY-MANAGEMENT"],
            skillSet: ["Zero Trust Architecture", "Identity and Access Management", "OAuth", "SAML"],
            location: "Portland, OR",
            timezone: "America/Los_Angeles",
            startDate: "2023-02-21T00:00:00.000Z"
        },
        {
            employeeId: "EMP065",
            name: "Catherine Green",
            email: "catherine.green@company.com",
            role: "TEAM_MEMBER",
            department: "Security Architecture",
            reportsTo: "EMP024",
            directReports: [],
            projectIds: ["SECURITY-FRAMEWORK", "THREAT-MODELING"],
            skillSet: ["Threat Modeling", "Security Assessment", "Penetration Testing", "Risk Analysis"],
            location: "Salem, OR",
            timezone: "America/Los_Angeles",
            startDate: "2023-03-14T00:00:00.000Z"
        },
        {
            employeeId: "EMP066",
            name: "Steven Baker",
            email: "steven.baker@company.com",
            role: "TEAM_MEMBER",
            department: "Security Architecture",
            reportsTo: "EMP024",
            directReports: [],
            projectIds: ["ENCRYPTION-STRATEGY", "KEY-MANAGEMENT"],
            skillSet: ["Encryption", "Key Management", "PKI", "Cryptography"],
            location: "Bend, OR",
            timezone: "America/Los_Angeles",
            startDate: "2023-04-26T00:00:00.000Z"
        },

        // Under Brian Mitchell (EMP025) - 2 members
        {
            employeeId: "EMP067",
            name: "Jennifer Adams",
            email: "jennifer.adams@company.com",
            role: "TEAM_MEMBER",
            department: "Cloud Architecture",
            reportsTo: "EMP025",
            directReports: [],
            projectIds: ["MULTI-CLOUD", "CLOUD-MIGRATION"],
            skillSet: ["Multi-Cloud", "Cloud Migration", "AWS", "Azure"],
            location: "Vancouver, BC",
            timezone: "America/Los_Angeles",
            startDate: "2023-03-27T00:00:00.000Z"
        },
        {
            employeeId: "EMP068",
            name: "Paul Nelson",
            email: "paul.nelson@company.com",
            role: "TEAM_MEMBER",
            department: "Cloud Architecture",
            reportsTo: "EMP025",
            directReports: [],
            projectIds: ["CLOUD-NATIVE-APPS", "SERVERLESS"],
            skillSet: ["Serverless Architecture", "Lambda Functions", "Cloud Functions", "Event-Driven"],
            location: "Victoria, BC",
            timezone: "America/Los_Angeles",
            startDate: "2023-04-11T00:00:00.000Z"
        },

        // Under Patricia Davis (EMP026) - 3 members
        {
            employeeId: "EMP069",
            name: "Laura Carter",
            email: "laura.carter@company.com",
            role: "TEAM_MEMBER",
            department: "Infrastructure Operations",
            reportsTo: "EMP026",
            directReports: [],
            projectIds: ["NETWORK-UPGRADE", "INFRASTRUCTURE-MONITORING"],
            skillSet: ["Network Administration", "Cisco", "Network Security", "VLAN Management"],
            location: "Denver, CO",
            timezone: "America/Denver",
            startDate: "2023-02-09T00:00:00.000Z"
        },
        {
            employeeId: "EMP070",
            name: "Kevin Mitchell",
            email: "kevin.mitchell@company.com",
            role: "TEAM_MEMBER",
            department: "Infrastructure Operations",
            reportsTo: "EMP026",
            directReports: [],
            projectIds: ["SERVER-MANAGEMENT", "VIRTUALIZATION"],
            skillSet: ["Server Administration", "VMware", "Virtualization", "Storage Management"],
            location: "Boulder, CO",
            timezone: "America/Denver",
            startDate: "2023-03-02T00:00:00.000Z"
        },
        {
            employeeId: "EMP071",
            name: "Michelle Roberts",
            email: "michelle.roberts@company.com",
            role: "TEAM_MEMBER",
            department: "Infrastructure Operations",
            reportsTo: "EMP026",
            directReports: [],
            projectIds: ["INFRASTRUCTURE-2025", "CAPACITY-PLANNING"],
            skillSet: ["Capacity Planning", "Performance Monitoring", "Infrastructure Design", "Cost Optimization"],
            location: "Fort Collins, CO",
            timezone: "America/Denver",
            startDate: "2023-04-19T00:00:00.000Z"
        },

        // Under Richard Brown (EMP027) - 2 members
        {
            employeeId: "EMP072",
            name: "Timothy Phillips",
            email: "timothy.phillips@company.com",
            role: "TEAM_MEMBER",
            department: "Disaster Recovery",
            reportsTo: "EMP027",
            directReports: [],
            projectIds: ["BACKUP-STRATEGY", "RECOVERY-TESTING"],
            skillSet: ["Backup Systems", "Recovery Planning", "Business Continuity", "RTO/RPO Planning"],
            location: "Colorado Springs, CO",
            timezone: "America/Denver",
            startDate: "2023-03-06T00:00:00.000Z"
        },
        {
            employeeId: "EMP073",
            name: "Angela Campbell",
            email: "angela.campbell@company.com",
            role: "TEAM_MEMBER",
            department: "Disaster Recovery",
            reportsTo: "EMP027",
            directReports: [],
            projectIds: ["DISASTER-RECOVERY", "FAILOVER-TESTING"],
            skillSet: ["Failover Systems", "Disaster Recovery Testing", "Site Replication", "Emergency Response"],
            location: "Pueblo, CO",
            timezone: "America/Denver",
            startDate: "2023-04-24T00:00:00.000Z"
        },

        // Under Nancy Wilson (EMP028) - 3 members
        {
            employeeId: "EMP074",
            name: "Edward Turner",
            email: "edward.turner@company.com",
            role: "TEAM_MEMBER",
            department: "Monitoring & Performance",
            reportsTo: "EMP028",
            directReports: [],
            projectIds: ["MONITORING-UPGRADE", "ALERTING-SYSTEM"],
            skillSet: ["System Monitoring", "Nagios", "Zabbix", "Alert Management"],
            location: "Phoenix, AZ",
            timezone: "America/Phoenix",
            startDate: "2023-02-16T00:00:00.000Z"
        },
        {
            employeeId: "EMP075",
            name: "Dorothy Parker",
            email: "dorothy.parker@company.com",
            role: "TEAM_MEMBER",
            department: "Monitoring & Performance",
            reportsTo: "EMP028",
            directReports: [],
            projectIds: ["PERFORMANCE-OPTIMIZATION", "METRICS-COLLECTION"],
            skillSet: ["Performance Analysis", "Metrics Collection", "Grafana", "Prometheus"],
            location: "Tempe, AZ",
            timezone: "America/Phoenix",
            startDate: "2023-03-23T00:00:00.000Z"
        },
        {
            employeeId: "EMP076",
            name: "Harold Evans",
            email: "harold.evans@company.com",
            role: "TEAM_MEMBER",
            department: "Monitoring & Performance",
            reportsTo: "EMP028",
            directReports: [],
            projectIds: ["SRE-PRACTICES", "INCIDENT-RESPONSE"],
            skillSet: ["Site Reliability Engineering", "Incident Response", "Automation", "Error Budgets"],
            location: "Mesa, AZ",
            timezone: "America/Phoenix",
            startDate: "2023-04-10T00:00:00.000Z"
        },

        // Under George Martinez (EMP029) - 2 members
        {
            employeeId: "EMP077",
            name: "Carol Collins",
            email: "carol.collins@company.com",
            role: "TEAM_MEMBER",
            department: "Automation Engineering",
            reportsTo: "EMP029",
            directReports: [],
            projectIds: ["WORKFLOW-AUTOMATION", "PROCESS-AUTOMATION"],
            skillSet: ["Workflow Automation", "Process Design", "Business Process Management", "Robotic Process Automation"],
            location: "Tucson, AZ",
            timezone: "America/Phoenix",
            startDate: "2023-03-29T00:00:00.000Z"
        },
        {
            employeeId: "EMP078",
            name: "Frank Stewart",
            email: "frank.stewart@company.com",
            role: "TEAM_MEMBER",
            department: "Automation Engineering",
            reportsTo: "EMP029",
            directReports: [],
            projectIds: ["AUTOMATION-INITIATIVE", "SCRIPTING-FRAMEWORK"],
            skillSet: ["Scripting", "Shell Scripting", "PowerShell", "Automation Framework Development"],
            location: "Flagstaff, AZ",
            timezone: "America/Phoenix",
            startDate: "2023-04-15T00:00:00.000Z"
        },

        // Under Helen Zhang (EMP030) - 3 members
        {
            employeeId: "EMP079",
            name: "Ruth Sanchez",
            email: "ruth.sanchez@company.com",
            role: "TEAM_MEMBER",
            department: "Security Operations",
            reportsTo: "EMP030",
            directReports: [],
            projectIds: ["SOC-MODERNIZATION", "THREAT-DETECTION"],
            skillSet: ["Security Operations Center", "Threat Detection", "SIEM", "Security Analytics"],
            location: "Salt Lake City, UT",
            timezone: "America/Denver",
            startDate: "2023-02-22T00:00:00.000Z"
        },
        {
            employeeId: "EMP080",
            name: "Wayne Morris",
            email: "wayne.morris@company.com",
            role: "TEAM_MEMBER",
            department: "Security Operations",
            reportsTo: "EMP030",
            directReports: [],
            projectIds: ["INCIDENT-RESPONSE", "FORENSICS"],
            skillSet: ["Incident Response", "Digital Forensics", "Malware Analysis", "Evidence Handling"],
            location: "Provo, UT",
            timezone: "America/Denver",
            startDate: "2023-03-17T00:00:00.000Z"
        },
        {
            employeeId: "EMP081",
            name: "Janet Rogers",
            email: "janet.rogers@company.com",
            role: "TEAM_MEMBER",
            department: "Security Operations",
            reportsTo: "EMP030",
            directReports: [],
            projectIds: ["SECURITY-COMPLIANCE", "VULNERABILITY-MANAGEMENT"],
            skillSet: ["Compliance Management", "Vulnerability Assessment", "Security Auditing", "Risk Management"],
            location: "Ogden, UT",
            timezone: "America/Denver",
            startDate: "2023-04-21T00:00:00.000Z"
        }
    ],

    // Admin Users (2)
    adminUsers: [
        {
            employeeId: "EMP089",
            name: "System Admin", // Existing from mock data
            email: "admin@company.com",
            role: "ADMIN",
            department: "IT Operations",
            reportsTo: "EMP005", // Reports to IT Operations BU Manager
            directReports: [],
            projectIds: ["SYSTEM-ADMINISTRATION", "USER-MANAGEMENT"],
            skillSet: ["System Administration", "User Management", "Security", "Monitoring"],
            location: "Denver, CO",
            timezone: "America/Denver",
            startDate: "2020-06-01T00:00:00.000Z"
        },
        {
            employeeId: "EMP090",
            name: "Technical Admin",
            email: "tech.admin@company.com",
            role: "ADMIN",
            department: "IT Operations",
            reportsTo: "EMP005", // Reports to IT Operations BU Manager
            directReports: [],
            projectIds: ["TECHNICAL-SUPPORT", "SYSTEM-MAINTENANCE"],
            skillSet: ["Technical Support", "System Maintenance", "Troubleshooting", "Documentation"],
            location: "Phoenix, AZ",
            timezone: "America/Phoenix",
            startDate: "2021-03-15T00:00:00.000Z"
        }
    ]
};

module.exports = teamMembersAndAdmins;