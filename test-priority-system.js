/**
 * Priority System Test Script
 */

// Test the priority system components
async function testPrioritySystem() {
    console.log('🧪 Testing Priority System Components...');

    try {
        // Test 1: Import modules
        console.log('📦 Testing imports...');
        const DataFetcher = require('./priority-system/data-fetcher');
        const ScoringEngine = require('./priority-system/scoring-engine');
        const DataAggregator = require('./priority-system/data-aggregator');
        const PrioritySystemService = require('./priority-system/index');
        console.log('✅ All modules imported successfully');

        // Test 2: Create scoring engine
        console.log('🧮 Testing scoring engine...');
        const scoringEngine = new ScoringEngine();

        // Test JIRA scoring
        const testJiraTask = {
            key: 'TEST-123',
            summary: 'Urgent bug fix needed ASAP',
            priority: 'High',
            status: 'In Progress',
            assignee: 'Test User',
            dueDate: '2025-11-01', // Yesterday (overdue)
            description: 'Critical issue blocking production'
        };

        const jiraScore = scoringEngine.calculateJIRAScore(testJiraTask);
        console.log('✅ JIRA scoring test:', jiraScore);

        // Test Confluence scoring
        const testConfluencePage = {
            id: 'TEST-PAGE',
            title: 'Urgent: Project Update Required',
            lastModified: new Date().toISOString(), // Just now
            content: 'This is an urgent update with @mentions needed immediately',
            labels: [{ name: 'urgent' }, { name: 'critical' }],
            version: 15 // High collaboration
        };

        const confluenceScore = scoringEngine.calculateConfluenceScore(testConfluencePage);
        console.log('✅ Confluence scoring test:', confluenceScore);

        // Test Outlook scoring
        const testOutlookEmail = {
            id: 'TEST-EMAIL',
            subject: 'URGENT: Client escalation requires immediate action',
            from: {
                emailAddress: {
                    address: 'client@important.com',
                    name: 'Important Client'
                }
            },
            importance: 'high',
            flag: { flagStatus: 'flagged' },
            isRead: false,
            receivedDateTime: '2025-11-01T10:00:00Z', // 2 days ago
            bodyPreview: 'Please respond ASAP with the updated timeline'
        };

        const outlookScore = scoringEngine.calculateOutlookScore(testOutlookEmail);
        console.log('✅ Outlook scoring test:', outlookScore);

        // Test urgency levels
        console.log('🎯 Testing urgency levels...');
        console.log('JIRA Task Urgency:', scoringEngine.getUrgencyLevel(jiraScore.score));
        console.log('Confluence Page Urgency:', scoringEngine.getUrgencyLevel(confluenceScore.score));
        console.log('Outlook Email Urgency:', scoringEngine.getUrgencyLevel(outlookScore.score));

        console.log('\n🎉 Priority System Test Complete!');
        console.log('📊 Summary:');
        console.log(`- JIRA Task: ${jiraScore.score}/100 (${scoringEngine.getUrgencyLevel(jiraScore.score)})`);
        console.log(`- Confluence Page: ${confluenceScore.score}/100 (${scoringEngine.getUrgencyLevel(confluenceScore.score)})`);
        console.log(`- Outlook Email: ${outlookScore.score}/100 (${scoringEngine.getUrgencyLevel(outlookScore.score)})`);

        return {
            success: true,
            scores: {
                jira: jiraScore.score,
                confluence: confluenceScore.score,
                outlook: outlookScore.score
            }
        };

    } catch (error) {
        console.error('❌ Priority System Test Failed:', error.message);
        console.error(error.stack);
        return { success: false, error: error.message };
    }
}

// Run the test
if (require.main === module) {
    testPrioritySystem().then(result => {
        if (result.success) {
            console.log('\n✅ All tests passed!');
            process.exit(0);
        } else {
            console.log('\n❌ Tests failed!');
            process.exit(1);
        }
    });
}

module.exports = testPrioritySystem;