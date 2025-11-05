/**
 * Mock Data Index - Central Export and Utility Functions
 * Provides unified access to all mock data and helper functions
 * for development and testing across the MCP server
 */

const jiraMockData = require('./jira-mock-data');
const confluenceMockData = require('./confluence-mock-data');
const outlookMockData = require('./outlook-mock-data');

// Utility functions for cross-system data consistency
const mockDataUtils = {
    // Get common users across all systems
    getCommonUsers: () => {
        return [
            {
                id: "user1",
                accountId: "user1",
                displayName: "Abrar ul haq N",
                emailAddress: "abrar.ulhaq@company.com",
                department: "Data Engineering",
                title: "Senior ETL Developer",
                systems: ["jira", "confluence", "outlook"]
            },
            {
                id: "user2",
                accountId: "user2",
                displayName: "Dinesh Kumar M",
                emailAddress: "dinesh.kumar@company.com",
                department: "Database Administration",
                title: "Database Architect",
                systems: ["jira", "confluence", "outlook"]
            },
            {
                id: "user3",
                accountId: "user3",
                displayName: "Mani S",
                emailAddress: "mani.s@company.com",
                department: "Data Quality",
                title: "Data Quality Specialist",
                systems: ["jira", "confluence", "outlook"]
            },
            {
                id: "system",
                accountId: "system",
                displayName: "System Admin",
                emailAddress: "admin@company.com",
                department: "IT Operations",
                title: "System Administrator",
                systems: ["jira", "confluence", "outlook"]
            }
        ];
    },

    // Get projects common across systems
    getCommonProjects: () => {
        return [
            {
                key: "PORTAEH",
                name: "PORTAEH Project",
                description: "ETL and data processing for PORTAEH system",
                systems: ["jira", "confluence"]
            },
            {
                key: "CCACB",
                name: "CCACB Project",
                description: "Data warehouse and quality management for CCACB",
                systems: ["jira", "confluence"]
            }
        ];
    },

    // Generate realistic dates for consistent timelines
    generateRealisticDates: (baseDate = new Date()) => {
        const dates = {};
        dates.today = new Date(baseDate);
        dates.yesterday = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
        dates.weekAgo = new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        dates.monthAgo = new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        dates.tomorrow = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
        dates.nextWeek = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        return dates;
    },

    // Cross-reference data between systems
    findRelatedContent: (entityId, entityType) => {
        const related = {
            jira: [],
            confluence: [],
            outlook: []
        };

        // Find JIRA issues related to entity
        if (entityType === 'project') {
            related.jira = jiraMockData.issues.filter(issue =>
                issue.project.key === entityId
            );
            related.confluence = confluenceMockData.pages.filter(page =>
                page.spaceKey === entityId
            );
            related.outlook = outlookMockData.emails.filter(email =>
                email.subject.includes(entityId) ||
                email.parentFolderId === entityId.toLowerCase()
            );
        }

        // Find content by user
        if (entityType === 'user') {
            related.jira = jiraMockData.issues.filter(issue =>
                issue.assignee && issue.assignee.displayName.includes(entityId)
            );
            related.confluence = confluenceMockData.pages.filter(page =>
                page.createdBy.displayName.includes(entityId) ||
                page.lastModifiedBy.displayName.includes(entityId)
            );
            related.outlook = outlookMockData.emails.filter(email =>
                email.sender.emailAddress.name.includes(entityId) ||
                email.toRecipients.some(recipient =>
                    recipient.emailAddress.name.includes(entityId)
                )
            );
        }

        return related;
    },

    // Generate summary statistics
    getSystemSummary: () => {
        return {
            jira: {
                totalIssues: jiraMockData.issues.length,
                openIssues: jiraMockData.issues.filter(issue =>
                    !['Task Closed', 'Task Cancelled', 'Closed'].includes(issue.status.name)
                ).length,
                projects: Object.keys(jiraMockData.projects).length,
                users: jiraMockData.users.length
            },
            confluence: {
                totalPages: confluenceMockData.pages.length,
                spaces: confluenceMockData.spaces.length,
                recentlyUpdated: confluenceMockData.pages.filter(page => {
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return new Date(page.lastModified) > weekAgo;
                }).length,
                users: confluenceMockData.users.length
            },
            outlook: {
                totalEmails: outlookMockData.emails.length,
                unreadEmails: outlookMockData.emails.filter(email => !email.isRead).length,
                upcomingEvents: outlookMockData.calendarEvents.filter(event => {
                    return new Date(event.start.dateTime) > new Date();
                }).length,
                folders: outlookMockData.folders.length
            }
        };
    },

    // Generate realistic test scenarios
    generateTestScenarios: () => {
        return {
            // High priority JIRA issue with related Confluence documentation and email notifications
            criticalIssueScenario: {
                jiraIssue: jiraMockData.issues.find(issue => issue.priority.name === "Highest"),
                relatedPages: confluenceMockData.pages.filter(page =>
                    page.labels.includes('ETL') || page.labels.includes('database')
                ),
                relatedEmails: outlookMockData.emails.filter(email =>
                    email.importance === 'high'
                )
            },

            // User workload analysis
            userWorkloadScenario: {
                user: "Abrar ul haq N",
                jiraIssues: jiraMockData.issues.filter(issue =>
                    issue.assignee && issue.assignee.displayName === "Abrar ul haq N"
                ),
                confluenceContributions: confluenceMockData.pages.filter(page =>
                    page.createdBy.displayName === "Abrar ul haq N" ||
                    page.lastModifiedBy.displayName === "Abrar ul haq N"
                ),
                emailActivity: outlookMockData.emails.filter(email =>
                    email.sender.emailAddress.name === "Abrar ul haq N"
                ),
                upcomingMeetings: outlookMockData.calendarEvents.filter(event =>
                    event.attendees.some(attendee =>
                        attendee.emailAddress.name === "Abrar ul haq N"
                    )
                )
            },

            // Project status overview
            projectStatusScenario: {
                project: "PORTAEH",
                activeIssues: jiraMockData.issues.filter(issue =>
                    issue.project.key === "PORTAEH" &&
                    !['Task Closed', 'Task Cancelled'].includes(issue.status.name)
                ),
                documentation: confluenceMockData.pages.filter(page =>
                    page.spaceKey === "PORTAEH"
                ),
                projectEmails: outlookMockData.emails.filter(email =>
                    email.subject.includes("PORTAEH") ||
                    email.parentFolderId === "portaeh"
                ),
                upcomingMeetings: outlookMockData.calendarEvents.filter(event =>
                    event.subject.includes("PORTAEH")
                )
            }
        };
    },

    // Validate data consistency across systems
    validateDataConsistency: () => {
        const issues = [];

        // Check user consistency
        const jiraUsers = jiraMockData.users.map(u => u.displayName);
        const confluenceUsers = confluenceMockData.users.map(u => u.displayName);
        const outlookUsers = outlookMockData.users.map(u => u.displayName);

        const allUsers = [...new Set([...jiraUsers, ...confluenceUsers, ...outlookUsers])];

        allUsers.forEach(user => {
            if (!jiraUsers.includes(user)) issues.push(`User ${user} missing from JIRA`);
            if (!confluenceUsers.includes(user)) issues.push(`User ${user} missing from Confluence`);
            if (!outlookUsers.includes(user)) issues.push(`User ${user} missing from Outlook`);
        });

        // Check project consistency
        const jiraProjects = Object.keys(jiraMockData.projects);
        const confluenceSpaces = confluenceMockData.spaces
            .filter(s => jiraProjects.includes(s.key))
            .map(s => s.key);

        jiraProjects.forEach(project => {
            if (!confluenceSpaces.includes(project)) {
                issues.push(`Project ${project} has no corresponding Confluence space`);
            }
        });

        return {
            isValid: issues.length === 0,
            issues: issues,
            summary: `Validated ${allUsers.length} users and ${jiraProjects.length} projects`
        };
    }
};

// Main export object
const mockData = {
    // Individual system data
    jira: jiraMockData,
    confluence: confluenceMockData,
    outlook: outlookMockData,

    // Utility functions
    utils: mockDataUtils,

    // Quick access to common data
    users: mockDataUtils.getCommonUsers(),
    projects: mockDataUtils.getCommonProjects(),
    summary: mockDataUtils.getSystemSummary(),
    testScenarios: mockDataUtils.generateTestScenarios(),

    // Environment configuration
    config: {
        testMode: process.env.USE_TEST_MODE === 'true',
        baseUrl: {
            jira: "https://svil.bansel.it/jira",
            confluence: "https://confluence.company.com",
            outlook: "https://graph.microsoft.com/v1.0"
        },
        defaultDates: mockDataUtils.generateRealisticDates(),
        version: "1.0.0",
        lastUpdated: new Date().toISOString()
    },

    // Health check function
    healthCheck: () => {
        const validation = mockDataUtils.validateDataConsistency();
        const summary = mockDataUtils.getSystemSummary();

        return {
            status: validation.isValid ? "healthy" : "warnings",
            timestamp: new Date().toISOString(),
            validation: validation,
            dataStats: summary,
            systems: {
                jira: { available: true, itemCount: summary.jira.totalIssues },
                confluence: { available: true, itemCount: summary.confluence.totalPages },
                outlook: { available: true, itemCount: summary.outlook.totalEmails }
            }
        };
    }
};

module.exports = mockData;