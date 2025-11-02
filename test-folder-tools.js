require('dotenv').config();

// Import email modules directly
const handleListEmails = require('./outlook/email/list');
const handleSearchEmails = require('./outlook/email/search');
const { GraphService } = require('./outlook/services/graph-service');

async function testFolderTools() {
    try {
        console.log('🚀 Starting folder-specific email tools test...\n');

        // First, let's list available folders
        console.log('0. Getting list of available folders:');
        const graphService = new GraphService();
        const foldersResponse = await graphService.graphRequest('/me/mailFolders?$top=50');
        const folderNames = foldersResponse.value.map(f => f.displayName);
        console.log(`Available folders: ${folderNames.join(', ')}\n`);

        // Test 1: List emails from Inbox
        console.log('1. Testing list-emails from Inbox:');
        const inboxEmails = await handleListEmails({
            folder: 'inbox',
            count: 5
        });
        console.log('✅ Inbox emails:', inboxEmails.content[0].text.substring(0, 200), '...\n');

        // Test 2: List emails from Drafts
        console.log('2. Testing list-emails from Drafts:');
        const draftsEmails = await handleListEmails({
            folder: 'Drafts',
            count: 5
        });
        console.log('✅ Drafts emails:', draftsEmails.content[0].text.substring(0, 200), '...\n');

        // Test 3: Search emails in Inbox with subject
        console.log('3. Testing search-emails in Inbox with subject "Test Email":');
        const searchInbox = await handleSearchEmails({
            folder: 'inbox',
            subject: 'Test Email',
            count: 5
        });
        console.log('✅ Search in Inbox:', searchInbox.content[0].text.substring(0, 200), '...\n');

        // Test 4: Search emails in Sent Items
        console.log('4. Testing search-emails in Sent Items:');
        const searchSent = await handleSearchEmails({
            folder: 'Sent Items',
            subject: 'Test',
            count: 5
        });
        console.log('✅ Search in Sent Items:', searchSent.content[0].text.substring(0, 200), '...\n');

        // Test 5: Try to list from non-existent folder
        console.log('5. Testing list-emails from non-existent folder (should error):');
        const invalidFolder = await handleListEmails({
            folder: 'NonExistentFolder',
            count: 5
        });
        console.log('✅ Error handling:', invalidFolder.content[0].text, '\n');

        console.log('✨ Folder-specific email tools test complete!');
    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testFolderTools();
