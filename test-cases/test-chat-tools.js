require('dotenv').config();

const { jiraService } = require('../jira');
const { TeamPlanningService } = require('../team-planner');
const ChatAssistant = require('../chat-assistant');

async function testChatTools() {
    try {
        const teamPlanningService = new TeamPlanningService();
        const chat = new ChatAssistant();

        await chat.initialize({
            jiraService,
            teamPlanningService,
            outlookService: null,
            confluenceService: null
        });

        console.log('✅ Chat initialized with tools:', Array.from(chat.availableTools.keys()).join(', '));

        // Test JIRA tool
        console.log('\n🧪 Testing get_my_tasks tool...');
        const jiraResult = await chat.availableTools.get('get_my_tasks').handler({
            assignee: 'Dinesh Kumar M'
        });
        console.log('📋 JIRA result:', jiraResult.success ?
            `✅ Success - ${jiraResult.data?.length || 0} tasks found` :
            `❌ Error: ${jiraResult.error}`
        );

        // Test Team Planning tool
        console.log('\n🧪 Testing analyze_team_member tool...');
        const teamResult = await chat.availableTools.get('analyze_team_member').handler({
            memberName: 'Dinesh',
            month: '2025-11'
        });
        console.log('👥 Team result:', teamResult.success ?
            `✅ Success - ${teamResult.data?.summary?.totalTasks || 0} planned tasks` :
            `❌ Error: ${teamResult.error}`
        );

        console.log('\n🎉 Chat assistant tools validation completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testChatTools();