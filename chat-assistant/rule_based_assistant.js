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
 * - User context support for "my" queries
 */

// Load environment variables if not already loaded
if (!process.env.JIRA_USERNAME) {
    require('dotenv').config();
}

const mockData = require('../mock-data');
const { USER_CONTEXT } = require('../config.js');

class EnhancedSmartstartAssistant {
    constructor() {
        this.conversationHistory = [];

        // Check if we should use test mode (mock data) or live data
        this.useTestMode = this.shouldUseTestMode();

        // Load data based on test mode setting
        if (this.useTestMode) {
            // Use mock data for testing/demo
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

            console.log(`[Enhanced Assistant] Using MOCK data: ${this.employees.length} employees, ${this.jiraIssues.length} issues, ${this.jiraProjects.length} projects`);
        } else {
            // Use minimal live data structure - focus on individual user context
            this.employees = this.createLiveUserProfile();
            this.jiraProjects = [];
            this.jiraIssues = [];
            this.confluencePages = [];
            this.outlookEmails = [];

            console.log(`[Enhanced Assistant] Using LIVE data mode: Individual user focus for ${USER_CONTEXT.defaultUserName}`);
        }

        // Initialize intent patterns
        this.initializeIntentPatterns();
    }

    /**
     * Determine if test mode should be used based on environment variables
     */
    shouldUseTestMode() {
        // Check for global test mode setting
        const globalTestMode = process.env.USE_TEST_MODE;

        // Check for service-specific test mode (not applicable here but for consistency)
        const assistantTestMode = process.env.ASSISTANT_USE_TEST_MODE;

        // If service-specific setting exists, use it; otherwise use global setting
        if (assistantTestMode !== undefined && assistantTestMode !== '') {
            return assistantTestMode.toLowerCase() === 'true';
        }

        // Default to global setting, defaulting to true (test mode) if not set
        return globalTestMode ? globalTestMode.toLowerCase() === 'true' : true;
    }

    /**
     * Create a live user profile for the current user
     */
    createLiveUserProfile() {
        return [
            {
                employeeId: USER_CONTEXT.defaultUserId,
                name: USER_CONTEXT.defaultUserName,
                email: USER_CONTEXT.defaultUserEmail,
                role: 'Senior Data Engineer',
                department: 'Data Engineering',
                location: 'Remote',
                manager: 'N/A',
                directReports: [], // Will be populated from live data if needed
                level: 'Senior',
                isLiveUser: true // Flag to indicate this is live user data
            }
        ];
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
            overdue_tasks: [
                // Team member overdue patterns (HIGH priority)
                /^(?:list\s+of\s+)?overdue\s+tasks?\s+(?:of\s+)?my\s+team\s+members?$/i,
                /^(?:show\s+me\s+)?(?:the\s+)?overdue\s+tasks?\s+(?:of\s+)?my\s+team\s+members?$/i,
                /^my\s+team\s+members?\s+overdue\s+tasks?$/i,
                /^overdue\s+tasks?\s+(?:of\s+)?my\s+team\s+members?$/i,
                /^(?:what\s+are\s+the\s+)?overdue\s+tasks?\s+(?:assigned\s+to\s+)?my\s+team\s+members?$/i,
                // General overdue patterns
                /^overdue\s+tasks?$/i,
                /^list\s+overdue\s+tasks?$/i,
                /^show\s+overdue\s+tasks?$/i,
                /^tasks?\s+that\s+are\s+overdue$/i,
                /^late\s+tasks?$/i,
                /^missed\s+deadlines?$/i,
                /overdue/i,
                /past\s+due/i,
                /late\s+tasks?/i
            ],
            workload_analysis: [
                // Team workload patterns (HIGH priority)
                /^team\s+workload\s+analysis$/i,
                /^(?:workload\s+)?analysis\s+(?:of\s+)?my\s+team\s+members?$/i,
                /^(?:show\s+me\s+)?(?:the\s+)?workload\s+(?:of\s+)?my\s+team\s+members?$/i,
                /^my\s+team\s+members?\s+workload$/i,
                /^workload\s+(?:of\s+)?my\s+team\s+members?$/i,
                /^(?:team\s+)?workload\s+distribution$/i,
                /^(?:how\s+is\s+the\s+)?workload\s+(?:distributed\s+)?(?:among\s+)?my\s+team\s+members?$/i,
                /^(?:show\s+me\s+)?(?:team\s+)?workload\s+balance$/i,
                /^(?:analyze\s+)?(?:my\s+)?team\s+workload(?:\s+analysis)?$/i,
                // General workload patterns
                /^workload\s+analysis$/i,
                /^team\s+productivity$/i,
                /^task\s+distribution$/i,
                /workload/i,
                /task\s+distribution/i
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
                // "My" project patterns (HIGHEST priority - most specific)
                /^my\s+projects?$/i,
                /^what\s+are\s+my\s+projects?$/i,
                /^show\s+me\s+my\s+projects?$/i,
                /^list\s+my\s+projects?$/i,
                /^get\s+my\s+projects?$/i,
                /^my\s+current\s+projects?$/i,
                /^what\s+projects?\s+am\s+i\s+working\s+on$/i,
                /^which\s+projects?\s+am\s+i\s+on$/i,
                // Project-specific queries (most specific - must come first)
                /what\s+(?:are\s+the\s+)?project\s+names?\s+([a-zA-Z\s\.]+)\s+(?:working\s+on|works?\s+on)/i,
                /what\s+(?:are\s+the\s+)?projects?\s+(?:names?\s+)?(?:is\s+)?([a-zA-Z\s\.]+)\s+(?:working\s+on|works?\s+on)/i,
                /list\s+projects?\s+for\s+([a-zA-Z\s\.]+)/i,
                /^([a-zA-Z\s\.]+)\s+projects?\s*(?:names?)?$/i,
                /projects?\s+(?:names?\s+)?for\s+([a-zA-Z\s\.]+)/i,
                /show\s+(?:me\s+)?([a-zA-Z\s\.]+)\s+projects?/i
            ],
            task_lookup: [
                // "My" task patterns (HIGHEST priority - most specific)
                /^my\s+tasks?$/i,
                /^what\s+are\s+my\s+tasks?$/i,
                /^show\s+me\s+my\s+tasks?$/i,
                /^list\s+my\s+tasks?$/i,
                /^get\s+my\s+tasks?$/i,
                /^my\s+current\s+tasks?$/i,
                /^my\s+jira\s+tasks?$/i,
                /^my\s+jira\s+issues?$/i,
                /^what\s+am\s+i\s+working\s+on$/i,
                /^my\s+work$/i,
                /^my\s+assignments?$/i,
                /^my\s+current\s+work$/i,
                // Team member task patterns (HIGH priority - team task queries)
                /^(?:what\s+is\s+the\s+)?status\s+of\s+(?:the\s+)?tasks?\s+assigned\s+to\s+my\s+team\s+members?$/i,
                /^(?:what\s+are\s+the\s+)?tasks?\s+assigned\s+to\s+my\s+team\s+members?$/i,
                /^(?:show\s+me\s+)?(?:the\s+)?tasks?\s+(?:of\s+)?my\s+team\s+members?$/i,
                /^my\s+team\s+members?\s+tasks?$/i,
                /^tasks?\s+(?:of\s+)?my\s+team\s+members?$/i,
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
                /^team\s+tasks?$/i  // Make this more specific to avoid conflicts
            ],
            team_schedule: [
                // Team member schedule patterns (HIGH priority - must come before team_structure)
                /^(?:give\s+me\s+)?my\s+team\s+members?\s+schedule$/i,
                /^(?:show\s+me\s+)?(?:the\s+)?schedule\s+(?:of\s+)?my\s+team\s+members?$/i,
                /^my\s+team\s+members?\s+calendar$/i,
                /^(?:what\s+(?:is|are)\s+)?my\s+team\s+members?\s+(?:schedule|meetings?|appointments?)$/i,
                /^(?:team\s+)?schedule\s+(?:for\s+)?my\s+team\s+members?$/i,
                /^upcoming\s+(?:events?|meetings?)\s+(?:for\s+)?my\s+team\s+members?$/i,
                /^(?:show\s+me\s+)?(?:my\s+)?team\s+(?:member\s+)?schedule$/i
            ],
            team_structure: [
                // "My" team patterns (HIGHEST priority - most specific)
                /^my\s+team\s+members?$/i,
                /^who\s+reports?\s+to\s+me\??$/i,
                /^my\s+direct\s+reports?$/i,
                /^who\s+are\s+my\s+team\s+members?$/i,
                /^show\s+me\s+my\s+team$/i,
                /^list\s+my\s+team\s+members?$/i,
                /^my\s+team$/i,
                // User-specific team patterns (must come after "my" patterns)
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
            department_head: [
                /who\s+is\s+the\s+([a-zA-Z\s]+)\s+manager/i,
                /([a-zA-Z\s]+)\s+head/i,
                /department\s+head/i,
                /team\s+lead/i,
                /who\s+leads?\s+the\s+([a-zA-Z\s]+)/i
            ],
            calendar_availability: [
                // "My" calendar patterns (HIGHEST priority - most specific)
                /^my\s+calendar$/i,
                /^give\s+me\s+my\s+calendar$/i,
                /^show\s+me\s+my\s+calendar$/i,
                /^my\s+calendar\s+events?$/i,
                /^my\s+schedule$/i,
                /^my\s+meetings?$/i,
                /^my\s+appointments?$/i,
                /^what\s+(?:is|are)\s+my\s+(?:schedule|meetings?|appointments?|events?)$/i,
                /^upcoming\s+(?:events?|meetings?)\s+for\s+me$/i,
                /^my\s+upcoming\s+(?:events?|meetings?)$/i,
                // User-specific calendar patterns
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

                        // Check if this is a "my" query (contains "my" or "i" and no specific entity captured)
                        const queryLower = message.toLowerCase();
                        const isMyQuery = (queryLower.includes(' my ') || queryLower.startsWith('my ') ||
                            queryLower.includes(' i ') || queryLower.includes('what am i') ||
                            queryLower.includes(' me') || queryLower.includes('to me')) &&
                            (!match[1] || match[1].trim() === '' || match[1].toLowerCase().includes('my') ||
                                match[1].toLowerCase() === 'me');

                        // Handle "my" queries - replace with user context
                        if (isMyQuery && (messageLower.includes('my') || messageLower.includes(' me'))) {
                            if (intentType.includes('task') || intentType.includes('project') ||
                                intentType.includes('employee') || intentType.includes('team') ||
                                intentType.includes('calendar')) {
                                analysis.entities.names.push(USER_CONTEXT.defaultUserName);
                                patternEntityExtracted = true;
                                // Mark as user context query for later handling
                                analysis.isUserContextQuery = true;
                            }
                        }
                        // Extract specific entity from pattern match
                        else if (match[1] && match[1].trim()) {
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
                return await this.handleTaskLookup(analysis);

            case 'project_status':
                return this.handleProjectStatus(analysis);

            case 'team_structure':
                return this.handleTeamStructure(analysis);

            case 'department_head':
                return this.handleDepartmentHead(analysis);

            case 'calendar_availability':
                return this.handleCalendarAvailability(analysis);

            case 'team_schedule':
                return this.handleTeamSchedule(analysis);

            case 'urgent_tasks':
                return this.handleUrgentTasks(analysis);

            case 'overdue_tasks':
                return this.handleOverdueTasks(analysis);

            case 'workload_analysis':
                return this.handleWorkloadAnalysis(analysis);

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
    async handleTaskLookup(analysis) {
        const queryLower = analysis.originalQuery.toLowerCase();

        // Check for team member task queries
        if (queryLower.includes('my team members') ||
            queryLower.includes('tasks assigned to my team') ||
            queryLower.includes('my team tasks') ||
            queryLower.includes('team member tasks')) {
            return await this.handleTeamMemberTasks();
        }

        // Check for general task listing requests (no specific user)
        if (queryLower === 'jira tasks' ||
            queryLower === 'all tasks' ||
            queryLower === 'list tasks' ||
            queryLower === 'show tasks' ||
            queryLower === 'tasks' ||
            queryLower === 'list all tasks' ||
            queryLower === 'show all tasks' ||
            (queryLower.includes('all') && queryLower.includes('task'))) {
            return await this.formatAllTasks();
        }

        // Handle "my" queries with user context
        if (analysis.isUserContextQuery) {
            const userEmployee = {
                employeeId: USER_CONTEXT.defaultUserId,
                name: USER_CONTEXT.defaultUserName,
                email: USER_CONTEXT.defaultUserEmail
            };
            return await this.formatUserTasks(userEmployee);
        }

        if (analysis.entities.names.length === 0) {
            // Suggest task listing if no specific user mentioned
            return `📋 **Task Options:**\n\n` +
                `• "My tasks" - Show your JIRA tasks\n` +
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

        return await this.formatUserTasks(employee);
    }

    /**
     * Handle user projects queries - show project names for a specific user
     */
    handleUserProjects(analysis) {
        // Handle "my" queries with user context
        if (analysis.isUserContextQuery) {
            const userEmployee = {
                employeeId: USER_CONTEXT.defaultUserId,
                name: USER_CONTEXT.defaultUserName,
                email: USER_CONTEXT.defaultUserEmail
            };
            return this.formatUserProjects(userEmployee);
        }

        if (analysis.entities.names.length === 0) {
            return "I'd be happy to show project information! Please specify whose projects you'd like to see, or ask for 'my projects'.";
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
        // Handle "my" queries with user context
        if (analysis.isUserContextQuery) {
            const userEmployee = {
                employeeId: USER_CONTEXT.defaultUserId,
                name: USER_CONTEXT.defaultUserName,
                email: USER_CONTEXT.defaultUserEmail
            };

            // Check if asking about reports/team
            if (analysis.originalQuery.toLowerCase().includes('report') ||
                analysis.originalQuery.toLowerCase().includes('team')) {
                return this.formatDirectReports(USER_CONTEXT.defaultUserName);
            }

            return this.formatTeamInfo(USER_CONTEXT.defaultUserName);
        }

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
     * Handle team member task queries - show tasks for all team members
     */
    handleTeamMemberTasks() {
        // Get the current user's team members
        const userEmployee = {
            employeeId: USER_CONTEXT.defaultUserId,
            name: USER_CONTEXT.defaultUserName,
            email: USER_CONTEXT.defaultUserEmail
        };

        // Find the user in the employee list to get their direct reports
        const manager = this.employees.find(emp =>
            emp.employeeId === USER_CONTEXT.defaultUserId ||
            emp.name.toLowerCase() === USER_CONTEXT.defaultUserName.toLowerCase()
        );

        if (!manager || !manager.directReports || manager.directReports.length === 0) {
            return `👥 **Team Member Tasks**\n\n` +
                `You don't appear to have any direct team members assigned, or team structure data is not available.\n\n` +
                `💡 **Alternative Options:**\n` +
                `• "My tasks" - Show your assigned tasks\n` +
                `• "All tasks" - Show all project tasks\n` +
                `• "Urgent tasks" - Show high priority items`;
        }

        // Get team members
        const teamMembers = this.employees.filter(emp =>
            manager.directReports.includes(emp.employeeId)
        );

        if (teamMembers.length === 0) {
            return `👥 **Team Member Tasks**\n\n` +
                `No team members found in the employee directory.\n\n` +
                `💡 **Tip:** Try "My team members" to see your team structure.`;
        }

        // Get tasks for each team member
        let response = `👥 **Tasks Assigned to Team Members** (${teamMembers.length} team members):\n\n`;

        let totalTasks = 0;
        let statusSummary = {
            'Open': 0,
            'In Progress': 0,
            'Task In Progress': 0,
            'Task Assigned': 0,
            'Done': 0,
            'Resolved': 0
        };

        teamMembers.forEach(member => {
            const memberTasks = this.jiraIssues.filter(task =>
                task.assignee.toLowerCase().includes(member.name.toLowerCase()) ||
                member.name.toLowerCase().includes(task.assignee.toLowerCase()) ||
                task.assignee === member.employeeId
            );

            response += `**${member.name}** (${member.role || 'Team Member'}):\n`;

            if (memberTasks.length === 0) {
                response += `   📝 No assigned tasks\n\n`;
            } else {
                totalTasks += memberTasks.length;

                memberTasks.forEach(task => {
                    const priorityIcon = this.getPriorityIcon(task.priority);
                    const statusIcon = this.getStatusIcon(task.status);

                    response += `   ${statusIcon} **${task.key}**: ${task.summary}\n`;
                    response += `      📊 Status: ${task.status} | ${priorityIcon} Priority: ${task.priority}\n`;

                    // Update status summary
                    if (statusSummary.hasOwnProperty(task.status)) {
                        statusSummary[task.status]++;
                    }
                });
                response += '\n';
            }
        });

        // Add summary
        response += `📊 **Summary:**\n`;
        response += `• Total Tasks: ${totalTasks}\n`;

        Object.entries(statusSummary).forEach(([status, count]) => {
            if (count > 0) {
                response += `• ${status}: ${count} tasks\n`;
            }
        });

        if (totalTasks > 0) {
            const completedTasks = statusSummary['Done'] + statusSummary['Resolved'];
            const inProgressTasks = statusSummary['In Progress'] + statusSummary['Task In Progress'];
            const openTasks = statusSummary['Open'] + statusSummary['Task Assigned'];

            response += `\n💡 **Team Status:**\n`;
            if (openTasks > 0) response += `• ${openTasks} tasks ready to start\n`;
            if (inProgressTasks > 0) response += `• ${inProgressTasks} tasks in progress\n`;
            if (completedTasks > 0) response += `• ${completedTasks} tasks completed\n`;
        }

        return response;
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
        // Handle "my" queries with user context
        if (analysis.isUserContextQuery) {
            const userEmployee = {
                employeeId: USER_CONTEXT.defaultUserId,
                name: USER_CONTEXT.defaultUserName,
                email: USER_CONTEXT.defaultUserEmail
            };
            return this.formatUserCalendar(userEmployee);
        }

        if (analysis.entities.names.length === 0) {
            return "I can help check availability! Please specify whose calendar you'd like to check, or ask for 'my calendar'.";
        }

        const searchName = analysis.entities.names[0];
        const employee = this.findEmployeesByName(searchName)[0];

        if (!employee) {
            return `I couldn't find an employee named "${searchName}".`;
        }

        return this.formatUserCalendar(employee);
    }

    /**
     * Format calendar events for a user
     */
    formatUserCalendar(employee) {
        // Get calendar events for this employee
        const calendarEvents = this.getCalendarEventsForEmployee(employee);
        const taskCount = this.getTaskCount(employee);

        let response = `📅 **Calendar for ${employee.name}**\n\n`;
        response += `👤 **Employee Info:**\n`;
        response += `   💼 Role: ${employee.role || 'Team Lead'}\n`;
        response += `   🏢 Department: ${employee.department || 'Data Engineering Department'}\n`;
        response += `   📍 Location: ${employee.location || 'Remote'}\n`;
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
     * Handle team schedule queries - show calendar for all team members
     */
    handleTeamSchedule(analysis) {
        // Get the current user's team members
        const userEmployee = {
            employeeId: USER_CONTEXT.defaultUserId,
            name: USER_CONTEXT.defaultUserName,
            email: USER_CONTEXT.defaultUserEmail
        };

        // Find the user in the employee list to get their direct reports
        const manager = this.employees.find(emp =>
            emp.employeeId === USER_CONTEXT.defaultUserId ||
            emp.name.toLowerCase() === USER_CONTEXT.defaultUserName.toLowerCase()
        );

        if (!manager || !manager.directReports || manager.directReports.length === 0) {
            return `📅 **Team Member Schedules**\n\n` +
                `You don't appear to have any direct team members assigned, or team structure data is not available.\n\n` +
                `💡 **Alternative Options:**\n` +
                `• "My calendar" - Show your calendar\n` +
                `• "All employees" - Show company directory\n` +
                `• "Team structure" - View organizational structure`;
        }

        // Get team members
        const teamMembers = this.employees.filter(emp =>
            manager.directReports.includes(emp.employeeId)
        );

        if (teamMembers.length === 0) {
            return `📅 **Team Member Schedules**\n\n` +
                `No team members found in the employee directory.\n\n` +
                `💡 **Tip:** Try "My team members" to see your team structure.`;
        }

        // Get schedule for each team member
        let response = `📅 **Team Members Schedule** (${teamMembers.length} team members):\n\n`;
        let totalEvents = 0;

        teamMembers.forEach((member, index) => {
            const calendarEvents = this.getCalendarEventsForEmployee(member);
            const taskCount = this.getTaskCount(member);

            response += `**${index + 1}. ${member.name}** (${member.role || 'Team Member'})\n`;
            response += `   📍 Location: ${member.location || 'Remote'}\n`;
            response += `   ✅ Active Tasks: ${taskCount}\n`;

            if (calendarEvents.length > 0) {
                totalEvents += calendarEvents.length;
                response += `   📅 Upcoming Events: ${calendarEvents.length}\n\n`;

                // Show up to 3 upcoming events per team member
                const upcomingEvents = calendarEvents.slice(0, 3);
                upcomingEvents.forEach((event, eventIndex) => {
                    const startDate = new Date(event.start.dateTime);
                    const dateStr = startDate.toLocaleDateString();
                    const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endTime = new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    response += `      ${eventIndex + 1}. **${event.subject}**\n`;
                    response += `         🗓️ ${dateStr} | ⏰ ${startTime} - ${endTime}\n`;
                    if (event.location?.displayName) {
                        response += `         📍 ${event.location.displayName}\n`;
                    }
                });

                if (calendarEvents.length > 3) {
                    response += `      ... and ${calendarEvents.length - 3} more events\n`;
                }
                response += '\n';
            } else {
                response += `   📅 No upcoming events scheduled\n\n`;
            }
        });

        // Team schedule summary
        response += `📊 **Team Schedule Summary:**\n`;
        response += `• Total Team Members: ${teamMembers.length}\n`;
        response += `• Total Upcoming Events: ${totalEvents}\n`;

        const busyMembers = teamMembers.filter(member =>
            this.getCalendarEventsForEmployee(member).length > 0
        ).length;
        const availableMembers = teamMembers.length - busyMembers;

        response += `• Members with Events: ${busyMembers}\n`;
        response += `• Available Members: ${availableMembers}\n\n`;

        // Recommendations
        response += `💡 **Team Availability Insights:**\n`;

        if (availableMembers > busyMembers) {
            response += `• Most team members appear available for new meetings\n`;
        } else if (busyMembers > availableMembers) {
            response += `• Team has a busy schedule - consider workload balance\n`;
        } else {
            response += `• Team schedule appears well-balanced\n`;
        }

        if (totalEvents === 0) {
            response += `• Great opportunity to schedule team meetings or collaborative work\n`;
        } else if (totalEvents > teamMembers.length * 2) {
            response += `• Heavy meeting schedule - consider consolidating or rescheduling if needed\n`;
        }

        response += `\n💡 **Quick Actions:**\n`;
        response += `• "Workload analysis of my team members" - View task distribution\n`;
        response += `• "My team members" - See team structure\n`;
        response += `• "[Name] calendar" - View individual schedules`;

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
     * Handle overdue tasks queries
     */
    handleOverdueTasks(analysis) {
        const queryLower = analysis.originalQuery.toLowerCase();

        // Check for team member overdue tasks queries
        if (queryLower.includes('my team members') ||
            queryLower.includes('overdue tasks of my team') ||
            queryLower.includes('my team overdue') ||
            queryLower.includes('team members overdue')) {
            return this.handleTeamMemberOverdueTasks();
        }

        // General overdue tasks
        return this.handleGeneralOverdueTasks();
    }

    /**
     * Handle overdue tasks for team members
     */
    handleTeamMemberOverdueTasks() {
        // Get the current user's team members
        const userEmployee = {
            employeeId: USER_CONTEXT.defaultUserId,
            name: USER_CONTEXT.defaultUserName,
            email: USER_CONTEXT.defaultUserEmail
        };

        // Find the user in the employee list to get their direct reports
        const manager = this.employees.find(emp =>
            emp.employeeId === USER_CONTEXT.defaultUserId ||
            emp.name.toLowerCase() === USER_CONTEXT.defaultUserName.toLowerCase()
        );

        if (!manager || !manager.directReports || manager.directReports.length === 0) {
            return `📅 **Team Member Overdue Tasks**\n\n` +
                `You don't appear to have any direct team members assigned, or team structure data is not available.\n\n` +
                `💡 **Alternative Options:**\n` +
                `• "Overdue tasks" - Show all overdue items\n` +
                `• "My tasks" - Show your assigned tasks\n` +
                `• "Urgent tasks" - Show high priority items`;
        }

        // Get team members
        const teamMembers = this.employees.filter(emp =>
            manager.directReports.includes(emp.employeeId)
        );

        if (teamMembers.length === 0) {
            return `📅 **Team Member Overdue Tasks**\n\n` +
                `No team members found in the employee directory.\n\n` +
                `💡 **Tip:** Try "My team members" to see your team structure.`;
        }

        // Get overdue tasks for each team member
        let response = `📅 **Overdue Tasks - Team Members** (${teamMembers.length} team members):\n\n`;
        let totalOverdue = 0;

        teamMembers.forEach(member => {
            const memberTasks = this.jiraIssues.filter(task =>
                (task.assignee.toLowerCase().includes(member.name.toLowerCase()) ||
                    member.name.toLowerCase().includes(task.assignee.toLowerCase()) ||
                    task.assignee === member.employeeId) &&
                this.isTaskOverdue(task)
            );

            response += `**${member.name}** (${member.role || 'Team Member'}):\n`;

            if (memberTasks.length === 0) {
                response += `   ✅ No overdue tasks\n\n`;
            } else {
                totalOverdue += memberTasks.length;

                memberTasks.forEach(task => {
                    const priorityIcon = this.getPriorityIcon(task.priority);
                    const daysOverdue = this.getDaysOverdue(task);

                    response += `   ⚠️ **${task.key}**: ${task.summary}\n`;
                    response += `      📊 Status: ${task.status} | ${priorityIcon} Priority: ${task.priority}\n`;
                    response += `      📅 Overdue by: ${daysOverdue} days\n`;
                });
                response += '\n';
            }
        });

        // Add summary
        if (totalOverdue === 0) {
            response += `🎉 **Excellent!** No overdue tasks found for your team members.\n\n`;
            response += `💡 **Keep it up!** Your team is staying on top of their deadlines.`;
        } else {
            response += `📊 **Summary:**\n`;
            response += `• Total Overdue Tasks: ${totalOverdue}\n`;
            response += `• Team Members Affected: ${teamMembers.filter(member =>
                this.jiraIssues.some(task =>
                    (task.assignee.toLowerCase().includes(member.name.toLowerCase()) ||
                        member.name.toLowerCase().includes(task.assignee.toLowerCase()) ||
                        task.assignee === member.employeeId) &&
                    this.isTaskOverdue(task)
                )
            ).length}\n\n`;

            response += `💡 **Recommendation:**\n`;
            response += `• Focus on highest priority overdue items first\n`;
            response += `• Consider reassigning tasks if workload is unbalanced\n`;
            response += `• Schedule team check-in to address blockers`;
        }

        return response;
    }

    /**
     * Handle general overdue tasks (all tasks, not team-specific)
     */
    handleGeneralOverdueTasks() {
        const overdueTasks = this.jiraIssues.filter(task => this.isTaskOverdue(task));

        if (overdueTasks.length === 0) {
            return `🎉 **Great news!** No overdue tasks found in the system.\n\n` +
                `✅ All tasks are either completed or within their deadlines.\n\n` +
                `💡 **Keep up the good work!**`;
        }

        let response = `📅 **Overdue Tasks** (${overdueTasks.length} total):\n\n`;

        overdueTasks.slice(0, 10).forEach((task, index) => {
            const priorityIcon = this.getPriorityIcon(task.priority);
            const statusIcon = this.getStatusIcon(task.status);
            const daysOverdue = this.getDaysOverdue(task);

            response += `${index + 1}. ${statusIcon} **${task.key}**: ${task.summary}\n`;
            response += `   📊 Status: ${task.status} | ${priorityIcon} Priority: ${task.priority}\n`;
            response += `   👤 Assignee: ${task.assignee}\n`;
            response += `   📅 Overdue by: ${daysOverdue} days\n\n`;
        });

        if (overdueTasks.length > 10) {
            response += `... and ${overdueTasks.length - 10} more overdue tasks.\n\n`;
        }

        response += `💡 **Recommendation:** Address Critical and High priority overdue tasks immediately.`;
        return response;
    }

    /**
     * Check if a task is overdue (simplified - assumes due date exists)
     */
    isTaskOverdue(task) {
        // For demo purposes, let's assume some tasks are overdue based on status and created date
        // In a real system, you'd check against actual due dates
        if (!task.created) return false;

        const createdDate = new Date(task.created);
        const currentDate = new Date();
        const daysSinceCreated = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));

        // Consider a task overdue if it's been open for more than 14 days and not completed
        const isOldTask = daysSinceCreated > 14;
        const isNotCompleted = !['Done', 'Resolved', 'Closed'].includes(task.status);

        return isOldTask && isNotCompleted;
    }

    /**
     * Calculate days overdue for a task
     */
    getDaysOverdue(task) {
        if (!task.created) return 0;

        const createdDate = new Date(task.created);
        const currentDate = new Date();
        const daysSinceCreated = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));

        // For demo purposes, assume 14 days is the expected completion time
        return Math.max(0, daysSinceCreated - 14);
    }

    /**
     * Handle workload analysis queries
     */
    handleWorkloadAnalysis(analysis) {
        const queryLower = analysis.originalQuery.toLowerCase();

        // Check for team member workload analysis queries
        if (queryLower.includes('my team members') ||
            queryLower.includes('my team') ||
            queryLower.includes('team workload') ||
            queryLower.includes('workload of my team')) {
            return this.handleTeamWorkloadAnalysis();
        }

        // General workload analysis
        return this.handleGeneralWorkloadAnalysis();
    }

    /**
     * Handle workload analysis for team members
     */
    handleTeamWorkloadAnalysis() {
        // Check if we're in live data mode
        if (!this.useTestMode) {
            return `📊 **Team Workload Analysis - Live Data Mode**\n\n` +
                `⚠️ **Team structure not available in live data mode.**\n\n` +
                `For live data environments, try:\n` +
                `• "My tasks" - Your personal workload\n` +
                `• Individual queries: "Show me [Name] tasks"\n` +
                `• Project-based analysis: Use JIRA project tools\n\n` +
                `💡 **Note**: Team structure requires configuration in mock data mode.\n` +
                `Set USE_TEST_MODE=true in .env for team hierarchy features.`;
        }

        // Get the current user's team members (mock data mode)
        const userEmployee = {
            employeeId: USER_CONTEXT.defaultUserId,
            name: USER_CONTEXT.defaultUserName,
            email: USER_CONTEXT.defaultUserEmail
        };

        // Find the user in the employee list to get their direct reports
        const manager = this.employees.find(emp =>
            emp.employeeId === USER_CONTEXT.defaultUserId ||
            emp.name.toLowerCase() === USER_CONTEXT.defaultUserName.toLowerCase()
        );

        if (!manager || !manager.directReports || manager.directReports.length === 0) {
            return `📊 **Team Workload Analysis**\n\n` +
                `You don't appear to have any direct team members assigned, or team structure data is not available.\n\n` +
                `💡 **Alternative Options:**\n` +
                `• "Workload analysis" - Show general workload overview\n` +
                `• "My tasks" - Show your assigned tasks\n` +
                `• "All tasks" - Show all project tasks`;
        }

        // Get team members
        const teamMembers = this.employees.filter(emp =>
            manager.directReports.includes(emp.employeeId)
        );

        if (teamMembers.length === 0) {
            return `📊 **Team Workload Analysis**\n\n` +
                `No team members found in the employee directory.\n\n` +
                `💡 **Tip:** Try "My team members" to see your team structure.`;
        }

        // Analyze workload for each team member
        let response = `📊 **Team Workload Analysis** (${teamMembers.length} team members):\n\n`;
        let totalTasks = 0;
        let workloadData = [];

        teamMembers.forEach(member => {
            const memberTasks = this.jiraIssues.filter(task =>
                task.assignee.toLowerCase().includes(member.name.toLowerCase()) ||
                member.name.toLowerCase().includes(task.assignee.toLowerCase()) ||
                task.assignee === member.employeeId
            );

            const tasksByStatus = {
                'Open': memberTasks.filter(t => t.status === 'Open').length,
                'In Progress': memberTasks.filter(t => t.status === 'In Progress' || t.status === 'Task In Progress').length,
                'Assigned': memberTasks.filter(t => t.status === 'Task Assigned').length,
                'Completed': memberTasks.filter(t => ['Done', 'Resolved', 'Closed'].includes(t.status)).length
            };

            const tasksByPriority = {
                'Critical': memberTasks.filter(t => t.priority === 'Critical').length,
                'High': memberTasks.filter(t => t.priority === 'High' || t.priority === 'Highest').length,
                'Medium': memberTasks.filter(t => t.priority === 'Medium' || t.priority === 'Normal').length,
                'Low': memberTasks.filter(t => t.priority === 'Low').length
            };

            const activeTasks = tasksByStatus['Open'] + tasksByStatus['In Progress'] + tasksByStatus['Assigned'];
            const overdueTasks = memberTasks.filter(task => this.isTaskOverdue(task)).length;

            workloadData.push({
                member,
                totalTasks: memberTasks.length,
                activeTasks,
                completedTasks: tasksByStatus['Completed'],
                overdueTasks,
                tasksByStatus,
                tasksByPriority,
                workloadScore: this.calculateWorkloadScore(memberTasks)
            });

            totalTasks += memberTasks.length;
        });

        // Sort by workload score (highest first)
        workloadData.sort((a, b) => b.workloadScore - a.workloadScore);

        // Display individual workload analysis
        workloadData.forEach((data, index) => {
            const { member, totalTasks, activeTasks, completedTasks, overdueTasks, tasksByPriority, workloadScore } = data;
            const workloadLevel = this.getWorkloadLevel(workloadScore);
            const workloadIcon = this.getWorkloadIcon(workloadScore);

            response += `**${member.name}** (${member.role || 'Team Member'}) ${workloadIcon}\n`;
            response += `   📋 Total Tasks: ${totalTasks} | 🔄 Active: ${activeTasks} | ✅ Completed: ${completedTasks}\n`;

            if (overdueTasks > 0) {
                response += `   ⚠️ Overdue: ${overdueTasks} tasks\n`;
            }

            response += `   🎯 Workload Level: ${workloadLevel} (Score: ${workloadScore})\n`;

            // Priority breakdown if has tasks
            if (totalTasks > 0) {
                const priorityBreakdown = [];
                if (tasksByPriority['Critical'] > 0) priorityBreakdown.push(`🔥 ${tasksByPriority['Critical']} Critical`);
                if (tasksByPriority['High'] > 0) priorityBreakdown.push(`⚡ ${tasksByPriority['High']} High`);
                if (tasksByPriority['Medium'] > 0) priorityBreakdown.push(`📋 ${tasksByPriority['Medium']} Medium`);
                if (tasksByPriority['Low'] > 0) priorityBreakdown.push(`📝 ${tasksByPriority['Low']} Low`);

                if (priorityBreakdown.length > 0) {
                    response += `   📊 Priority: ${priorityBreakdown.join(', ')}\n`;
                }
            }

            response += '\n';
        });

        // Team summary and insights
        const averageWorkload = workloadData.reduce((sum, data) => sum + data.workloadScore, 0) / workloadData.length;
        const highWorkloadMembers = workloadData.filter(data => data.workloadScore > 75).length;
        const lowWorkloadMembers = workloadData.filter(data => data.workloadScore < 25).length;
        const totalOverdue = workloadData.reduce((sum, data) => sum + data.overdueTasks, 0);

        response += `📈 **Team Summary:**\n`;
        response += `• Total Tasks: ${totalTasks}\n`;
        response += `• Average Workload Score: ${Math.round(averageWorkload)}\n`;
        response += `• Team Members: ${teamMembers.length}\n`;

        if (highWorkloadMembers > 0) response += `• High Workload: ${highWorkloadMembers} members\n`;
        if (lowWorkloadMembers > 0) response += `• Low Workload: ${lowWorkloadMembers} members\n`;
        if (totalOverdue > 0) response += `• Total Overdue: ${totalOverdue} tasks\n`;

        // Recommendations
        response += `\n💡 **Recommendations:**\n`;

        if (highWorkloadMembers > 0 && lowWorkloadMembers > 0) {
            response += `• Consider redistributing tasks from high-workload to low-workload team members\n`;
        } else if (highWorkloadMembers > 0) {
            response += `• Review high-workload members for potential support or deadline adjustments\n`;
        } else if (lowWorkloadMembers > 0) {
            response += `• Consider assigning additional tasks to team members with lower workloads\n`;
        }

        if (totalOverdue > 0) {
            response += `• Address ${totalOverdue} overdue tasks as priority\n`;
        }

        if (averageWorkload > 80) {
            response += `• Team workload is high - consider additional resources or timeline adjustments\n`;
        } else if (averageWorkload < 40) {
            response += `• Team has capacity for additional work\n`;
        } else {
            response += `• Team workload appears well-balanced\n`;
        }

        return response;
    }

    /**
     * Handle general workload analysis (all employees, not team-specific)
     */
    handleGeneralWorkloadAnalysis() {
        return `📊 **General Workload Analysis**\n\n` +
            `This feature shows overall system workload. For detailed team analysis, try:\n\n` +
            `• "Workload analysis of my team members"\n` +
            `• "My team workload"\n` +
            `• "Team workload distribution"`;
    }

    /**
     * Calculate workload score for a set of tasks (0-100)
     */
    calculateWorkloadScore(tasks) {
        if (tasks.length === 0) return 0;

        let score = 0;

        // Base score from number of active tasks
        const activeTasks = tasks.filter(t => !['Done', 'Resolved', 'Closed'].includes(t.status));
        score += Math.min(activeTasks.length * 10, 50); // Max 50 points for task count

        // Priority weighting
        tasks.forEach(task => {
            if (task.priority === 'Critical') score += 15;
            else if (task.priority === 'High' || task.priority === 'Highest') score += 10;
            else if (task.priority === 'Medium' || task.priority === 'Normal') score += 5;
            else if (task.priority === 'Low') score += 2;
        });

        // Overdue penalty
        const overdueTasks = tasks.filter(task => this.isTaskOverdue(task));
        score += overdueTasks.length * 20; // Heavy penalty for overdue

        return Math.min(score, 100); // Cap at 100
    }

    /**
     * Get workload level description
     */
    getWorkloadLevel(score) {
        if (score >= 80) return 'Very High';
        if (score >= 60) return 'High';
        if (score >= 40) return 'Moderate';
        if (score >= 20) return 'Light';
        return 'Very Light';
    }

    /**
     * Get workload icon based on score
     */
    getWorkloadIcon(score) {
        if (score >= 80) return '🔴'; // Very High
        if (score >= 60) return '🟠'; // High
        if (score >= 40) return '🟡'; // Moderate
        if (score >= 20) return '🟢'; // Light
        return '⚪'; // Very Light
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
    async formatUserTasks(employee) {
        let userTasks;

        if (this.useTestMode) {
            // Use mock data
            userTasks = this.jiraIssues.filter(task =>
                task.assignee === employee.employeeId ||
                task.assignee === employee.name ||
                (task.assignee && task.assignee.toLowerCase().includes(employee.name.toLowerCase())) ||
                (employee.name && employee.name.toLowerCase().includes(task.assignee.toLowerCase()))
            );
        } else {
            // Fetch live JIRA data
            try {
                userTasks = await this.fetchLiveUserTasks(employee.employeeId);
            } catch (error) {
                console.error('Error fetching live tasks:', error);
                return `❌ **Error fetching tasks for ${employee.name}**: ${error.message}`;
            }
        }

        if (userTasks.length === 0) {
            return `📋 **${employee.name}** currently has no assigned JIRA tasks.`;
        }

        let response = `📋 **Tasks for ${employee.name}** (${userTasks.length} total):\n\n`;

        userTasks.slice(0, 5).forEach((task, index) => {
            response += `${index + 1}. **${task.key || task.summary}**: ${task.summary}\n`;
            response += `   📊 Status: ${task.status} | 🔥 Priority: ${task.priority}\n`;
            response += `   📁 Project: ${task.project || 'Unknown'}\n\n`;
        });

        if (userTasks.length > 5) {
            response += `... and ${userTasks.length - 5} more tasks.\n\n`;
        }

        // Add workload assessment
        const highPriorityCount = userTasks.filter(t =>
            t.priority === 'High' || t.priority === 'Critical' || t.priority === 'Highest'
        ).length;
        if (highPriorityCount > 0) {
            response += `⚠️ **${highPriorityCount}** high-priority tasks require attention.`;
        } else {
            response += `✅ Good workload balance - no critical priority tasks.`;
        }

        return response;
    }

    /**
     * Fetch live JIRA tasks for a user
     */
    async fetchLiveUserTasks(assignee) {
        const { JiraService } = require('../jira/service');
        const jiraService = new JiraService();

        try {
            console.log(`[Live Data] Fetching tasks for assignee: ${assignee}`);
            const result = await jiraService.handleFetchByAssignee(assignee, null, 50);

            // Parse the MCP content format
            let parsedData = {};
            if (result.content && result.content[0] && result.content[0].text) {
                parsedData = JSON.parse(result.content[0].text);
            }

            console.log(`[Live Data] JIRA result:`, {
                total: parsedData.total,
                returnedCount: parsedData.returnedCount,
                issuesLength: parsedData.issues?.length || 0
            });

            return parsedData.issues || [];
        } catch (error) {
            console.error('Live JIRA fetch error:', error);
            return [];
        }
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

    /**
     * Get priority icon for task priority
     */
    getPriorityIcon(priority) {
        const priorityLower = priority.toLowerCase();
        if (priorityLower.includes('highest') || priorityLower.includes('critical')) return '🔥';
        if (priorityLower.includes('high')) return '⚡';
        if (priorityLower.includes('medium') || priorityLower.includes('normal')) return '📋';
        if (priorityLower.includes('low')) return '📝';
        return '📋';
    }

    /**
     * Get status icon for task status
     */
    getStatusIcon(status) {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('done') || statusLower.includes('resolved') || statusLower.includes('closed')) return '✅';
        if (statusLower.includes('progress') || statusLower.includes('active')) return '🔄';
        if (statusLower.includes('open') || statusLower.includes('assigned') || statusLower.includes('todo')) return '📝';
        if (statusLower.includes('blocked') || statusLower.includes('waiting')) return '⏸️';
        if (statusLower.includes('review') || statusLower.includes('testing')) return '👀';
        return '📝';
    }
}

module.exports = EnhancedSmartstartAssistant;