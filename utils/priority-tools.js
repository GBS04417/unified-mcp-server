/**
 * Priority System Tools for run-tool.js integration
 */

const PrioritySystemService = require('../priority-system');

// Initialize priority system service
const prioritySystem = new PrioritySystemService();

const priorityTools = {

    /**
     * Generate comprehensive priority report
     */
    'generate_priority_report': {
        description: 'Generate comprehensive priority report from JIRA, Confluence, and Outlook with AI scoring',
        inputSchema: {
            type: 'object',
            properties: {
                focusUser: {
                    type: 'string',
                    description: 'Focus on specific user (e.g., "Abrar ul haq N")'
                },
                includeGreeting: {
                    type: 'boolean',
                    description: 'Include personalized greeting message',
                    default: true
                },
                maxItems: {
                    type: 'number',
                    description: 'Maximum number of items to return (default: 50)',
                    default: 50
                },
                minScore: {
                    type: 'number',
                    description: 'Minimum priority score threshold (0-100, default: 20)',
                    default: 20
                }
            }
        },
        handler: async (args) => {
            // Initialize if not already done
            if (!prioritySystem.aggregator) {
                const jiraService = require('../jira').jiraService;
                const confluenceService = require('../confluence').confluenceService;
                const outlookService = require('../outlook').outlookService;

                await prioritySystem.initialize(jiraService, confluenceService, outlookService);
            }

            return await prioritySystem.generatePriorityReport(args);
        }
    },

    /**
     * Get only urgent and high priority items
     */
    'get_urgent_items': {
        description: 'Get only urgent and high priority items requiring immediate attention',
        inputSchema: {
            type: 'object',
            properties: {
                focusUser: {
                    type: 'string',
                    description: 'Focus on specific user (e.g., "Abrar ul haq N")'
                },
                urgencyLevels: {
                    type: 'array',
                    items: { type: 'string', enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'] },
                    description: 'Include items with these urgency levels',
                    default: ['URGENT', 'HIGH']
                }
            }
        },
        handler: async (args) => {
            if (!prioritySystem.aggregator) {
                const jiraService = require('../jira').jiraService;
                const confluenceService = require('../confluence').confluenceService;
                const outlookService = require('../outlook').outlookService;

                await prioritySystem.initialize(jiraService, confluenceService, outlookService);
            }

            return await prioritySystem.getUrgentItems(args);
        }
    },

    /**
     * Get workload capacity analysis
     */
    'workload_analysis': {
        description: 'Analyze workload capacity and provide recommendations',
        inputSchema: {
            type: 'object',
            properties: {
                focusUser: {
                    type: 'string',
                    description: 'Focus on specific user (e.g., "Abrar ul haq N")'
                }
            }
        },
        handler: async (args) => {
            if (!prioritySystem.aggregator) {
                const jiraService = require('../jira').jiraService;
                const confluenceService = require('../confluence').confluenceService;
                const outlookService = require('../outlook').outlookService;

                await prioritySystem.initialize(jiraService, confluenceService, outlookService);
            }

            return await prioritySystem.getWorkloadSummary(args);
        }
    },

    /**
     * Get dashboard data for UI
     */
    'dashboard_data': {
        description: 'Get formatted data for priority dashboard UI',
        inputSchema: {
            type: 'object',
            properties: {
                focusUser: {
                    type: 'string',
                    description: 'Focus on specific user (e.g., "Abrar ul haq N")'
                }
            }
        },
        handler: async (args) => {
            if (!prioritySystem.aggregator) {
                const jiraService = require('../jira').jiraService;
                const confluenceService = require('../confluence').confluenceService;
                const outlookService = require('../outlook').outlookService;

                await prioritySystem.initialize(jiraService, confluenceService, outlookService);
            }

            const report = await prioritySystem.generatePriorityReport(args);

            // Extract and format dashboard data
            const dashboardData = {
                greeting: prioritySystem.aggregator.getGreeting(args.focusUser, report.summary),
                workloadCapacity: {
                    level: report.summary.workloadCapacity,
                    percentage: Math.min((report.summary.averageScore / 100) * 100, 100),
                    color: prioritySystem.getCapacityColor(report.summary.workloadCapacity)
                },
                urgencyBadges: report.items.slice(0, 8).map(item => ({
                    id: item.id,
                    title: item.title.length > 50 ? item.title.substring(0, 47) + '...' : item.title,
                    urgency: item.urgencyLevel,
                    score: item.priorityScore,
                    source: item.source,
                    url: item.url,
                    color: prioritySystem.getUrgencyColor(item.urgencyLevel)
                })),
                statistics: {
                    totalItems: report.summary.totalItems,
                    urgentCount: report.summary.urgentCount,
                    overdueCount: report.summary.overdueCount,
                    averageScore: report.summary.averageScore
                },
                sourceBreakdown: report.summary.sourceBreakdown,
                recommendations: prioritySystem.generateRecommendations(report.summary),
                lastUpdated: report.summary.lastUpdated
            };

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(dashboardData, null, 2)
                }]
            };
        }
    },

    /**
     * Clear priority system cache
     */
    'clear_cache': {
        description: 'Clear all cached data in the priority system',
        inputSchema: { type: 'object', properties: {} },
        handler: async (args) => {
            if (prioritySystem.aggregator) {
                prioritySystem.aggregator.clearCache();
            }

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: true,
                        message: 'Priority system cache cleared',
                        timestamp: new Date().toISOString()
                    }, null, 2)
                }]
            };
        }
    }

};

// Convert to array format for run-tool.js compatibility
const priorityToolsArray = Object.entries(priorityTools).map(([name, tool]) => ({
    name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    handler: tool.handler
}));

module.exports = priorityToolsArray;