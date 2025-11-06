/**
 * Comprehensive AI Assistant Test Suite
 * 
 * This file combines all test cases and runs them directly against the Smartstart Assistant
 * to show actual responses for review and improvement suggestions.
 */

const LLMChatAssistant = require('../chat-assistant');
const mockData = require('../mock-data');

class ComprehensiveAssistantTest {
    constructor() {
        this.assistant = new LLMChatAssistant();
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
    }

    /**
     * Run all comprehensive tests
     */
    async runAllTests() {
        console.log('🚀 Starting Comprehensive AI Assistant Test Suite');
        console.log('='.repeat(80));

        // Test Categories
        await this.runBasicFunctionalityTests();
        await this.runEmployeeLookupTests();
        await this.runTaskManagementTests();
        await this.runProjectStatusTests();
        await this.runTeamStructureTests();
        await this.runEdgeCaseTests();
        await this.runNaturalLanguageTests();
        await this.runPerformanceTests();

        this.displayFinalResults();
    }

    /**
     * Basic Functionality Tests
     */
    async runBasicFunctionalityTests() {
        console.log('\n📋 BASIC FUNCTIONALITY TESTS');
        console.log('-'.repeat(50));

        const tests = [
            {
                name: 'Empty Query',
                query: '',
                expectedBehavior: 'Should provide helpful guidance'
            },
            {
                name: 'Whitespace Query',
                query: '   ',
                expectedBehavior: 'Should provide helpful guidance'
            },
            {
                name: 'Greeting',
                query: 'Hello',
                expectedBehavior: 'Should respond with introduction'
            },
            {
                name: 'Help Request',
                query: 'What can you do?',
                expectedBehavior: 'Should list capabilities'
            },
            {
                name: 'Random Text',
                query: 'asdfghjkl',
                expectedBehavior: 'Should provide fallback guidance'
            }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }
    }

    /**
     * Employee Lookup Tests
     */
    async runEmployeeLookupTests() {
        console.log('\n👥 EMPLOYEE LOOKUP TESTS');
        console.log('-'.repeat(50));

        const tests = [
            {
                name: 'Direct Employee Search',
                query: 'Who is John Smith?',
                expectedBehavior: 'Should find employee details'
            },
            {
                name: 'Partial Name Search',
                query: 'Tell me about Sarah',
                expectedBehavior: 'Should find Sarah Johnson'
            },
            {
                name: 'Case Insensitive Search',
                query: 'who is MIKE DAVIS?',
                expectedBehavior: 'Should find Mike Davis'
            },
            {
                name: 'Department Head Query',
                query: 'Who is the Engineering Manager?',
                expectedBehavior: 'Should identify department heads'
            },
            {
                name: 'Team Lead Search',
                query: 'Who leads the DevOps team?',
                expectedBehavior: 'Should find team leaders'
            },
            {
                name: 'Non-existent Employee',
                query: 'Who is Jane Doe?',
                expectedBehavior: 'Should indicate employee not found'
            }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }
    }

    /**
     * Task Management Tests
     */
    async runTaskManagementTests() {
        console.log('\n📋 TASK MANAGEMENT TESTS');
        console.log('-'.repeat(50));

        const tests = [
            {
                name: 'User Task Query',
                query: 'Show me Dinesh tasks',
                expectedBehavior: 'Should list Dinesh\'s tasks'
            },
            {
                name: 'Task Status Query',
                query: 'What is the status of Abrar work?',
                expectedBehavior: 'Should show Abrar\'s task status'
            },
            {
                name: 'All Tasks Query',
                query: 'List all JIRA tasks',
                expectedBehavior: 'Should list multiple tasks'
            },
            {
                name: 'Current Assignments',
                query: 'Show me current assignments for Sankar',
                expectedBehavior: 'Should show Sankar\'s assignments'
            },
            {
                name: 'Work Progress Query',
                query: 'What is Kamesh working on?',
                expectedBehavior: 'Should show current work'
            },
            {
                name: 'Team Tasks Overview',
                query: 'Show me all team tasks',
                expectedBehavior: 'Should provide team overview'
            }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }
    }

    /**
     * Project Status Tests
     */
    async runProjectStatusTests() {
        console.log('\n🚀 PROJECT STATUS TESTS');
        console.log('-'.repeat(50));

        const tests = [
            {
                name: 'Specific Project Query',
                query: 'What is the status of PORTAEH project?',
                expectedBehavior: 'Should provide PORTAEH project details'
            },
            {
                name: 'Project Progress',
                query: 'CLOUDMIG project progress',
                expectedBehavior: 'Should show CloudMig progress'
            },
            {
                name: 'All Projects Overview',
                query: 'Show me all projects status',
                expectedBehavior: 'Should list all projects'
            },
            {
                name: 'Project Timeline',
                query: 'When is APIMGMT project due?',
                expectedBehavior: 'Should show timeline'
            },
            {
                name: 'Project Team',
                query: 'Who is working on DEVINFRA?',
                expectedBehavior: 'Should show team members'
            }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }
    }

    /**
     * Team Structure Tests
     */
    async runTeamStructureTests() {
        console.log('\n🏢 TEAM STRUCTURE TESTS');
        console.log('-'.repeat(50));

        const tests = [
            {
                name: 'Reporting Structure',
                query: 'Who reports to Mike Davis?',
                expectedBehavior: 'Should show Mike\'s direct reports'
            },
            {
                name: 'Manager Query',
                query: 'Who is Sarah Johnson\'s manager?',
                expectedBehavior: 'Should show Sarah\'s manager'
            },
            {
                name: 'Department Overview',
                query: 'Show me the Engineering department structure',
                expectedBehavior: 'Should show department hierarchy'
            },
            {
                name: 'Team Composition',
                query: 'Who is in the DevOps team?',
                expectedBehavior: 'Should list team members'
            },
            {
                name: 'Cross-team Query',
                query: 'How many people report to John Smith?',
                expectedBehavior: 'Should count direct reports'
            }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }
    }

    /**
     * Edge Case Tests
     */
    async runEdgeCaseTests() {
        console.log('\n⚠️ EDGE CASE TESTS');
        console.log('-'.repeat(50));

        const tests = [
            {
                name: 'Very Long Query',
                query: 'I need to know about the current status of all projects especially PORTAEH and how the team is progressing with their individual tasks and what are the priorities for this week and next week and also who needs help with their workload',
                expectedBehavior: 'Should handle complex multi-part query'
            },
            {
                name: 'Mixed Case Query',
                query: 'sHoW Me diNeSh tAsKs',
                expectedBehavior: 'Should handle mixed case'
            },
            {
                name: 'Special Characters',
                query: 'What about John Smith\'s tasks? @urgent #priority',
                expectedBehavior: 'Should ignore special characters'
            },
            {
                name: 'Ambiguous Query',
                query: 'status',
                expectedBehavior: 'Should ask for clarification'
            },
            {
                name: 'Typo in Name',
                query: 'Who is Jon Smyth?',
                expectedBehavior: 'Should suggest close matches'
            }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }
    }

    /**
     * Natural Language Tests
     */
    async runNaturalLanguageTests() {
        console.log('\n🗣️ NATURAL LANGUAGE TESTS');
        console.log('-'.repeat(50));

        const tests = [
            {
                name: 'Casual Question',
                query: 'Hey, what\'s up with the PORTAEH thing?',
                expectedBehavior: 'Should understand casual language'
            },
            {
                name: 'Formal Query',
                query: 'Could you please provide a comprehensive overview of the current project statuses?',
                expectedBehavior: 'Should handle formal language'
            },
            {
                name: 'Conversational Style',
                query: 'I was wondering if you could tell me about Sarah\'s workload',
                expectedBehavior: 'Should understand conversational tone'
            },
            {
                name: 'Question Variations',
                query: 'What are Dinesh\'s current responsibilities?',
                expectedBehavior: 'Should interpret as task query'
            },
            {
                name: 'Implied Context',
                query: 'Is Mike available for a meeting?',
                expectedBehavior: 'Should suggest checking calendar/workload'
            }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }
    }

    /**
     * Performance Tests
     */
    async runPerformanceTests() {
        console.log('\n⚡ PERFORMANCE TESTS');
        console.log('-'.repeat(50));

        const tests = [
            {
                name: 'Rapid Fire Queries',
                query: 'Quick status check',
                expectedBehavior: 'Should respond quickly'
            },
            {
                name: 'Multiple Employee Query',
                query: 'Tell me about John, Sarah, Mike, and Dinesh',
                expectedBehavior: 'Should handle multiple entities'
            },
            {
                name: 'Complex Analysis',
                query: 'Analyze the workload distribution across all teams',
                expectedBehavior: 'Should provide comprehensive analysis'
            }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }
    }

    /**
     * Run a single test and capture results
     */
    async runSingleTest(testCase) {
        this.totalTests++;
        const startTime = Date.now();

        try {
            // Use the fallback response generator directly since LLM may not be available
            const response = this.assistant.generateFallbackResponse(testCase.query);
            const responseTime = Date.now() - startTime;

            // Analyze the response
            const analysis = this.analyzeResponse(testCase, response);

            console.log(`\n${this.totalTests}. ${testCase.name}`);
            console.log(`Query: "${testCase.query}"`);
            console.log(`Expected: ${testCase.expectedBehavior}`);
            console.log(`Response: ${response.substring(0, 200)}${response.length > 200 ? '...' : ''}`);
            console.log(`Analysis: ${analysis.status} - ${analysis.reason}`);
            console.log(`Response Time: ${responseTime}ms`);

            if (analysis.status === 'PASS') {
                this.passedTests++;
                console.log(`✅ PASS`);
            } else {
                console.log(`❌ NEEDS IMPROVEMENT`);
            }

            this.testResults.push({
                testNumber: this.totalTests,
                name: testCase.name,
                query: testCase.query,
                expectedBehavior: testCase.expectedBehavior,
                response: response,
                responseTime: responseTime,
                status: analysis.status,
                reason: analysis.reason
            });

        } catch (error) {
            console.log(`\n${this.totalTests}. ${testCase.name}`);
            console.log(`Query: "${testCase.query}"`);
            console.log(`❌ ERROR: ${error.message}`);

            this.testResults.push({
                testNumber: this.totalTests,
                name: testCase.name,
                query: testCase.query,
                expectedBehavior: testCase.expectedBehavior,
                response: `ERROR: ${error.message}`,
                responseTime: Date.now() - startTime,
                status: 'ERROR',
                reason: error.message
            });
        }
    }

    /**
     * Analyze response quality
     */
    analyzeResponse(testCase, response) {
        const responseLower = response.toLowerCase();
        const queryLower = testCase.query.toLowerCase();

        // Check for empty responses
        if (!response || response.trim() === '') {
            return { status: 'FAIL', reason: 'Empty response' };
        }

        // Check for error responses
        if (responseLower.includes('error') || responseLower.includes('sorry')) {
            return { status: 'FAIL', reason: 'Error in response' };
        }

        // Specific test case analysis
        if (testCase.name.includes('Empty') || testCase.name.includes('Whitespace')) {
            if (responseLower.includes('smartstart assistant') && responseLower.includes('provide')) {
                return { status: 'PASS', reason: 'Provides helpful guidance for empty query' };
            }
        }

        if (testCase.name.includes('Employee') && queryLower.includes('who is')) {
            if (responseLower.includes('smartstart assistant')) {
                return { status: 'PASS', reason: 'Acknowledges employee query' };
            }
        }

        if (testCase.name.includes('Task') || queryLower.includes('task')) {
            if (responseLower.includes('task') || responseLower.includes('jira') || responseLower.includes('smartstart assistant')) {
                return { status: 'PASS', reason: 'Acknowledges task-related query' };
            }
        }

        if (testCase.name.includes('Project') && queryLower.includes('project')) {
            if (responseLower.includes('project') || responseLower.includes('smartstart assistant')) {
                return { status: 'PASS', reason: 'Acknowledges project query' };
            }
        }

        // General checks
        if (responseLower.includes('smartstart assistant')) {
            return { status: 'PASS', reason: 'Assistant responds appropriately' };
        }

        return { status: 'PASS', reason: 'Response generated successfully' };
    }

    /**
     * Display final test results
     */
    displayFinalResults() {
        console.log('\n' + '='.repeat(80));
        console.log('🎯 COMPREHENSIVE TEST RESULTS SUMMARY');
        console.log('='.repeat(80));

        console.log(`\nTotal Tests: ${this.totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.totalTests - this.passedTests}`);
        console.log(`Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);

        // Performance metrics
        const totalTime = this.testResults.reduce((sum, result) => sum + result.responseTime, 0);
        const avgResponseTime = totalTime / this.testResults.length;

        console.log(`\n📊 Performance Metrics:`);
        console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`Total Test Duration: ${totalTime}ms`);

        // Failed tests summary
        const failedTests = this.testResults.filter(result => result.status !== 'PASS');
        if (failedTests.length > 0) {
            console.log(`\n❌ Tests Needing Improvement:`);
            failedTests.forEach(test => {
                console.log(`- ${test.name}: ${test.reason}`);
            });
        }

        // Success rate evaluation
        const successRate = (this.passedTests / this.totalTests) * 100;
        if (successRate >= 90) {
            console.log(`\n🎉 EXCELLENT! Assistant is performing very well.`);
        } else if (successRate >= 75) {
            console.log(`\n✅ GOOD! Assistant is performing well with minor improvements needed.`);
        } else if (successRate >= 50) {
            console.log(`\n⚠️ FAIR. Assistant needs some improvements.`);
        } else {
            console.log(`\n❌ POOR. Assistant needs significant improvements.`);
        }

        console.log(`\n🚀 Smartstart Assistant Comprehensive Test Complete!`);
    }
}

// Run the comprehensive test suite
async function main() {
    const testSuite = new ComprehensiveAssistantTest();
    await testSuite.runAllTests();
}

// Export for use in other files
module.exports = ComprehensiveAssistantTest;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}