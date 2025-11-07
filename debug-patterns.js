/**
 * Debug Pattern Matching
 */

require('dotenv').config();

// Let's test the patterns directly
const patterns = [
    /^my\s+team\s+members?$/i,
    /^who\s+reports?\s+to\s+me\??$/i,
    /^my\s+direct\s+reports?$/i,
    /^who\s+are\s+my\s+team\s+members?$/i,
    /^show\s+me\s+my\s+team$/i,
    /^list\s+my\s+team\s+members?$/i,
    /^my\s+team$/i
];

const testQueries = [
    'my team',
    'my team members',
    'who reports to me?',
    'my direct reports'
];

console.log('Direct pattern testing:');
for (const query of testQueries) {
    console.log(`\nQuery: "${query}"`);
    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const match = query.match(pattern);
        if (match) {
            console.log(`  ✅ Matches pattern ${i}: ${pattern}`);
            console.log(`  Capture groups:`, match);
        }
    }
}

// Now test with the actual assistant
console.log('\n\nAssistant testing:');
delete require.cache[require.resolve('./chat-assistant/rule_based_assistant.js')];
const RuleBasedAssistant = require('./chat-assistant/rule_based_assistant.js');
const assistant = new RuleBasedAssistant();

for (const query of testQueries) {
    console.log(`\nQuery: "${query}"`);

    // Test each pattern in the team_structure array
    const teamPatterns = assistant.intentPatterns.team_structure;
    console.log(`  Found ${teamPatterns.length} team patterns`);

    for (let i = 0; i < teamPatterns.length; i++) {
        const pattern = teamPatterns[i];
        const match = query.match(pattern);
        if (match) {
            console.log(`  ✅ Assistant pattern ${i} matches: ${pattern}`);
            break;
        }
    }

    const analysis = assistant.analyzeMessageIntent(query);
    console.log(`  Intent: ${analysis.primaryIntent}`);
}