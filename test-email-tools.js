require('dotenv').config();

// Import email modules directly
const handleListEmails = require('./outlook/email/list');
const handleSearchEmails = require('./outlook/email/search');
const handleReadEmail = require('./outlook/email/read');
const handleSendEmail = require('./outlook/email/send');
const handleMarkAsRead = require('./outlook/email/mark-as-read');

async function testEmailTools() {
    try {
        // Test 1: List Emails
        console.log('\n1. Testing list-emails:');
        const listResult = await handleListEmails({
            maxEmails: 5,
            includeBody: false
        });
        console.log('✅ List emails success:', JSON.stringify(listResult, null, 2));

        // Get first email ID for testing
        const emailText = listResult?.content?.[0]?.text;
        const firstEmailMatch = emailText?.match(/ID: ([^\n]+)/);
        const firstEmailId = firstEmailMatch ? firstEmailMatch[1].trim() : null;

        console.log('📧 Found email ID for testing:', firstEmailId);

        if (firstEmailId) {
            // Test 2: Read Email
            console.log('\n2. Testing read-email:');
            const readResult = await handleReadEmail({
                id: firstEmailId
            });
            console.log('✅ Read email success:', JSON.stringify(readResult, null, 2));

            // Test 3: Mark as Read
            console.log('\n3. Testing mark-as-read:');
            const markResult = await handleMarkAsRead({
                id: firstEmailId,
                isRead: true
            });
            console.log('✅ Mark as read success:', JSON.stringify(markResult, null, 2));
        }

        // Test 4: Search Emails
        console.log('\n4. Testing search-emails with specific subject:');
        const searchResult = await handleSearchEmails({
            subject: 'Test Email',
            count: 10
        });
        console.log('✅ Search emails success:', JSON.stringify(searchResult, null, 2));

        // Test 5: Send Email to abrar.n@centrico.tech
        console.log('\n5. Testing send-email to abrar.n@centrico.tech:');
        const sendResult = await handleSendEmail({
            to: 'abrar.n@centrico.tech',
            subject: 'Test Email',
            body: '--ignore'
        });
        console.log('✅ Send email success:', JSON.stringify(sendResult, null, 2));

    } catch (error) {
        console.error('❌ Error testing email tools:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

// Run the tests
console.log('🚀 Starting email tools test...');
testEmailTools()
    .then(() => console.log('✨ Email tools test complete!'))
    .catch(error => console.error('💥 Fatal error:', error));