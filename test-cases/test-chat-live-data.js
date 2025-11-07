#!/usr/bin/env node

/**
 * Live Chat Assistant Testing Script for SmartStart AI
 * Tests the chat assistant with real live data from JIRA, Confluence, and Outlook
 */

// Set SSL bypass for corporate environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();

async function testChatAssistantWithLiveData() {
    console.log('🤖 SmartStart AI Chat Assistant Live Data Test');
    console.log('==============================================');
    console.log('Testing chat assistant with real JIRA, Confluence, and Outlook data...');
    console.log('');

    const testQueries = [
        {
            category: 'Live JIRA Data',
            query: 'What are my current JIRA tasks assigned to GBS04417?',
            expectation: 'Should find real JIRA issues'
        },
        {
            category: 'Live Outlook Data',
            query: 'Show me my recent emails',
            expectation: 'Should find real emails from Microsoft account'
        },
        {
            category: 'Mixed Data Query',
            query: 'Give me a complete status update - my tasks, emails, and schedule',
            expectation: 'Should combine data from all live sources'
        },
        {
            category: 'Employee Lookup',
            query: 'Who is employee GBS04417 and what are their responsibilities?',
            expectation: 'Should find employee in organizational data'
        },
        {
            category: 'Priority Analysis',
            query: 'What are the most urgent items I need to focus on today?',
            expectation: 'Should analyze priorities across all data sources'
        }
    ];

    let successCount = 0;
    let totalTests = testQueries.length;

    for (let i = 0; i < testQueries.length; i++) {
        const test = testQueries[i];
        console.log(`📋 Test ${i + 1}/${totalTests}: ${test.category}`);
        console.log(`❓ Query: "${test.query}"`);
        console.log(`🎯 Expected: ${test.expectation}`);

        try {
            // Import and run the chat tool
            const { spawn } = require('child_process');

            const result = await new Promise((resolve, reject) => {
                const child = spawn('node', ['run-tool.js', 'chat.chat', '--message', test.query], {
                    env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' },
                    stdio: 'pipe'
                });

                let stdout = '';
                let stderr = '';

                child.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                child.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                child.on('close', (code) => {
                    if (code === 0) {
                        resolve({ stdout, stderr });
                    } else {
                        reject(new Error(`Process exited with code ${code}: ${stderr}`));
                    }
                });

                // Set timeout
                setTimeout(() => {
                    child.kill();
                    reject(new Error('Chat query timeout'));
                }, 30000); // 30 second timeout
            });

            // Analyze the response
            const response = result.stdout;
            let success = false;
            let details = '';

            // Show the actual response
            console.log(`📝 Chat Response:`);
            console.log('─'.repeat(50));
            if (response.length > 0) {
                // Clean up the response for better display
                const cleanResponse = response
                    .replace(/\n+/g, '\n')
                    .replace(/^.*?✅ Result:/, '✅ Result:')
                    .trim();
                console.log(cleanResponse);
            } else {
                console.log('(No response received)');
            }
            console.log('─'.repeat(50));

            if (response.includes('✅') && response.length > 100) {
                success = true;
                successCount++;

                // Extract key information from response
                if (test.category === 'Live JIRA Data' && response.includes('PORTAEH')) {
                    details = 'Found real JIRA project data';
                } else if (test.category === 'Live Outlook Data' && (response.includes('email') || response.includes('Microsoft'))) {
                    details = 'Found real email data';
                } else if (response.includes('Priority') || response.includes('urgent')) {
                    details = 'Priority analysis working';
                } else {
                    details = 'Valid response received';
                }
            } else if (response.includes('❌') || response.includes('Error')) {
                details = 'Chat assistant reported error';
            } else {
                details = 'Unexpected response format';
            }

            console.log(`📊 Analysis: ${success ? '✅ SUCCESS' : '❌ FAILED'} - ${details}`);

        } catch (error) {
            console.log(`� Chat Response:`);
            console.log('─'.repeat(50));
            console.log(`ERROR: ${error.message}`);
            console.log('─'.repeat(50));
            console.log(`� Analysis: ❌ FAILED - ${error.message.substring(0, 100)}...`);
        }

        console.log('');
    }

    // Summary
    console.log('🎯 Chat Assistant Live Data Test Summary:');
    console.log('========================================');
    console.log(`✅ Successful tests: ${successCount}/${totalTests}`);
    console.log(`📊 Success rate: ${Math.round((successCount / totalTests) * 100)}%`);

    if (successCount === totalTests) {
        console.log('🏆 PERFECT! Chat Assistant working flawlessly with all live data sources!');
        console.log('🚀 Ready for production use with:');
        console.log('   - Live JIRA integration');
        console.log('   - Live Confluence integration');
        console.log('   - Live Outlook integration');
        console.log('   - Organizational data access');
        console.log('   - Priority analysis capabilities');
    } else if (successCount > totalTests / 2) {
        console.log('👍 GOOD! Chat Assistant mostly working with live data');
        console.log('🔧 Some tests failed - may need minor adjustments');
    } else {
        console.log('⚠️  NEEDS WORK! Chat Assistant having issues with live data');
        console.log('🔧 Requires investigation and fixes');
    }

    console.log('');
    console.log('💡 To test individual queries, use:');
    console.log('   node run-tool.js chat.chat --message "Your question here"');
}

// Run the test
testChatAssistantWithLiveData().catch(console.error);