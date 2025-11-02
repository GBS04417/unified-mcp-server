/**
 * Test moving folder with detailed response analysis
 */

const fs = require('fs');
const path = require('path');

async function testMove() {
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
            const data = await response.json();

            return {
                status: response.status,
                statusText: response.statusText,
                body: data
            };
        }

        console.log('========================================');
        console.log('MOVE TEST - DETAILED ANALYSIS');
        console.log('========================================\n');

        // Get all folders
        console.log('[1] Fetching all folders...');
        const allFolders = await graphRequest('/me/mailFolders?$select=id,displayName,parentFolderId&$top=500');
        const folders = allFolders.body.value;

        console.log(`Found ${folders.length} folders:\n`);
        folders.forEach((f, i) => {
            console.log(`  ${i + 1}. ${f.displayName} (parent: ${f.parentFolderId || 'none (root)'})`);
        });
        console.log();

        // Select any two different folders
        if (folders.length < 2) {
            console.log('❌ Need at least 2 folders to test. Current folders:', folders.map(f => f.displayName).join(', '));
            process.exit(0);
        }

        const source = folders[0];
        const target = folders.find(f => f.id !== source.id);

        if (!target) {
            console.log('❌ Cannot find a different target folder');
            process.exit(0);
        }

        console.log(`[2] Test case: Move "${source.displayName}" into "${target.displayName}"`);
        console.log(`    Source ID: ${source.id}`);
        console.log(`    Target ID: ${target.id}\n`);

        console.log('[3] Sending PATCH request...');
        const moveResult = await graphRequest(
            `/me/mailFolders/${source.id}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ parentFolderId: target.id })
            }
        );

        console.log(`    Status: ${moveResult.status} ${moveResult.statusText}`);
        console.log(`    Response parentFolderId: ${moveResult.body.parentFolderId || 'NOT SET'}\n`);

        if (moveResult.body.error) {
            console.log(`    Error: ${moveResult.body.error.code}`);
            console.log(`    Message: ${moveResult.body.error.message}\n`);
        }

        console.log('[4] Waiting 2 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('[5] Fetching updated folder structure...');
        const updated = await graphRequest('/me/mailFolders?$select=id,displayName,parentFolderId&$top=500');
        const updatedSource = updated.body.value.find(f => f.id === source.id);

        console.log(`    Source parent before: ${source.parentFolderId || 'root'}`);
        console.log(`    Source parent now: ${updatedSource.parentFolderId || 'root'}`);
        console.log(`    Target ID: ${target.id}\n`);

        if (updatedSource.parentFolderId === target.id) {
            console.log('✅✅✅ SUCCESS! Folder move WORKED!');
        } else {
            console.log('❌ FAILED. Folder did not move.');
            console.log('\nFullresponse from PATCH:');
            console.log(JSON.stringify(moveResult.body, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testMove();
