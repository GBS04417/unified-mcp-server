#!/usr/bin/env node

/**
 * Generic Tool Runner for Unified MCP Server
 * 
 * Usage: node run-tool.js <service>.<tool-name> [--param value] [--param value]
 * 
 * Examples:
 *   node run-tool.js outlook.create-event --subject "Meeting" --attendees "user@domain.com" --start "2025-11-03T18:00:00"
 *   node run-tool.js jira.jira_fetch_by_assignee --assignee "Abrar ul haq N"
 *   node run-tool.js confluence.confluence_fetch --url "/display/ITDQ/Project+Management"
 *   node run-tool.js outlook.list-emails --count 5
 *   node run-tool.js outlook.list-events --count 10
 * 
 * Special parameter handling:
 *   --attendees "user1@domain.com,user2@domain.com" (comma-separated for arrays)
 *   --start "18:00" (time format, will use today's date)
 *   --date "2025-11-04" (date format for events)
 *   --json '{"key": "value"}' (JSON objects)
 *   --boolean-flag (boolean flags, no value needed)
 */

// Auto-setup environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();

// Import all tool modules
const { outlookTools } = require('./outlook');
const { jiraTools } = require('./jira');
const { confluenceTools } = require('./confluence');
const { priorityTools } = require('./utils');

// Combine all tools with service prefixes
const allTools = {
    outlook: outlookTools,
    jira: jiraTools,
    confluence: confluenceTools,
    priority: priorityTools
};/**
 * Parse command line arguments into parameters object
 */
function parseArguments(args) {
    const params = {};

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg.startsWith('--')) {
            const key = arg.substring(2);
            const nextArg = args[i + 1];

            // Handle boolean flags (no value provided)
            if (!nextArg || nextArg.startsWith('--')) {
                params[key] = true;
                continue;
            }

            let value = nextArg;

            // Special parameter transformations
            if (key === 'attendees' && typeof value === 'string') {
                // Split comma-separated emails
                params[key] = value.split(',').map(email => email.trim());
            } else if (key === 'start' && value.match(/^\d{2}:\d{2}$/)) {
                // Convert "18:00" to today's date at that time
                const [hours, minutes] = value.split(':');
                const date = new Date();
                date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                params[key] = date.toISOString();
            } else if (key === 'end' && value.match(/^\d{2}:\d{2}$/)) {
                // Convert "19:00" to today's date at that time  
                const [hours, minutes] = value.split(':');
                const date = new Date();
                date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                params[key] = date.toISOString();
            } else if (key === 'date') {
                // Handle date parameter for start/end times
                params._date = value; // Store for later processing
            } else if (value.startsWith('{') || value.startsWith('[')) {
                // Parse JSON objects/arrays
                try {
                    params[key] = JSON.parse(value);
                } catch (e) {
                    params[key] = value;
                }
            } else if (value === 'true') {
                params[key] = true;
            } else if (value === 'false') {
                params[key] = false;
            } else if (!isNaN(value)) {
                params[key] = parseFloat(value);
            } else {
                params[key] = value;
            }

            i++; // Skip next argument as it was the value
        }
    }

    // Post-process date handling
    if (params._date) {
        const baseDate = new Date(params._date);

        if (params.start && typeof params.start === 'string' && params.start.match(/^\d{2}:\d{2}$/)) {
            const [hours, minutes] = params.start.split(':');
            baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            params.start = baseDate.toISOString();
        }

        if (params.end && typeof params.end === 'string' && params.end.match(/^\d{2}:\d{2}$/)) {
            const [hours, minutes] = params.end.split(':');
            const endDate = new Date(baseDate);
            endDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            params.end = endDate.toISOString();
        }

        delete params._date;
    }

    return params;
}

/**
 * Find and execute a tool
 */
async function runTool(serviceAndTool, params) {
    const [serviceName, toolName] = serviceAndTool.split('.');

    if (!serviceName || !toolName) {
        throw new Error('Invalid format. Use: service.tool-name (e.g., outlook.create-event)');
    }

    const serviceTools = allTools[serviceName];
    if (!serviceTools) {
        throw new Error(`Service '${serviceName}' not found. Available: ${Object.keys(allTools).join(', ')}`);
    }

    const tool = serviceTools.find(t => t.name === toolName);
    if (!tool) {
        const availableTools = serviceTools.map(t => t.name).join(', ');
        throw new Error(`Tool '${toolName}' not found in '${serviceName}'. Available: ${availableTools}`);
    }

    console.log(`🔧 Running: ${serviceName}.${toolName}`);
    console.log(`📋 Parameters:`, JSON.stringify(params, null, 2));
    console.log('─'.repeat(50));

    const result = await tool.handler(params);
    return result;
}

/**
 * Format and display results
 */
function displayResult(result) {
    console.log('✅ Result:');
    console.log('═'.repeat(50));

    if (result.content && result.content[0]) {
        try {
            const parsed = JSON.parse(result.content[0].text);
            console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.log(result.content[0].text);
        }
    } else {
        console.log(JSON.stringify(result, null, 2));
    }
}

/**
 * Show available tools
 */
function showHelp() {
    console.log('🛠️  Available Tools:');
    console.log('═'.repeat(60));

    Object.entries(allTools).forEach(([service, tools]) => {
        console.log(`\n📦 ${service.toUpperCase()}:`);
        tools.forEach(tool => {
            console.log(`  • ${service}.${tool.name}`);
            if (tool.description) {
                console.log(`    ${tool.description}`);
            }
        });
    });

    console.log('\n💡 Usage Examples:');
    console.log('─'.repeat(40));
    console.log('node run-tool.js outlook.create-event --subject "Team Meeting" --attendees "user@domain.com" --start "18:00"');
    console.log('node run-tool.js jira.jira_fetch_by_assignee --assignee "Abrar ul haq N"');
    console.log('node run-tool.js confluence.confluence_fetch --url "/display/ITDQ/Project+Management"');
    console.log('node run-tool.js outlook.list-emails --count 5');
    console.log('node run-tool.js --help  # Show this help');
}

/**
 * Main execution
 */
async function main() {
    try {
        const args = process.argv.slice(2);

        if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
            showHelp();
            return;
        }

        const serviceAndTool = args[0];
        const params = parseArguments(args.slice(1));

        const result = await runTool(serviceAndTool, params);
        displayResult(result);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Use --help to see available tools and usage examples');
        process.exit(1);
    }
}

// Export for use as module
module.exports = {
    runTool,
    parseArguments,
    displayResult,
    allTools
};

// Run if called directly
if (require.main === module) {
    main();
}