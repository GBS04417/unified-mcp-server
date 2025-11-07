/**
 * Chat Assistant Response Test
 * 
 * This test demonstrates the chat assistant responses with user context
 * and shows how "my" queries work with the synchronized GBS04417 data
 */

// Load environment variables
require('dotenv').config();

const RuleBasedAssistant = require('../chat-assistant/rule_based_assistant.js');

async function testChatAssistantResponses() {
    console.log('🤖 Testing Chat Assistant Responses\n');
    console.log('='.repeat(60));
    console.log('Expected User: GBS04417 (Abrar ul haq N)');
    console.log('='.repeat(60));

    const assistant = new RuleBasedAssistant();

    // Test queries that should show user context
    const testQueries = [
        {
            category: "👤 User Context Queries",
            queries: [
                "my tasks",
                "what are my tasks?",
                "show me my current work",
                "my projects",
                "what projects am i working on?",
                "my team members"
            ]
        },
        {
            category: "🔍 Explicit Name Queries (for comparison)",
            queries: [
                "Abrar ul haq N tasks",
                "show me Abrar ul haq N projects",
                "who reports to Abrar ul haq N"
            ]
        },
        {
            category: "📊 General Queries",
            queries: [
                "all employees",
                "urgent tasks",
                "team structure",
                "project status"
            ]
        }
    ];

    for (const category of testQueries) {
        console.log(`\n\n${category.category}`);
        console.log('━'.repeat(50));

        for (const query of category.queries) {
            try {
                console.log(`\n🔍 Query: "${query}"`);
                console.log('─'.repeat(40));

                const startTime = Date.now();
                const result = await assistant.chat(query);
                const duration = Date.now() - startTime;

                if (result.success) {
                    // Show metadata
                    console.log(`✅ Intent: ${result.intent}`);
                    console.log(`🎯 Confidence: ${result.confidence}`);
                    console.log(`⏱️ Response time: ${duration}ms`);

                    if (result.entities && Object.keys(result.entities).length > 0) {
                        console.log(`👤 Entities found: ${JSON.stringify(result.entities)}`);
                    }

                    // Check for user context indicators
                    if (result.response.includes('Abrar ul haq N') || result.response.includes('GBS04417')) {
                        console.log('🎉 User context detected in response!');
                    }

                    // Show the actual response
                    console.log('\n📝 Response:');
                    console.log('┌' + '─'.repeat(48) + '┐');
                    const lines = result.response.split('\n');
                    lines.forEach(line => {
                        console.log(`│ ${line.padEnd(46)} │`);
                    });
                    console.log('└' + '─'.repeat(48) + '┘');

                } else {
                    console.log(`❌ Error: ${result.error}`);
                }

            } catch (error) {
                console.error(`❌ Exception for "${query}":`, error.message);
            }
        }
    }

    // Test conversation flow
    console.log('\n\n🔄 Conversation Flow Test');
    console.log('━'.repeat(50));

    const conversation = [
        "Hi, I'm looking for information about my work",
        "what are my current tasks?",
        "tell me about the PORTAEH project",
        "who are my team members?",
        "what's urgent in my work?"
    ];

    for (let i = 0; i < conversation.length; i++) {
        const query = conversation[i];

        console.log(`\n${i + 1}. 👤 User: "${query}"`);
        console.log('─'.repeat(40));

        try {
            const result = await assistant.chat(query);

            if (result.success) {
                console.log(`🤖 Assistant (${result.intent}):`);
                console.log(result.response);
            } else {
                console.log(`❌ Assistant Error: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ Exception: ${error.message}`);
        }
    }

    console.log('\n\n✅ Chat Assistant Response Test Complete!');
    console.log('='.repeat(60));
}

if (require.main === module) {
    testChatAssistantResponses()
        .catch(error => {
            console.error('❌ Test failed:', error);
            process.exit(1);
        });
}