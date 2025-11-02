require('dotenv').config();

// Import email modules directly
const handleListEmails = require('./outlook/email/list');
const handleMoveEmail = require('./outlook/email/move');

async function testMoveEmailTool() {
    try {
        console.log('🚀 Starting move-email tool test...\n');

        // Test 1: Get an email from inbox
        console.log('1. Getting an email from Inbox to move:');
        const inboxEmails = await handleListEmails({
            folder: 'inbox',
            count: 1
        });

        const emailText = inboxEmails.content[0].text;
        const emailIdMatch = emailText.match(/ID: ([^\n]+)/);

        if (!emailIdMatch) {
            console.log('❌ No emails found in inbox to test moving');
            return;
        }

        const emailId = emailIdMatch[1].trim();
        const subjectMatch = emailText.match(/Subject: ([^\n]+)/);
        const emailSubject = subjectMatch ? subjectMatch[1] : 'Unknown';

        console.log(`✅ Found email to move: "${emailSubject}"\nEmail ID: ${emailId}\n`);

        // Test 2: Move the email to Junk Email folder
        console.log('2. Testing move-email to "Junk Email" folder:');
        const moveResult = await handleMoveEmail({
            id: emailId,
            destinationFolder: 'Junk Email'
        });
        console.log('✅ Move result:', moveResult.content[0].text, '\n');

        // Test 3: Get another email from Junk Email to move to Drafts
        console.log('3. Testing move-email from "Junk Email" to "Drafts" folder:');
        const junkEmails = await handleListEmails({
            folder: 'Junk Email',
            count: 1
        });

        const junkEmailText = junkEmails.content[0].text;
        const junkEmailIdMatch = junkEmailText.match(/ID: ([^\n]+)/);

        if (!junkEmailIdMatch) {
            console.log('❌ No emails found in Junk Email folder');
        } else {
            const junkEmailId = junkEmailIdMatch[1].trim();
            const moveToDrafts = await handleMoveEmail({
                id: junkEmailId,
                destinationFolder: 'Drafts'
            });
            console.log('✅ Move to Drafts result:', moveToDrafts.content[0].text, '\n');
        }

        // Test 4: Move to non-existent folder
        console.log('4. Testing move-email to non-existent folder (should error):');
        const moveToNonExistent = await handleMoveEmail({
            id: emailId,
            destinationFolder: 'FakeFolder'
        });
        console.log('✅ Error handling:', moveToNonExistent.content[0].text, '\n');

        // Test 5: Move with missing destinationFolder
        console.log('5. Testing move-email with missing destinationFolder (should error):');
        const moveNoDestination = await handleMoveEmail({
            id: emailId
        });
        console.log('✅ Validation error:', moveNoDestination.content[0].text, '\n');

        console.log('✨ Move-email tool test complete!');
    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testMoveEmailTool();
