const LLMChatAssistant = require('../chat-assistant');

console.log('=== Testing Empty Query Response ===');
const assistant = new LLMChatAssistant();
const result = assistant.generateFallbackResponse('');
console.log('\nEmpty Query Response:');
console.log(result);

console.log('\n=== Testing Whitespace Query Response ===');
const whitespaceResult = assistant.generateFallbackResponse('   ');
console.log('\nWhitespace Query Response:');
console.log(whitespaceResult);