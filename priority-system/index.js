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
            },
            'get_team_workload_analysis': {
                description: 'Generate comprehensive team workload analysis with graphical representation data',
                inputSchema: {
                    type: 'object',
                    properties: {
                        teamLeadId: {
                            type: 'string',
                            description: 'Team Lead Employee ID (e.g., "EMP014", "EMP015")'
                        },
                        teamLeadName: {
                            type: 'string',
                            description: 'Team Lead Name (e.g., "Abrar ul haq N", "Dinesh Kumar M")'
                        },
                        department: {
                            type: 'string',
                            description: 'Department filter (e.g., "Data Management", "IT Architecture")'
                        },
                        includeChartData: {
                            type: 'boolean',
                            description: 'Include chart/graph data for visualization',
                            default: true
                        },
                        includeRecommendations: {
                            type: 'boolean',
                            description: 'Include workload recommendations',
                            default: true
                        }
                    }
                },
                handler: this.getTeamWorkloadAnalysis.bind(this)
            },
            'get_bu_portfolio_analysis': {
                description: 'Generate comprehensive Business Unit portfolio performance analysis with project metrics and visualizations',
                inputSchema: {
                    type: 'object',
                    properties: {
                        buManagerId: {
                            type: 'string',
                            description: 'BU Manager Employee ID (e.g., "EMP003", "EMP004", "EMP005")'
                        },
                        buManagerName: {
                            type: 'string',
                            description: 'BU Manager Name (e.g., "Jennifer Martinez", "David Kim", "Lisa Thompson")'
                        },
                        department: {
                            type: 'string',
                            description: 'Department filter (e.g., "Data Management", "IT Architecture", "IT Operations")'
                        },
                        includeProjectTimelines: {
                            type: 'boolean',
                            description: 'Include project timeline and milestone data',
                            default: true
                        },
                        includeResourceMetrics: {
                            type: 'boolean',
                            description: 'Include resource allocation and utilization metrics',
                            default: true
                        },
                        includeChartData: {
                            type: 'boolean',
                            description: 'Include chart/visualization data for dashboards',
                            default: true
                        },
                        includeRecommendations: {
                            type: 'boolean',
                            description: 'Include strategic recommendations and insights',
                            default: true
                        }
                    }
                },
                handler: this.getBUPortfolioAnalysis.bind(this)
            },

            'get_project_performance_analysis': {
                description: 'Generate individual project performance analysis for Project Managers with detailed metrics, team velocity, and KPIs (single project focus vs BU portfolio cross-project view)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: {
                            type: 'string',
                            description: 'Project ID to analyze (e.g., "MICROSERVICES-MIGRATION", "PORTAEH", "CCACB")'
                        },
                        projectManagerId: {
                            type: 'string',
                            description: 'Project Manager Employee ID (e.g., "EMP006", "EMP007", "EMP009") - optional, will auto-detect'
                        },
                        projectManagerName: {
                            type: 'string',
                            description: 'Project Manager Name (e.g., "Robert Wilson", "Kevin Zhang") - optional, will auto-detect'
                        },
                        analysisDepth: {
                            type: 'string',
                            description: 'Analysis depth level for project metrics',
                            enum: ['summary', 'detailed', 'comprehensive'],
                            default: 'detailed'
                        },
                        includeTeamVelocity: {
                            type: 'boolean',
                            description: 'Include team velocity and sprint performance metrics',
                            default: true
                        },
                        includeTaskMetrics: {
                            type: 'boolean',
                            description: 'Include detailed task completion and quality metrics',
                            default: true
                        },
                        includeRiskAnalysis: {
                            type: 'boolean',
                            description: 'Include project risk assessment and mitigation analysis',
                            default: true
                        },
                        includeChartData: {
                            type: 'boolean',
                            description: 'Include visualization data for project dashboards',
                            default: true
                        },
                        includeRecommendations: {
                            type: 'boolean',
                            description: 'Include project optimization recommendations',
                            default: true
                        }
                    },
                    required: ['projectId']
                },
                handler: this.getProjectPerformanceAnalysis.bind(this)
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
     * Generate comprehensive team workload analysis with graphical representation
     */
    async getTeamWorkloadAnalysis(params = {}) {
        console.log('📊 Generating comprehensive team workload analysis...');

        try {
            const {
                teamLeadId,
                teamLeadName,
                department,
                includeChartData = true,
                includeRecommendations = true
            } = params;

            // Load mock data
            const employeesData = require('../mock-data/employees.js');
            const jiraData = require('../mock-data/projects-jira.js');
            const teamMembersData = require('../mock-data/team-members.js');

            // Find team lead
            let teamLead = null;
            if (teamLeadId) {
                teamLead = employeesData.employees.find(emp => emp.employeeId === teamLeadId);
            } else if (teamLeadName) {
                teamLead = employeesData.employees.find(emp => emp.name === teamLeadName);
            }

            if (!teamLead) {
                throw new Error(`Team lead not found. Please provide valid teamLeadId or teamLeadName.`);
            }

            // Get direct reports
            const directReportIds = teamLead.directReports || [];
            const teamMembers = [];

            // Find team member details
            directReportIds.forEach(empId => {
                let member = employeesData.employees.find(emp => emp.employeeId === empId);
                if (!member) {
                    member = teamMembersData.teamMembers.find(emp => emp.employeeId === empId);
                }
                if (member) {
                    teamMembers.push(member);
                }
            });

            // Get workload data for team lead and members
            const teamWorkloadData = [];
            const allMembers = [teamLead, ...teamMembers];

            allMembers.forEach(member => {
                const workload = (jiraData.employeeWorkloads && jiraData.employeeWorkloads[member.employeeId]) || {
                    totalTasks: 0, inProgress: 0, assigned: 0, completed: 0
                };

                const utilizationRate = workload.totalTasks > 0 ?
                    ((workload.inProgress + workload.assigned) / (workload.totalTasks * 1.2) * 100) : 0;

                let capacityLevel = 'OPTIMAL';
                if (utilizationRate > 85) capacityLevel = 'OVERLOADED';
                else if (utilizationRate > 70) capacityLevel = 'HIGH';
                else if (utilizationRate > 50) capacityLevel = 'MODERATE';

                teamWorkloadData.push({
                    employee: {
                        id: member.employeeId,
                        name: member.name,
                        email: member.email,
                        role: member.role,
                        department: member.department,
                        location: member.location,
                        timezone: member.timezone,
                        skillSet: member.skillSet || [],
                        projectIds: member.projectIds || []
                    },
                    workload: {
                        totalTasks: workload.totalTasks,
                        inProgress: workload.inProgress,
                        assigned: workload.assigned,
                        completed: workload.completed,
                        utilizationRate: Math.round(utilizationRate),
                        capacityLevel,
                        capacityColor: this.getCapacityColor(capacityLevel)
                    }
                });
            });

            // Calculate team statistics
            const teamStats = {
                totalMembers: allMembers.length,
                totalTasks: teamWorkloadData.reduce((sum, member) => sum + member.workload.totalTasks, 0),
                totalInProgress: teamWorkloadData.reduce((sum, member) => sum + member.workload.inProgress, 0),
                totalAssigned: teamWorkloadData.reduce((sum, member) => sum + member.workload.assigned, 0),
                totalCompleted: teamWorkloadData.reduce((sum, member) => sum + member.workload.completed, 0),
                averageUtilization: Math.round(
                    teamWorkloadData.reduce((sum, member) => sum + member.workload.utilizationRate, 0) / allMembers.length
                )
            };

            // Prepare graphical data
            let chartData = {};
            if (includeChartData) {
                chartData = {
                    // Bar chart data for workload distribution
                    workloadDistribution: {
                        type: 'bar',
                        title: 'Team Workload Distribution',
                        data: teamWorkloadData.map(member => ({
                            name: member.employee.name.split(' ')[0], // First name only for charts
                            totalTasks: member.workload.totalTasks,
                            inProgress: member.workload.inProgress,
                            assigned: member.workload.assigned,
                            completed: member.workload.completed
                        }))
                    },

                    // Pie chart for capacity levels
                    capacityDistribution: {
                        type: 'pie',
                        title: 'Team Capacity Distribution',
                        data: [
                            {
                                label: 'Optimal',
                                value: teamWorkloadData.filter(m => m.workload.capacityLevel === 'OPTIMAL').length,
                                color: '#44FF44'
                            },
                            {
                                label: 'Moderate',
                                value: teamWorkloadData.filter(m => m.workload.capacityLevel === 'MODERATE').length,
                                color: '#FFDD00'
                            },
                            {
                                label: 'High',
                                value: teamWorkloadData.filter(m => m.workload.capacityLevel === 'HIGH').length,
                                color: '#FF8800'
                            },
                            {
                                label: 'Overloaded',
                                value: teamWorkloadData.filter(m => m.workload.capacityLevel === 'OVERLOADED').length,
                                color: '#FF4444'
                            }
                        ].filter(item => item.value > 0)
                    },

                    // Utilization gauge chart
                    utilizationGauge: {
                        type: 'gauge',
                        title: 'Average Team Utilization',
                        value: teamStats.averageUtilization,
                        min: 0,
                        max: 100,
                        thresholds: [
                            { value: 50, color: '#44FF44' },
                            { value: 70, color: '#FFDD00' },
                            { value: 85, color: '#FF8800' },
                            { value: 100, color: '#FF4444' }
                        ]
                    },

                    // Skill distribution chart
                    skillDistribution: {
                        type: 'horizontal-bar',
                        title: 'Team Skill Distribution',
                        data: this._generateSkillDistribution(teamWorkloadData)
                    }
                };
            }

            // Generate recommendations
            let recommendations = [];
            if (includeRecommendations) {
                recommendations = this._generateTeamRecommendations(teamWorkloadData, teamStats);
            }

            const result = {
                success: true,
                teamAnalysis: {
                    teamLead: {
                        id: teamLead.employeeId,
                        name: teamLead.name,
                        department: teamLead.department,
                        location: teamLead.location
                    },
                    teamMembers: teamWorkloadData,
                    statistics: teamStats,
                    chartData: includeChartData ? chartData : null,
                    recommendations: includeRecommendations ? recommendations : null,
                    metadata: {
                        generatedAt: new Date().toISOString(),
                        analysisType: 'team-workload-analysis',
                        dataSource: 'mock-organizational-data',
                        chartDataIncluded: includeChartData,
                        recommendationsIncluded: includeRecommendations
                    }
                }
            };

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };

        } catch (error) {
            console.error('❌ Team workload analysis failed:', error.message);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: error.message,
                        availableTeamLeads: [
                            { id: 'EMP014', name: 'Abrar ul haq N', department: 'Data Engineering' },
                            { id: 'EMP015', name: 'Dinesh Kumar M', department: 'Database Management' },
                            { id: 'EMP016', name: 'Mani S', department: 'Data Quality' },
                            { id: 'EMP021', name: 'Dev Sparrow', department: 'Integration' }
                        ]
                    }, null, 2)
                }]
            };
        }
    }

    /**
     * Generate skill distribution data for charts
     */
    _generateSkillDistribution(teamWorkloadData) {
        const skillMap = {};
        teamWorkloadData.forEach(member => {
            member.employee.skillSet.forEach(skill => {
                skillMap[skill] = (skillMap[skill] || 0) + 1;
            });
        });

        return Object.entries(skillMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10) // Top 10 skills
            .map(([skill, count]) => ({
                skill,
                count,
                percentage: Math.round((count / teamWorkloadData.length) * 100)
            }));
    }

    /**
     * Generate workload recommendations
     */
    _generateTeamRecommendations(teamWorkloadData, teamStats) {
        const recommendations = [];

        // Check for overloaded members
        const overloadedMembers = teamWorkloadData.filter(m => m.workload.capacityLevel === 'OVERLOADED');
        if (overloadedMembers.length > 0) {
            recommendations.push({
                type: 'CRITICAL',
                priority: 'HIGH',
                message: `${overloadedMembers.length} team member(s) are overloaded`,
                details: overloadedMembers.map(m => m.employee.name),
                action: 'Consider redistributing tasks or adding resources',
                impact: 'HIGH'
            });
        }

        // Check for underutilized members
        const underutilizedMembers = teamWorkloadData.filter(m => m.workload.utilizationRate < 30);
        if (underutilizedMembers.length > 0) {
            recommendations.push({
                type: 'OPPORTUNITY',
                priority: 'MEDIUM',
                message: `${underutilizedMembers.length} team member(s) have additional capacity`,
                details: underutilizedMembers.map(m => `${m.employee.name} (${m.workload.utilizationRate}% utilized)`),
                action: 'Consider assigning additional tasks or cross-training opportunities',
                impact: 'MEDIUM'
            });
        }

        // Team balance check
        if (teamStats.averageUtilization > 80) {
            recommendations.push({
                type: 'WARNING',
                priority: 'HIGH',
                message: 'Team average utilization is high',
                details: [`Average utilization: ${teamStats.averageUtilization}%`],
                action: 'Monitor team burnout and consider workload redistribution',
                impact: 'HIGH'
            });
        }

        // Skill diversity check
        const skillCoverage = new Set();
        teamWorkloadData.forEach(member => {
            member.employee.skillSet.forEach(skill => skillCoverage.add(skill));
        });

        if (skillCoverage.size < 5) {
            recommendations.push({
                type: 'INFO',
                priority: 'LOW',
                message: 'Limited skill diversity in team',
                details: [`Only ${skillCoverage.size} unique skills identified`],
                action: 'Consider cross-training or hiring for skill gaps',
                impact: 'MEDIUM'
            });
        }

        return recommendations;
    }

    /**
     * Generate comprehensive Business Unit portfolio performance analysis
     */
    async getBUPortfolioAnalysis(params = {}) {
        console.log('📊 Generating BU portfolio performance analysis...');

        try {
            const {
                buManagerId,
                buManagerName,
                department,
                includeProjectTimelines = true,
                includeResourceMetrics = true,
                includeChartData = true,
                includeRecommendations = true
            } = params;

            // Load mock data
            const employeesData = require('../mock-data/employees.js');
            const projectsData = require('../mock-data/projects-jira.js');
            const jiraData = require('../mock-data/projects-jira.js');

            // Find BU manager
            let buManager = null;
            if (buManagerId) {
                buManager = employeesData.employees.find(emp => emp.employeeId === buManagerId);
            } else if (buManagerName) {
                buManager = employeesData.employees.find(emp => emp.name === buManagerName);
            } else if (department) {
                buManager = employeesData.employees.find(emp => emp.department === department && emp.role === 'BU_MANAGER');
            }

            if (!buManager) {
                throw new Error(`BU Manager not found. Please provide valid buManagerId, buManagerName, or department.`);
            }

            // Get projects under this BU manager's department
            const departmentProjects = projectsData.projects.filter(project =>
                project.department === buManager.department
            );

            // Get project managers under this BU manager
            const projectManagers = employeesData.employees.filter(emp =>
                buManager.directReports.includes(emp.employeeId)
            );

            // Generate project performance data
            const projectPerformanceData = departmentProjects.map(project => {
                const projectManager = employeesData.employees.find(emp => emp.employeeId === project.lead);
                const teamSize = project.members.length;

                // Calculate project timeline metrics
                const startDate = new Date(project.startDate);
                const endDate = new Date(project.endDate);
                const today = new Date();
                const totalDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
                const progressPercentage = Math.max(0, Math.min(100, Math.round((daysElapsed / totalDuration) * 100)));

                // Simulate project health based on status and timeline
                let healthScore = 85; // Base score
                if (project.status === 'Completed') healthScore = 100;
                else if (project.status === 'In Progress') healthScore = 80;
                else if (project.status === 'Planning') healthScore = 70;
                else if (project.status === 'On Hold') healthScore = 40;

                // Adjust health based on timeline
                if (progressPercentage > 90 && project.status !== 'Completed') healthScore -= 20;
                else if (progressPercentage > 75 && project.status === 'Planning') healthScore -= 10;

                let riskLevel = 'LOW';
                if (healthScore < 50) riskLevel = 'HIGH';
                else if (healthScore < 70) riskLevel = 'MEDIUM';

                return {
                    project: {
                        id: project.projectId,
                        name: project.name,
                        description: project.description,
                        status: project.status,
                        priority: project.priority,
                        startDate: project.startDate,
                        endDate: project.endDate,
                        projectManager: {
                            id: projectManager?.employeeId || 'N/A',
                            name: projectManager?.name || 'Unassigned',
                            email: projectManager?.email || ''
                        }
                    },
                    metrics: {
                        teamSize,
                        progressPercentage,
                        healthScore,
                        riskLevel,
                        daysElapsed,
                        totalDuration,
                        remainingDays: Math.max(0, totalDuration - daysElapsed)
                    },
                    performance: {
                        onSchedule: progressPercentage <= 100 && project.status !== 'On Hold',
                        budgetStatus: 'On Track', // Simulated
                        qualityScore: healthScore,
                        teamUtilization: Math.min(100, teamSize * 15) // Simulated utilization
                    }
                };
            });

            // Calculate BU-level statistics
            const buStats = {
                totalProjects: departmentProjects.length,
                activeProjects: departmentProjects.filter(p => p.status === 'In Progress').length,
                completedProjects: departmentProjects.filter(p => p.status === 'Completed').length,
                projectsInPlanning: departmentProjects.filter(p => p.status === 'Planning').length,
                projectsOnHold: departmentProjects.filter(p => p.status === 'On Hold').length,
                totalTeamSize: projectPerformanceData.reduce((sum, p) => sum + p.metrics.teamSize, 0),
                averageHealthScore: Math.round(
                    projectPerformanceData.reduce((sum, p) => sum + p.metrics.healthScore, 0) / departmentProjects.length
                ),
                highRiskProjects: projectPerformanceData.filter(p => p.metrics.riskLevel === 'HIGH').length,
                projectManagers: projectManagers.length
            };

            // Generate visualization data
            let chartData = {};
            if (includeChartData) {
                chartData = {
                    // Project status distribution pie chart
                    projectStatusDistribution: {
                        type: 'pie',
                        title: 'Project Status Distribution',
                        data: [
                            { label: 'In Progress', value: buStats.activeProjects, color: '#4CAF50' },
                            { label: 'Completed', value: buStats.completedProjects, color: '#2196F3' },
                            { label: 'Planning', value: buStats.projectsInPlanning, color: '#FF9800' },
                            { label: 'On Hold', value: buStats.projectsOnHold, color: '#F44336' }
                        ].filter(item => item.value > 0)
                    },

                    // Project health timeline
                    projectHealthTimeline: {
                        type: 'timeline',
                        title: 'Project Health & Timeline Overview',
                        data: projectPerformanceData.map(project => ({
                            name: project.project.name,
                            startDate: project.project.startDate,
                            endDate: project.project.endDate,
                            progress: project.metrics.progressPercentage,
                            healthScore: project.metrics.healthScore,
                            riskLevel: project.metrics.riskLevel,
                            status: project.project.status
                        }))
                    },

                    // Resource utilization bar chart
                    resourceUtilization: {
                        type: 'bar',
                        title: 'Resource Utilization by Project',
                        data: projectPerformanceData.map(project => ({
                            name: project.project.name.split(' ')[0], // Short name
                            teamSize: project.metrics.teamSize,
                            utilization: project.performance.teamUtilization,
                            healthScore: project.metrics.healthScore
                        }))
                    },

                    // Portfolio health gauge
                    portfolioHealthGauge: {
                        type: 'gauge',
                        title: 'Overall Portfolio Health',
                        value: buStats.averageHealthScore,
                        min: 0,
                        max: 100,
                        thresholds: [
                            { value: 50, color: '#F44336' },
                            { value: 70, color: '#FF9800' },
                            { value: 85, color: '#4CAF50' },
                            { value: 100, color: '#2196F3' }
                        ]
                    },

                    // Risk assessment chart
                    riskAssessment: {
                        type: 'horizontal-bar',
                        title: 'Project Risk Assessment',
                        data: [
                            {
                                risk: 'LOW',
                                count: projectPerformanceData.filter(p => p.metrics.riskLevel === 'LOW').length,
                                color: '#4CAF50'
                            },
                            {
                                risk: 'MEDIUM',
                                count: projectPerformanceData.filter(p => p.metrics.riskLevel === 'MEDIUM').length,
                                color: '#FF9800'
                            },
                            {
                                risk: 'HIGH',
                                count: projectPerformanceData.filter(p => p.metrics.riskLevel === 'HIGH').length,
                                color: '#F44336'
                            }
                        ].filter(item => item.count > 0)
                    }
                };
            }

            // Generate strategic recommendations
            let recommendations = [];
            if (includeRecommendations) {
                recommendations = this._generateBURecommendations(projectPerformanceData, buStats, buManager);
            }

            const result = {
                success: true,
                portfolioAnalysis: {
                    buManager: {
                        id: buManager.employeeId,
                        name: buManager.name,
                        department: buManager.department,
                        email: buManager.email,
                        location: buManager.location,
                        directReports: buManager.directReports.length
                    },
                    projects: projectPerformanceData,
                    statistics: buStats,
                    projectTimelines: includeProjectTimelines ? this._generateProjectTimelines(projectPerformanceData) : null,
                    resourceMetrics: includeResourceMetrics ? this._generateResourceMetrics(projectPerformanceData, projectManagers) : null,
                    chartData: includeChartData ? chartData : null,
                    recommendations: includeRecommendations ? recommendations : null,
                    metadata: {
                        generatedAt: new Date().toISOString(),
                        analysisType: 'bu-portfolio-analysis',
                        dataSource: 'mock-organizational-data',
                        department: buManager.department,
                        chartDataIncluded: includeChartData,
                        recommendationsIncluded: includeRecommendations
                    }
                }
            };

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };

        } catch (error) {
            console.error('❌ BU portfolio analysis failed:', error.message);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: error.message,
                        availableBUManagers: [
                            { id: 'EMP003', name: 'Jennifer Martinez', department: 'Data Management' },
                            { id: 'EMP004', name: 'David Kim', department: 'IT Architecture' },
                            { id: 'EMP005', name: 'Lisa Thompson', department: 'IT Operations' }
                        ]
                    }, null, 2)
                }]
            };
        }
    }

    /**
     * Generate individual project performance analysis for Project Managers
     * Focus: Single project deep-dive vs BU portfolio cross-project view
     */
    async getProjectPerformanceAnalysis(params = {}) {
        console.log('🚀 Generating individual project performance analysis...');

        try {
            const {
                projectId,
                projectManagerId,
                projectManagerName,
                analysisDepth = 'detailed',
                includeTeamVelocity = true,
                includeTaskMetrics = true,
                includeRiskAnalysis = true,
                includeChartData = true,
                includeRecommendations = true
            } = params;

            if (!projectId) {
                throw new Error('Project ID is required for project performance analysis');
            }

            // Load mock data
            const employeesData = require('../mock-data/employees.js');
            const projectsData = require('../mock-data/projects-jira.js');
            const jiraData = require('../mock-data/projects-jira.js');

            // Find the specific project
            const project = projectsData.projects.find(p => p.projectId === projectId);
            if (!project) {
                throw new Error(`Project '${projectId}' not found`);
            }

            // Find project manager (auto-detect if not provided)
            let projectManager = null;
            if (projectManagerId) {
                projectManager = employeesData.employees.find(e => e.employeeId === projectManagerId);
            } else if (projectManagerName) {
                projectManager = employeesData.employees.find(e =>
                    e.name.toLowerCase().includes(projectManagerName.toLowerCase())
                );
            } else {
                // Auto-detect from project lead
                projectManager = employeesData.employees.find(e => e.employeeId === project.lead);
            }

            if (!projectManager) {
                throw new Error('Project Manager not found. Please provide valid projectManagerId or projectManagerName');
            }

            // Get all project team members
            const projectTeamMembers = employeesData.employees.filter(emp =>
                project.members.includes(emp.employeeId)
            );

            // Get JIRA issues for this project (simulate based on team size)
            const projectJiraIssues = jiraData.jiraIssues.filter(issue =>
                issue.projectKey === projectId ||
                projectTeamMembers.some(member => issue.assignee.includes(member.name.split(' ')[0]))
            );

            // Calculate project metrics
            const projectMetrics = this._calculateProjectMetrics(
                project, projectTeamMembers, projectJiraIssues
            );

            // Calculate team velocity metrics
            const teamVelocityData = includeTeamVelocity ?
                this._calculateTeamVelocity(projectTeamMembers, projectJiraIssues) : null;

            // Calculate task completion metrics
            const taskMetrics = includeTaskMetrics ?
                this._calculateTaskMetrics(projectJiraIssues) : null;

            // Calculate project risk analysis
            const riskAnalysis = includeRiskAnalysis ?
                this._calculateProjectRisks(project, projectMetrics, projectTeamMembers) : null;

            // Generate chart data for visualizations
            const chartData = includeChartData ?
                this._generateProjectChartData(project, projectMetrics, teamVelocityData, taskMetrics) : null;

            // Generate project-specific recommendations
            const recommendations = includeRecommendations ?
                this._generateProjectRecommendations(project, projectMetrics, riskAnalysis, teamVelocityData) : null;

            // Build comprehensive project performance response
            const projectPerformanceData = {
                success: true,
                timestamp: new Date().toISOString(),
                analysisDepth,
                projectInfo: {
                    projectId: project.projectId,
                    projectName: project.name,
                    description: project.description,
                    department: project.department,
                    status: project.status,
                    priority: project.priority,
                    startDate: project.startDate,
                    endDate: project.endDate,
                    durationDays: Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))
                },
                projectManager: {
                    employeeId: projectManager.employeeId,
                    name: projectManager.name,
                    email: projectManager.email,
                    role: projectManager.role,
                    department: projectManager.department,
                    location: projectManager.location,
                    directReports: projectManager.directReports?.length || 0
                },
                teamComposition: {
                    totalMembers: projectTeamMembers.length,
                    teamLead: projectManager.name,
                    members: projectTeamMembers.map(member => ({
                        employeeId: member.employeeId,
                        name: member.name,
                        role: member.role,
                        skillSet: member.skillSet,
                        location: member.location,
                        workloadLevel: this._calculateIndividualWorkload(member)
                    })),
                    skillDistribution: this._analyzeTeamSkills(projectTeamMembers)
                },
                projectMetrics,
                ...(teamVelocityData && { teamVelocity: teamVelocityData }),
                ...(taskMetrics && { taskMetrics }),
                ...(riskAnalysis && { riskAnalysis }),
                ...(chartData && { chartData }),
                ...(recommendations && { recommendations }),
                kpiSummary: {
                    projectHealthScore: projectMetrics.healthScore,
                    completionPercentage: projectMetrics.completionPercentage,
                    onTimeDeliveryProbability: riskAnalysis?.timelineRisk === 'LOW' ? 85 :
                        riskAnalysis?.timelineRisk === 'MEDIUM' ? 65 : 35,
                    teamProductivityIndex: teamVelocityData?.overallProductivityScore || 75,
                    stakeholderSatisfaction: this._calculateStakeholderSatisfaction(project, projectMetrics)
                }
            };

            // Add detailed analysis for comprehensive depth
            if (analysisDepth === 'comprehensive') {
                projectPerformanceData.detailedAnalysis = {
                    sprintAnalysis: this._generateSprintAnalysis(projectJiraIssues),
                    codeQualityMetrics: this._generateCodeQualityMetrics(project),
                    stakeholderEngagement: this._analyzeStakeholderEngagement(project, projectTeamMembers),
                    budgetAnalysis: this._generateBudgetAnalysis(project, projectTeamMembers),
                    resourceOptimization: this._analyzeResourceOptimization(project, projectTeamMembers)
                };
            }

            console.log('✅ Project performance analysis completed successfully');

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(projectPerformanceData, null, 2)
                }]
            };

        } catch (error) {
            console.error('❌ Project performance analysis failed:', error.message);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: error.message,
                        availableProjects: [
                            { id: 'MICROSERVICES-MIGRATION', pm: 'Kevin Zhang', department: 'IT Architecture' },
                            { id: 'PORTAEH', pm: 'Robert Wilson', department: 'Data Management' },
                            { id: 'CCACB', pm: 'Amanda Rodriguez', department: 'Data Management' },
                            { id: 'CLOUD-NATIVE-APPS', pm: 'Sarah Wilson', department: 'IT Architecture' },
                            { id: 'DEVOPS-AUTOMATION', pm: 'Michael Thompson', department: 'IT Operations' }
                        ]
                    }, null, 2)
                }]
            };
        }
    }

    /**
     * Generate project timeline data for visualization
     */
    _generateProjectTimelines(projectPerformanceData) {
        return projectPerformanceData.map(project => ({
            projectId: project.project.id,
            projectName: project.project.name,
            timeline: {
                startDate: project.project.startDate,
                endDate: project.project.endDate,
                currentProgress: project.metrics.progressPercentage,
                milestones: [
                    { name: 'Project Kickoff', date: project.project.startDate, completed: true },
                    { name: 'Requirements Complete', date: this._addDays(new Date(project.project.startDate), 30), completed: project.metrics.progressPercentage > 25 },
                    { name: 'Development Complete', date: this._addDays(new Date(project.project.startDate), Math.floor(project.metrics.totalDuration * 0.8)), completed: project.metrics.progressPercentage > 80 },
                    { name: 'Testing Complete', date: this._addDays(new Date(project.project.startDate), Math.floor(project.metrics.totalDuration * 0.9)), completed: project.metrics.progressPercentage > 90 },
                    { name: 'Project Delivery', date: project.project.endDate, completed: project.project.status === 'Completed' }
                ],
                criticalPath: project.metrics.riskLevel === 'HIGH'
            }
        }));
    }

    /**
     * Generate resource metrics for BU analysis
     */
    _generateResourceMetrics(projectPerformanceData, projectManagers) {
        return {
            totalResources: projectPerformanceData.reduce((sum, p) => sum + p.metrics.teamSize, 0),
            projectManagerUtilization: projectManagers.map(pm => ({
                id: pm.employeeId,
                name: pm.name,
                projectsManaged: projectPerformanceData.filter(p => p.project.projectManager.id === pm.employeeId).length,
                utilizationLevel: projectPerformanceData.filter(p => p.project.projectManager.id === pm.employeeId).length > 2 ? 'HIGH' : 'OPTIMAL'
            })),
            departmentCapacity: {
                totalCapacity: projectManagers.length * 100, // 100% per PM
                currentUtilization: Math.round(projectPerformanceData.length / projectManagers.length * 100),
                availableCapacity: Math.max(0, 100 - Math.round(projectPerformanceData.length / projectManagers.length * 100))
            }
        };
    }

    /**
     * Generate strategic recommendations for BU portfolio
     */
    _generateBURecommendations(projectPerformanceData, buStats, buManager) {
        const recommendations = [];

        // High-risk projects alert
        if (buStats.highRiskProjects > 0) {
            const highRiskProjects = projectPerformanceData.filter(p => p.metrics.riskLevel === 'HIGH');
            recommendations.push({
                type: 'CRITICAL',
                priority: 'HIGH',
                category: 'Risk Management',
                message: `${buStats.highRiskProjects} project(s) require immediate attention`,
                details: highRiskProjects.map(p => `${p.project.name} (Health: ${p.metrics.healthScore}%)`),
                action: 'Conduct risk assessment and mitigation planning for high-risk projects',
                impact: 'HIGH',
                timeframe: 'Immediate'
            });
        }

        // Portfolio health assessment
        if (buStats.averageHealthScore < 70) {
            recommendations.push({
                type: 'WARNING',
                priority: 'HIGH',
                category: 'Portfolio Health',
                message: 'Overall portfolio health is below optimal levels',
                details: [`Average portfolio health: ${buStats.averageHealthScore}%`],
                action: 'Review project execution processes and resource allocation',
                impact: 'HIGH',
                timeframe: '2-4 weeks'
            });
        }

        // Resource optimization
        const overUtilizedPMs = projectPerformanceData.filter(p => p.performance.teamUtilization > 90);
        if (overUtilizedPMs.length > 0) {
            recommendations.push({
                type: 'OPPORTUNITY',
                priority: 'MEDIUM',
                category: 'Resource Optimization',
                message: 'Some teams are operating at high utilization levels',
                details: overUtilizedPMs.map(p => `${p.project.name} team (${p.performance.teamUtilization}% utilized)`),
                action: 'Consider load balancing or additional resource allocation',
                impact: 'MEDIUM',
                timeframe: '1-2 weeks'
            });
        }

        // Strategic planning insight
        if (buStats.projectsInPlanning > buStats.activeProjects * 0.5) {
            recommendations.push({
                type: 'INFO',
                priority: 'LOW',
                category: 'Strategic Planning',
                message: 'High number of projects in planning phase',
                details: [`${buStats.projectsInPlanning} projects in planning vs ${buStats.activeProjects} active`],
                action: 'Review project prioritization and execution capacity',
                impact: 'MEDIUM',
                timeframe: '4-6 weeks'
            });
        }

        // Success recognition
        if (buStats.averageHealthScore > 85 && buStats.highRiskProjects === 0) {
            recommendations.push({
                type: 'SUCCESS',
                priority: 'LOW',
                category: 'Performance Recognition',
                message: 'Excellent portfolio performance!',
                details: [`All projects healthy with ${buStats.averageHealthScore}% average health score`],
                action: 'Document best practices and share success strategies across organization',
                impact: 'POSITIVE',
                timeframe: 'Ongoing'
            });
        }

        return recommendations;
    }

    /**
     * Calculate comprehensive project metrics
     */
    _calculateProjectMetrics(project, teamMembers, jiraIssues) {
        const totalIssues = Math.max(jiraIssues.length, teamMembers.length * 8); // Min 8 issues per member
        const completedIssues = Math.floor(totalIssues * (0.4 + Math.random() * 0.4)); // 40-80% completion
        const inProgressIssues = Math.floor((totalIssues - completedIssues) * 0.6);
        const todoIssues = totalIssues - completedIssues - inProgressIssues;

        const completionPercentage = Math.round((completedIssues / totalIssues) * 100);
        const projectStarted = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        const currentDate = new Date();
        const timeElapsed = (currentDate - projectStarted) / (projectEnd - projectStarted);
        const scheduleVariance = completionPercentage / 100 - Math.min(timeElapsed, 1);

        return {
            totalTasks: totalIssues,
            completedTasks: completedIssues,
            inProgressTasks: inProgressIssues,
            todoTasks: todoIssues,
            completionPercentage,
            scheduleVariance: Math.round(scheduleVariance * 100) / 100,
            averageTasksPerMember: Math.round(totalIssues / teamMembers.length * 10) / 10,
            healthScore: Math.min(95, Math.max(30, 70 + (scheduleVariance * 20) + (Math.random() * 10 - 5))),
            burnDownRate: Math.round(completedIssues / Math.max(1, Math.ceil(timeElapsed * 100)) * 10) / 10,
            estimatedCompletionDate: this._calculateEstimatedCompletion(project, completionPercentage),
            criticalPath: this._identifyCriticalPath(project, jiraIssues)
        };
    }

    /**
     * Calculate team velocity metrics
     */
    _calculateTeamVelocity(teamMembers, jiraIssues) {
        const sprintLength = 14; // 2-week sprints
        const sprintsCompleted = Math.ceil(jiraIssues.length / (teamMembers.length * 3)); // ~3 issues per member per sprint

        return {
            averageSprintVelocity: Math.round(jiraIssues.length / Math.max(1, sprintsCompleted) * 10) / 10,
            sprintsCompleted,
            sprintLength,
            teamCapacity: teamMembers.length * 80, // 80 hours per person per sprint
            actualHoursLogged: Math.round(teamMembers.length * (60 + Math.random() * 40)), // 60-100 hours
            velocityTrend: Math.random() > 0.5 ? 'INCREASING' : 'STABLE',
            burndownEfficiency: Math.min(95, 60 + Math.random() * 35),
            overallProductivityScore: Math.min(95, 65 + Math.random() * 30),
            memberVelocityBreakdown: teamMembers.map(member => ({
                employeeId: member.employeeId,
                name: member.name,
                tasksCompleted: Math.floor(3 + Math.random() * 5),
                velocityScore: Math.round(70 + Math.random() * 25),
                specialization: member.skillSet[0]
            }))
        };
    }

    /**
     * Calculate detailed task metrics
     */
    _calculateTaskMetrics(jiraIssues) {
        const bugIssues = Math.floor(jiraIssues.length * 0.15);
        const featureIssues = Math.floor(jiraIssues.length * 0.60);
        const improvementIssues = jiraIssues.length - bugIssues - featureIssues;

        return {
            taskDistribution: {
                bugs: bugIssues,
                features: featureIssues,
                improvements: improvementIssues,
                total: jiraIssues.length
            },
            qualityMetrics: {
                defectRate: Math.round((bugIssues / jiraIssues.length) * 100 * 10) / 10,
                reworkPercentage: Math.round(Math.random() * 15 * 10) / 10,
                codeReviewCoverage: Math.round((85 + Math.random() * 15) * 10) / 10,
                testCoverage: Math.round((75 + Math.random() * 20) * 10) / 10
            },
            cycleTimeMetrics: {
                averageCycleTime: Math.round((3 + Math.random() * 4) * 10) / 10, // days
                averageLeadTime: Math.round((5 + Math.random() * 6) * 10) / 10, // days
                workInProgressLimit: Math.min(15, Math.max(5, Math.floor(jiraIssues.length * 0.3))),
                throughput: Math.round(jiraIssues.length / 14 * 10) / 10 // per day
            },
            priorityBreakdown: {
                critical: Math.floor(jiraIssues.length * 0.1),
                high: Math.floor(jiraIssues.length * 0.3),
                medium: Math.floor(jiraIssues.length * 0.45),
                low: Math.floor(jiraIssues.length * 0.15)
            }
        };
    }

    /**
     * Calculate project risk analysis
     */
    _calculateProjectRisks(project, metrics, teamMembers) {
        const scheduleRisk = metrics.scheduleVariance < -0.1 ? 'HIGH' :
            metrics.scheduleVariance < 0 ? 'MEDIUM' : 'LOW';
        const resourceRisk = teamMembers.length < 3 ? 'HIGH' :
            teamMembers.length < 6 ? 'MEDIUM' : 'LOW';
        const qualityRisk = metrics.healthScore < 50 ? 'HIGH' :
            metrics.healthScore < 70 ? 'MEDIUM' : 'LOW';

        return {
            overallRiskLevel: this._calculateOverallRisk([scheduleRisk, resourceRisk, qualityRisk]),
            timelineRisk: scheduleRisk,
            resourceRisk,
            qualityRisk,
            technicalRisks: [
                { risk: 'Technical Debt', level: 'MEDIUM', impact: 'Potential delays in future sprints' },
                { risk: 'Integration Complexity', level: 'LOW', impact: 'Minor coordination overhead' },
                { risk: 'Skill Gaps', level: teamMembers.length < 4 ? 'MEDIUM' : 'LOW', impact: 'May require training or external support' }
            ],
            mitigationStrategies: [
                { strategy: 'Weekly risk review meetings', priority: 'HIGH' },
                { strategy: 'Cross-team skill sharing sessions', priority: 'MEDIUM' },
                { strategy: 'Buffer time allocation for critical path', priority: 'HIGH' }
            ],
            riskTrends: {
                lastMonth: 'STABLE',
                currentMonth: scheduleRisk,
                forecast: scheduleRisk === 'HIGH' ? 'INCREASING' : 'STABLE'
            }
        };
    }

    /**
     * Generate chart data for project visualizations
     */
    _generateProjectChartData(project, metrics, velocityData, taskMetrics) {
        return {
            taskCompletionChart: {
                type: 'pie',
                title: 'Project Task Completion Status',
                data: [
                    { label: 'Completed', value: metrics.completedTasks, color: '#28a745' },
                    { label: 'In Progress', value: metrics.inProgressTasks, color: '#ffc107' },
                    { label: 'To Do', value: metrics.todoTasks, color: '#6c757d' }
                ]
            },
            burndownChart: {
                type: 'line',
                title: 'Project Burndown Chart',
                xAxis: 'Sprint',
                yAxis: 'Tasks Remaining',
                data: this._generateBurndownData(metrics.totalTasks, velocityData?.sprintsCompleted || 6)
            },
            velocityTrendChart: {
                type: 'bar',
                title: 'Sprint Velocity Trend',
                xAxis: 'Sprint Number',
                yAxis: 'Story Points',
                data: this._generateVelocityTrendData(velocityData?.sprintsCompleted || 6)
            },
            teamProductivityChart: {
                type: 'horizontal-bar',
                title: 'Team Member Productivity',
                xAxis: 'Productivity Score',
                yAxis: 'Team Member',
                data: velocityData?.memberVelocityBreakdown.map(member => ({
                    label: member.name,
                    value: member.velocityScore,
                    color: this._getProductivityColor(member.velocityScore)
                })) || []
            },
            projectHealthGauge: {
                type: 'gauge',
                title: 'Project Health Score',
                value: metrics.healthScore,
                max: 100,
                thresholds: [
                    { value: 30, color: '#dc3545' },
                    { value: 60, color: '#ffc107' },
                    { value: 80, color: '#28a745' }
                ]
            },
            taskTypeDistribution: {
                type: 'doughnut',
                title: 'Task Type Distribution',
                data: taskMetrics ? [
                    { label: 'Features', value: taskMetrics.taskDistribution.features, color: '#007bff' },
                    { label: 'Bugs', value: taskMetrics.taskDistribution.bugs, color: '#dc3545' },
                    { label: 'Improvements', value: taskMetrics.taskDistribution.improvements, color: '#17a2b8' }
                ] : []
            }
        };
    }

    /**
     * Generate project-specific recommendations
     */
    _generateProjectRecommendations(project, metrics, riskAnalysis, velocityData) {
        const recommendations = [];

        // Schedule-based recommendations
        if (metrics.scheduleVariance < -0.15) {
            recommendations.push({
                type: 'SCHEDULE_CRITICAL',
                priority: 'URGENT',
                title: 'Schedule Recovery Required',
                description: `Project is ${Math.abs(Math.round(metrics.scheduleVariance * 100))}% behind schedule. Immediate intervention needed.`,
                actions: [
                    'Conduct schedule recovery workshop',
                    'Consider scope reduction or resource augmentation',
                    'Implement daily standups with stakeholders'
                ]
            });
        } else if (metrics.scheduleVariance < 0) {
            recommendations.push({
                type: 'SCHEDULE_WARNING',
                priority: 'HIGH',
                title: 'Monitor Schedule Closely',
                description: 'Project showing early signs of schedule pressure.',
                actions: [
                    'Review task estimates and dependencies',
                    'Consider parallel work streams where possible'
                ]
            });
        }

        // Quality-based recommendations  
        if (metrics.healthScore < 60) {
            recommendations.push({
                type: 'QUALITY_IMPROVEMENT',
                priority: 'HIGH',
                title: 'Quality Score Needs Attention',
                description: `Project health score is ${Math.round(metrics.healthScore)}%. Focus on quality improvement.`,
                actions: [
                    'Increase code review frequency',
                    'Implement automated testing',
                    'Schedule quality retrospective'
                ]
            });
        }

        // Team velocity recommendations
        if (velocityData && velocityData.overallProductivityScore < 70) {
            recommendations.push({
                type: 'PRODUCTIVITY_OPTIMIZATION',
                priority: 'MEDIUM',
                title: 'Team Productivity Enhancement',
                description: 'Team productivity can be improved with targeted interventions.',
                actions: [
                    'Identify and remove blockers',
                    'Consider skill development initiatives',
                    'Review and optimize team processes'
                ]
            });
        }

        // Resource optimization
        recommendations.push({
            type: 'RESOURCE_OPTIMIZATION',
            priority: 'MEDIUM',
            title: 'Resource Allocation Review',
            description: 'Regular review of resource allocation for optimal project delivery.',
            actions: [
                'Assess current workload distribution',
                'Plan for upcoming milestone requirements',
                'Consider cross-training opportunities'
            ]
        });

        return recommendations;
    }

    /**
     * Helper methods for project analysis
     */
    _calculateIndividualWorkload(employee) {
        const baseLoad = 70 + Math.random() * 25;
        return Math.min(100, Math.round(baseLoad));
    }

    _analyzeTeamSkills(teamMembers) {
        const allSkills = teamMembers.flatMap(member => member.skillSet || []);
        const skillCounts = {};
        allSkills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });

        return Object.entries(skillCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([skill, count]) => ({ skill, count, percentage: Math.round(count / teamMembers.length * 100) }));
    }

    _calculateEstimatedCompletion(project, completionPercentage) {
        const projectEnd = new Date(project.endDate);
        const remaining = (100 - completionPercentage) / 100;
        const additionalDays = Math.round(remaining * 30); // Estimate based on remaining work
        const estimated = new Date(projectEnd);
        estimated.setDate(estimated.getDate() + additionalDays);
        return estimated.toISOString();
    }

    _identifyCriticalPath(project, jiraIssues) {
        return [
            { task: 'Architecture Review', duration: 3, dependent: true },
            { task: 'Core Implementation', duration: 14, dependent: true },
            { task: 'Integration Testing', duration: 5, dependent: true },
            { task: 'User Acceptance Testing', duration: 7, dependent: false }
        ];
    }

    _calculateOverallRisk(riskLevels) {
        const highRisks = riskLevels.filter(r => r === 'HIGH').length;
        const mediumRisks = riskLevels.filter(r => r === 'MEDIUM').length;

        if (highRisks >= 2) return 'HIGH';
        if (highRisks >= 1 || mediumRisks >= 2) return 'MEDIUM';
        return 'LOW';
    }

    _generateBurndownData(totalTasks, sprints) {
        const data = [];
        let remaining = totalTasks;
        for (let i = 0; i <= sprints; i++) {
            data.push({ sprint: i, ideal: totalTasks - (totalTasks * i / sprints), actual: remaining });
            remaining = Math.max(0, remaining - (15 + Math.random() * 10));
        }
        return data;
    }

    _generateVelocityTrendData(sprints) {
        const baseVelocity = 25;
        return Array.from({ length: sprints }, (_, i) => ({
            sprint: i + 1,
            velocity: baseVelocity + Math.sin(i * 0.5) * 5 + (Math.random() - 0.5) * 8
        }));
    }

    _getProductivityColor(score) {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    }

    _calculateStakeholderSatisfaction(project, metrics) {
        const baseScore = 70;
        const healthBonus = (metrics.healthScore - 70) * 0.3;
        const scheduleBonus = Math.max(-15, metrics.scheduleVariance * 20);
        return Math.min(95, Math.max(30, Math.round(baseScore + healthBonus + scheduleBonus)));
    }

    _generateSprintAnalysis(jiraIssues) {
        const sprintCount = Math.ceil(jiraIssues.length / 15);
        return Array.from({ length: sprintCount }, (_, i) => ({
            sprintNumber: i + 1,
            plannedPoints: 20 + Math.round(Math.random() * 10),
            completedPoints: 15 + Math.round(Math.random() * 10),
            carryoverPoints: Math.round(Math.random() * 5),
            sprintGoalMet: Math.random() > 0.3
        }));
    }

    _generateCodeQualityMetrics(project) {
        return {
            codeComplexity: Math.round(2 + Math.random() * 3),
            technicalDebt: Math.round(5 + Math.random() * 15),
            codeReviewScore: Math.round(80 + Math.random() * 15),
            automatedTestCoverage: Math.round(75 + Math.random() * 20),
            staticAnalysisScore: Math.round(85 + Math.random() * 10)
        };
    }

    _analyzeStakeholderEngagement(project, teamMembers) {
        return {
            stakeholderMeetings: Math.floor(2 + Math.random() * 3),
            feedbackResponseTime: Math.round(1 + Math.random() * 3),
            requirementChanges: Math.floor(Math.random() * 5),
            approvalCycleTime: Math.round(2 + Math.random() * 4)
        };
    }

    _generateBudgetAnalysis(project, teamMembers) {
        const budgetEstimate = teamMembers.length * 50000; // $50k per team member
        const actualSpend = budgetEstimate * (0.7 + Math.random() * 0.4);
        return {
            budgetEstimate,
            actualSpend: Math.round(actualSpend),
            variance: Math.round(((actualSpend - budgetEstimate) / budgetEstimate) * 100),
            forecastToComplete: Math.round(budgetEstimate * 1.1),
            costPerStoryPoint: Math.round(actualSpend / Math.max(1, teamMembers.length * 20))
        };
    }

    _analyzeResourceOptimization(project, teamMembers) {
        return {
            utilizationRate: Math.round(75 + Math.random() * 20),
            crossTrainingNeeds: Math.floor(teamMembers.length * 0.3),
            skillGapAnalysis: teamMembers.length < 5 ? 'Limited expertise diversity' : 'Good skill coverage',
            recommendedTeamSize: Math.max(3, Math.min(8, teamMembers.length + Math.floor(Math.random() * 3 - 1)))
        };
    }

    /**
     * Helper method to add days to a date
     */
    _addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString();
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