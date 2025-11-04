/**
 * Priority System Main Service
 * Entry point for the comprehensive priority-based MCP integration
 */

const DataAggregator = require('./data-aggregator');

class PrioritySystemService {
    constructor() {
        this.name = 'Priority System';
        this.description = 'Comprehensive priority-based task aggregation system';
        this.tools = {
            'generate_priority_report': {
                description: 'Generate comprehensive priority report from all sources',
                inputSchema: {
                    type: 'object',
                    properties: {
                        focusUser: {
                            type: 'string',
                            description: 'Focus on specific user (optional)'
                        },
                        includeGreeting: {
                            type: 'boolean',
                            description: 'Include personalized greeting message',
                            default: true
                        },
                        maxItems: {
                            type: 'number',
                            description: 'Maximum number of items to return',
                            default: 50
                        },
                        minScore: {
                            type: 'number',
                            description: 'Minimum priority score threshold (0-100)',
                            default: 20
                        }
                    }
                },
                handler: this.generatePriorityReport.bind(this)
            },
            'get_urgent_items': {
                description: 'Get only urgent and high priority items',
                inputSchema: {
                    type: 'object',
                    properties: {
                        focusUser: {
                            type: 'string',
                            description: 'Focus on specific user (optional)'
                        },
                        urgencyLevels: {
                            type: 'array',
                            items: { type: 'string', enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'] },
                            description: 'Include items with these urgency levels',
                            default: ['URGENT', 'HIGH']
                        }
                    }
                },
                handler: this.getUrgentItems.bind(this)
            },
            'get_workload_summary': {
                description: 'Get workload capacity and summary statistics',
                inputSchema: {
                    type: 'object',
                    properties: {
                        focusUser: {
                            type: 'string',
                            description: 'Focus on specific user (optional)'
                        }
                    }
                },
                handler: this.getWorkloadSummary.bind(this)
            },
            'update_scoring_config': {
                description: 'Update priority scoring configuration weights',
                inputSchema: {
                    type: 'object',
                    properties: {
                        weights: {
                            type: 'object',
                            description: 'New scoring weights configuration'
                        }
                    }
                },
                handler: this.updateScoringConfig.bind(this)
            },
            'clear_cache': {
                description: 'Clear all cached data',
                inputSchema: { type: 'object', properties: {} },
                handler: this.clearCache.bind(this)
            }
        };

        this.aggregator = null;
    }

    /**
     * Initialize the priority system with service dependencies
     */
    async initialize(jiraService, confluenceService, outlookService, config = {}) {
        console.log('🔧 Initializing Priority System...');

        try {
            this.aggregator = new DataAggregator(
                jiraService,
                confluenceService,
                outlookService,
                config
            );

            console.log('✅ Priority System initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Priority System initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Generate comprehensive priority report
     */
    async generatePriorityReport(params = {}) {
        console.log('📊 Generating comprehensive priority report...');

        try {
            if (!this.aggregator) {
                throw new Error('Priority system not initialized');
            }

            const {
                focusUser = null,
                includeGreeting = true,
                maxItems = 50,
                minScore = 20
            } = params;

            // Generate full report
            const report = await this.aggregator.generatePriorityReport(focusUser);

            // Filter items based on criteria
            const filteredItems = report.items
                .filter(item => item.priorityScore >= minScore)
                .slice(0, maxItems);

            // Prepare response
            const response = {
                ...report,
                items: filteredItems
            };

            // Add greeting if requested
            if (includeGreeting) {
                response.greeting = this.aggregator.getGreeting(focusUser, report.summary);
            }

            // Add dashboard data
            response.dashboard = this.prepareDashboardData(report);

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(response, null, 2)
                }]
            };

        } catch (error) {
            console.error('❌ Priority report generation failed:', error.message);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        error: error.message,
                        items: [],
                        summary: {
                            totalItems: 0,
                            urgentCount: 0,
                            lastUpdated: new Date().toISOString()
                        }
                    }, null, 2)
                }]
            };
        }
    }

    /**
     * Get only urgent and high priority items
     */
    async getUrgentItems(params = {}) {
        console.log('🚨 Getting urgent items only...');

        try {
            const {
                focusUser = null,
                urgencyLevels = ['URGENT', 'HIGH']
            } = params;

            const report = await this.aggregator.generatePriorityReport(focusUser);

            // Filter for urgent items only
            const urgentItems = report.items.filter(item =>
                urgencyLevels.includes(item.urgencyLevel)
            );

            const response = {
                items: urgentItems,
                summary: {
                    ...report.summary,
                    filteredCount: urgentItems.length,
                    criteria: urgencyLevels
                },
                greeting: this.aggregator.getGreeting(focusUser, report.summary)
            };

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(response, null, 2)
                }]
            };

        } catch (error) {
            console.error('❌ Urgent items retrieval failed:', error.message);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        error: error.message,
                        items: [],
                        summary: { filteredCount: 0 }
                    }, null, 2)
                }]
            };
        }
    }

    /**
     * Get workload capacity and summary
     */
    async getWorkloadSummary(params = {}) {
        console.log('📈 Getting workload summary...');

        try {
            const { focusUser = null } = params;

            const report = await this.aggregator.generatePriorityReport(focusUser);

            const summary = {
                greeting: this.aggregator.getGreeting(focusUser, report.summary),
                workloadCapacity: report.summary.workloadCapacity,
                statistics: {
                    totalItems: report.summary.totalItems,
                    averageScore: report.summary.averageScore,
                    urgentCount: report.summary.urgentCount,
                    overdueCount: report.summary.overdueCount
                },
                sourceBreakdown: report.summary.sourceBreakdown,
                topPriorities: report.summary.topPriorities,
                recommendations: this.generateRecommendations(report.summary),
                lastUpdated: report.summary.lastUpdated
            };

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(summary, null, 2)
                }]
            };

        } catch (error) {
            console.error('❌ Workload summary failed:', error.message);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        error: error.message,
                        workloadCapacity: 'UNKNOWN'
                    }, null, 2)
                }]
            };
        }
    }

    /**
     * Update scoring configuration
     */
    async updateScoringConfig(params = {}) {
        console.log('⚙️ Updating scoring configuration...');

        try {
            const { weights } = params;

            if (!this.aggregator) {
                throw new Error('Priority system not initialized');
            }

            this.aggregator.updateScoringConfig(weights);

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: true,
                        message: 'Scoring configuration updated',
                        newWeights: weights
                    }, null, 2)
                }]
            };

        } catch (error) {
            console.error('❌ Scoring config update failed:', error.message);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: error.message
                    }, null, 2)
                }]
            };
        }
    }

    /**
     * Clear all caches
     */
    async clearCache(params = {}) {
        console.log('🗑️ Clearing cache...');

        try {
            if (!this.aggregator) {
                throw new Error('Priority system not initialized');
            }

            this.aggregator.clearCache();

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: true,
                        message: 'Cache cleared successfully',
                        timestamp: new Date().toISOString()
                    }, null, 2)
                }]
            };

        } catch (error) {
            console.error('❌ Cache clear failed:', error.message);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: error.message
                    }, null, 2)
                }]
            };
        }
    }

    /**
     * Prepare dashboard-specific data
     */
    prepareDashboardData(report) {
        return {
            capacityIndicator: {
                level: report.summary.workloadCapacity,
                color: this.getCapacityColor(report.summary.workloadCapacity),
                percentage: Math.min((report.summary.averageScore / 100) * 100, 100)
            },
            urgencyBadges: report.items.slice(0, 10).map(item => ({
                id: item.id,
                title: item.title,
                urgency: item.urgencyLevel,
                score: item.priorityScore,
                source: item.source,
                color: this.getUrgencyColor(item.urgencyLevel)
            })),
            chartData: {
                sourceDistribution: report.summary.sourceBreakdown,
                urgencyDistribution: {
                    urgent: report.summary.urgentCount,
                    high: report.summary.highCount,
                    medium: report.summary.mediumCount,
                    low: report.summary.lowCount
                }
            }
        };
    }

    /**
     * Generate actionable recommendations
     */
    generateRecommendations(summary) {
        const recommendations = [];

        if (summary.urgentCount > 5) {
            recommendations.push({
                type: 'CRITICAL',
                message: 'You have many urgent items. Consider delegating or rescheduling non-critical tasks.',
                action: 'Review urgent items and prioritize top 3'
            });
        }

        if (summary.overdueCount > 3) {
            recommendations.push({
                type: 'WARNING',
                message: 'Multiple overdue items detected. Address these first.',
                action: 'Focus on overdue tasks before starting new work'
            });
        }

        if (summary.workloadCapacity === 'OVERLOADED') {
            recommendations.push({
                type: 'SUGGESTION',
                message: 'Your workload is very high. Take breaks and focus on one task at a time.',
                action: 'Consider time blocking for deep work sessions'
            });
        }

        if (summary.totalItems === 0) {
            recommendations.push({
                type: 'INFO',
                message: 'No high-priority items found. Great job staying on top of things!',
                action: 'Use this time for strategic planning or professional development'
            });
        }

        return recommendations;
    }

    /**
     * Helper methods for UI colors
     */
    getCapacityColor(level) {
        const colors = {
            'OVERLOADED': '#FF4444',
            'HIGH': '#FF8800',
            'MODERATE': '#FFDD00',
            'OPTIMAL': '#44FF44'
        };
        return colors[level] || '#CCCCCC';
    }

    getUrgencyColor(urgency) {
        const colors = {
            'URGENT': '#FF0000',
            'HIGH': '#FF6600',
            'MEDIUM': '#FFAA00',
            'LOW': '#00AA00'
        };
        return colors[urgency] || '#CCCCCC';
    }

    /**
     * Get available tools for MCP
     */
    getTools() {
        return Object.entries(this.tools).map(([name, tool]) => ({
            name,
            description: tool.description,
            inputSchema: tool.inputSchema
        }));
    }

    /**
     * Handle tool calls
     */
    async handleToolCall(name, args) {
        if (this.tools[name]) {
            return await this.tools[name].handler(args);
        }
        throw new Error(`Unknown tool: ${name}`);
    }
}

module.exports = PrioritySystemService;