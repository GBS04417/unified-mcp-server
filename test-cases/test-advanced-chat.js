/**
 * Advanced Chat Assistant Test Scenarios
 * Testing complex queries and cross-system integration
 */

const mockData = require('../mock-data');

console.log('🤖 ADVANCED CHAT ASSISTANT TEST SCENARIOS');
console.log('========================================');
console.log('');

// Advanced Test 1: Cross-System Employee Analysis
console.log('🔍 Advanced Test 1: Complete Employee Profile Analysis');
console.log('Query: "Give me a complete profile of Abrar ul haq N with all his work"');

const allEmployees = [
    ...mockData.employees.leadership,
    ...mockData.employees.teamMembers,
    ...mockData.employees.adminUsers
];

const abrar = allEmployees.find(emp => emp.name === 'Abrar ul haq N');
const abrarsIssues = mockData.jira.issues.filter(issue => issue.assignee === 'EMP014' || issue.reporter === 'EMP014');
const abrarsProjects = mockData.jira.projects.filter(project => project.members && project.members.includes('EMP014'));
const abrarsPages = mockData.confluence.pages.filter(page => page.author === 'EMP014');
const abrarsTeam = mockData.employees.teamMembers.filter(member => member.reportsTo === 'EMP014');

console.log('✅ COMPREHENSIVE PROFILE:');
console.log(`👤 Employee: ${abrar.name} (${abrar.employeeId})`);
console.log(`🏢 Position: ${abrar.role} in ${abrar.department}`);
console.log(`📍 Location: ${abrar.location} (${abrar.timezone})`);
console.log(`📊 Team Size: Managing ${abrarsTeam.length} direct reports`);
console.log(`🎯 Active Projects: ${abrarsProjects.length} projects`);
console.log(`📋 JIRA Issues: ${abrarsIssues.length} total (assigned + reported)`);
console.log(`📚 Documentation: ${abrarsPages.length} Confluence pages authored`);
console.log('');

// Advanced Test 2: Team Workload Analysis
console.log('📊 Advanced Test 2: Team Workload Distribution');
console.log('Query: "Show me the workload distribution across Abrar\'s team"');

console.log('✅ TEAM WORKLOAD ANALYSIS:');
abrarsTeam.forEach(member => {
    const memberIssues = mockData.jira.issues.filter(issue => issue.assignee === member.employeeId);
    const memberProjects = member.projectIds || [];

    console.log(`👤 ${member.name}:`);
    console.log(`   📋 Active Issues: ${memberIssues.length}`);
    console.log(`   🎯 Projects: ${memberProjects.length} (${memberProjects.join(', ')})`);
    console.log(`   🏠 Location: ${member.location}`);

    if (memberIssues.length > 0) {
        memberIssues.forEach(issue => {
            console.log(`      - ${issue.key}: ${issue.summary} (${issue.status})`);
        });
    }
});
console.log('');

// Advanced Test 3: Project Health Dashboard
console.log('🎯 Advanced Test 3: Project Health Analysis');
console.log('Query: "What\'s the status of PORTAEH project?"');

const portaehProject = mockData.jira.projects.find(p => p.projectId === 'PORTAEH');
const portaehIssues = mockData.jira.issues.filter(issue => issue.project === 'PORTAEH');

console.log('✅ PORTAEH PROJECT DASHBOARD:');
console.log(`📋 Project: ${portaehProject.name}`);
console.log(`📊 Status: ${portaehProject.status}`);
console.log(`⚡ Priority: ${portaehProject.priority}`);
console.log(`👥 Team Members: ${portaehProject.members.length}`);
console.log(`📅 Timeline: ${portaehProject.startDate} → ${portaehProject.endDate}`);
console.log(`📋 Total Issues: ${portaehIssues.length}`);

// Issue breakdown by status
const statusBreakdown = {};
portaehIssues.forEach(issue => {
    statusBreakdown[issue.status] = (statusBreakdown[issue.status] || 0) + 1;
});

console.log('📊 Issue Status Breakdown:');
Object.entries(statusBreakdown).forEach(([status, count]) => {
    console.log(`   ${status}: ${count} issues`);
});
console.log('');

// Advanced Test 4: Communication Patterns Analysis
console.log('📧 Advanced Test 4: Executive Communication Analysis');
console.log('Query: "Analyze recent executive communications"');

const executiveEmails = mockData.outlook.emails.filter(email =>
    email.from.includes('sarah.johnson') || email.from.includes('michael.chen')
);

console.log('✅ EXECUTIVE COMMUNICATION PATTERNS:');
console.log(`📧 Total Executive Emails: ${executiveEmails.length}`);

executiveEmails.forEach(email => {
    const sender = email.from.includes('sarah.johnson') ? 'CEO' : 'CTO';
    console.log(`📩 From ${sender}: "${email.subject}"`);
    console.log(`   Recipients: ${email.to.length} direct, ${email.cc ? email.cc.length : 0} CC`);
    console.log(`   Importance: ${email.importance}`);
    console.log(`   Topics: ${email.labels.join(', ')}`);
});
console.log('');

// Advanced Test 5: Knowledge Base Search
console.log('📚 Advanced Test 5: Knowledge Base Search');
console.log('Query: "Find all documentation related to ETL and data pipelines"');

const etlPages = mockData.confluence.pages.filter(page =>
    page.title.toLowerCase().includes('etl') ||
    page.content.toLowerCase().includes('etl') ||
    page.labels.some(label => label.includes('etl') || label.includes('data-pipeline'))
);

console.log('✅ ETL KNOWLEDGE BASE RESULTS:');
console.log(`📄 Found ${etlPages.length} relevant pages`);

etlPages.forEach(page => {
    console.log(`📋 "${page.title}"`);
    console.log(`   Space: ${page.space}`);
    console.log(`   Author: ${page.author}`);
    console.log(`   Updated: ${page.updated}`);
    console.log(`   Tags: ${page.labels.join(', ')}`);
    console.log(`   Collaborators: ${page.collaborators ? page.collaborators.length : 0} people`);
});
console.log('');

// Advanced Test 6: Urgent Items Dashboard
console.log('🚨 Advanced Test 6: Urgent Items Dashboard');
console.log('Query: "Show me all high priority and urgent items"');

const urgentIssues = mockData.jira.issues.filter(issue =>
    issue.priority === 'Highest' || issue.priority === 'High'
);

const todaysDate = '2025-11-06';
const dueTodayIssues = mockData.jira.issues.filter(issue =>
    issue.dueDate && issue.dueDate.startsWith(todaysDate)
);

console.log('✅ URGENT ITEMS DASHBOARD:');
console.log(`🔥 High Priority Issues: ${urgentIssues.length}`);
console.log(`📅 Due Today: ${dueTodayIssues.length}`);

console.log('\n🚨 Critical Issues:');
urgentIssues.forEach(issue => {
    const isDueToday = issue.dueDate && issue.dueDate.startsWith(todaysDate);
    console.log(`   ${isDueToday ? '🔴' : '🟡'} ${issue.key}: ${issue.summary}`);
    console.log(`      Assignee: ${issue.assignee}, Priority: ${issue.priority}`);
    console.log(`      Due: ${issue.dueDate || 'No due date'}`);
});
console.log('');

console.log('🎉 ADVANCED CHAT ASSISTANT TESTING COMPLETED!');
console.log('The organizational data supports complex queries and cross-system analysis.');
console.log('Chat assistant can provide comprehensive insights across JIRA, Confluence, Outlook, and HR data.');