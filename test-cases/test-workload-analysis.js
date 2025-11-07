const Assistant = require('../chat-assistant/rule_based_assistant');

async function testWorkloadAnalysis() {
    console.log('🤖 Testing Workload Analysis Query');
    console.log('============================================================');

    const assistant = new Assistant();
    const query = "workload analysis of my team members";

    console.log('Query:', query);
    console.log('');

    try {
        const result = await assistant.chat(query);

        console.log('🔍 Analysis:');
        console.log('  Intent:', result.intent);
        console.log('  Confidence:', result.confidence);
        console.log('  User Context:', result.hasUserContext);
        console.log('');

        console.log('📝 Response:');
        console.log(result.response);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testWorkloadAnalysis();