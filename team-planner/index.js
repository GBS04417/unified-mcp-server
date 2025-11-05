/**
 * Team Planning Management System
 * 
 * Manages Excel-based team planning with JIRA integration, leave management,
 * task reassignment, and automated scheduling updates.
 */

const { ExcelManagerService } = require('./excel-manager');

class TeamPlanningService {
    constructor(config = {}) {
        this.name = 'Team Planner Manager';
        this.description = 'Excel-based team planner with JIRA integration and automated task management';
        this.excelManager = new ExcelManagerService(config);
        this.jiraService = null; // Will be injected during initialization
        this.tools = {
            'load_team_plan': {
                description: 'Load team planner data from Excel file',
                inputSchema: {
                    type: 'object',
                    properties: {
                        filePath: {
                            type: 'string',
                            description: 'Path to the Excel planning file'
                        }
                    },
                    required: ['filePath']
                },
                handler: this.loadTeamPlan.bind(this)
            },
            'update_member_availability': {
                description: 'Update team member availability (leaves, holidays)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        memberName: {
                            type: 'string',
                            description: 'Team member name'
                        },
                        startDate: {
                            type: 'string',
                            description: 'Leave start date (YYYY-MM-DD)'
                        },
                        endDate: {
                            type: 'string',
                            description: 'Leave end date (YYYY-MM-DD)'
                        },
                        leaveType: {
                            type: 'string',
                            enum: ['vacation', 'sick', 'personal', 'holiday'],
                            description: 'Type of leave'
                        }
                    },
                    required: ['memberName', 'startDate', 'endDate', 'leaveType']
                },
                handler: this.updateMemberAvailability.bind(this)
            },
            'check_task_conflicts': {
                description: 'Check for task conflicts when member is unavailable',
                inputSchema: {
                    type: 'object',
                    properties: {
                        memberName: {
                            type: 'string',
                            description: 'Team member name'
                        },
                        dateRange: {
                            type: 'object',
                            properties: {
                                start: { type: 'string' },
                                end: { type: 'string' }
                            }
                        }
                    },
                    required: ['memberName']
                },
                handler: this.checkTaskConflicts.bind(this)
            },
            'reassign_tasks': {
                description: 'Reassign tasks from unavailable member to available team members',
                inputSchema: {
                    type: 'object',
                    properties: {
                        fromMember: {
                            type: 'string',
                            description: 'Member who is unavailable'
                        },
                        toMember: {
                            type: 'string',
                            description: 'Member to assign tasks to (optional - auto-assign if not specified)'
                        },
                        taskIds: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Specific task IDs to reassign (optional - all if not specified)'
                        },
                        dateRange: {
                            type: 'object',
                            properties: {
                                start: { type: 'string' },
                                end: { type: 'string' }
                            }
                        }
                    },
                    required: ['fromMember']
                },
                handler: this.reassignTasks.bind(this)
            },
            'update_calendar_view': {
                description: 'Update Excel sheets with calendar view (holidays, weekends grayed out)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        month: {
                            type: 'string',
                            description: 'Month to update (YYYY-MM)'
                        },
                        holidays: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'List of holiday dates (YYYY-MM-DD)'
                        }
                    },
                    required: ['month']
                },
                handler: this.updateCalendarView.bind(this)
            },
            'get_team_capacity': {
                description: 'Get team capacity and availability analysis',
                inputSchema: {
                    type: 'object',
                    properties: {
                        dateRange: {
                            type: 'object',
                            properties: {
                                start: { type: 'string' },
                                end: { type: 'string' }
                            }
                        },
                        includeDetails: {
                            type: 'boolean',
                            description: 'Include detailed member-wise breakdown',
                            default: false
                        }
                    }
                },
                handler: this.getTeamCapacity.bind(this)
            },
            'sync_with_jira': {
                description: 'Sync planning data with JIRA task status',
                inputSchema: {
                    type: 'object',
                    properties: {
                        updateExcel: {
                            type: 'boolean',
                            description: 'Update Excel file with JIRA status',
                            default: true
                        },
                        memberFilter: {
                            type: 'string',
                            description: 'Filter by specific member (optional)'
                        }
                    }
                },
                handler: this.syncWithJira.bind(this)
            },
            'generate_planning_report': {
                description: 'Generate comprehensive planning and utilization report',
                inputSchema: {
                    type: 'object',
                    properties: {
                        reportType: {
                            type: 'string',
                            enum: ['weekly', 'monthly', 'sprint', 'custom'],
                            description: 'Type of report to generate'
                        },
                        dateRange: {
                            type: 'object',
                            properties: {
                                start: { type: 'string' },
                                end: { type: 'string' }
                            }
                        },
                        includeJiraSync: {
                            type: 'boolean',
                            description: 'Include JIRA task status in report',
                            default: true
                        }
                    },
                    required: ['reportType']
                },
                handler: this.generatePlanningReport.bind(this)
            },
            'analyze_member_tasks': {
                description: 'Analyze tasks worked by a team member for a specific month',
                inputSchema: {
                    type: 'object',
                    properties: {
                        memberName: {
                            type: 'string',
                            description: 'Team member name (e.g., "Dinesh", "Sankar")'
                        },
                        month: {
                            type: 'string',
                            description: 'Month in YYYY-MM format (e.g., "2025-10", "2025-11")'
                        },
                        filePath: {
                            type: 'string',
                            description: 'Path to Excel planning file',
                            default: './NEW_CHENNAI_PLAN_2025.xlsx'
                        },
                        includeDetails: {
                            type: 'boolean',
                            description: 'Include detailed daily breakdown',
                            default: true
                        }
                    },
                    required: ['memberName', 'month']
                },
                handler: this.analyzeMemberTasks.bind(this)
            },
            'update_task_assignment': {
                description: 'Update or add task assignment for a team member on specific dates',
                inputSchema: {
                    type: 'object',
                    properties: {
                        memberName: {
                            type: 'string',
                            description: 'Team member name (e.g., "Dinesh", "Sankar")'
                        },
                        taskId: {
                            type: 'string',
                            description: 'Task/Issue ID (e.g., "CCACB-11717")'
                        },
                        date: {
                            type: 'string',
                            description: 'Date in YYYY-MM-DD format (e.g., "2025-11-11")'
                        },
                        hours: {
                            type: 'number',
                            description: 'Number of hours to allocate (e.g., 8)',
                            minimum: 0.5,
                            maximum: 8
                        },
                        filePath: {
                            type: 'string',
                            description: 'Path to Excel planning file',
                            default: './NEW_CHENNAI_PLAN_2025.xlsx'
                        }
                    },
                    required: ['memberName', 'taskId', 'date', 'hours']
                },
                handler: this.updateTaskAssignment.bind(this)
            }
        };
    }

    /**
     * Initialize the team planning service with required dependencies
     */
    async initialize(jiraService, config = {}) {
        this.jiraService = jiraService;
        this.config = {
            excelFilePath: config.excelFilePath || 'NEW_CHENNAI_PLAN_2025.xlsx',
            teamMembers: config.teamMembers || [
                'Sankar', 'Arunkumar', 'Kaushik S', 'Rajapandi', 'Venkat',
                'Lok', 'Vallarasu', 'Srividya', 'Prem', 'Dinesh', 'Anbu'
            ],
            workingDays: config.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            defaultWorkingHours: config.defaultWorkingHours || 8,
            ...config
        };

        console.log('✅ Team Planning Service initialized successfully');
        return true;
    }

    /**
     * Load team planning data from Excel file
     */
    async loadTeamPlan(params) {
        const { filePath = './NEW_CHENNAI_PLAN_2025.xlsx' } = params;

        try {
            console.log(`📊 Loading team planning data from: ${filePath}`);

            // Use Excel manager to read planning data
            const planningData = await this.excelManager.readPlanningFile(filePath);

            return {
                success: true,
                data: planningData,
                message: `Loaded planning data for ${planningData.teamMembers ? planningData.teamMembers.length : 0} team members`
            };
        } catch (error) {
            console.error('❌ Error loading team plan:', error.message);
            throw new Error(`Failed to load team planning data: ${error.message}`);
        }
    }

    /**
     * Update team member availability
     */
    async updateMemberAvailability(params) {
        const { memberName, startDate, endDate, leaveType } = params;

        try {
            console.log(`📅 Updating availability for ${memberName}: ${startDate} to ${endDate} (${leaveType})`);

            // Check for task conflicts during leave period
            const conflicts = await this.checkTaskConflicts({
                memberName,
                dateRange: { start: startDate, end: endDate }
            });

            // Update Excel file with leave information
            await this.excelManager.updateMemberAvailability(
                './NEW_CHENNAI_PLAN_2025.xlsx',
                memberName,
                startDate,
                endDate,
                leaveType
            );

            return {
                success: true,
                memberName,
                leaveType,
                dateRange: { start: startDate, end: endDate },
                conflicts: conflicts.conflicts,
                message: `Updated availability for ${memberName}. ${conflicts.conflicts.length} task conflicts detected.`
            };
        } catch (error) {
            console.error('❌ Error updating member availability:', error.message);
            throw new Error(`Failed to update member availability: ${error.message}`);
        }
    }

    /**
     * Check for task conflicts when member is unavailable
     */
    async checkTaskConflicts(params) {
        const { memberName, dateRange } = params;

        try {
            console.log(`🔍 Checking task conflicts for ${memberName}`);

            // Get member's scheduled tasks from Excel
            const scheduledTasks = await this.excelManager.getMemberScheduledTasks(
                './NEW_CHENNAI_PLAN_2025.xlsx',
                memberName,
                dateRange
            );

            // Get JIRA tasks assigned to member
            const jiraTasks = await this._getMemberJiraTasks(memberName);

            // Identify conflicts
            const conflicts = this._identifyTaskConflicts(scheduledTasks, jiraTasks, dateRange);

            return {
                success: true,
                memberName,
                dateRange,
                conflicts,
                scheduledTasksCount: scheduledTasks.length,
                jiraTasksCount: jiraTasks.length,
                message: `Found ${conflicts.length} task conflicts for ${memberName}`
            };
        } catch (error) {
            console.error('❌ Error checking task conflicts:', error.message);
            throw new Error(`Failed to check task conflicts: ${error.message}`);
        }
    }

    /**
     * Reassign tasks from unavailable member to available team members
     */
    async reassignTasks(params) {
        const { fromMember, toMember, taskIds, dateRange } = params;

        try {
            console.log(`🔄 Reassigning tasks from ${fromMember}${toMember ? ` to ${toMember}` : ' (auto-assign)'}`);

            // Get tasks that need reassignment
            const tasksToReassign = await this._getTasksForReassignment(fromMember, taskIds, dateRange);

            // Find available team members if no specific assignee
            const availableMembers = toMember ? [toMember] : await this._findAvailableMembers(dateRange);

            // Perform reassignment
            const reassignmentResults = await this._performTaskReassignment(tasksToReassign, availableMembers);

            // Update Excel sheets
            await this.excelManager.updateTaskReassignments(
                './NEW_CHENNAI_PLAN_2025.xlsx',
                reassignmentResults
            );

            // Update JIRA if applicable
            await this._updateJiraAssignments(reassignmentResults);

            return {
                success: true,
                fromMember,
                toMember: toMember || 'auto-assigned',
                reassignedTasks: reassignmentResults,
                message: `Successfully reassigned ${reassignmentResults.length} tasks from ${fromMember}`
            };
        } catch (error) {
            console.error('❌ Error reassigning tasks:', error.message);
            throw new Error(`Failed to reassign tasks: ${error.message}`);
        }
    }

    /**
     * Update Excel sheets with calendar view
     */
    async updateCalendarView(params) {
        const { month, holidays = [] } = params;

        try {
            console.log(`📅 Updating calendar view for ${month}`);

            // Update calendar view using Excel manager
            const result = await this.excelManager.updateCalendarView(
                './NEW_CHENNAI_PLAN_2025.xlsx',
                month,
                holidays
            );

            const updateResults = [result];

            return {
                success: true,
                month,
                holidaysCount: holidays.length,
                weekendsMarked: calendarData.weekends.length,
                updatedMembers: updateResults.length,
                message: `Updated calendar view for ${month} across all team member sheets`
            };
        } catch (error) {
            console.error('❌ Error updating calendar view:', error.message);
            throw new Error(`Failed to update calendar view: ${error.message}`);
        }
    }

    /**
     * Get team capacity and availability analysis
     */
    async getTeamCapacity(params) {
        const { dateRange, includeDetails = false } = params;

        try {
            console.log('📊 Analyzing team capacity');

            // Load team plan to get member list
            const planData = await this.loadTeamPlan({ filePath: './NEW_CHENNAI_PLAN_2025.xlsx' });
            const teamMembers = planData.data.teamMembers;

            // Calculate capacity for each member
            const memberCapacities = [];
            for (const member of teamMembers) {
                const capacity = await this.excelManager.calculateMemberCapacity(
                    './NEW_CHENNAI_PLAN_2025.xlsx',
                    member,
                    dateRange
                );
                memberCapacities.push(capacity);
            }

            // Generate overall team metrics
            const teamMetrics = this._generateTeamMetrics(memberCapacities);

            return {
                success: true,
                dateRange,
                teamMetrics,
                memberCapacities: includeDetails ? memberCapacities : undefined,
                message: `Team capacity analysis completed for ${memberCapacities.length} members`
            };
        } catch (error) {
            console.error('❌ Error getting team capacity:', error.message);
            throw new Error(`Failed to get team capacity: ${error.message}`);
        }
    }

    /**
     * Sync planning data with JIRA task status
     */
    async syncWithJira(params) {
        const { updateExcel = true, memberFilter } = params;

        try {
            console.log('🔄 Syncing planning data with JIRA');

            const members = memberFilter ? [memberFilter] : this.config.teamMembers;
            const syncResults = [];

            for (const member of members) {
                const result = await this._syncMemberWithJira(member, updateExcel);
                syncResults.push(result);
            }

            return {
                success: true,
                syncedMembers: syncResults.length,
                updatedTasks: syncResults.reduce((total, result) => total + result.updatedTasks, 0),
                syncResults: syncResults,
                message: `JIRA sync completed for ${syncResults.length} team members`
            };
        } catch (error) {
            console.error('❌ Error syncing with JIRA:', error.message);
            throw new Error(`Failed to sync with JIRA: ${error.message}`);
        }
    }

    /**
     * Generate comprehensive planning report
     */
    async generatePlanningReport(params) {
        const { reportType, dateRange, includeJiraSync = true } = params;

        try {
            console.log(`📊 Generating ${reportType} planning report`);

            // Sync with JIRA if requested
            if (includeJiraSync) {
                await this.syncWithJira({ updateExcel: false });
            }

            // Generate report based on type
            const reportData = await this.excelManager.generateReportData(
                './NEW_CHENNAI_PLAN_2025.xlsx',
                reportType,
                dateRange
            );

            return {
                success: true,
                reportType,
                dateRange,
                ...reportData,
                message: `Generated ${reportType} planning report`
            };
        } catch (error) {
            console.error('❌ Error generating planning report:', error.message);
            throw new Error(`Failed to generate planning report: ${error.message}`);
        }
    }

    // Private helper methods (implementation details)
    async _readExcelPlanningData(filePath) {
        // Implementation for reading Excel data using pandas or similar
        return {
            teamMembers: this.config.teamMembers,
            sheets: {},
            lastModified: new Date()
        };
    }

    async _updateExcelAvailability(memberName, startDate, endDate, leaveType) {
        // Implementation for updating Excel with leave information
        console.log(`Updating Excel availability for ${memberName}`);
    }

    async _getMemberScheduledTasks(memberName, dateRange) {
        // Implementation for getting scheduled tasks from Excel
        return [];
    }

    async _getMemberJiraTasks(memberName) {
        // Implementation for getting JIRA tasks assigned to member
        if (this.jiraService) {
            try {
                const result = await this.jiraService.handleFetchByAssignee(memberName, null, 100);
                return result.issues || [];
            } catch (error) {
                console.warn(`Could not fetch JIRA tasks for ${memberName}:`, error.message);
                return [];
            }
        }
        return [];
    }

    /**
     * Enrich task data with JIRA status and details
     */
    async _enrichTasksWithJiraStatus(taskIds) {
        if (!this.jiraService || !taskIds || taskIds.length === 0) {
            return {};
        }

        const jiraTaskDetails = {};

        for (const taskId of taskIds) {
            try {
                console.log(`🔍 Fetching JIRA details for ${taskId}...`);
                const result = await this.jiraService.handleFetch(taskId);

                // Handle the actual JIRA service response structure
                if (result.content && result.content[0] && result.content[0].text) {
                    const issueData = JSON.parse(result.content[0].text);

                    jiraTaskDetails[taskId] = {
                        key: issueData.key,
                        summary: issueData.fields.summary,
                        status: issueData.fields.status.name,
                        assignee: issueData.fields.assignee ? issueData.fields.assignee.displayName : 'Unassigned',
                        priority: issueData.fields.priority ? issueData.fields.priority.name : 'None',
                        dueDate: issueData.fields.duedate || null,
                        url: `https://svil.bansel.it/jira/browse/${taskId}`,
                        lastUpdated: issueData.fields.updated,
                        description: issueData.fields.description || '',
                        project: issueData.fields.project.name,
                        creator: issueData.fields.creator ? issueData.fields.creator.displayName : 'Unknown'
                    };
                    console.log(`✅ Successfully enriched ${taskId} with JIRA data`);
                } else {
                    console.warn(`Could not parse JIRA response for ${taskId}`);
                    jiraTaskDetails[taskId] = {
                        key: taskId,
                        status: 'Not Found',
                        url: `https://svil.bansel.it/jira/browse/${taskId}`,
                        error: 'Invalid JIRA response format'
                    };
                }
            } catch (error) {
                console.warn(`Error fetching JIRA details for ${taskId}:`, error.message);
                jiraTaskDetails[taskId] = {
                    key: taskId,
                    status: 'Error',
                    url: `https://svil.bansel.it/jira/browse/${taskId}`,
                    error: error.message
                };
            }
        }

        return jiraTaskDetails;
    }

    _identifyTaskConflicts(scheduledTasks, jiraTasks, dateRange) {
        // Implementation for identifying task conflicts
        return [];
    }

    async _getTasksForReassignment(fromMember, taskIds, dateRange) {
        // Implementation for getting tasks that need reassignment
        return [];
    }

    async _findAvailableMembers(dateRange) {
        // Implementation for finding available team members
        return this.config.teamMembers.slice(0, 3); // Mock implementation
    }

    async _performTaskReassignment(tasksToReassign, availableMembers) {
        // Implementation for performing task reassignment
        return [];
    }

    async _updateExcelWithReassignments(reassignmentResults) {
        // Implementation for updating Excel with reassignments
        console.log('Updating Excel with reassignments');
    }

    async _updateJiraAssignments(reassignmentResults) {
        // Implementation for updating JIRA assignments
        console.log('Updating JIRA assignments');
    }

    _generateMonthCalendar(month, holidays) {
        // Implementation for generating calendar data
        return {
            weekends: [],
            holidays: holidays,
            workingDays: []
        };
    }

    async _updateMemberCalendarSheet(member, calendarData) {
        // Implementation for updating member's calendar sheet
        return { member, updated: true };
    }

    async _calculateMemberCapacity(member, dateRange) {
        // Implementation for calculating member capacity
        return {
            member,
            availableHours: 40,
            allocatedHours: 35,
            utilizationPercentage: 87.5
        };
    }

    _generateTeamMetrics(memberCapacities) {
        // Implementation for generating team metrics
        return {
            totalCapacity: memberCapacities.length * 40,
            totalAllocated: memberCapacities.reduce((sum, m) => sum + m.allocatedHours, 0),
            averageUtilization: memberCapacities.reduce((sum, m) => sum + m.utilizationPercentage, 0) / memberCapacities.length
        };
    }

    async _syncMemberWithJira(member, updateExcel) {
        // Implementation for syncing member with JIRA
        return {
            member,
            updatedTasks: 0
        };
    }

    async _generateReport(reportType, dateRange) {
        // Implementation for generating different types of reports
        return {
            summary: `${reportType} report generated`,
            data: {}
        };
    }

    /**
     * Analyze tasks worked by a team member for a specific month
     */
    async analyzeMemberTasks(params) {
        try {
            const { memberName, month, filePath = './NEW_CHENNAI_PLAN_2025.xlsx', includeDetails = true } = params;

            console.log(`🔍 Analyzing tasks for ${memberName} in ${month}...`);

            // Load team planning data
            const planResult = await this.loadTeamPlan({ filePath });

            if (!planResult.success) {
                return {
                    success: false,
                    error: `Failed to load team plan: ${planResult.error}`,
                    data: null
                };
            }

            // Find member data
            const memberData = planResult.data.memberSchedules?.[memberName];
            if (!memberData) {
                return {
                    success: false,
                    error: `Member '${memberName}' not found in team schedule`,
                    data: null,
                    availableMembers: Object.keys(planResult.data.memberSchedules || {})
                };
            }

            // Get month data
            const monthData = memberData.monthlyAllocations?.[month];
            if (!monthData) {
                return {
                    success: false,
                    error: `No data found for ${memberName} in ${month}`,
                    data: null,
                    availableMonths: Object.keys(memberData.monthlyAllocations || {})
                };
            }

            // Calculate task statistics
            const tasks = Array.from(monthData.issues || new Set());
            const workingDays = Object.keys(monthData.days || {});
            const totalHours = monthData.totalHours || 0;
            const avgHoursPerDay = workingDays.length > 0 ? (totalHours / workingDays.length) : 0;

            // Build task details with daily breakdown
            const taskDetails = {};
            const dailyBreakdown = [];

            // Process each working day
            workingDays.sort().forEach(dayKey => {
                const dayData = monthData.days[dayKey];
                const dayNum = dayKey.split('-')[2];
                const dayDate = `${month}-${dayNum}`;

                const dayEntry = {
                    date: dayDate,
                    dayNumber: parseInt(dayNum),
                    hours: dayData.hours || 0,
                    isFullDay: dayData.isFullDay || false,
                    tasks: dayData.issues || []
                };

                dailyBreakdown.push(dayEntry);

                // Aggregate task statistics
                (dayData.issues || []).forEach(task => {
                    if (!taskDetails[task]) {
                        taskDetails[task] = {
                            taskId: task,
                            totalHours: 0,
                            daysWorked: 0,
                            dailyAllocations: []
                        };
                    }

                    taskDetails[task].totalHours += dayData.hours || 0;
                    taskDetails[task].daysWorked += 1;
                    taskDetails[task].dailyAllocations.push({
                        date: dayDate,
                        hours: dayData.hours || 0
                    });
                });
            });

            // Calculate task percentages
            Object.values(taskDetails).forEach(task => {
                task.percentageOfMonth = totalHours > 0 ? ((task.totalHours / totalHours) * 100).toFixed(1) : 0;
            });

            // Enrich tasks with JIRA status if JIRA service is available
            let jiraTaskDetails = {};
            if (this.jiraService && tasks.length > 0) {
                console.log(`🔍 Fetching JIRA status for ${tasks.length} tasks...`);
                try {
                    jiraTaskDetails = await this._enrichTasksWithJiraStatus(tasks);
                } catch (error) {
                    console.warn('Could not enrich with JIRA status:', error.message);
                }
            }

            // Sort tasks by hours (descending) and add JIRA enrichment
            const sortedTasks = Object.values(taskDetails).sort((a, b) => b.totalHours - a.totalHours).map(task => {
                const jiraInfo = jiraTaskDetails[task.taskId] || null;
                return {
                    ...task,
                    jiraStatus: jiraInfo ? {
                        status: jiraInfo.status,
                        summary: jiraInfo.summary,
                        priority: jiraInfo.priority,
                        assignee: jiraInfo.assignee,
                        dueDate: jiraInfo.dueDate,
                        url: jiraInfo.url,
                        lastUpdated: jiraInfo.lastUpdated,
                        error: jiraInfo.error
                    } : null
                };
            });

            const result = {
                success: true,
                data: {
                    memberName,
                    month,
                    summary: {
                        totalTasks: tasks.length,
                        totalWorkingDays: workingDays.length,
                        totalHours,
                        averageHoursPerDay: parseFloat(avgHoursPerDay.toFixed(1)),
                        utilizationRate: parseFloat((totalHours / (workingDays.length * 8) * 100).toFixed(1))
                    },
                    tasks: sortedTasks,
                    jiraIntegration: {
                        enabled: !!this.jiraService,
                        tasksEnriched: Object.keys(jiraTaskDetails).length,
                        enrichmentSuccess: Object.values(jiraTaskDetails).filter(t => !t.error).length
                    },
                    dailyBreakdown: includeDetails ? dailyBreakdown : null,
                    monthData: {
                        allIssues: tasks,
                        workingDayKeys: workingDays
                    }
                }
            };

            console.log(`✅ Analysis completed for ${memberName} in ${month}`);
            console.log(`📊 Found ${tasks.length} tasks across ${workingDays.length} working days`);
            if (this.jiraService) {
                console.log(`🔗 JIRA integration: ${Object.keys(jiraTaskDetails).length} tasks enriched`);
            }

            return result;

        } catch (error) {
            console.error('❌ Error analyzing member tasks:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    /**
     * Update or add task assignment for a team member on a specific date
     */
    async updateTaskAssignment(params) {
        try {
            const { memberName, taskId, date, hours, filePath = './NEW_CHENNAI_PLAN_2025.xlsx' } = params;

            console.log(`📝 Updating task assignment: ${memberName} -> ${taskId} -> ${date} (${hours}h)`);

            // Parse the date to get month and day
            const dateObj = new Date(date);
            const month = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
            const dayNumber = dateObj.getDate();

            // Load current team planning data to validate
            const planResult = await this.loadTeamPlan({ filePath });

            if (!planResult.success) {
                return {
                    success: false,
                    error: `Failed to load team plan: ${planResult.error}`,
                    data: null
                };
            }

            // Check if member exists
            const memberData = planResult.data.memberSchedules?.[memberName];
            if (!memberData) {
                return {
                    success: false,
                    error: `Member '${memberName}' not found in team schedule`,
                    data: null,
                    availableMembers: Object.keys(planResult.data.memberSchedules || {})
                };
            }

            // Update the Excel file directly
            const updateResult = await this.excelManager.addTaskAssignment(
                filePath,
                memberName,
                taskId,
                date,
                hours
            );

            if (!updateResult.success) {
                return {
                    success: false,
                    error: `Failed to update Excel: ${updateResult.error}`,
                    data: null
                };
            }

            // Verify the update by reloading and checking
            const verifyResult = await this.analyzeMemberTasks({
                memberName,
                month,
                filePath,
                includeDetails: false
            });

            const result = {
                success: true,
                data: {
                    memberName,
                    taskId,
                    date,
                    hours,
                    month,
                    updated: true
                },
                message: `Successfully updated ${memberName} with ${hours} hours for ${taskId} on ${date}`,
                verification: verifyResult.success ? verifyResult.data.summary : null
            };

            console.log(`✅ Task assignment updated successfully`);
            console.log(`📊 ${memberName}: ${taskId} (${hours}h on ${date})`);

            return result;

        } catch (error) {
            console.error('❌ Error updating task assignment:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }
}

module.exports = { TeamPlanningService };