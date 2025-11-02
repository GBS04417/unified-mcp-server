/**
 * Test with detailed error checking
 */

const fs = require('fs');
const path = require('path');

async function testWithDetailedErrors() {
    console.log('DETAILED ERROR TEST\n');

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
                headers: Object.fromEntries(response.headers),
                body: data
            };
        }

        const foldersData = await graphRequest('/me/mailFolders?$select=id,displayName,parentFolderId&$top=500');
        const folders = foldersData.body.value;

        const source = folders.find(f => f.displayName === 'FOLDER-TEST');
        const target = folders.find(f => f.displayName === 'Test-Folder');

        console.log('Source:', source.displayName);
        console.log('Target:', target.displayName);
        console.log();

        console.log('Attempting PATCH with detailed response...\n');
        const result = await graphRequest(
            `/me/mailFolders/${source.id}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ parentFolderId: target.id })
            }
        );

        console.log('Status:', result.status, result.statusText);
        console.log('Headers:');
        Object.entries(result.headers).forEach(([k, v]) => {
            if (k.toLowerCase().includes('content') || k.toLowerCase().includes('x-')) {
                console.log(`  ${k}: ${v}`);
            }
        });
        console.log();

        console.log('Response Body:');
        console.log(JSON.stringify(result.body, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testWithDetailedErrors();
