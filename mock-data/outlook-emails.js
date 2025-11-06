/**
 * Enhanced Outlook Email Dataset
 * Realistic email patterns and volumes for all 90 employees
 */

const outlookEmailData = {
    // Email distribution patterns by role level
    emailVolumes: {
        // Leadership - High strategic email volume
        executive: { daily: 45, weekly: 315, monthly: 1260 },
        // BU Managers - High coordination email volume  
        buManager: { daily: 38, weekly: 266, monthly: 1064 },
        // Project Managers - High project communication
        projectManager: { daily: 32, weekly: 224, monthly: 896 },
        // Team Leads - Moderate technical and team communication
        teamLead: { daily: 28, weekly: 196, monthly: 784 },
        // Senior Members - Moderate technical communication
        senior: { daily: 22, weekly: 154, monthly: 616 },
        // Regular Team Members - Standard operational communication
        regular: { daily: 18, weekly: 126, monthly: 504 },
        // Admin - High operational communication
        admin: { daily: 35, weekly: 245, monthly: 980 }
    },

    // Enhanced email dataset with realistic conversation threads
    emails: [
        // Executive Communications
        {
            id: "email-001",
            from: "sarah.johnson@company.com", // EMP001 - CEO
            to: ["michael.chen@company.com", "lisa.chen@company.com", "david.kim@company.com", "jennifer.brown@company.com"],
            cc: [],
            subject: "Strategic Initiative 2025 - Q4 Progress Review",
            body: "Team, I wanted to share our Q4 progress on the Strategic Initiative 2025. We've successfully completed Phase 1 of the digital transformation roadmap with 92% of milestones achieved. The technology modernization efforts led by Michael have exceeded expectations, particularly in the microservices migration project. I'd like to schedule our year-end leadership review for December 15th to discuss 2025 planning and resource allocation. Please review the attached progress dashboard and come prepared with your department's Q1 2025 priorities. Looking forward to our continued success in the new year.",
            timestamp: "2025-11-05T09:15:00.000Z",
            folder: "Sent Items",
            isRead: true,
            importance: "High",
            labels: ["strategic", "leadership", "q4-review", "2025-planning"]
        },
        {
            id: "email-002",
            from: "michael.chen@company.com", // EMP002 - CTO
            to: ["dev.sparrow@company.com", "emily.carter@company.com", "sandra.liu@company.com"],
            cc: ["david.kim@company.com"],
            subject: "Technology Architecture Review - Microservices Migration Status",
            body: "Hi Team, Following up on our architecture review meeting yesterday. The microservices migration is progressing well with 65% of services successfully decomposed and deployed. Dev, excellent work on the API gateway implementation - it's performing above our expected SLA targets. Emily, the service registry patterns you've documented will be crucial for our next phase. Sandra, please prioritize the zero-trust security integration as we scale out. I've attached the updated architecture roadmap with Q1 2025 deliverables. Let's sync again Thursday to review any blockers. Great momentum, everyone!",
            timestamp: "2025-11-05T11:30:00.000Z",
            folder: "Sent Items",
            isRead: true,
            importance: "Normal",
            labels: ["architecture", "microservices", "migration", "team-update"]
        },

        // Project Management Communications
        {
            id: "email-003",
            from: "robert.wilson@company.com", // EMP006 - PORTAEH PM
            to: ["abrar.haq@company.com", "dev.sparrow@company.com", "priya.sharma@company.com", "raj.patel@company.com"],
            cc: ["lisa.chen@company.com"],
            subject: "PORTAEH Project Status - Week Ending Nov 1st",
            body: "Team, Here's our weekly PORTAEH project update. We're currently at 78% completion with excellent progress on multiple fronts: ✅ ETL pipeline optimization (Abrar) - 95% complete, performance improved by 40% ✅ Outlook integration module (Dev) - 85% complete, API authentication working smoothly ⚠️ Real-time data streaming (Raj) - 70% complete, minor Kafka configuration issues identified 🔄 Data pipeline performance tuning (Priya) - 60% complete, focusing on bottleneck analysis. The ETL source availability issue from PORTAEH-3231 has been resolved thanks to Abrar's quick response. We're on track for our November 20th milestone. Next week's priorities include finalizing the Outlook module testing and resolving the streaming configuration. Great work everyone!",
            timestamp: "2025-11-04T16:45:00.000Z",
            folder: "Inbox",
            isRead: true,
            importance: "Normal",
            labels: ["portaeh", "project-update", "status", "weekly"]
        },
        {
            id: "email-004",
            from: "amanda.rodriguez@company.com", // EMP007 - CCACB PM
            to: ["dinesh.kumar@company.com", "suresh.reddy@company.com", "kamesh.reddy@company.com"],
            cc: ["lisa.chen@company.com"],
            subject: "CCACB Database Schema Updates - Urgent Review Required",
            body: "Hi Database Team, I need your immediate attention on the CCACB schema updates. We have three critical table creation tasks that require coordination: 1) DW_HS_AR_TITOLARE_EFFETTIVO columns (CCACB-11845) - Dinesh, this is highest priority for November 15th delivery. 2) DW_HS_GAG_STOCK_ESG_APE tables (CCACB-11894) - ESG reporting requirements have been finalized. 3) DW_HS_LIMITI_EM_TY_LO table (CCACB-11628) - Currently in progress, need status update. Kamesh, please review the performance impact analysis I've attached. We need to ensure these changes don't affect our current production workloads. Let's have a technical review meeting tomorrow at 2 PM. Please confirm attendance.",
            timestamp: "2025-11-04T14:20:00.000Z",
            folder: "Inbox",
            isRead: true,
            importance: "High",
            labels: ["ccacb", "database", "urgent", "review"]
        },

        // Technical Team Communications
        {
            id: "email-005",
            from: "abrar.haq@company.com", // EMP014 - ETL Team Lead
            to: ["priya.sharma@company.com", "raj.patel@company.com", "arjun.singh@company.com", "neha.gupta@company.com"],
            cc: ["robert.wilson@company.com"],
            subject: "ETL Pipeline Enhancement - Performance Optimization Results",
            body: "Team, Excellent news on our ETL performance optimization efforts! After implementing the new data pipeline architecture, we've achieved: 📈 40% improvement in processing speed 📈 60% reduction in memory usage 📈 25% decrease in error rates 🎯 99.7% uptime over the past 2 weeks. The PORTAEH-3231 incident taught us valuable lessons about monitoring and alerting. I've updated our ETL best practices documentation with these improvements. Priya, your bottleneck analysis was spot-on - the parallel processing changes made a huge difference. Raj, the Kafka integration is working smoothly now with the configuration tweaks. Next focus: implementing the real-time streaming enhancements. Great collaboration, everyone!",
            timestamp: "2025-11-04T13:15:00.000Z",
            folder: "Sent Items",
            isRead: true,
            importance: "Normal",
            labels: ["etl", "performance", "optimization", "results"]
        },
        {
            id: "email-006",
            from: "dinesh.kumar@company.com", // EMP015 - Database Team Lead
            to: ["suresh.reddy@company.com", "kamesh.reddy@company.com", "ravi.kumar@company.com", "anita.patel@company.com"],
            cc: ["amanda.rodriguez@company.com"],
            subject: "Database Performance Tuning - ESG Tables Implementation",
            body: "Database Team, Following our successful completion of CCACB-11724 (DW_HS_LIMITI_EM_TY_LO), we're moving forward with the ESG tables implementation. Here's our strategy: 🔹 DW_HS_GAG_STOCK_ESG_APE table structure finalized 🔹 Indexing strategy optimized for ESG reporting queries 🔹 Data migration scripts tested in staging environment 🔹 Performance benchmarks established. Kamesh, your performance tuning analysis for CCACB-11950 identified key optimization opportunities. Let's implement those indexing recommendations before production deployment. Suresh, please coordinate with the backup and recovery procedures. The ESG data requirements are complex, so we need to ensure data integrity throughout the migration. Target completion: November 30th. Weekly check-ins every Tuesday at 10 AM.",
            timestamp: "2025-11-04T11:30:00.000Z",
            folder: "Sent Items",
            isRead: true,
            importance: "Normal",
            labels: ["database", "esg", "performance", "ccacb"]
        },
        {
            id: "email-007",
            from: "dev.sparrow@company.com", // EMP021 - Integration Team Lead  
            to: ["megan.clark@company.com", "jacob.rodriguez@company.com", "tyler.johnson@company.com"],
            cc: ["michael.chen@company.com"],
            subject: "Integration Architecture Update - API Gateway Success Metrics",
            body: "Integration Team, Fantastic progress on our microservices integration initiatives! Here are this week's highlights: 🚀 API Gateway (Megan) - 99.9% uptime, handling 50K+ requests/day smoothly 🚀 Service Registry (Jacob) - All 23 services successfully registered and discoverable 🚀 Event-driven patterns - 95% reduction in point-to-point integrations 📊 Response times improved by 35% across all endpoints. The Outlook integration module for PORTAEH-3305 is performing exceptionally well. Authentication flows are solid, and we're seeing excellent user adoption. Tyler, your work on the message routing patterns has been instrumental in this success. Michael was impressed with our architecture documentation - it's becoming the gold standard for other teams. Next milestone: service mesh implementation. Keep up the outstanding work!",
            timestamp: "2025-11-05T10:45:00.000Z",
            folder: "Sent Items",
            isRead: true,
            importance: "Normal",
            labels: ["integration", "api", "microservices", "success"]
        },

        // Cross-Department Collaboration
        {
            id: "email-008",
            from: "mani.s@company.com", // EMP016 - Data Quality Lead
            to: ["abrar.haq@company.com", "dinesh.kumar@company.com", "dev.sparrow@company.com"],
            cc: ["lisa.chen@company.com"],
            subject: "Data Quality Framework - Cross-System Integration Results",
            body: "Hi Team, Our data quality framework implementation is showing excellent results across all systems! Integration highlights: ✅ ETL pipeline validation - 99.8% data accuracy achieved (Abrar's team) ✅ Database integrity checks - Zero critical issues in production (Dinesh's team) ✅ API data consistency - 100% schema compliance across integrations (Dev's team). The automated validation rules we implemented are catching issues before they reach production. We've identified and resolved 47 potential data quality issues this month alone. I'm particularly impressed with how well our monitoring integrates with the existing workflows. The data profiling dashboard is providing valuable insights for business stakeholders. Next phase: implementing predictive quality scoring. Excellent collaboration across all teams!",
            timestamp: "2025-11-03T15:20:00.000Z",
            folder: "Inbox",
            isRead: true,
            importance: "Normal",
            labels: ["data-quality", "integration", "collaboration", "results"]
        }
    ],

    // Email folders structure for different employee types
    folderStructures: {
        executive: ["Inbox", "Sent Items", "Strategic Planning", "Board Communications", "Leadership Team", "Deleted Items"],
        buManager: ["Inbox", "Sent Items", "Team Communications", "Project Updates", "Budget & Resources", "Vendor Communications", "Deleted Items"],
        projectManager: ["Inbox", "Sent Items", "Project Status", "Team Coordination", "Stakeholder Updates", "Issues & Risks", "Deleted Items"],
        teamLead: ["Inbox", "Sent Items", "Team Management", "Technical Discussions", "Code Reviews", "Training & Development", "Deleted Items"],
        teamMember: ["Inbox", "Sent Items", "Daily Work", "Technical Support", "Learning Resources", "Team Social", "Deleted Items"],
        admin: ["Inbox", "Sent Items", "System Notifications", "User Requests", "Maintenance", "Documentation", "Deleted Items"]
    },

    // Email signature patterns by role
    signatures: {
        executive: {
            template: "{name}\n{title}\n{company}\nDirect: {phone} | Mobile: {mobile}\n{email}\n\n\"Leading through innovation and collaboration\"",
            useCompanyLogo: true,
            includeDisclaimer: true
        },
        manager: {
            template: "{name}\n{title} | {department}\n{company}\nPhone: {phone}\n{email}",
            useCompanyLogo: true,
            includeDisclaimer: false
        },
        technical: {
            template: "{name}\n{title}\n{department} | {company}\n{email}\nLinkedIn: linkedin.com/in/{linkedin}",
            useCompanyLogo: false,
            includeDisclaimer: false
        },
        admin: {
            template: "{name}\n{title}\n{company}\nSupport: {phone}\n{email}\n\nFor urgent issues, please call the help desk at {helpdesk}",
            useCompanyLogo: true,
            includeDisclaimer: true
        }
    },

    // Meeting patterns and calendar integration
    meetingPatterns: {
        // Daily standup meetings
        dailyStandups: [
            { team: "ETL Team", time: "09:00", attendees: ["EMP014", "EMP031", "EMP032", "EMP033", "EMP034"] },
            { team: "Database Team", time: "09:30", attendees: ["EMP015", "EMP035", "EMP036", "EMP037", "EMP038"] },
            { team: "Integration Team", time: "10:00", attendees: ["EMP021", "EMP055", "EMP056", "EMP057", "EMP058"] },
            { team: "Data Quality Team", time: "10:30", attendees: ["EMP016", "EMP039", "EMP040", "EMP041", "EMP042"] }
        ],
        // Weekly team meetings  
        weeklyMeetings: [
            { meeting: "Leadership Sync", day: "Monday", time: "14:00", attendees: ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"] },
            { meeting: "PORTAEH Project Review", day: "Tuesday", time: "11:00", attendees: ["EMP006", "EMP014", "EMP021", "EMP031", "EMP032"] },
            { meeting: "CCACB Technical Review", day: "Wednesday", time: "14:00", attendees: ["EMP007", "EMP015", "EMP035", "EMP037", "EMP038"] },
            { meeting: "Architecture Planning", day: "Thursday", time: "15:00", attendees: ["EMP002", "EMP009", "EMP021", "EMP022", "EMP024"] }
        ],
        // Monthly strategic meetings
        monthlyMeetings: [
            { meeting: "Strategic Planning", day: "First Friday", time: "09:00", attendees: ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"] },
            { meeting: "Technology Review", day: "Second Friday", time: "14:00", attendees: ["EMP002", "EMP004", "EMP009", "EMP021", "EMP024"] },
            { meeting: "Operations Review", day: "Third Friday", time: "10:00", attendees: ["EMP005", "EMP011", "EMP012", "EMP013", "EMP026"] }
        ]
    },

    // Communication preferences by employee type
    communicationStyles: {
        executive: {
            preferredTime: "08:00-17:00",
            responseExpectation: "2-4 hours",
            meetingPreference: "Face-to-face or video calls",
            emailFrequency: "High - strategic communications"
        },
        manager: {
            preferredTime: "07:00-18:00",
            responseExpectation: "4-8 hours",
            meetingPreference: "Mixed - calls and in-person",
            emailFrequency: "High - coordination and updates"
        },
        technical: {
            preferredTime: "09:00-17:30",
            responseExpectation: "8-24 hours",
            meetingPreference: "Video calls with screen sharing",
            emailFrequency: "Moderate - technical discussions"
        },
        admin: {
            preferredTime: "08:30-17:00",
            responseExpectation: "1-2 hours for urgent, 24 hours for normal",
            meetingPreference: "Phone calls or chat",
            emailFrequency: "High - operational communications"
        }
    }
};

module.exports = outlookEmailData;