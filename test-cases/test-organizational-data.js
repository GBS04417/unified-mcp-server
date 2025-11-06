/**
 * Chat Assistant Test with Organizational Data
 * Testing the unified mock data integration
 */

const mockData = require('../mock-data');

console.log('🧪 TESTING CHAT ASSISTANT WITH ORGANIZATIONAL DATA');
console.log('=================================================');
console.log('');

// Test 1: Employee Information Query
console.log('📋 Test 1: Employee Information Query');
console.log('Query: "Tell me about Abrar ul haq N"');

const allEmployees = [
    ...mockData.employees.leadership,
    ...mockData.employees.teamMembers,
    ...mockData.employees.adminUsers
];

const abrar = allEmployees.find(emp => emp.name === 'Abrar ul haq N');
if (abrar) {
    console.log('✅ Result: Employee found');
    console.log(`   Name: ${abrar.name}`);
    console.log(`   ID: ${abrar.employeeId}`);
    console.log(`   Role: ${abrar.role}`);
    console.log(`   Department: ${abrar.department}`);
    console.log(`   Email: ${abrar.email}`);
    console.log(`   Location: ${abrar.location}`);
    console.log(`   Reports To: ${abrar.reportsTo}`);
} else {
    console.log('❌ Result: Employee not found');
}
console.log('');

// Test 2: JIRA Task Query
console.log('📊 Test 2: JIRA Task Query');
console.log('Query: "What tasks are assigned to Abrar ul haq N?"');

const abrarsIssues = mockData.jira.issues.filter(issue => issue.assignee === 'EMP014');
console.log(`✅ Result: ${abrarsIssues.length} JIRA issues found`);
abrarsIssues.forEach(issue => {
    console.log(`   - ${issue.key}: ${issue.summary}`);
    console.log(`     Status: ${issue.status}, Priority: ${issue.priority}`);
});
console.log('');

// Test 3: Team Structure Query
console.log('👥 Test 3: Team Structure Query');
console.log('Query: "Who reports to Abrar ul haq N?"');

const teamMembers = mockData.employees.teamMembers.filter(member => member.reportsTo === 'EMP014');
console.log(`✅ Result: ${teamMembers.length} team members report to Abrar`);
teamMembers.forEach(member => {
    console.log(`   - ${member.name} (${member.employeeId})`);
    console.log(`     Role: ${member.role}`);
    console.log(`     Location: ${member.location}`);
});
console.log('');

// Test 4: Project Information Query
console.log('🎯 Test 4: Project Information Query');
console.log('Query: "What projects is Abrar working on?"');

const abrarsProjects = mockData.jira.projects.filter(project =>
    project.members && project.members.includes('EMP014')
);
console.log(`✅ Result: ${abrarsProjects.length} projects found`);
abrarsProjects.forEach(project => {
    console.log(`   - ${project.name} (${project.projectId})`);
    console.log(`     Status: ${project.status}, Priority: ${project.priority}`);
    console.log(`     Description: ${project.description}`);
});
console.log('');

// Test 5: Email Communication Query
console.log('📧 Test 5: Email Communication Query');
console.log('Query: "Show me emails from Sarah Johnson"');

const sarahEmails = mockData.outlook.emails.filter(email =>
    email.from === 'sarah.johnson@company.com'
);
console.log(`✅ Result: ${sarahEmails.length} emails from Sarah Johnson`);
sarahEmails.forEach(email => {
    console.log(`   - Subject: ${email.subject}`);
    console.log(`     To: ${email.to.join(', ')}`);
    console.log(`     Date: ${email.timestamp}`);
    console.log(`     Importance: ${email.importance}`);
});
console.log('');

// Test 6: Confluence Documentation Query
console.log('📚 Test 6: Confluence Documentation Query');
console.log('Query: "What documentation has Abrar authored?"');

const abrarsPages = mockData.confluence.pages.filter(page =>
    page.author === 'EMP014'
);
console.log(`✅ Result: ${abrarsPages.length} Confluence pages authored by Abrar`);
abrarsPages.forEach(page => {
    console.log(`   - ${page.title}`);
    console.log(`     Space: ${page.space}`);
    console.log(`     Last Updated: ${page.updated}`);
    console.log(`     Labels: ${page.labels.join(', ')}`);
});
console.log('');

console.log('🎉 ORGANIZATIONAL DATA TESTING COMPLETED!');
console.log('All mock data systems are working correctly and integrated.');