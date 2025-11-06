/**
 * Enhanced Smartstart Assistant with Intelligent Response System
 * 
 * This enhanced version provides:
 * - Employee database lookup with fuzzy matching
 * - Task management integration with JIRA data
 * - Project status tracking with detailed information
 * - Team structure intelligence with hierarchy
 * - Advanced intent classification with entity extraction
 * - Edge case handling with query disambiguation
 * - Natural language processing for all communication styles
 */

const mockData = require('../mock-data');

class EnhancedSmartstartAssistant {
    constructor() {
        this.conversationHistory = [];

        // Load data with proper fallbacks
        const allEmployees = [
            ...(Array.isArray(mockData.employees?.leadership) ? mockData.employees.leadership : []),
            ...(Array.isArray(mockData.employees?.teamMembers) ? mockData.employees.teamMembers : []),
            ...(Array.isArray(mockData.employees?.adminUsers) ? mockData.employees.adminUsers : [])
        ];
        this.employees = allEmployees;
        this.jiraProjects = Array.isArray(mockData.jira?.projects) ? mockData.jira.projects : [];
        this.jiraIssues = Array.isArray(mockData.jira?.issues) ? mockData.jira.issues : [];
        this.confluencePages = Array.isArray(mockData.confluence?.pages) ? mockData.confluence.pages : [];
        this.outlookEmails = Array.isArray(mockData.outlook?.emails) ? mockData.outlook.emails : [];

        // Verify data loaded correctly
        console.log(`[Enhanced Assistant] Loaded ${this.employees.length} employees, ${this.jiraIssues.length} issues, ${this.jiraProjects.length} projects`);

        // Initialize intent patterns
        this.initializeIntentPatterns();
    }

    /**
     * Initialize comprehensive intent recognition patterns
     */
    initializeIntentPatterns() {
        this.intentPatterns = {
            // Put more specific patterns first to avoid broad matches
            urgent_tasks: [
                /^urgent\s+tasks?$/i,
                /^priority\s+tasks?$/i,
                /^high\s+priority\s+tasks?$/i,
                /^critical\s+tasks?$/i,
                /what\s+needs\s+attention/i,
                /urgent\s+items?/i,
                /critical\s+items?/i,
                /high\s+priority/i,
                /deadline/i,
                /urgent/i,
                /priority/i
            ],
            employee_listing: [
                /^all\s+employees?$/i,
                /^list\s+all\s+employees?$/i,
                /^show\s+all\s+employees?$/i,
                /^show\s+employees?$/i,
                /^list\s+employees?$/i,
                /^get\s+employees?$/i,
                /^employees?\s+list$/i,
                /^team\s+members?$/i,
                /^all\s+team\s+members?$/i,
                /^show\s+team$/i,
                /^company\s+directory$/i,
                /^staff\s+directory$/i
            ],
            user_projects: [
                // Project-specific queries (most specific - must come first)
                /what\s+(?:are\s+the\s+)?project\s+names?\s+([a-zA-Z\s\.]+)\s+(?:working\s+on|works?\s+on)/i,
                /what\s+(?:are\s+the\s+)?projects?\s+(?:names?\s+)?(?:is\s+)?([a-zA-Z\s\.]+)\s+(?:working\s+on|works?\s+on)/i,
                /list\s+projects?\s+for\s+([a-zA-Z\s\.]+)/i,
                /^([a-zA-Z\s\.]+)\s+projects?\s*(?:names?)?$/i,
                /projects?\s+(?:names?\s+)?for\s+([a-zA-Z\s\.]+)/i,
                /show\s+(?:me\s+)?([a-zA-Z\s\.]+)\s+projects?/i
            ],
            task_lookup: [
                // User-specific task patterns (MUST come first - more specific)
                /show\s+me\s+([a-zA-Z\s\.]+)\s+tasks?/i,
                /list\s+([a-zA-Z\s\.]+)\s+tasks?/i,
                /([a-zA-Z\s\.]+)\s+tasks?/i,
                /tasks?\s+for\s+([a-zA-Z\s\.]+)/i,
                /what\s+is\s+([a-zA-Z\s\.]+)\s+working\s+on/i,
                /([a-zA-Z\s\.]+)\s+work/i,
                /assignments?\s+for\s+([a-zA-Z\s\.]+)/i,
                /current\s+work\s+for\s+([a-zA-Z\s\.]+)/i,
                // General task listing patterns (lower priority)
                /^jira\s+tasks?$/i,
                /^list\s+jira\s+tasks?$/i,
                /^show\s+jira\s+tasks?$/i,
                /^all\s+jira\s+tasks?$/i,
                /^get\s+jira\s+tasks?$/i,
                /^jira\s+issues?$/i,
                /^list\s+all\s+tasks?$/i,
                /^show\s+all\s+tasks?$/i,
                /^all\s+tasks?$/i,
                /^tasks?\s+list$/i,
                /^get\s+tasks?$/i,
                /^show\s+tasks?$/i,
                /^list\s+tasks?$/i,
                /^tasks?$/i,
                /team\s+tasks?/i
            ],
            team_structure: [
                /who\s+(?:are\s+)?(?:all\s+)?reports?\s+to\s+([a-zA-Z\s\.]+)/i,
                /who\s+(?:are\s+)?(?:all\s+)?reporting\s+to\s+([a-zA-Z\s\.]+)/i,
                /who\s+are\s+the\s+direct\s+reports?\s+of\s+([a-zA-Z\s\.]+)/i,
                /direct\s+reports?\s+(?:of|for)\s+([a-zA-Z\s\.]+)/i,
                /show\s+me\s+team\s+members?\s+under\s+([a-zA-Z\s\.]+)/i,
                /list\s+people\s+reporting\s+to\s+([a-zA-Z\s\.]+)/i,
                /team\s+members?\s+under\s+([a-zA-Z\s\.]+)/i,
                /([a-zA-Z\s\.]+)\s+direct\s+reports?/i,
                /([a-zA-Z\s\.]+)\s+team\s+members?/i,
                /([a-zA-Z\s\.]+)\s+manager/i,
                /manager\s+of\s+([a-zA-Z\s\.]+)/i,
                /department\s+structure/i,
                /engineering\s+department/i,
                /team\s+composition/i,
                /who\s+is\s+in\s+the\s+([a-zA-Z\s\.]+)\s+team/i,
                /how\s+many\s+people\s+report\s+to\s+([a-zA-Z\s]+)/i,
                /organizational\s+chart/i
            ],
            employee_lookup: [
                /who\s+is\s+([a-zA-Z\s\.]+)\??/i,
                /tell\s+me\s+about\s+([a-zA-Z\s\.]+)(?!\s+tasks?)(?!\s+team)(?!\s+under)/i,  // Negative lookahead for tasks and team queries
                /find\s+([a-zA-Z\s\.]+)(?!\s+tasks?)(?!\s+team)(?!\s+under)/i,              // Negative lookahead for tasks and team queries
                /([a-zA-Z\s\.]+)\s+profile/i,
                /employee\s+([a-zA-Z\s\.]+)/i,
                /staff\s+([a-zA-Z\s\.]+)/i,
                /who\s+([a-zA-Z\s\.]+)\s+is/i,
                /do\s+you\s+know\s+([a-zA-Z\s\.]+)\??/i,
                /information\s+about\s+([a-zA-Z\s\.]+)(?!\s+tasks?)(?!\s+team)/i, // Negative lookahead
                /details\s+about\s+([a-zA-Z\s\.]+)(?!\s+tasks?)(?!\s+team)/i,    // Negative lookahead
                /show\s+me\s+([a-zA-Z\s\.]+)(?!\s+tasks?)(?!\s+team)/i          // Enhanced negative lookahead to avoid task and team queries
            ],
            project_status: [
                /([A-Z][A-Z0-9]+)\s+project/i,
                /project\s+([A-Z][A-Z0-9]+)/i,
                /status\s+of\s+([A-Z][A-Z0-9]+)/i,
                /([A-Z][A-Z0-9]+)\s+progress/i,
                /when\s+is\s+([A-Z][A-Z0-9]+)\s+due/i,
                /timeline\s+for\s+([A-Z][A-Z0-9]+)/i,
                /who\s+is\s+working\s+on\s+([A-Z][A-Z0-9]+)/i,
                /all\s+projects?/i,
                /show\s+me\s+all\s+projects?/i
            ],
            team_structure: [
                /who\s+(?:are\s+)?(?:all\s+)?reports?\s+to\s+([a-zA-Z\s\.]+)/i,
                /who\s+(?:are\s+)?(?:all\s+)?reporting\s+to\s+([a-zA-Z\s\.]+)/i,
                /who\s+are\s+the\s+direct\s+reports?\s+of\s+([a-zA-Z\s\.]+)/i,
                /direct\s+reports?\s+(?:of|for)\s+([a-zA-Z\s\.]+)/i,
                /show\s+me\s+team\s+members?\s+under\s+([a-zA-Z\s\.]+)/i,
                /list\s+people\s+reporting\s+to\s+([a-zA-Z\s\.]+)/i,
                /team\s+members?\s+under\s+([a-zA-Z\s\.]+)/i,
                /([a-zA-Z\s\.]+)\s+direct\s+reports?/i,
                /([a-zA-Z\s\.]+)\s+team\s+members?/i,
                /([a-zA-Z\s\.]+)\s+manager/i,
                /manager\s+of\s+([a-zA-Z\s\.]+)/i,
                /department\s+structure/i,
                /engineering\s+department/i,
                /team\s+composition/i,
                /who\s+is\s+in\s+the\s+([a-zA-Z\s\.]+)\s+team/i,
                /how\s+many\s+people\s+report\s+to\s+([a-zA-Z\s]+)/i,
                /organizational\s+chart/i
            ],
            department_head: [
                /who\s+is\s+the\s+([a-zA-Z\s]+)\s+manager/i,
                /([a-zA-Z\s]+)\s+head/i,
                /department\s+head/i,
                /team\s+lead/i,
                /who\s+leads?\s+the\s+([a-zA-Z\s]+)/i
            ],
            calendar_availability: [
                /is\s+([a-zA-Z\s\.]+)\s+available/i,
                /([a-zA-Z\s\.]+)\s+calendar/i,
                /schedule\s+for\s+([a-zA-Z\s\.]+)/i,
                /meeting\s+with\s+([a-zA-Z\s\.]+)/i,
                /give\s+me\s+(?:the\s+)?([a-zA-Z\s\.]+)\s+calendar/i,
                /show\s+me\s+(?:the\s+)?([a-zA-Z\s\.]+)\s+calendar/i,
                /(?:what\s+(?:is|are)\s+)?([a-zA-Z\s\.]+)\s+(?:schedule|meetings?|appointments?)/i,
                /upcoming\s+(?:events|meetings?)\s+for\s+([a-zA-Z\s\.]+)/i
            ]
        };

        this.entityPatterns = {
            names: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+[A-Z])?)\b/g,
            projects: /\b([A-Z]{3,}[A-Z0-9]*)\b/g,
            departments: /\b(engineering|devops|qa|design|product|marketing|sales|hr|finance)\b/gi,
            roles: /\b(manager|lead|developer|engineer|designer|analyst|admin|ceo|cto|vp)\b/gi
        };
    }

    /**
     * Main chat function with enhanced intelligence
     */
    async chat(userMessage) {
        try {
            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date().toISOString()
            });

            // Handle empty queries
            if (!userMessage || userMessage.trim() === '') {
                return this.generateEmptyQueryResponse();
            }

            // Analyze intent and extract entities
            const analysis = this.analyzeMessageIntent(userMessage);

            // Generate intelligent response based on intent
            const response = await this.generateIntelligentResponse(userMessage, analysis);

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            });

            return {
                success: true,
                response,
                intent: analysis.primaryIntent,
                entities: analysis.entities,
                confidence: analysis.confidence
            };

        } catch (error) {
            console.error('Enhanced Assistant Error:', error);
            return {
                success: false,
                error: error.message,
                response: 'I apologize, but I encountered an issue processing your request. Please try rephrasing your question.'
            };
        }
    }

    /**
     * Advanced intent analysis with entity extraction
     */
    analyzeMessageIntent(message) {
        const messageLower = message.toLowerCase().trim();
        const analysis = {
            primaryIntent: 'unknown',
            secondaryIntents: [],
            entities: {
                names: [],
                projects: [],
                departments: [],
                roles: []
            },
            confidence: 0,
            originalQuery: message
        };

        // Analyze intents and extract pattern-specific entities first
        let patternEntityExtracted = false;

        for (const [intentType, patterns] of Object.entries(this.intentPatterns)) {
            for (const pattern of patterns) {
                const match = message.match(pattern);
                if (match) {
                    if (analysis.primaryIntent === 'unknown') {
                        analysis.primaryIntent = intentType;
                        analysis.confidence = 0.9;

                        // Extract specific entity from pattern match
                        if (match[1] && match[1].trim()) {
                            const entityName = match[1].trim();
                            if (intentType.includes('employee') || intentType.includes('task') || intentType.includes('team')) {
                                analysis.entities.names.push(entityName);
                                patternEntityExtracted = true;
                            }
                            if (intentType.includes('project')) {
                                analysis.entities.projects.push(entityName);
                            }
                        }
                    } else {
                        analysis.secondaryIntents.push(intentType);
                    }
                }
            }
        }

        // Extract general entities only if pattern-specific extraction didn't work
        if (!patternEntityExtracted) {
            this.extractEntities(message, analysis);
        }

        // Fallback intent detection based on keywords
        if (analysis.primaryIntent === 'unknown') {
            if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
                analysis.primaryIntent = 'greeting';
                analysis.confidence = 0.8;
            } else if (messageLower.includes('help') || messageLower.includes('what can you do')) {
                analysis.primaryIntent = 'help';
                analysis.confidence = 0.8;
            } else if (analysis.entities.names.length > 0) {
                analysis.primaryIntent = 'employee_lookup';
                analysis.confidence = 0.7;
            } else if (analysis.entities.projects.length > 0) {
                analysis.primaryIntent = 'project_status';
                analysis.confidence = 0.7;
            }
        }

        return analysis;
    }

    /**
     * Extract entities from the message
     */
    extractEntities(message, analysis) {
        // Extract names
        const nameMatches = [...message.matchAll(this.entityPatterns.names)];
        nameMatches.forEach(match => {
            const name = match[1].trim();
            if (name.length > 1 && !analysis.entities.names.includes(name)) {
                analysis.entities.names.push(name);
            }
        });

        // Extract project codes
        const projectMatches = [...message.matchAll(this.entityPatterns.projects)];
        projectMatches.forEach(match => {
            const project = match[1].trim();
            if (!analysis.entities.projects.includes(project)) {
                analysis.entities.projects.push(project);
            }
        });

        // Extract departments
        const deptMatches = [...message.matchAll(this.entityPatterns.departments)];
        deptMatches.forEach(match => {
            const dept = match[1].toLowerCase();
            if (!analysis.entities.departments.includes(dept)) {
                analysis.entities.departments.push(dept);
            }
        });

        // Extract roles
        const roleMatches = [...message.matchAll(this.entityPatterns.roles)];
        roleMatches.forEach(match => {
            const role = match[1].toLowerCase();
            if (!analysis.entities.roles.includes(role)) {
                analysis.entities.roles.push(role);
            }
        });
    }

    /**
     * Generate intelligent responses based on intent
     */
    async generateIntelligentResponse(message, analysis) {
        switch (analysis.primaryIntent) {
            case 'employee_lookup':
                return this.handleEmployeeLookup(analysis);

            case 'employee_listing':
                return this.handleEmployeeListing(analysis);

            case 'user_projects':
                return this.handleUserProjects(analysis);

            case 'task_lookup':
                return this.handleTaskLookup(analysis);

            case 'project_status':
                return this.handleProjectStatus(analysis);

            case 'team_structure':
                return this.handleTeamStructure(analysis);

            case 'department_head':
                return this.handleDepartmentHead(analysis);

            case 'calendar_availability':
                return this.handleCalendarAvailability(analysis);

            case 'urgent_tasks':
                return this.handleUrgentTasks(analysis);

            case 'greeting':
                return this.handleGreeting();

            case 'help':
                return this.handleHelpRequest();

            default:
                return this.handleUnknownIntent(message, analysis);
        }
    }

    /**
     * Handle employee lookup with enhanced fuzzy matching for "who" queries
     */
    handleEmployeeLookup(analysis) {
        if (analysis.entities.names.length === 0) {
            return "I'd be happy to help you find employee information! Please specify the person's name you're looking for.";
        }

        const searchName = analysis.entities.names[0];

        // Enhanced search strategy: Try multiple approaches
        let matchedEmployees = this.findEmployeesByName(searchName);

        // If no exact match, try enhanced fuzzy matching
        if (matchedEmployees.length === 0) {
            matchedEmployees = this.findEmployeesEnhancedFuzzy(searchName);

            // If we found fuzzy matches, check confidence
            if (matchedEmployees.length > 0) {
                const bestMatch = matchedEmployees[0];
                const confidence = this.calculateNameMatchConfidence(searchName, bestMatch.name);

                // High confidence match (>0.85) - return directly
                if (confidence > 0.85) {
                    return this.formatEmployeeDetails(bestMatch);
                }

                // Medium confidence (0.6-0.85) - show suggestions
                if (confidence > 0.6) {
                    const suggestions = matchedEmployees.slice(0, 3).map(emp => emp.name).join(', ');
                    return `I couldn't find "${searchName}" exactly. Did you mean: ${suggestions}?\n\nTo see details for any of these, just ask "Who is [exact name]?"`;
                }
            }

            return `I couldn't find an employee named "${searchName}". Please check the spelling or try a different name. You can also ask "List all employees" to see available names.`;
        }

        if (matchedEmployees.length === 1) {
            return this.formatEmployeeDetails(matchedEmployees[0]);
        } else {
            // Multiple matches - show options
            const nameList = matchedEmployees.map(emp => emp.name).join(', ');
            return `I found multiple employees matching "${searchName}": ${nameList}.\n\nPlease be more specific by asking "Who is [exact name]?"`;
        }
    }

    /**
     * Handle employee listing requests
     */
    handleEmployeeListing(analysis) {
        if (this.employees.length === 0) {
            return "📋 No employee data is currently available.";
        }

        const totalEmployees = this.employees.length;
        let response = `👥 **Company Directory** (${totalEmployees} employees):\n\n`;

        // Group by department
        const departmentGroups = {};
        this.employees.forEach(emp => {
            const dept = emp.department || 'Other';
            if (!departmentGroups[dept]) {
                departmentGroups[dept] = [];
            }
            departmentGroups[dept].push(emp);
        });

        // Show departments and their members
        for (const [department, members] of Object.entries(departmentGroups)) {
            response += `🏢 **${department} Department** (${members.length} members):\n`;
            members.forEach(emp => {
                const role = emp.role || emp.title || 'Employee';
                response += `   • ${emp.name} - ${role}\n`;
            });
            response += '\n';
        }

        response += `💡 **Quick Actions:**\n`;
        response += `• "Who is [Name]?" - Get detailed employee info\n`;
        response += `• "Tell me about [Name]" - Employee profile\n`;
        response += `• "[Name] tasks" - Show someone's current tasks\n`;

        return response;
    }

    /**
     * Handle task lookup with user filtering
     */
    handleTaskLookup(analysis) {
        const queryLower = analysis.originalQuery.toLowerCase();

        // Check for general task listing requests (no specific user)
        if (queryLower === 'jira tasks' ||
            queryLower === 'all tasks' ||
            queryLower === 'list tasks' ||
            queryLower === 'show tasks' ||
            queryLower === 'tasks' ||
            queryLower === 'list all tasks' ||
            queryLower === 'show all tasks' ||
            (queryLower.includes('all') && queryLower.includes('task'))) {
            return this.formatAllTasks();
        }

        if (analysis.entities.names.length === 0) {
            // Suggest task listing if no specific user mentioned
            return `📋 **Task Options:**\n\n` +
                `• "JIRA tasks" - Show all JIRA tasks\n` +
                `• "All tasks" - Complete task overview\n` +
                `• "[Name] tasks" - Show specific person's tasks\n` +
                `• "Urgent tasks" - Show high priority items\n\n` +
                `What would you like to see?`;
        }

        const searchName = analysis.entities.names[0];
        const employee = this.findEmployeesByName(searchName)[0];

        if (!employee) {
            return `I couldn't find an employee named "${searchName}". Please check the name and try again.`;
        }

        return this.formatUserTasks(employee);
    }

    /**
     * Handle user projects queries - show project names for a specific user
     */
    handleUserProjects(analysis) {
        if (analysis.entities.names.length === 0) {
            return "I'd be happy to show project information! Please specify whose projects you'd like to see.";
        }

        const searchName = analysis.entities.names[0];
        const employee = this.findEmployeesByName(searchName)[0];

        if (!employee) {
            return `I couldn't find an employee named "${searchName}". Please check the name and try again.`;
        }

        return this.formatUserProjects(employee);
    }

    /**
     * Handle project status queries
     */
    handleProjectStatus(analysis) {
        // Check if asking for all projects
        if (analysis.originalQuery.toLowerCase().includes('all') && analysis.originalQuery.toLowerCase().includes('project')) {
            return this.formatAllProjects();
        }

        if (analysis.entities.projects.length === 0) {
            return "I can provide project status information! Please specify which project you'd like to know about (e.g., PORTAEH, CLOUDMIG).";
        }

        const projectCode = analysis.entities.projects[0];
        const project = this.findProjectByCode(projectCode);

        if (!project) {
            const availableProjects = this.jiraProjects.map(p => p.projectId).join(', ');
            return `I couldn't find project "${projectCode}". Available projects: ${availableProjects}`;
        }

        return this.formatProjectDetails(project);
    }

    /**
     * Handle team structure queries
     */
    handleTeamStructure(analysis) {
        if (analysis.entities.names.length === 0) {
            if (analysis.originalQuery.toLowerCase().includes('department') ||
                analysis.originalQuery.toLowerCase().includes('organization')) {
                return this.formatOrganizationalStructure();
            }
            return "I can help with team structure questions! Please specify a person or team you'd like to know about.";
        }

        const searchName = analysis.entities.names[0];

        // Check if asking about reports
        if (analysis.originalQuery.toLowerCase().includes('report')) {
            return this.formatDirectReports(searchName);
        }

        // Check if asking about manager
        if (analysis.originalQuery.toLowerCase().includes('manager')) {
            return this.formatManagerInfo(searchName);
        }

        return this.formatTeamInfo(searchName);
    }

    /**
     * Handle department head queries
     */
    handleDepartmentHead(analysis) {
        const queryLower = analysis.originalQuery.toLowerCase();

        if (analysis.entities.departments.length > 0) {
            const department = analysis.entities.departments[0];
            return this.formatDepartmentHead(department);
        }

        if (analysis.entities.roles.length > 0) {
            const role = analysis.entities.roles[0];
            return this.formatRoleHolders(role);
        }

        return "I can help you find department heads and team leads! Please specify which department or role you're asking about.";
    }

    /**
     * Handle calendar availability queries
     */
    handleCalendarAvailability(analysis) {
        if (analysis.entities.names.length === 0) {
            return "I can help check availability! Please specify whose calendar you'd like to check.";
        }

        const searchName = analysis.entities.names[0];
        const employee = this.findEmployeesByName(searchName)[0];

        if (!employee) {
            return `I couldn't find an employee named "${searchName}".`;
        }

        // Get calendar events for this employee
        const calendarEvents = this.getCalendarEventsForEmployee(employee);
        const taskCount = this.getTaskCount(employee);

        let response = `📅 **Calendar for ${employee.name}**\n\n`;
        response += `👤 **Employee Info:**\n`;
        response += `   💼 Role: ${employee.role}\n`;
        response += `   🏢 Department: ${employee.department}\n`;
        response += `   📍 Location: ${employee.location}\n`;
        response += `   ✅ Current Tasks: ${taskCount} active assignments\n\n`;

        if (calendarEvents.length > 0) {
            response += `📋 **Upcoming Events (${calendarEvents.length} total):**\n\n`;

            calendarEvents.forEach((event, index) => {
                const startDate = new Date(event.start.dateTime);
                const endDate = new Date(event.end.dateTime);
                const dateStr = startDate.toLocaleDateString();
                const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                response += `${index + 1}. **${event.subject}**\n`;
                response += `   🗓️ ${dateStr} | ⏰ ${startTime} - ${endTime}\n`;
                if (event.location?.displayName) {
                    response += `   📍 ${event.location.displayName}\n`;
                }
                response += `   👥 ${event.attendees?.length || 0} attendees\n\n`;
            });
        } else {
            response += `� **No upcoming events found**\n\n`;
        }

        response += `💡 **Quick Actions:**\n`;
        response += `   • Check their current tasks: "Show me ${employee.name} tasks"\n`;
        response += `   • View team information: "Who reports to ${employee.name}"\n`;
        response += `   • Contact info: ${employee.email}`;

        return response;
    }

    /**
     * Get calendar events for a specific employee
     */
    getCalendarEventsForEmployee(employee) {
        if (!this.outlookEmails || !Array.isArray(this.outlookEmails)) {
            return [];
        }

        // Mock calendar events for demonstration
        // In a real system, this would fetch from Outlook API or database
        const mockEvents = this.getMockCalendarEvents();

        // Filter events where the employee is an attendee or organizer
        const userEmail = employee.email;

        return mockEvents.filter(event => {
            // Check if employee is organizer
            if (event.organizer?.emailAddress?.address === userEmail) {
                return true;
            }

            // Check if employee is an attendee
            if (event.attendees) {
                return event.attendees.some(attendee =>
                    attendee.emailAddress?.address === userEmail ||
                    attendee.emailAddress?.name === employee.name
                );
            }

            return false;
        }).slice(0, 10); // Limit to next 10 events
    }

    /**
     * Get mock calendar events (simulating calendar data)
     */
    getMockCalendarEvents() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        return [
            {
                id: "event_abrar_1",
                subject: "Monthly Data Quality Review",
                start: {
                    dateTime: "2025-11-07T10:00:00.000Z",
                    timeZone: "Europe/Rome"
                },
                end: {
                    dateTime: "2025-11-07T11:30:00.000Z",
                    timeZone: "Europe/Rome"
                },
                location: {
                    displayName: "Conference Room B"
                },
                organizer: {
                    emailAddress: {
                        address: "mani.s@company.com",
                        name: "Mani S"
                    }
                },
                attendees: [
                    {
                        emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" }
                    },
                    {
                        emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" }
                    },
                    {
                        emailAddress: { address: "manager@company.com", name: "Project Manager" }
                    }
                ]
            },
            {
                id: "event_abrar_2",
                subject: "Cross-System Architecture Planning",
                start: {
                    dateTime: "2025-11-08T10:00:00.000Z",
                    timeZone: "Europe/Rome"
                },
                end: {
                    dateTime: "2025-11-08T11:30:00.000Z",
                    timeZone: "Europe/Rome"
                },
                location: {
                    displayName: "Teams Meeting"
                },
                organizer: {
                    emailAddress: {
                        address: "devsparrow84@outlook.com",
                        name: "Dev Sparrow"
                    }
                },
                attendees: [
                    {
                        emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" }
                    },
                    {
                        emailAddress: { address: "michael.chen@company.com", name: "Michael Chen" }
                    }
                ]
            },
            {
                id: "event_abrar_3",
                subject: "Team Demo: Email Integration Module",
                start: {
                    dateTime: "2025-11-10T14:00:00.000Z",
                    timeZone: "Europe/Rome"
                },
                end: {
                    dateTime: "2025-11-10T15:00:00.000Z",
                    timeZone: "Europe/Rome"
                },
                location: {
                    displayName: "Conference Room A / Teams Hybrid"
                },
                organizer: {
                    emailAddress: {
                        address: "devsparrow84@outlook.com",
                        name: "Dev Sparrow"
                    }
                },
                attendees: [
                    {
                        emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" }
                    },
                    {
                        emailAddress: { address: "team@company.com", name: "Development Team" }
                    }
                ]
            },
            {
                id: "event_abrar_4",
                subject: "PORTAEH Sprint Planning - Q4 2025",
                start: {
                    dateTime: "2025-11-12T09:00:00.000Z",
                    timeZone: "Europe/Rome"
                },
                end: {
                    dateTime: "2025-11-12T10:30:00.000Z",
                    timeZone: "Europe/Rome"
                },
                location: {
                    displayName: "Conference Room A"
                },
                organizer: {
                    emailAddress: {
                        address: "abrar.ulhaq@company.com",
                        name: "Abrar ul haq N"
                    }
                },
                attendees: [
                    {
                        emailAddress: { address: "priya.sharma@company.com", name: "Priya Sharma" }
                    },
                    {
                        emailAddress: { address: "raj.patel@company.com", name: "Raj Patel" }
                    },
                    {
                        emailAddress: { address: "alex.thompson@company.com", name: "Alex Thompson" }
                    },
                    {
                        emailAddress: { address: "emma.rodriguez@company.com", name: "Emma Rodriguez" }
                    }
                ]
            }
        ];
    }

    /**
     * Handle urgent tasks queries
     */
    handleUrgentTasks(analysis) {
        const urgentTasks = this.jiraIssues.filter(task =>
            task.priority === 'High' || task.priority === 'Critical'
        );

        if (urgentTasks.length === 0) {
            return "✅ Great news! No urgent or critical tasks are currently pending.";
        }

        let response = `⚠️ **Urgent Items Requiring Attention:**\n\n`;
        urgentTasks.slice(0, 5).forEach((task, index) => {
            response += `${index + 1}. **${task.key}**: ${task.summary}\n`;
            response += `   📊 Status: ${task.status} | 🔥 Priority: ${task.priority}\n`;
            response += `   👤 Assignee: ${task.assignee}\n\n`;
        });

        if (urgentTasks.length > 5) {
            response += `... and ${urgentTasks.length - 5} more urgent items.\n\n`;
        }

        response += `💡 **Recommendation:** Focus on Critical items first, then High priority tasks.`;
        return response;
    }

    /**
     * Handle greeting
     */
    handleGreeting() {
        const greetings = [
            "Hello! I'm Smartstart Assistant. I'm here to help you with employee information, project status, task management, and team coordination. What would you like to know?",
            "Hi there! I'm Smartstart Assistant, your intelligent workplace companion. I can help you find information about employees, track projects, manage tasks, and understand team structures. How can I assist you?",
            "Welcome! I'm Smartstart Assistant. Whether you need employee details, project updates, task information, or team insights, I'm here to help. What can I do for you today?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    /**
     * Handle help requests
     */
    handleHelpRequest() {
        return `🤖 **Smartstart Assistant Capabilities:**\n\n` +
            `👥 **Employee Information:**\n` +
            `• "All employees" - Company directory\n` +
            `• "Who is John Smith?" - Get employee details\n` +
            `• "Tell me about Sarah" - Employee profiles\n` +
            `• "Who reports to Mike Davis?" - Team structure\n\n` +
            `📋 **Task Management:**\n` +
            `• "JIRA tasks" - List all tasks\n` +
            `• "All tasks" - Complete task overview\n` +
            `• "Show me Dinesh's tasks" - Individual task lists\n` +
            `• "What is Abrar working on?" - Current assignments\n` +
            `• "Urgent tasks" - High priority items\n\n` +
            `🚀 **Project Status:**\n` +
            `• "PORTAEH project status" - Project details\n` +
            `• "All projects overview" - Complete project list\n` +
            `• "Who is working on CLOUDMIG?" - Project teams\n\n` +
            `🏢 **Team & Organization:**\n` +
            `• "Engineering department structure" - Org chart\n` +
            `• "Who is the DevOps lead?" - Department heads\n` +
            `• "Team composition" - Team member lists\n\n` +
            `⚡ **Priority Management:**\n` +
            `• "What needs attention today?" - Urgent items\n` +
            `• "High priority tasks" - Critical task list\n\n` +
            `Just ask me anything about your team, projects, or tasks in natural language!`;
    }

    /**
     * Handle unknown intents with suggestions
     */
    handleUnknownIntent(message, analysis) {
        // Try to provide contextual suggestions based on extracted entities
        let suggestions = [];

        if (analysis.entities.names.length > 0) {
            const name = analysis.entities.names[0];
            suggestions.push(`"Who is ${name}?" - Get employee information`);
            suggestions.push(`"Show me ${name}'s tasks" - View their assignments`);
        }

        if (analysis.entities.projects.length > 0) {
            const project = analysis.entities.projects[0];
            suggestions.push(`"${project} project status" - Get project details`);
            suggestions.push(`"Who is working on ${project}?" - See project team`);
        }

        if (suggestions.length === 0) {
            suggestions = [
                '"Who is John Smith?" - Find employee information',
                '"Show me Dinesh\'s tasks" - View task assignments',
                '"PORTAEH project status" - Get project updates',
                '"What needs attention today?" - See urgent items'
            ];
        }

        return `I'm not sure I understand "${message}". Here are some things you could try:\n\n` +
            suggestions.map(s => `• ${s}`).join('\n') +
            `\n\nI'm here to help with employee information, tasks, projects, and team structure!`;
    }

    /**
     * Generate empty query response
     */
    generateEmptyQueryResponse() {
        return "Hi! I'm Smartstart Assistant. I can provide:\n" +
            "📅 Your daily plan and schedule\n" +
            "📋 Task updates and project status\n" +
            "👥 Team member information\n" +
            "📧 Email summaries and calendar events\n" +
            "⚡ Urgent items that need attention\n" +
            "📚 Quick access to documentation\n\n" +
            "Just tell me what you need!";
    }

    // Utility methods for data lookup and formatting

    /**
     * Find employees by name with exact and partial matching
     */
    findEmployeesByName(searchName) {
        const searchLower = searchName.toLowerCase();

        // Exact matches first
        let matches = this.employees.filter(emp =>
            emp.name.toLowerCase() === searchLower ||
            emp.name.toLowerCase().includes(searchLower)
        );

        // If no exact matches, try partial matching
        if (matches.length === 0) {
            matches = this.employees.filter(emp => {
                const empNameParts = emp.name.toLowerCase().split(' ');
                const searchParts = searchLower.split(' ');
                return searchParts.some(part =>
                    empNameParts.some(empPart => empPart.includes(part) && part.length > 1)
                );
            });
        }

        return matches;
    }

    /**
     * Find employees with fuzzy matching for typos
     */
    findEmployeesFuzzy(searchName) {
        const searchLower = searchName.toLowerCase();

        return this.employees.filter(emp => {
            const empName = emp.name.toLowerCase();
            // Simple fuzzy matching based on character similarity
            const similarity = this.calculateSimilarity(searchLower, empName);
            return similarity > 0.6; // 60% similarity threshold
        }).sort((a, b) => {
            const simA = this.calculateSimilarity(searchLower, a.name.toLowerCase());
            const simB = this.calculateSimilarity(searchLower, b.name.toLowerCase());
            return simB - simA;
        });
    }

    /**
     * Simple similarity calculation
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    /**
     * Levenshtein distance for fuzzy matching
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Enhanced fuzzy matching with multiple algorithms for "who" queries
     */
    findEmployeesEnhancedFuzzy(searchName) {
        const searchLower = searchName.toLowerCase().trim();
        const results = [];

        this.employees.forEach(emp => {
            const empName = emp.name.toLowerCase();
            const empNames = empName.split(' ');

            // Calculate multiple similarity scores
            const scores = {
                full: this.calculateSimilarity(searchLower, empName),
                partial: this.calculatePartialNameMatch(searchLower, empNames),
                phonetic: this.calculatePhoneticSimilarity(searchLower, empName),
                initials: this.calculateInitialsMatch(searchLower, empNames)
            };

            // Calculate weighted confidence score
            const confidence = this.calculateNameMatchConfidence(searchName, emp.name);

            if (confidence > 0.4) { // Lower threshold for suggestions
                results.push({
                    ...emp,
                    confidence,
                    scores
                });
            }
        });

        // Sort by confidence (highest first)
        return results.sort((a, b) => b.confidence - a.confidence);
    }

    /**
     * Calculate overall name match confidence
     */
    calculateNameMatchConfidence(searchName, targetName) {
        const searchLower = searchName.toLowerCase().trim();
        const targetLower = targetName.toLowerCase();
        const targetNames = targetLower.split(' ');

        // Multiple scoring methods
        const fullMatch = this.calculateSimilarity(searchLower, targetLower);
        const partialMatch = this.calculatePartialNameMatch(searchLower, targetNames);
        const phoneticMatch = this.calculatePhoneticSimilarity(searchLower, targetLower);
        const initialsMatch = this.calculateInitialsMatch(searchLower, targetNames);

        // Weighted combination (prioritize exact and partial matches)
        const confidence = (
            fullMatch * 0.4 +           // Full name similarity
            partialMatch * 0.3 +        // Partial name match
            phoneticMatch * 0.2 +       // Phonetic similarity
            initialsMatch * 0.1         // Initials match
        );

        return Math.min(confidence, 1.0);
    }

    /**
     * Calculate partial name matching (first name, last name, etc.)
     */
    calculatePartialNameMatch(searchTerm, nameArray) {
        const searchWords = searchTerm.split(/\s+/);
        let maxScore = 0;

        // Check each search word against each name part
        for (const searchWord of searchWords) {
            for (const namePart of nameArray) {
                if (searchWord.length > 1 && namePart.length > 1) {
                    const score = this.calculateSimilarity(searchWord, namePart);
                    maxScore = Math.max(maxScore, score);
                }
            }
        }

        return maxScore;
    }

    /**
     * Simple phonetic similarity (handle common sound-alikes)
     */
    calculatePhoneticSimilarity(search, target) {
        // Basic phonetic replacements
        const phoneticReplacements = {
            'ph': 'f', 'gh': 'f', 'ck': 'k', 'qu': 'kw',
            'x': 'ks', 'z': 's', 'c': 'k'
        };

        let searchPhonetic = search;
        let targetPhonetic = target;

        Object.entries(phoneticReplacements).forEach(([from, to]) => {
            searchPhonetic = searchPhonetic.replace(new RegExp(from, 'g'), to);
            targetPhonetic = targetPhonetic.replace(new RegExp(from, 'g'), to);
        });

        return this.calculateSimilarity(searchPhonetic, targetPhonetic);
    }

    /**
     * Calculate initials matching (e.g., "SJ" matches "Sarah Johnson")
     */
    calculateInitialsMatch(search, nameArray) {
        // Check if search looks like initials (short, mostly capitals)
        if (search.length > 4 || !/^[a-zA-Z\s]*$/.test(search)) {
            return 0;
        }

        const searchInitials = search.replace(/\s/g, '').toLowerCase();
        const targetInitials = nameArray.map(name => name.charAt(0)).join('').toLowerCase();

        if (searchInitials === targetInitials) {
            return 1.0;
        }

        // Partial initials match
        if (searchInitials.length <= targetInitials.length) {
            const matchCount = searchInitials.split('').filter((char, i) =>
                targetInitials.charAt(i) === char
            ).length;
            return matchCount / searchInitials.length;
        }

        return 0;
    }

    /**
     * Find project by code
     */
    findProjectByCode(projectCode) {
        return this.jiraProjects.find(project =>
            project.projectId.toLowerCase() === projectCode.toLowerCase() ||
            project.name.toLowerCase().includes(projectCode.toLowerCase())
        );
    }

    /**
     * Format employee details
     */
    formatEmployeeDetails(employee) {
        let response = `👤 **${employee.name}**\n\n`;
        response += `🏢 **Department:** ${employee.department}\n`;
        response += `💼 **Role:** ${employee.role}\n`;
        response += `📍 **Location:** ${employee.location}\n`;
        response += `📧 **Email:** ${employee.email}\n`;

        if (employee.manager && employee.manager !== 'N/A') {
            response += `👨‍💼 **Manager:** ${employee.manager}\n`;
        }

        if (employee.level) {
            response += `📊 **Level:** ${employee.level}\n`;
        }

        // Add task count
        const taskCount = this.getTaskCount(employee);
        if (taskCount > 0) {
            response += `📋 **Active Tasks:** ${taskCount}\n`;
        }

        // Add direct reports if any
        const directReports = this.getDirectReports(employee.name);
        if (directReports.length > 0) {
            response += `👥 **Direct Reports:** ${directReports.length} people\n`;
        }

        return response;
    }

    /**
     * Format user tasks
     */
    formatUserTasks(employee) {
        // Find tasks by employee ID (JIRA tasks use employeeId as assignee)
        const userTasks = this.jiraIssues.filter(task =>
            task.assignee === employee.employeeId ||
            task.assignee === employee.name ||
            (task.assignee && task.assignee.toLowerCase().includes(employee.name.toLowerCase())) ||
            (employee.name && employee.name.toLowerCase().includes(task.assignee.toLowerCase()))
        );

        if (userTasks.length === 0) {
            return `📋 **${employee.name}** currently has no assigned JIRA tasks.`;
        }

        let response = `📋 **Tasks for ${employee.name}** (${userTasks.length} total):\n\n`;

        userTasks.slice(0, 5).forEach((task, index) => {
            response += `${index + 1}. **${task.key}**: ${task.summary}\n`;
            response += `   📊 Status: ${task.status} | 🔥 Priority: ${task.priority}\n`;
            response += `   📁 Project: ${task.project}\n\n`;
        });

        if (userTasks.length > 5) {
            response += `... and ${userTasks.length - 5} more tasks.\n\n`;
        }

        // Add workload assessment
        const highPriorityCount = userTasks.filter(t => t.priority === 'High' || t.priority === 'Critical').length;
        if (highPriorityCount > 0) {
            response += `⚠️ **${highPriorityCount}** high-priority tasks require attention.`;
        } else {
            response += `✅ Good workload balance - no critical priority tasks.`;
        }

        return response;
    }

    /**
     * Format user projects - show project names and details for a specific user
     */
    formatUserProjects(employee) {
        // Find tasks assigned to this employee to determine their projects
        const userTasks = this.jiraIssues.filter(task =>
            task.assignee === employee.employeeId ||
            task.assignee === employee.name ||
            (task.assignee && task.assignee.toLowerCase().includes(employee.name.toLowerCase())) ||
            (employee.name && employee.name.toLowerCase().includes(task.assignee.toLowerCase()))
        );

        // Find projects where the employee is a member
        const userProjects = this.jiraProjects.filter(project =>
            project.members && project.members.includes(employee.employeeId)
        );

        // Get unique project names from tasks
        const taskProjectNames = [...new Set(userTasks.map(task => task.project))];

        // Combine project information
        const allProjectInfo = new Map();

        // Add projects from membership
        userProjects.forEach(project => {
            allProjectInfo.set(project.projectId, {
                id: project.projectId,
                name: project.name,
                description: project.description,
                status: project.status,
                priority: project.priority,
                role: 'Team Member'
            });
        });

        // Add projects from tasks (might not be in membership list)
        taskProjectNames.forEach(projectId => {
            if (!allProjectInfo.has(projectId)) {
                const projectDetails = this.jiraProjects.find(p => p.projectId === projectId);
                allProjectInfo.set(projectId, {
                    id: projectId,
                    name: projectDetails ? projectDetails.name : projectId,
                    description: projectDetails ? projectDetails.description : 'Project details not available',
                    status: projectDetails ? projectDetails.status : 'Unknown',
                    priority: projectDetails ? projectDetails.priority : 'Unknown',
                    role: 'Task Assignee'
                });
            }
        });

        if (allProjectInfo.size === 0) {
            return `📋 **${employee.name}** is not currently assigned to any projects.`;
        }

        let response = `🏢 **Projects for ${employee.name}** (${allProjectInfo.size} total):\n\n`;

        Array.from(allProjectInfo.values()).forEach((project, index) => {
            response += `${index + 1}. **${project.name}** (${project.id})\n`;
            response += `   📝 ${project.description}\n`;
            response += `   📊 Status: ${project.status} | 🔥 Priority: ${project.priority}\n`;
            response += `   👤 Role: ${project.role}\n\n`;
        });

        // Add task summary for each project
        response += `📋 **Task Summary by Project:**\n`;
        taskProjectNames.forEach(projectId => {
            const projectTasks = userTasks.filter(task => task.project === projectId);
            const projectInfo = allProjectInfo.get(projectId);
            response += `• ${projectInfo.name}: ${projectTasks.length} tasks assigned\n`;
        });

        return response;
    }

    /**
     * Format all tasks overview
     */
    formatAllTasks() {
        if (this.jiraIssues.length === 0) {
            return "📋 No JIRA tasks are currently in the system.";
        }

        const statusCounts = {};
        const priorityCounts = {};

        this.jiraIssues.forEach(task => {
            statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
            priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
        });

        let response = `📋 **All JIRA Tasks Overview** (${this.jiraIssues.length} total):\n\n`;

        response += `📊 **By Status:**\n`;
        Object.entries(statusCounts).forEach(([status, count]) => {
            response += `• ${status}: ${count} tasks\n`;
        });

        response += `\n🔥 **By Priority:**\n`;
        Object.entries(priorityCounts).forEach(([priority, count]) => {
            response += `• ${priority}: ${count} tasks\n`;
        });

        // Show recent tasks
        response += `\n📋 **Recent Tasks:**\n`;
        this.jiraIssues.slice(0, 3).forEach((task, index) => {
            response += `${index + 1}. **${task.key}**: ${task.summary} (${task.assignee})\n`;
        });

        return response;
    }

    /**
     * Format project details
     */
    formatProjectDetails(project) {
        let response = `🚀 **${project.name} (${project.projectId})**\n\n`;
        response += `📊 **Status:** ${project.status}\n`;
        response += `🔥 **Priority:** ${project.priority}\n`;
        response += `📅 **Timeline:** ${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}\n`;
        response += `👥 **Team Size:** ${project.members.length} members\n`;

        if (project.description) {
            response += `📝 **Description:** ${project.description}\n`;
        }

        // Add project tasks
        const projectTasks = this.jiraIssues.filter(task => task.project === project.projectId);
        if (projectTasks.length > 0) {
            response += `\n📋 **Active Tasks:** ${projectTasks.length}\n`;

            const tasksByStatus = {};
            projectTasks.forEach(task => {
                tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;
            });

            Object.entries(tasksByStatus).forEach(([status, count]) => {
                response += `• ${status}: ${count} tasks\n`;
            });
        }

        // Add team members
        response += `\n👥 **Team Members:**\n`;
        project.members.slice(0, 5).forEach(member => {
            response += `• ${member}\n`;
        });

        if (project.members.length > 5) {
            response += `• ... and ${project.members.length - 5} more members\n`;
        }

        return response;
    }

    /**
     * Format all projects overview
     */
    formatAllProjects() {
        if (this.jiraProjects.length === 0) {
            return "🚀 No projects are currently in the system.";
        }

        let response = `🚀 **All Projects Overview** (${this.jiraProjects.length} total):\n\n`;

        this.jiraProjects.forEach((project, index) => {
            response += `${index + 1}. **${project.name} (${project.projectId})**\n`;
            response += `   📊 Status: ${project.status} | 🔥 Priority: ${project.priority}\n`;
            response += `   👥 Team: ${project.members.length} members\n`;
            response += `   📅 Due: ${new Date(project.endDate).toLocaleDateString()}\n\n`;
        });

        return response;
    }

    /**
     * Format organizational structure
     */
    formatOrganizationalStructure() {
        const ceo = this.employees.find(emp => emp.role.toLowerCase().includes('ceo'));

        let response = `🏢 **Organizational Structure:**\n\n`;

        if (ceo) {
            response += `👑 **CEO:** ${ceo.name}\n\n`;

            const directReports = this.getDirectReports(ceo.name);
            if (directReports.length > 0) {
                response += `📊 **Executive Team:**\n`;
                directReports.forEach(report => {
                    response += `• ${report.name} - ${report.role}\n`;
                });
            }
        }

        // Group by department
        const departments = {};
        this.employees.forEach(emp => {
            if (!departments[emp.department]) {
                departments[emp.department] = [];
            }
            departments[emp.department].push(emp);
        });

        response += `\n🏢 **By Department:**\n`;
        Object.entries(departments).forEach(([dept, members]) => {
            response += `\n**${dept}** (${members.length} members):\n`;
            const managers = members.filter(m => m.role.toLowerCase().includes('manager') || m.role.toLowerCase().includes('lead'));
            managers.forEach(mgr => {
                response += `• ${mgr.name} - ${mgr.role}\n`;
            });
        });

        return response;
    }

    /**
     * Format direct reports
     */
    formatDirectReports(managerName) {
        const manager = this.findEmployeesByName(managerName)[0];
        if (!manager) {
            return `I couldn't find an employee named "${managerName}".`;
        }

        const directReports = this.getDirectReports(manager.name);

        if (directReports.length === 0) {
            return `👤 **${manager.name}** currently has no direct reports.`;
        }

        let response = `👥 **Direct Reports for ${manager.name}** (${directReports.length} total):\n\n`;

        directReports.forEach((report, index) => {
            response += `${index + 1}. **${report.name}**\n`;
            response += `   💼 Role: ${report.role}\n`;
            response += `   📍 Location: ${report.location}\n`;
            const taskCount = this.getTaskCount(report);
            if (taskCount > 0) {
                response += `   📋 Active Tasks: ${taskCount}\n`;
            }
            response += `\n`;
        });

        return response;
    }

    /**
     * Format manager information
     */
    formatManagerInfo(employeeName) {
        const employee = this.findEmployeesByName(employeeName)[0];
        if (!employee) {
            return `I couldn't find an employee named "${employeeName}".`;
        }

        if (!employee.manager || employee.manager === 'N/A') {
            return `👤 **${employee.name}** appears to be at the top level with no direct manager listed.`;
        }

        const manager = this.findEmployeesByName(employee.manager)[0];
        if (manager) {
            return `👨‍💼 **${employee.name}** reports to:\n\n` +
                this.formatEmployeeDetails(manager);
        } else {
            return `👨‍💼 **${employee.name}** reports to: ${employee.manager}`;
        }
    }

    /**
     * Format team information
     */
    formatTeamInfo(searchName) {
        const employee = this.findEmployeesByName(searchName)[0];
        if (!employee) {
            return `I couldn't find an employee named "${searchName}".`;
        }

        let response = `👥 **Team Information for ${employee.name}:**\n\n`;
        response += `🏢 **Department:** ${employee.department}\n`;
        response += `💼 **Role:** ${employee.role}\n`;

        if (employee.manager && employee.manager !== 'N/A') {
            response += `👨‍💼 **Reports to:** ${employee.manager}\n`;
        }

        const directReports = this.getDirectReports(employee.name);
        if (directReports.length > 0) {
            response += `👥 **Manages:** ${directReports.length} people\n`;
        }

        // Find team members (same department, same manager)
        const teammates = this.employees.filter(emp =>
            emp.department === employee.department &&
            emp.manager === employee.manager &&
            emp.name !== employee.name
        );

        if (teammates.length > 0) {
            response += `\n🤝 **Teammates:**\n`;
            teammates.slice(0, 5).forEach(teammate => {
                response += `• ${teammate.name} - ${teammate.role}\n`;
            });
            if (teammates.length > 5) {
                response += `• ... and ${teammates.length - 5} more teammates\n`;
            }
        }

        return response;
    }

    /**
     * Format department head information
     */
    formatDepartmentHead(department) {
        const deptEmployees = this.employees.filter(emp =>
            emp.department.toLowerCase().includes(department.toLowerCase())
        );

        if (deptEmployees.length === 0) {
            return `I couldn't find the "${department}" department.`;
        }

        const heads = deptEmployees.filter(emp =>
            emp.role.toLowerCase().includes('manager') ||
            emp.role.toLowerCase().includes('head') ||
            emp.role.toLowerCase().includes('director') ||
            emp.role.toLowerCase().includes('lead')
        );

        if (heads.length === 0) {
            return `I couldn't find a specific head for the ${department} department.`;
        }

        let response = `👨‍💼 **${department.charAt(0).toUpperCase() + department.slice(1)} Department Leadership:**\n\n`;
        heads.forEach(head => {
            response += `• **${head.name}** - ${head.role}\n`;
        });

        return response;
    }

    /**
     * Format role holders
     */
    formatRoleHolders(role) {
        const roleHolders = this.employees.filter(emp =>
            emp.role.toLowerCase().includes(role.toLowerCase())
        );

        if (roleHolders.length === 0) {
            return `I couldn't find anyone with the role "${role}".`;
        }

        let response = `💼 **Employees in ${role} roles:**\n\n`;
        roleHolders.forEach(emp => {
            response += `• **${emp.name}** - ${emp.role} (${emp.department})\n`;
        });

        return response;
    }

    /**
     * Get direct reports for an employee
     */
    getDirectReports(managerName) {
        // Find the manager first
        const manager = this.employees.find(emp =>
            emp.name.toLowerCase() === managerName.toLowerCase() ||
            emp.name.toLowerCase().includes(managerName.toLowerCase()) ||
            managerName.toLowerCase().includes(emp.name.toLowerCase())
        );

        if (!manager || !manager.directReports) {
            return [];
        }

        // Get employees who are in the manager's directReports list
        return this.employees.filter(emp =>
            manager.directReports.includes(emp.employeeId)
        );
    }

    /**
     * Get task count for an employee
     */
    getTaskCount(employee) {
        return this.jiraIssues.filter(task =>
            task.assignee.toLowerCase().includes(employee.name.toLowerCase()) ||
            employee.name.toLowerCase().includes(task.assignee.toLowerCase())
        ).length;
    }
}

module.exports = EnhancedSmartstartAssistant;