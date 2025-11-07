/**
 * Test User Context Functionality for "My" Queries
 * 
 * This test validates that the chat assistant correctly handles user context
 * when users say "my tasks", "my projects", etc.
 */

const { SmartStartAssistant } = require('../chat-assistant');

async function testUserContext() {
    console.log('🧪 Testing User Context Functionality...\n');

    const assistant = new SmartStartAssistant();

    const myQueries = [
        "my tasks",
        "what are my tasks",
        "show me my tasks",
        "list my tasks",
        "my current tasks",
        "my jira tasks",
        "what am i working on",
        "my work",
        "my assignments",
        "my projects",
        "what are my projects",
        "show me my projects",
        "list my projects",
        "what projects am i working on"
    ];

    console.log('📋 Testing "My" Queries with User Context:\n');
    console.log('Expected User: GBS04417 (Abrar ul haq N)\n');

    for (const query of myQueries) {
        try {
            console.log(`\n🔍 Query: "${query}"`);
            console.log('='.repeat(50));

            const result = await assistant.chat(query);

            if (result.success) {
                console.log(`✅ Intent: ${result.intent}`);
                console.log(`🎯 Confidence: ${result.confidence}`);
                console.log(`👤 Entities: ${JSON.stringify(result.entities)}`);
                console.log(`📝 Response:\n${result.response}`);

                // Check if response contains user context
                if (result.response.includes('GBS04417') || result.response.includes('Abrar')) {
                    console.log('🎉 User context correctly applied!');
                } else {
                    console.log('⚠️ User context may not be applied');
                }
            } else {
                console.log(`❌ Error: ${result.error}`);
            }

        } catch (error) {
            console.error(`❌ Exception for "${query}":`, error.message);
        }
    }

    console.log('\n🧪 Testing Regular Named Queries (should still work):\n');

    const namedQueries = [
        "Abrar ul haq N tasks",
        "show me John Doe tasks",
        "what is Sarah Johnson working on"
    ];

    for (const query of namedQueries) {
        try {
            console.log(`\n🔍 Query: "${query}"`);
            console.log('='.repeat(50));

            const result = await assistant.chat(query);

            if (result.success) {
                console.log(`✅ Intent: ${result.intent}`);
                console.log(`📝 Response:\n${result.response}`);
            } else {
                console.log(`❌ Error: ${result.error}`);
            }

        } catch (error) {
            console.error(`❌ Exception for "${query}":`, error.message);
        }
    }

    console.log('\n✅ User Context Test Complete!');
}

// Run the test
if (require.main === module) {
    testUserContext()
        .catch(error => {
            console.error('❌ Test failed:', error);
            process.exit(1);
        });
}

module.exports = { testUserContext };