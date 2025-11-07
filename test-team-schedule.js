const Assistant = require('./chat-assistant/rule_based_assistant');

async function testTeamMemberSchedule() {
    console.log('🤖 Testing Team Member Schedule Query');
    console.log('============================================================');

    const assistant = new Assistant();
    const query = "give me my team member schedule";

    console.log('Query:', query);
    console.log('');

    // Check the analysis step by step
    const analysis = assistant.analyzeMessageIntent(query);

    console.log('🔍 Analysis Debug:');
    console.log('  Primary Intent:', analysis.primaryIntent);
    console.log('  Confidence:', analysis.confidence);
    console.log('  User Context Query:', analysis.isUserContextQuery);
    console.log('  Entities Names:', analysis.entities.names);
    console.log('  Secondary Intents:', analysis.secondaryIntents);
    console.log('');

    // Test the chat response
    try {
        const result = await assistant.chat(query);

        console.log('📝 Chat Result:');
        console.log('  Intent:', result.intent);
        console.log('  Confidence:', result.confidence);
        console.log('  User Context:', result.hasUserContext);
        console.log('');

        console.log('Response:');
        console.log(result.response);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testTeamMemberSchedule();