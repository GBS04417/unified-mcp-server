// Unified Mock Data Index - Organizational Data Integration
const employeesData = require('./employees.js');
const teamMembersData = require('./team-members.js');
const projectsJiraData = require('./projects-jira.js');
const confluencePagesData = require('./confluence-pages.js');
const outlookEmailsData = require('./outlook-emails.js');

const mockData = {
    jira: {
        issues: projectsJiraData.jiraIssues || [],
        projects: projectsJiraData.projects || []
    },
    confluence: {
        pages: confluencePagesData.pages || [],
        spaces: confluencePagesData.spaces || []
    },
    outlook: {
        emails: outlookEmailsData.emails || []
    },
    employees: {
        leadership: employeesData.employees || [],
        teamMembers: teamMembersData.teamMembers || [],
        adminUsers: teamMembersData.adminUsers || []
    }
};

module.exports = mockData;
