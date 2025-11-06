/**
 * Confluence Pages and Documentation Dataset 
 * Maps employees to Confluence pages, documentation, and knowledge sharing
 */

const confluenceData = {
    // Confluence spaces based on organizational structure
    spaces: [
        {
            key: "EXEC",
            name: "Executive",
            description: "Executive level documentation and strategic planning",
            owner: "EMP001", // Sarah Johnson - CEO
            type: "private",
            permissions: ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"]
        },
        {
            key: "DATAMGMT",
            name: "Data Management",
            description: "Data architecture, ETL processes, and data governance",
            owner: "EMP003", // Lisa Chen - BU Manager
            type: "team",
            permissions: ["EMP003", "EMP006", "EMP007", "EMP008", "EMP014", "EMP015", "EMP016", "EMP017", "EMP018", "EMP019", "EMP020"]
        },
        {
            key: "ARCH",
            name: "IT Architecture",
            description: "System architecture, microservices, and cloud solutions",
            owner: "EMP004", // David Kim - BU Manager
            type: "team",
            permissions: ["EMP004", "EMP009", "EMP010", "EMP021", "EMP022", "EMP023", "EMP024", "EMP025"]
        },
        {
            key: "INFRA",
            name: "IT Operations",
            description: "Infrastructure, monitoring, security, and operations",
            owner: "EMP005", // Jennifer Brown - BU Manager
            type: "team",
            permissions: ["EMP005", "EMP011", "EMP012", "EMP013", "EMP026", "EMP027", "EMP028", "EMP029", "EMP030"]
        },
        {
            key: "PORTAEH",
            name: "PORTAEH Project",
            description: "Project-specific documentation for PORTAEH initiative",
            owner: "EMP006", // Robert Wilson - PM
            type: "project",
            permissions: ["EMP006", "EMP014", "EMP021", "EMP031", "EMP032", "EMP033", "EMP034"]
        },
        {
            key: "CCACB",
            name: "CCACB Project",
            description: "Database modernization and table creation documentation",
            owner: "EMP007", // Amanda Rodriguez - PM
            type: "project",
            permissions: ["EMP007", "EMP015", "EMP035", "EMP036", "EMP037", "EMP038"]
        }
    ],

    // Comprehensive page collection
    pages: [
        // Executive Documentation
        {
            id: "exec-001",
            title: "Strategic Initiative 2025 - Master Plan",
            space: "EXEC",
            author: "EMP001", // Sarah Johnson
            created: "2025-01-15T00:00:00.000Z",
            updated: "2025-11-01T00:00:00.000Z",
            content: "Comprehensive strategic planning document outlining company objectives, KPIs, and transformation roadmap for 2025. Includes digital transformation initiatives, organizational restructuring, and technology modernization plans.",
            labels: ["strategic-planning", "2025-roadmap", "transformation", "executive"],
            permissions: "restricted",
            collaborators: ["EMP002", "EMP003", "EMP004", "EMP005"]
        },
        {
            id: "exec-002",
            title: "Technology Architecture Vision 2025",
            space: "EXEC",
            author: "EMP002", // Michael Chen
            created: "2025-01-20T00:00:00.000Z",
            updated: "2025-10-28T00:00:00.000Z",
            content: "High-level technology vision document outlining architectural principles, technology stack evolution, cloud-first strategy, and innovation frameworks for the organization.",
            labels: ["technology-vision", "architecture", "cloud-strategy", "innovation"],
            permissions: "restricted",
            collaborators: ["EMP001", "EMP004", "EMP009", "EMP021"]
        },

        // Data Management Documentation
        {
            id: "data-001",
            title: "ETL Pipeline Architecture and Best Practices",
            space: "DATAMGMT",
            author: "EMP014", // Abrar ul haq N
            created: "2024-10-01T00:00:00.000Z",
            updated: "2025-11-04T00:00:00.000Z",
            content: "Comprehensive guide to ETL pipeline design, implementation patterns, error handling strategies, performance optimization techniques, and monitoring best practices. Includes PORTAEH project case studies and lessons learned.",
            labels: ["etl", "data-pipeline", "best-practices", "architecture", "portaeh"],
            permissions: "team",
            collaborators: ["EMP006", "EMP031", "EMP032", "EMP033"]
        },
        {
            id: "data-002",
            title: "Database Schema Evolution and Migration Strategies",
            space: "DATAMGMT",
            author: "EMP015", // Dinesh Kumar M
            created: "2024-09-15T00:00:00.000Z",
            updated: "2025-11-03T00:00:00.000Z",
            content: "Detailed documentation on database schema design principles, migration methodologies, version control strategies, and rollback procedures. Covers CCACB project table creation patterns and naming conventions.",
            labels: ["database", "schema", "migration", "ccacb", "dw", "table-creation"],
            permissions: "team",
            collaborators: ["EMP007", "EMP035", "EMP036", "EMP037"]
        },
        {
            id: "data-003",
            title: "Data Quality Framework and Monitoring",
            space: "DATAMGMT",
            author: "EMP016", // Mani S
            created: "2024-11-01T00:00:00.000Z",
            updated: "2025-11-02T00:00:00.000Z",
            content: "Data quality assessment methodologies, automated validation rules, data profiling techniques, and quality monitoring dashboard specifications. Includes integration with existing ETL processes.",
            labels: ["data-quality", "monitoring", "validation", "profiling"],
            permissions: "team",
            collaborators: ["EMP014", "EMP039", "EMP040", "EMP041"]
        },
        {
            id: "data-004",
            title: "Master Data Management Strategy",
            space: "DATAMGMT",
            author: "EMP017", // Alexander Johnson
            created: "2024-10-10T00:00:00.000Z",
            updated: "2025-10-25T00:00:00.000Z",
            content: "Master data management principles, data stewardship roles, data lineage tracking, and governance policies. Covers customer, product, and organizational data domains.",
            labels: ["mdm", "master-data", "stewardship", "governance"],
            permissions: "team",
            collaborators: ["EMP008", "EMP042", "EMP043", "EMP044"]
        },

        // Integration and Architecture Documentation  
        {
            id: "arch-001",
            title: "Integration Architecture Patterns and Guidelines",
            space: "ARCH",
            author: "EMP021", // Dev Sparrow
            created: "2024-10-15T00:00:00.000Z",
            updated: "2025-11-05T00:00:00.000Z",
            content: "Integration architecture patterns, API design guidelines, service mesh implementation, event-driven architecture principles, and microservices communication patterns. Includes Outlook integration case study.",
            labels: ["integration", "api", "microservices", "outlook", "architecture"],
            permissions: "team",
            collaborators: ["EMP009", "EMP055", "EMP056", "EMP057"]
        },
        {
            id: "arch-002",
            title: "Cloud Native Development Standards",
            space: "ARCH",
            author: "EMP024", // Sandra Liu
            created: "2024-11-20T00:00:00.000Z",
            updated: "2025-10-30T00:00:00.000Z",
            content: "Cloud native development methodologies, containerization strategies, Kubernetes deployment patterns, CI/CD pipeline design, and DevOps best practices for cloud applications.",
            labels: ["cloud-native", "kubernetes", "containers", "devops", "cicd"],
            permissions: "team",
            collaborators: ["EMP010", "EMP064", "EMP065", "EMP066"]
        },
        {
            id: "arch-003",
            title: "Microservices Migration Playbook",
            space: "ARCH",
            author: "EMP022", // Emily Carter
            created: "2024-11-01T00:00:00.000Z",
            updated: "2025-11-01T00:00:00.000Z",
            content: "Step-by-step guide for migrating monolithic applications to microservices architecture. Includes domain decomposition strategies, service boundary identification, and migration planning templates.",
            labels: ["microservices", "migration", "architecture", "decomposition"],
            permissions: "team",
            collaborators: ["EMP009", "EMP058", "EMP059", "EMP060"]
        },

        // Infrastructure and Operations Documentation
        {
            id: "infra-001",
            title: "Infrastructure as Code Implementation Guide",
            space: "INFRA",
            author: "EMP026", // Patricia Davis
            created: "2024-12-01T00:00:00.000Z",
            updated: "2025-10-28T00:00:00.000Z",
            content: "Infrastructure as Code (IaC) implementation using Terraform and Ansible. Includes environment provisioning templates, configuration management strategies, and automated deployment procedures.",
            labels: ["iac", "terraform", "ansible", "automation", "deployment"],
            permissions: "team",
            collaborators: ["EMP011", "EMP069", "EMP070", "EMP071"]
        },
        {
            id: "infra-002",
            title: "Monitoring and Alerting Strategy",
            space: "INFRA",
            author: "EMP028", // Christopher Wilson 
            created: "2025-01-10T00:00:00.000Z",
            updated: "2025-10-31T00:00:00.000Z",
            content: "Comprehensive monitoring strategy covering infrastructure metrics, application performance monitoring, log aggregation, alerting rules, and incident response procedures.",
            labels: ["monitoring", "alerting", "metrics", "logging", "incident-response"],
            permissions: "team",
            collaborators: ["EMP012", "EMP074", "EMP075", "EMP076"]
        },
        {
            id: "infra-003",
            title: "Security Operations Center (SOC) Procedures",
            space: "INFRA",
            author: "EMP030", // Helen Zhang
            created: "2024-10-16T00:00:00.000Z",
            updated: "2025-11-04T00:00:00.000Z",
            content: "Security operations procedures, threat detection methodologies, incident response playbooks, vulnerability management processes, and compliance reporting guidelines.",
            labels: ["security", "soc", "threat-detection", "incident-response", "compliance"],
            permissions: "restricted",
            collaborators: ["EMP013", "EMP079", "EMP080", "EMP081"]
        },

        // Project-Specific Documentation
        {
            id: "portaeh-001",
            title: "PORTAEH Project Technical Specifications",
            space: "PORTAEH",
            author: "EMP006", // Robert Wilson
            created: "2024-10-01T00:00:00.000Z",
            updated: "2025-11-03T00:00:00.000Z",
            content: "Technical specifications for the PORTAEH project including system requirements, integration points, data flow diagrams, API specifications, and testing strategies. Current status and progress updates.",
            labels: ["portaeh", "specifications", "integration", "api", "progress"],
            permissions: "project",
            collaborators: ["EMP014", "EMP021", "EMP031", "EMP032"]
        },
        {
            id: "portaeh-002",
            title: "Outlook Integration Module Documentation",
            space: "PORTAEH",
            author: "EMP021", // Dev Sparrow
            created: "2024-10-15T00:00:00.000Z",
            updated: "2025-11-05T00:00:00.000Z",
            content: "Detailed documentation for Outlook integration module including authentication flows, API endpoints, data synchronization processes, error handling, and testing procedures. Progress update from PORTAEH-3305.",
            labels: ["outlook", "integration", "api", "authentication", "module"],
            permissions: "project",
            collaborators: ["EMP006", "EMP033", "EMP034"]
        },
        {
            id: "ccacb-001",
            title: "CCACB Database Schema Documentation",
            space: "CCACB",
            author: "EMP007", // Amanda Rodriguez
            created: "2024-09-15T00:00:00.000Z",
            updated: "2025-11-04T00:00:00.000Z",
            content: "Complete database schema documentation for CCACB project including table structures, relationships, indexing strategies, and performance considerations. Covers DW_HS tables and ESG data requirements.",
            labels: ["ccacb", "database", "schema", "dw", "esg"],
            permissions: "project",
            collaborators: ["EMP015", "EMP035", "EMP036", "EMP037"]
        },
        {
            id: "ccacb-002",
            title: "ESG Data Model and Table Specifications",
            space: "CCACB",
            author: "EMP015", // Dinesh Kumar M
            created: "2024-10-30T00:00:00.000Z",
            updated: "2025-11-04T00:00:00.000Z",
            content: "ESG (Environmental, Social, Governance) data model specifications including DW_HS_GAG_STOCK_ESG_APE table structure, data lineage, transformation rules, and reporting requirements from CCACB-11894.",
            labels: ["esg", "data-model", "table-creation", "ccacb", "specifications"],
            permissions: "project",
            collaborators: ["EMP007", "EMP037", "EMP038"]
        }
    ],

    // Page view and collaboration statistics  
    pageMetrics: {
        "exec-001": { views: 45, likes: 12, comments: 8, collaborators: 4 },
        "exec-002": { views: 38, likes: 15, comments: 6, collaborators: 4 },
        "data-001": { views: 127, likes: 23, comments: 15, collaborators: 4 }, // Popular ETL guide
        "data-002": { views: 98, likes: 18, comments: 12, collaborators: 4 },
        "data-003": { views: 67, likes: 14, comments: 9, collaborators: 4 },
        "data-004": { views: 54, likes: 11, comments: 7, collaborators: 4 },
        "arch-001": { views: 89, likes: 19, comments: 11, collaborators: 4 },
        "arch-002": { views: 72, likes: 16, comments: 8, collaborators: 4 },
        "arch-003": { views: 61, likes: 13, comments: 10, collaborators: 4 },
        "infra-001": { views: 43, likes: 9, comments: 5, collaborators: 4 },
        "infra-002": { views: 58, likes: 12, comments: 7, collaborators: 4 },
        "infra-003": { views: 31, likes: 8, comments: 4, collaborators: 4 }, // Restricted access
        "portaeh-001": { views: 156, likes: 28, comments: 18, collaborators: 4 }, // Most viewed project doc
        "portaeh-002": { views: 134, likes: 25, comments: 16, collaborators: 3 },
        "ccacb-001": { views: 112, likes: 21, comments: 14, collaborators: 4 },
        "ccacb-002": { views: 87, likes: 17, comments: 11, collaborators: 3 }
    },

    // Recent page activity
    recentActivity: [
        {
            type: "page_updated",
            pageId: "portaeh-002",
            user: "EMP021", // Dev Sparrow
            timestamp: "2025-11-05T14:30:00.000Z",
            description: "Updated Outlook Integration Module Documentation with progress from PORTAEH-3305"
        },
        {
            type: "page_updated",
            pageId: "data-001",
            user: "EMP014", // Abrar ul haq N
            timestamp: "2025-11-04T16:45:00.000Z",
            description: "Added ETL error handling section and PORTAEH lessons learned"
        },
        {
            type: "page_updated",
            pageId: "ccacb-002",
            user: "EMP015", // Dinesh Kumar M
            timestamp: "2025-11-04T11:20:00.000Z",
            description: "Updated ESG table specifications for CCACB-11894 requirements"
        },
        {
            type: "comment_added",
            pageId: "data-002",
            user: "EMP037", // Kamesh Reddy
            timestamp: "2025-11-04T10:15:00.000Z",
            description: "Added performance tuning considerations for large table migrations"
        },
        {
            type: "page_updated",
            pageId: "infra-003",
            user: "EMP030", // Helen Zhang
            timestamp: "2025-11-04T09:30:00.000Z",
            description: "Updated security procedures with zero-trust implementation guidelines"
        }
    ]
};

module.exports = confluenceData;