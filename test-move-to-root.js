/**
 * Test moving folder to ROOT (removing parent)
 */

const fs = require('fs');
const path = require('path');

async function testMoveToRoot() {
    console.log('========================================');
    console.log('TEST: MOVE FOLDER TO ROOT');
    console.log('========================================\n');

    try {
        const tokenFilePath = path.join(__dirname, '.outlook-tokens.json');
        const tokenData = JSON.parse(fs.readFileSync(tokenFilePath, 'utf-8'));
        const accessToken = tokenData.access_token;

        async function graphRequest(endpoint, options = {}) {
            const url = `https://graph.microsoft.com/v1.0${endpoint}`;
            const method = options.method || 'GET';

            const fetchOptions = {
                method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            if (options.body) {
                fetchOptions.body = options.body;
            }

            const response = await fetch(url, fetchOptions);
            return await response.json();
        }

        console.log('[1] Fetching folders...');
        const foldersData = await graphRequest('/me/mailFolders?$select=id,displayName,parentFolderId&$top=500');
        const sourceFolder = foldersData.value.find(f => f.displayName === 'FOLDER-TEST');

        console.log(`✅ Found FOLDER-TEST (ID: ${sourceFolder.id})`);
        console.log(`   Current parent: ${sourceFolder.parentFolderId || 'root'}\n`);

        // Try moving to root by setting parentFolderId to null
        console.log('[2] Attempting to move to ROOT (parentFolderId: null)...');
        const moveResult1 = await graphRequest(
            `/me/mailFolders/${sourceFolder.id}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ parentFolderId: null })
            }
        );

        if (moveResult1.error) {
            console.error(`❌ Error (null): ${moveResult1.error.code} - ${moveResult1.error.message}\n`);
        } else {
            console.log('Response received:', JSON.stringify(moveResult1, null, 2).substring(0, 200));
            console.log();
        }

        // Try moving to empty string
        console.log('[3] Attempting to move to ROOT (parentFolderId: empty string)...');
        const moveResult2 = await graphRequest(
            `/me/mailFolders/${sourceFolder.id}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ parentFolderId: '' })
            }
        );

        if (moveResult2.error) {
            console.error(`❌ Error (empty): ${moveResult2.error.code} - ${moveResult2.error.message}\n`);
        } else {
            console.log('Response received:', JSON.stringify(moveResult2, null, 2).substring(0, 200));
            console.log();
        }

        // Verify what happened
        console.log('[4] Verifying current state...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedFolders = await graphRequest('/me/mailFolders?$select=id,displayName,parentFolderId&$top=500');
        const updated = updatedFolders.value.find(f => f.displayName === 'FOLDER-TEST');

        console.log(`FOLDER-TEST parent now: ${updated.parentFolderId || 'root'}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testMoveToRoot();
