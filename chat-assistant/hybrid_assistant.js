/**
 * Final Hybrid Chat Assistant Service for Unified MCP Server
 * 
 * This final version combines:
 * - LLM-powered intelligent conversations (from original index.js)
 * - Rule-based pattern matching and entity extraction (from enhanced-assistant.js)
 * - Direct mock data integration for offline/testing scenarios
 * - Comprehensive edge case handling and fuzzy matching
 * - Support for both live services and mock data
 * 
 * Provides intelligent chat capabilities that can:
 * - Answer questions about JIRA tasks, Confluence pages, Outlook emails
 * - Execute actions through natural language commands
 * - Provide contextual insights from team planning data
 * - Generate reports and summaries across all integrated services
 * - Handle employee lookups with fuzzy matching and typo correction
 * - Process complex queries with entity extraction
 */

const config = require('../config');
const LLMProvider = require('./llm-provider');
const mockData = require('../mock-data');

class LLMChatAssistant {
    constructor(options = {}) {
        // Initialize LLM provider
        this.llmProvider = new LLMProvider({
            provider: options.llmProvider || 'openai',
            model: options.model || 'gpt-4',
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens || 2000,
            apiKey: options.apiKey || process.env.OPENAI_API_KEY,
            baseURL: options.baseURL
        });

        // Services will be injected
        this.jiraService = null;
        this.confluenceService = null;
        this.outlookService = null;
        this.prioritySystem = null;
        this.teamPlanningService = null;

        // Mock data - Only used when live services are unavailable (offline/test mode)
        this.loadMockData();

        // Conversation history
        this.conversationHistory = [];
        this.maxHistoryLength = options.maxHistoryLength || 20;

        // Enhanced intent recognition patterns
        this.initializeIntentPatterns();

        // Tools registry
        this.availableTools = new Map();
        this.initializeTools();
    }

    /**
     * Load mock data for fallback scenarios when services are unavailable
     */
    loadMockData() {
        try {
            // Load all employee data from different sources
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

            console.log(`[Final Assistant] Loaded mock data: ${this.employees.length} employees, ${this.jiraIssues.length} issues, ${this.jiraProjects.length} projects`);
        } catch (error) {
            console.error('[Final Assistant] Error loading mock data:', error);
            // Initialize empty arrays as fallback
            this.employees = [];
            this.jiraProjects = [];
            this.jiraIssues = [];
            this.confluencePages = [];
            this.outlookEmails = [];
        }
    }

    /**
     * Determine whether to use mock data based on configuration flags
     * @param {string} serviceType - Type of service ('jira', 'confluence', 'outlook', 'general')
     * @returns {boolean} - True if should use mock data
     */
    shouldUseMockData(serviceType = 'general') {
        // Check global test mode flag first
        if (config.USE_TEST_MODE === true || config.USE_TEST_MODE === 'true') {
            return true;
        }

        // Check service-specific flags
        switch (serviceType.toLowerCase()) {
            case 'jira':
                return config.JIRA_USE_TEST_MODE === true || config.JIRA_USE_TEST_MODE === 'true';
            case 'confluence':
                return config.CONFLUENCE_USE_TEST_MODE === true || config.CONFLUENCE_USE_TEST_MODE === 'true';
            case 'outlook':
                return config.OUTLOOK_USE_TEST_MODE === true || config.OUTLOOK_USE_TEST_MODE === 'true';
            default:
                // For general queries, use mock data if any service is in test mode or no live services available
                const anyServiceInTestMode =
                    config.JIRA_USE_TEST_MODE === true || config.JIRA_USE_TEST_MODE === 'true' ||
                    config.CONFLUENCE_USE_TEST_MODE === true || config.CONFLUENCE_USE_TEST_MODE === 'true' ||
                    config.OUTLOOK_USE_TEST_MODE === true || config.OUTLOOK_USE_TEST_MODE === 'true';

                const hasLiveServices = this.jiraService || this.outlookService || this.confluenceService || this.prioritySystem || this.teamPlanningService;

                // Use mock data if in test mode OR if no live services are available
                return anyServiceInTestMode || !hasLiveServices;
        }
    }

    /**
     * Initialize comprehensive intent recognition patterns from enhanced assistant
     */
    initializeIntentPatterns() {
        this.intentPatterns = {
            employee_lookup: [
                /who\s+is\s+([a-zA-Z\s]+)\??/i,
                /tell\s+me\s+about\s+([a-zA-Z\s]+)/i,
                /find\s+([a-zA-Z\s]+)/i,
                /([a-zA-Z\s]+)\s+profile/i,
                /employee\s+([a-zA-Z\s]+)/i,
                /staff\s+([a-zA-Z\s]+)/i
            ],
            task_lookup: [
                /show\s+me\s+([a-zA-Z\s]+)\s+tasks?/i,
                /([a-zA-Z\s]+)\s+tasks?/i,
                /tasks?\s+for\s+([a-zA-Z\s]+)/i,
                /what\s+is\s+([a-zA-Z\s]+)\s+working\s+on/i,
                /([a-zA-Z\s]+)\s+assignments?/i,
                /current\s+work\s+for\s+([a-zA-Z\s]+)/i,
                /list\s+all\s+(jira\s+)?tasks?/i,
                /show\s+all\s+tasks?/i,
                /task\s+status/i,
                /jira\s+tasks?/i
            ],
            project_status: [
                /project\s+([a-zA-Z0-9\-_]+)/i,
                /status\s+of\s+([a-zA-Z0-9\-_]+)/i,
                /([a-zA-Z0-9\-_]+)\s+project/i,
                /show\s+me\s+all\s+projects?/i,
                /list\s+projects?/i,
                /project\s+progress/i,
                /timeline\s+for/i
            ],
            team_structure: [
                /who\s+reports?\s+to\s+([a-zA-Z\s]+)/i,
                /([a-zA-Z\s]+)\s+team/i,
                /team\s+structure/i,
                /department\s+structure/i,
                /organizational\s+chart/i,
                /reporting\s+structure/i
            ],
            department_head: [
                /who\s+(leads?|manages?|heads?)\s+([a-zA-Z\s]+)/i,
                /([a-zA-Z\s]+)\s+(manager|head|lead)/i,
                /department\s+head/i
            ],
            calendar_availability: [
                /is\s+([a-zA-Z\s]+)\s+available/i,
                /([a-zA-Z\s]+)\s+schedule/i,
                /meeting\s+with\s+([a-zA-Z\s]+)/i,
                /calendar\s+for\s+([a-zA-Z\s]+)/i,
                /availability/i
            ],
            urgent_tasks: [
                /urgent/i,
                /priority/i,
                /attention/i,
                /immediate/i,
                /critical/i,
                /what\s+needs?\s+attention/i,
                /high\s+priority/i
            ],
            greeting: [
                /^(hi|hello|hey|good\s+morning|good\s+afternoon)/i,
                /how\s+are\s+you/i
            ],
            help: [
                /help/i,
                /what\s+can\s+you\s+do/i,
                /capabilities/i,
                /features/i,
                /commands?/i
            ]
        };
    }

    /**
     * Initialize services
     */
    async initialize(services) {
        this.jiraService = services.jiraService;
        this.confluenceService = services.confluenceService;
        this.outlookService = services.outlookService;
        this.prioritySystem = services.prioritySystem;
        this.teamPlanningService = services.teamPlanningService;

        console.error('✅ Final Hybrid Smartstart Assistant initialized with services');
    }

    /**
     * Initialize available tools for the assistant
     */
    initializeTools() {
        // JIRA Tools
        this.availableTools.set('get_my_tasks', {
            description: 'Get JIRA tasks assigned to a specific user',
            parameters: { assignee: 'string' },
            handler: async (params) => {
                if (!this.jiraService) return { error: 'JIRA service not available' };
                try {
                    const mcpResult = await this.jiraService.handleFetchByAssignee(params.assignee);
                    // Extract data from MCP format for chat assistant
                    if (mcpResult.content && mcpResult.content[0] && mcpResult.content[0].text) {
                        const parsedData = JSON.parse(mcpResult.content[0].text);
                        return {
                            success: true,
                            data: parsedData.issues || [],
                            summary: {
                                assignee: parsedData.assignee,
                                total: parsedData.total,
                                returnedCount: parsedData.returnedCount,
                                statusFilter: parsedData.statusFilter
                            }
                        };
                    }
                    return { success: false, error: 'Invalid response format from JIRA service' };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }
        });

        this.availableTools.set('search_emails', {
            description: 'Search emails in Outlook',
            parameters: { query: 'string', folder: 'string?' },
            handler: async (params) => {
                if (!this.outlookService) return { error: 'Outlook service not available' };
                return await this.outlookService.searchEmails(params.query, params.folder);
            }
        });

        this.availableTools.set('get_calendar_events', {
            description: 'Get upcoming calendar events',
            parameters: { days: 'number?', count: 'number?' },
            handler: async (params) => {
                if (!this.outlookService) return { error: 'Outlook service not available' };
                return await this.outlookService.listEvents(params.count || 10);
            }
        });

        this.availableTools.set('analyze_team_member', {
            description: 'Analyze team member workload and tasks',
            parameters: { memberName: 'string', month: 'string?' },
            handler: async (params) => {
                if (!this.teamPlanningService) return { error: 'Team planning service not available' };
                return await this.teamPlanningService.analyzeMemberTasks({
                    memberName: params.memberName,
                    month: params.month || new Date().toISOString().substring(0, 7),
                    includeDetails: true
                });
            }
        });

        this.availableTools.set('get_priority_dashboard', {
            description: 'Get priority dashboard with urgent items',
            parameters: { focusUser: 'string?' },
            handler: async (params) => {
                if (!this.prioritySystem) return { error: 'Priority system not available' };
                return await this.prioritySystem.handleToolCall('get_urgent_items', params);
            }
        });

        this.availableTools.set('search_confluence', {
            description: 'Search Confluence pages and spaces',
            parameters: { query: 'string', spaceKey: 'string?' },
            handler: async (params) => {
                if (!this.confluenceService) return { error: 'Confluence service not available' };
                return await this.confluenceService.handleSearch(params.query, params.spaceKey);
            }
        });
    }

    /**
     * Enhanced chat method with comprehensive edge case handling
     */
    async chat(userMessage, context = {}) {
        try {
            // Handle empty queries with enhanced guidance
            if (!userMessage || userMessage.trim() === '') {
                return {
                    success: true,
                    response: this.generateEmptyQueryResponse(),
                    intent: 'empty_query',
                    entities: {},
                    conversationId: this.generateConversationId()
                };
            }

            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date().toISOString()
            });

            // Enhanced intent analysis with entity extraction
            const intent = await this.analyzeIntentWithEntities(userMessage);

            let toolResults = {};

            // Check if should use mock data based on configuration flags
            const useMockData = this.shouldUseMockData();

            // Use mock data when configuration flags indicate test mode
            if (useMockData) {
                const mockResponse = await this.tryDirectMockResponse(userMessage, intent);
                if (mockResponse) {
                    // Add assistant response to history
                    this.conversationHistory.push({
                        role: 'assistant',
                        content: mockResponse.response,
                        timestamp: new Date().toISOString(),
                        source: 'mock_data'
                    });

                    this.trimHistory();
                    return mockResponse;
                }
            }

            // Use service-based tools when services are available
            if (intent.needsTools && intent.tools.length > 0) {
                // Execute needed tools
                toolResults = await this.executeTools(intent.tools);
            }

            // Generate response using LLM with enhanced fallback
            const response = await this.generateResponseWithFallback(userMessage, toolResults, context, intent);

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString(),
                toolsUsed: Object.keys(toolResults)
            });

            // Trim history if too long
            this.trimHistory();

            return {
                success: true,
                response,
                toolsUsed: Object.keys(toolResults),
                intent: intent.summary,
                entities: intent.entities,
                conversationId: this.generateConversationId()
            };

        } catch (error) {
            console.error('Chat error:', error);
            return {
                success: false,
                error: error.message,
                response: 'Sorry, I encountered an error while processing your request. Please try again.'
            };
        }
    }

    /**
     * Generate response for empty queries with comprehensive guidance
     */
    generateEmptyQueryResponse() {
        return `🤖 **Welcome to Smartstart Assistant!** I'm here to help you with:

👥 **Employee Information:**
• "Who is John Smith?" - Get employee details and contact info
• "Tell me about Sarah" - Find team members and their roles

📋 **Task Management:**
• "Show me Dinesh's tasks" - View assigned JIRA tasks
• "What is Abrar working on?" - Check current assignments
• "List all urgent tasks" - See priority items

🚀 **Project Status:**
• "PORTAEH project status" - Get project details and timeline
• "Show all projects" - Overview of all active projects

👥 **Team Structure:**
• "Who reports to Mike?" - See team hierarchy
• "Engineering team structure" - Department organization

📧 **Communications:**
• "Search emails about meetings" - Find relevant emails
• "My calendar for today" - Check scheduled events

Just ask me anything about your work environment!`;
    }

    /**
     * Enhanced intent analysis with entity extraction and confidence scoring
     */
    async analyzeIntentWithEntities(message) {
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
            needsTools: false,
            tools: [],
            summary: ''
        };

        // Extract entities first
        analysis.entities = this.extractEntities(message);

        // Analyze intent using patterns
        let maxConfidence = 0;
        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            for (const pattern of patterns) {
                if (pattern.test(message)) {
                    const confidence = this.calculatePatternConfidence(pattern, message);
                    if (confidence > maxConfidence) {
                        maxConfidence = confidence;
                        analysis.primaryIntent = intent;
                        analysis.confidence = confidence;
                    }
                }
            }
        }

        // Map intents to tools and determine if services are needed
        const toolMapping = this.mapIntentToTools(analysis.primaryIntent, analysis.entities);
        analysis.tools = toolMapping.tools;
        analysis.needsTools = toolMapping.needsTools;
        analysis.summary = `Intent: ${analysis.primaryIntent} (${(analysis.confidence * 100).toFixed(1)}%) | Tools: ${analysis.tools.join(', ')}`;

        return analysis;
    }

    /**
     * Extract entities (names, projects, departments, roles) from message
     */
    extractEntities(message) {
        const entities = {
            names: [],
            projects: [],
            departments: [],
            roles: []
        };

        // Extract potential names using specific patterns
        const specificPatterns = [
            { pattern: /who\s+is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi, group: 1 },
            { pattern: /about\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi, group: 1 },
            { pattern: /tell\s+me\s+about\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi, group: 1 },
            { pattern: /find\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi, group: 1 },
            { pattern: /([A-Z][a-z]+)(?:'s|'s)/g, group: 1 }
        ];

        for (const { pattern, group } of specificPatterns) {
            let match;
            while ((match = pattern.exec(message)) !== null) {
                const name = match[group].trim();
                if (name && name.length > 1) {
                    entities.names.push(name);
                }
            }
        }

        // Extract project codes (common patterns: ALL_CAPS, CAPS-WITH-DASHES, etc.)
        const projectPatterns = [
            /\b[A-Z]{2,}(?:-[A-Z0-9]+)*\b/g,
            /\b[A-Z][a-z]*-[A-Z0-9]+\b/g
        ];

        for (const pattern of projectPatterns) {
            const matches = message.match(pattern);
            if (matches) {
                entities.projects.push(...matches);
            }
        }

        // Extract departments
        const departments = ['engineering', 'devops', 'qa', 'design', 'product', 'marketing', 'sales', 'hr', 'finance'];
        for (const dept of departments) {
            if (message.toLowerCase().includes(dept)) {
                entities.departments.push(dept);
            }
        }

        // Extract roles
        const roles = ['manager', 'lead', 'senior', 'junior', 'architect', 'developer', 'engineer', 'designer', 'analyst'];
        for (const role of roles) {
            if (message.toLowerCase().includes(role)) {
                entities.roles.push(role);
            }
        }

        // Remove duplicates
        Object.keys(entities).forEach(key => {
            entities[key] = [...new Set(entities[key])];
        });

        return entities;
    }

    /**
     * Calculate confidence score for pattern matches
     */
    calculatePatternConfidence(pattern, message) {
        const match = pattern.exec(message);
        if (!match) return 0;

        let confidence = 0.7; // Base confidence

        // Increase confidence for exact matches
        if (match[0] === message.trim()) confidence += 0.2;

        // Increase confidence for longer, more specific patterns
        if (match[0].length > 10) confidence += 0.1;

        return Math.min(confidence, 0.9); // Cap at 90%
    }

    /**
     * Map detected intent to appropriate tools
     */
    mapIntentToTools(intent, entities) {
        const mapping = {
            employee_lookup: { tools: ['get_my_tasks'], needsTools: false }, // Use mock data first
            task_lookup: { tools: ['get_my_tasks'], needsTools: true },
            project_status: { tools: [], needsTools: false }, // Use mock data
            team_structure: { tools: [], needsTools: false }, // Use mock data
            urgent_tasks: { tools: ['get_priority_dashboard'], needsTools: true },
            calendar_availability: { tools: ['get_calendar_events'], needsTools: true },
            greeting: { tools: [], needsTools: false },
            help: { tools: [], needsTools: false },
            unknown: { tools: [], needsTools: false }
        };

        return mapping[intent] || { tools: [], needsTools: false };
    }

    /**
     * Try to respond directly using mock data for faster responses
     */
    async tryDirectMockResponse(message, intent) {
        try {
            switch (intent.primaryIntent) {
                case 'employee_lookup':
                    return this.handleEmployeeLookupMock(intent.entities);
                case 'project_status':
                    return this.handleProjectStatusMock(intent.entities);
                case 'task_lookup':
                    return this.handleTaskLookupMock(intent.entities);
                case 'team_structure':
                    return this.handleTeamStructureMock(intent.entities);
                case 'urgent_tasks':
                    return this.handleUrgentTasksMock();
                case 'greeting':
                    return { success: true, response: this.generateGreetingResponse(), intent: 'greeting' };
                case 'help':
                    return { success: true, response: this.generateHelpResponse(), intent: 'help' };
                default:
                    return null; // Fall through to service-based handling
            }
        } catch (error) {
            console.error('Mock response error:', error);
            return null; // Fall through to service-based handling
        }
    }

    /**
     * Handle employee lookup using mock data with fuzzy matching
     */
    handleEmployeeLookupMock(entities) {
        if (entities.names.length === 0) {
            return {
                success: true,
                response: "I'd be happy to help you find employee information! Please specify the person's name you're looking for.",
                intent: 'employee_lookup'
            };
        }

        const searchName = entities.names[0];
        const matchedEmployees = this.findEmployeesByName(searchName);

        if (matchedEmployees.length === 0) {
            const suggestions = this.getSimilarNames(searchName);
            return {
                success: true,
                response: `I couldn't find an employee named "${searchName}". ${suggestions ? `Did you mean: ${suggestions.join(', ')}?` : 'Please check the spelling or try a different name.'}`,
                intent: 'employee_lookup'
            };
        }

        // Check if we have an exact match (score 1.0) - prioritize it
        const exactMatches = matchedEmployees.filter(emp => emp.score === 1.0);
        if (exactMatches.length === 1) {
            const employee = exactMatches[0];
            return {
                success: true,
                response: this.formatEmployeeDetails(employee),
                intent: 'employee_lookup'
            };
        }

        if (matchedEmployees.length === 1) {
            const employee = matchedEmployees[0];
            return {
                success: true,
                response: this.formatEmployeeDetails(employee),
                intent: 'employee_lookup'
            };
        }

        // Multiple matches - but if we have exact matches, only show those
        if (exactMatches.length > 1) {
            return {
                success: true,
                response: `I found multiple employees with the exact name "${searchName}": ${exactMatches.map(e => e.name).join(', ')}. Please specify more details like department or role.`,
                intent: 'employee_lookup'
            };
        }

        // Multiple partial/fuzzy matches
        return {
            success: true,
            response: `I found multiple employees matching "${searchName}": ${matchedEmployees.slice(0, 4).map(e => e.name).join(', ')}. Please be more specific.`,
            intent: 'employee_lookup'
        };
    }

    /**
     * Find employees by name with fuzzy matching
     */
    findEmployeesByName(searchName) {
        const matches = [];
        const searchLower = searchName.toLowerCase();

        for (const employee of this.employees) {
            const nameLower = employee.name.toLowerCase();

            // Exact match - highest priority
            if (nameLower === searchLower) {
                matches.push({ ...employee, score: 1.0 });
                continue;
            }

            // For full names (first + last), be more strict with partial matches
            const searchParts = searchLower.split(' ');
            const nameParts = nameLower.split(' ');

            if (searchParts.length >= 2 && nameParts.length >= 2) {
                // Check if all search parts match name parts (exact word matching)
                const allPartsMatch = searchParts.every(searchPart =>
                    nameParts.some(namePart => namePart === searchPart)
                );

                if (allPartsMatch) {
                    matches.push({ ...employee, score: 0.9 });
                    continue;
                }
            }

            // Single name partial match (first name or last name only)
            if (searchParts.length === 1) {
                if (nameParts.some(part => part === searchLower)) {
                    matches.push({ ...employee, score: 0.8 });
                    continue;
                }
            }

            // Fuzzy match using Levenshtein distance (only for close typos)
            const distance = this.levenshteinDistance(nameLower, searchLower);
            const similarity = 1 - (distance / Math.max(nameLower.length, searchLower.length));

            if (similarity > 0.8) {  // Increased threshold for fuzzy matching
                matches.push({ ...employee, score: similarity });
            }
        }

        // Sort by score and return top matches
        return matches.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    /**
     * Calculate Levenshtein distance for fuzzy matching
     */
    levenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Get similar names for suggestions
     */
    getSimilarNames(searchName) {
        const similar = this.findEmployeesByName(searchName).slice(0, 3);
        return similar.length > 0 ? similar.map(emp => emp.name) : null;
    }

    /**
     * Format employee details for display
     */
    formatEmployeeDetails(employee) {
        return `👤 **${employee.name}**
📧 Email: ${employee.email}
📱 Phone: ${employee.phone || 'N/A'}
🏢 Department: ${employee.department}
💼 Role: ${employee.role}
📍 Location: ${employee.location || 'N/A'}
👤 Manager: ${employee.manager || 'N/A'}`;
    }

    /**
     * Generate greeting response
     */
    generateGreetingResponse() {
        const greetings = [
            "Hello! I'm Smartstart Assistant. I can help you with employee information, project status, task management, and team coordination. What would you like to know?",
            "Hi there! Welcome to Smartstart Assistant. Whether you need employee details, project updates, task information, or team insights, I'm here to help. What can I assist you with?",
            "Welcome! I'm Smartstart Assistant, your intelligent workplace companion. I can help you find information about employees, track projects, manage tasks, and coordinate with your team. How can I help you today?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    /**
     * Generate help response with comprehensive capabilities
     */
    generateHelpResponse() {
        return `🤖 **Smartstart Assistant Capabilities:**

👥 **Employee Information:**
• "Who is John Smith?" - Get employee details
• "Tell me about Sarah" - Employee profiles and contact info
• "Engineering team members" - Department listings

📋 **Task Management:**
• "Show me Dinesh's tasks" - View assigned JIRA tasks
• "List all JIRA tasks" - Complete task overview
• "What urgent tasks need attention?" - Priority items

🚀 **Project Status:**
• "PORTAEH project status" - Detailed project information
• "Show me all projects" - Project portfolio overview
• "Project timeline for CLOUDMIG" - Schedule and milestones

🏢 **Team Structure:**
• "Who reports to Mike Davis?" - Team hierarchy
• "Engineering department structure" - Organizational chart
• "Who leads the DevOps team?" - Department heads

📧 **Communications:**
• "Search emails about meetings" - Email search
• "My calendar today" - Upcoming events
• "Is Sarah available for a meeting?" - Availability check

💡 **Just ask naturally!** I understand casual language and can help with typos and partial names.`;
    }

    /**
     * Analyze user intent to determine what tools might be needed (Legacy method for compatibility)
     */
    async analyzeIntent(message) {
        // Enhanced keywords with more comprehensive patterns
        const keywords = {
            jira: ['task', 'issue', 'ticket', 'jira', 'assigned', 'bug', 'story', 'project', 'work', 'todo', 'backlog', 'sprint', 'progress', 'status'],
            outlook: ['email', 'calendar', 'meeting', 'appointment', 'schedule', 'mail', 'message', 'inbox', 'event'],
            confluence: ['confluence', 'page', 'document', 'wiki', 'space', 'documentation', 'guide', 'manual'],
            team: ['team', 'member', 'workload', 'capacity', 'planning', 'resource', 'allocation', 'analysis'],
            priority: ['priority', 'urgent', 'dashboard', 'important', 'deadline', 'critical', 'high']
        };

        // Specific action patterns that should trigger tools
        const toolPatterns = {
            get_my_tasks: [
                /get.*tasks?.*for/i,
                /show.*tasks?.*for/i,
                /list.*tasks?.*for/i,
                /tasks?.*assigned.*to/i,
                /tasks?.*for.*\w+/i,
                /what.*tasks?.*(has|have)/i,
                /\w+.*tasks?/i,
                /(jira|assigned).*tasks?/i,
                /tasks?.*(progress|status)/i,
                /show.*me.*\w+.*(work|task)/i,
                /\w+.*(work|task).*(status|progress)/i,
                /work.*status.*for/i,
                /status.*of.*\w+/i,
                /\w+.*(current|active).*(assignments?|tasks?)/i,
                /about.*\w+.*(assignments?|work|tasks?)/i,
                /(assignments?|work).*for.*\w+/i,
                /tell.*me.*about.*\w+/i,
                /list.*all.*(jira|tasks?|tickets?|issues?)/i,
                /(tickets?|issues?).*assigned.*to/i,
                /get.*(tickets?|issues?).*for/i,
                /show.*(tickets?|issues?).*for/i,
                /\w+.*(tickets?|issues?)/i
            ],
            search_emails: [
                /search.*email/i,
                /find.*email/i,
                /email.*about/i,
                /messages?.*from/i
            ],
            get_calendar_events: [
                /calendar/i,
                /meetings?.*today|tomorrow|week/i,
                /schedule.*for/i,
                /events?.*upcoming/i
            ],
            analyze_team_member: [
                /analyz.*workload/i,
                /team.*capacity/i,
                /resource.*allocation/i,
                /planning.*for/i
            ],
            get_priority_dashboard: [
                /priority.*dashboard/i,
                /urgent.*items/i,
                /high.*priority/i
            ],
            search_confluence: [
                /search.*confluence/i,
                /find.*documentation/i,
                /confluence.*page/i
            ]
        };

        const messageLower = message.toLowerCase();
        const detectedServices = [];
        const potentialTools = [];

        // First, use pattern matching for direct tool detection
        for (const [toolName, patterns] of Object.entries(toolPatterns)) {
            if (patterns.some(pattern => pattern.test(message))) {
                potentialTools.push(toolName);
                console.log(`[DEBUG] Pattern matched for tool: ${toolName}`);
            }
        }

        // If no tools detected via patterns, fall back to keyword-based detection
        if (potentialTools.length === 0) {
            console.log('[DEBUG] No pattern matches, using keyword detection');

            // Detect which services might be needed
            for (const [service, serviceKeywords] of Object.entries(keywords)) {
                if (serviceKeywords.some(keyword => messageLower.includes(keyword))) {
                    detectedServices.push(service);
                }
            }

            // Map services to specific tools with enhanced logic
            if (detectedServices.includes('jira')) {
                if (messageLower.includes('my task') || messageLower.includes('assigned to') ||
                    messageLower.includes('jira task') || messageLower.includes('get task') ||
                    messageLower.includes('tasks for') || messageLower.includes('show task') ||
                    messageLower.includes('work') || messageLower.includes('progress') ||
                    messageLower.includes('assignment') || messageLower.includes('current') ||
                    messageLower.includes('about') && messageLower.includes('task')) {
                    potentialTools.push('get_my_tasks');
                }
            }

            if (detectedServices.includes('outlook')) {
                if (messageLower.includes('email') || messageLower.includes('mail')) {
                    potentialTools.push('search_emails');
                }
                if (messageLower.includes('calendar') || messageLower.includes('meeting')) {
                    potentialTools.push('get_calendar_events');
                }
            }

            // Only use team analysis if explicitly asking for workload/capacity analysis
            // and NOT asking for direct JIRA tasks
            if (detectedServices.includes('team') && !potentialTools.includes('get_my_tasks')) {
                if (messageLower.includes('workload') || messageLower.includes('capacity') ||
                    messageLower.includes('analyze') || messageLower.includes('planning')) {
                    potentialTools.push('analyze_team_member');
                }
            }

            if (detectedServices.includes('priority')) {
                potentialTools.push('get_priority_dashboard');
            }

            if (detectedServices.includes('confluence')) {
                potentialTools.push('search_confluence');
            }
        } else {
            // If tools were detected via patterns, also detect services for context
            for (const [service, serviceKeywords] of Object.entries(keywords)) {
                if (serviceKeywords.some(keyword => messageLower.includes(keyword))) {
                    detectedServices.push(service);
                }
            }
        }

        return {
            services: detectedServices,
            tools: potentialTools,
            needsTools: potentialTools.length > 0,
            summary: `Detected services: ${detectedServices.join(', ')} | Tools: ${potentialTools.join(', ')}`
        };
    }

    /**
     * Execute multiple tools based on intent analysis
     */
    async executeTools(toolNames) {
        const results = {};

        for (const toolName of toolNames) {
            const tool = this.availableTools.get(toolName);
            if (!tool) continue;

            try {
                // Extract parameters from conversation context if possible
                const params = this.extractParametersFromContext(toolName);
                results[toolName] = await tool.handler(params);
            } catch (error) {
                results[toolName] = { error: error.message };
            }
        }

        return results;
    }

    /**
     * Extract parameters from conversation context
     */
    extractParametersFromContext(toolName) {
        const lastUserMessage = this.conversationHistory
            .filter(msg => msg.role === 'user')
            .slice(-1)[0]?.content || '';

        const messageLower = lastUserMessage.toLowerCase();

        // Simple parameter extraction based on patterns
        const params = {};

        // Extract user names with full names for JIRA
        const userNameMap = {
            'dinesh': { memberName: 'Dinesh', assignee: 'Dinesh Kumar M' },
            'abrar': { memberName: 'Abrar', assignee: 'Abrar ul haq N' },
            'sankar': { memberName: 'Sankar', assignee: 'Mani S' },
            'mani': { memberName: 'Mani', assignee: 'Mani S' },
            'arunkumar': { memberName: 'Arunkumar', assignee: 'Arunkumar' },
            'kamesh': { memberName: 'Kamesh', assignee: 'Kamesh' },
            'architha': { memberName: 'Architha', assignee: 'Architha' },
            'suresh': { memberName: 'Suresh', assignee: 'Suresh' }
        };

        for (const [searchName, names] of Object.entries(userNameMap)) {
            if (messageLower.includes(searchName)) {
                params.memberName = names.memberName;
                params.assignee = names.assignee;
                break;
            }
        }

        // Extract months
        const months = ['january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'];
        for (let i = 0; i < months.length; i++) {
            if (messageLower.includes(months[i])) {
                params.month = `2025-${(i + 1).toString().padStart(2, '0')}`;
                break;
            }
        }

        // Extract search queries for different tools
        if (toolName === 'search_emails') {
            // Extract email search query
            const searchPhrases = lastUserMessage.match(/"([^"]+)"/);
            if (searchPhrases) {
                params.query = searchPhrases[1];
            } else {
                // Try to extract query from common patterns
                const aboutMatch = lastUserMessage.match(/about\s+([^,\s]+(?:\s+[^,\s]+)*)/i);
                const searchMatch = lastUserMessage.match(/search.*emails?\s+.*?([a-zA-Z][^,.\s]+(?:\s+[a-zA-Z][^,.\s]+)*)/i);

                if (aboutMatch) {
                    params.query = aboutMatch[1].trim();
                } else if (searchMatch) {
                    params.query = searchMatch[1].trim();
                } else {
                    // Default search query extraction
                    const words = lastUserMessage.toLowerCase().split(' ');
                    const emailIndex = words.findIndex(w => w.includes('email'));
                    if (emailIndex > -1 && emailIndex < words.length - 1) {
                        params.query = words.slice(emailIndex + 1).join(' ').replace(/[^\w\s]/g, '').trim();
                    }
                }
            }

            // Default folder if not specified
            if (!params.folder) {
                params.folder = 'inbox';
            }
        } else if (toolName === 'search_confluence') {
            // Extract confluence search query
            const searchPhrases = lastUserMessage.match(/"([^"]+)"/);
            if (searchPhrases) {
                params.query = searchPhrases[1];
            } else {
                // Try to extract query from common patterns
                const aboutMatch = lastUserMessage.match(/about\s+([^,\s]+(?:\s+[^,\s]+)*)/i);
                const findMatch = lastUserMessage.match(/find.*documentation.*?([a-zA-Z][^,.\s]+(?:\s+[a-zA-Z][^,.\s]+)*)/i);

                if (aboutMatch) {
                    params.query = aboutMatch[1].trim();
                } else if (findMatch) {
                    params.query = findMatch[1].trim();
                }
            }
        } else {
            // General search query extraction
            const searchPhrases = lastUserMessage.match(/"([^"]+)"/);
            if (searchPhrases) {
                params.query = searchPhrases[1];
            }
        }

        return params;
    }

    /**
     * Handle project status using mock data
     */
    handleProjectStatusMock(entities) {
        if (entities.projects.length === 0 && !entities.names.some(name => name.toLowerCase().includes('all'))) {
            return {
                success: true,
                response: "I'd be happy to help with project information! Please specify a project name or ask for 'all projects'.",
                intent: 'project_status'
            };
        }

        // Handle "all projects" request
        if (entities.names.some(name => name.toLowerCase().includes('all')) || entities.projects.includes('all')) {
            return {
                success: true,
                response: this.formatAllProjects(),
                intent: 'project_status'
            };
        }

        // Handle specific project
        const projectName = entities.projects[0];
        const project = this.jiraProjects.find(p =>
            p.key && p.key.toLowerCase() === projectName.toLowerCase() ||
            p.name && p.name.toLowerCase().includes(projectName.toLowerCase())
        );

        if (project) {
            return {
                success: true,
                response: this.formatProjectDetails(project),
                intent: 'project_status'
            };
        }

        return {
            success: true,
            response: `I couldn't find project "${projectName}". Available projects: ${this.jiraProjects.map(p => p.key).join(', ')}`,
            intent: 'project_status'
        };
    }

    /**
     * Handle task lookup using mock data
     */
    handleTaskLookupMock(entities) {
        if (entities.names.some(name => name.toLowerCase().includes('all')) || entities.names.some(name => name.toLowerCase().includes('jira'))) {
            return {
                success: true,
                response: this.formatAllTasks(),
                intent: 'task_lookup'
            };
        }

        if (entities.names.length > 0) {
            const memberName = entities.names.find(name => !['show', 'me', 'tell', 'what', 'list'].includes(name.toLowerCase()));
            if (memberName) {
                const tasks = this.jiraIssues.filter(issue =>
                    issue.assignee && issue.assignee.toLowerCase().includes(memberName.toLowerCase())
                );

                if (tasks.length > 0) {
                    return {
                        success: true,
                        response: this.formatMemberTasks(memberName, tasks),
                        intent: 'task_lookup'
                    };
                } else {
                    return {
                        success: true,
                        response: `📋 **${memberName}** currently has no assigned JIRA tasks.`,
                        intent: 'task_lookup'
                    };
                }
            }
        }

        return {
            success: true,
            response: this.formatAllTasks(),
            intent: 'task_lookup'
        };
    }

    /**
     * Handle team structure using mock data
     */
    handleTeamStructureMock(entities) {
        if (entities.departments.length > 0) {
            const dept = entities.departments[0];
            const deptMembers = this.employees.filter(emp =>
                emp.department.toLowerCase().includes(dept.toLowerCase())
            );

            if (deptMembers.length > 0) {
                return {
                    success: true,
                    response: this.formatDepartmentStructure(dept, deptMembers),
                    intent: 'team_structure'
                };
            }
        }

        return {
            success: true,
            response: `I couldn't find the "${entities.departments[0] || 'requested'}" department.`,
            intent: 'team_structure'
        };
    }

    /**
     * Handle urgent tasks using mock data
     */
    handleUrgentTasksMock() {
        const urgentTasks = this.jiraIssues.filter(issue =>
            issue.priority === 'High' || issue.priority === 'Highest' ||
            issue.status === 'In Progress'
        ).slice(0, 5);

        if (urgentTasks.length === 0) {
            return {
                success: true,
                response: "✅ **No urgent items found!** All tasks appear to be on track.",
                intent: 'urgent_tasks'
            };
        }

        return {
            success: true,
            response: this.formatUrgentTasks(urgentTasks),
            intent: 'urgent_tasks'
        };
    }

    /**
     * Format all projects for display
     */
    formatAllProjects() {
        if (this.jiraProjects.length === 0) {
            return "📊 No projects found in the system.";
        }

        let response = `🚀 **All Projects Overview** (${this.jiraProjects.length} total):\n\n`;

        this.jiraProjects.forEach((project, index) => {
            response += `${index + 1}. **${project.name} (${project.key})**\n`;
            response += `   📊 Status: ${project.status} | 🔥 Priority: ${project.priority}\n`;
            if (project.lead) response += `   👥 Lead: ${project.lead}\n`;
            response += '\n';
        });

        return response;
    }

    /**
     * Format project details
     */
    formatProjectDetails(project) {
        return `🚀 **${project.name} (${project.key})**

📊 **Status:** ${project.status}
🔥 **Priority:** ${project.priority}
📅 **Timeline:** ${project.startDate || 'N/A'} - ${project.endDate || 'N/A'}
👥 **Team Lead:** ${project.lead || 'N/A'}
📝 **Description:** ${project.description || 'No description available'}

${project.url ? `🔗 **Link:** ${project.url}` : ''}`;
    }

    /**
     * Format all tasks overview
     */
    formatAllTasks() {
        if (this.jiraIssues.length === 0) {
            return "📋 No JIRA tasks found in the system.";
        }

        const statusCounts = {};
        const priorityCounts = {};

        this.jiraIssues.forEach(issue => {
            statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1;
            priorityCounts[issue.priority] = (priorityCounts[issue.priority] || 0) + 1;
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

        response += `\n📋 **Recent Tasks:**\n`;
        this.jiraIssues.slice(0, 5).forEach((issue, index) => {
            response += `${index + 1}. **${issue.key}**: ${issue.summary}\n`;
            response += `   👤 Assignee: ${issue.assignee || 'Unassigned'} | 📊 Status: ${issue.status}\n`;
        });

        return response;
    }

    /**
     * Format member tasks
     */
    formatMemberTasks(memberName, tasks) {
        let response = `📋 **${memberName}'s Tasks** (${tasks.length} active):\n\n`;

        tasks.forEach((task, index) => {
            response += `${index + 1}. **${task.key}**: ${task.summary}\n`;
            response += `   📊 Status: ${task.status} | 🔥 Priority: ${task.priority}\n`;
            if (task.dueDate) response += `   📅 Due: ${task.dueDate}\n`;
            response += '\n';
        });

        return response;
    }

    /**
     * Format department structure
     */
    formatDepartmentStructure(department, members) {
        let response = `🏢 **${department.charAt(0).toUpperCase() + department.slice(1)} Department** (${members.length} members):\n\n`;

        const managers = members.filter(emp => emp.role.toLowerCase().includes('manager') || emp.role.toLowerCase().includes('lead'));
        const staff = members.filter(emp => !emp.role.toLowerCase().includes('manager') && !emp.role.toLowerCase().includes('lead'));

        if (managers.length > 0) {
            response += `👨‍💼 **Leadership:**\n`;
            managers.forEach(manager => {
                response += `• ${manager.name} - ${manager.role}\n`;
            });
            response += '\n';
        }

        if (staff.length > 0) {
            response += `👥 **Team Members:**\n`;
            staff.forEach(member => {
                response += `• ${member.name} - ${member.role}\n`;
            });
        }

        return response;
    }

    /**
     * Format urgent tasks
     */
    formatUrgentTasks(urgentTasks) {
        let response = `⚠️ **Urgent Items Requiring Attention:**\n\n`;

        urgentTasks.forEach((task, index) => {
            response += `${index + 1}. **${task.key}**: ${task.summary}\n`;
            response += `   📊 Status: ${task.status} | 🔥 Priority: ${task.priority}\n`;
            response += `   👤 Assignee: ${task.assignee || 'Unassigned'}\n`;
            if (task.dueDate) response += `   📅 Due: ${task.dueDate}\n`;
            response += '\n';
        });

        return response;
    }

    /**
     * Enhanced response generation with conditional fallback
     */
    async generateResponseWithFallback(userMessage, toolResults, context, intent) {
        try {
            // Try LLM first if available
            const response = await this.generateResponse(userMessage, toolResults, context);
            return response;
        } catch (error) {
            console.error('LLM generation failed:', error);

            // Check if should use mock data based on configuration flags
            const useMockData = this.shouldUseMockData();

            if (useMockData) {
                // Use mock data fallback when configuration indicates test mode or no live services
                console.log('Using mock data fallback based on configuration flags');
                return this.generateEnhancedStructuredResponse(userMessage, toolResults, intent);
            } else {
                // With live services and test mode disabled, provide a minimal response without mock data
                console.log('Live services mode - LLM failed, providing minimal response');
                return this.generateMinimalServiceResponse(userMessage, toolResults);
            }
        }
    }

    /**
     * Generate minimal response when live services are available but LLM failed
     */
    generateMinimalServiceResponse(userMessage, toolResults) {
        if (Object.keys(toolResults).length === 0) {
            return "I apologize, but I'm having trouble processing your request right now. Please try rephrasing your question or try again in a moment.";
        }

        // Process tool results with basic formatting (no mock data fallback)
        return this.generateStructuredResponse(userMessage, toolResults);
    }

    /**
     * Enhanced structured response generation when LLM fails (only used in offline/test mode)
     */
    generateEnhancedStructuredResponse(userMessage, toolResults, intent) {
        if (Object.keys(toolResults).length === 0) {
            // No tool results - handle based on intent
            switch (intent.primaryIntent) {
                case 'greeting':
                    return this.generateGreetingResponse();
                case 'help':
                    return this.generateHelpResponse();
                case 'unknown':
                    return this.generateUnknownIntentResponse(userMessage, intent);
                default:
                    return this.generateFallbackResponse(userMessage);
            }
        }

        // Process tool results with enhanced formatting (offline mode only)
        return this.generateStructuredResponse(userMessage, toolResults);
    }

    /**
     * Generate response for unknown intents with suggestions
     */
    generateUnknownIntentResponse(message, intent) {
        let response = `I'm not sure I understand "${message}". Here are some things you could try:\n\n`;

        response += `👥 **Employee Info:** "Who is John Smith?" or "Tell me about Sarah"\n`;
        response += `📋 **Tasks:** "Show me Dinesh's tasks" or "What urgent tasks need attention?"\n`;
        response += `🚀 **Projects:** "PORTAEH project status" or "Show all projects"\n`;
        response += `🏢 **Team:** "Engineering team structure" or "Who reports to Mike?"\n\n`;

        if (intent.entities.names.length > 0) {
            response += `💡 **Detected names:** ${intent.entities.names.join(', ')}\n`;
        }
        if (intent.entities.projects.length > 0) {
            response += `💡 **Detected projects:** ${intent.entities.projects.join(', ')}\n`;
        }

        return response;
    }

    /**
     * Generate LLM response using configured provider (Original method)
     */
    async generateResponse(userMessage, toolResults, context) {
        try {
            // Create system prompt
            const systemPrompt = this.createSystemPrompt(toolResults, context);

            // Prepare conversation history for LLM
            const messages = this.prepareMessagesForLLM(userMessage, toolResults);

            // Generate response using LLM
            const response = await this.llmProvider.generateCompletion(messages, systemPrompt);

            return response;
        } catch (error) {
            console.error('LLM generation error:', error);
            console.error('[DEBUG] Tool results for fallback:', JSON.stringify(toolResults, null, 2));
            // Fallback to structured response if LLM fails
            return this.generateStructuredResponse(userMessage, toolResults);
        }
    }

    /**
     * Create system prompt based on available data and context
     */
    createSystemPrompt(toolResults, context) {
        let prompt = `You are Smartstart Assistant, an AI assistant integrated with a unified business management system. You have access to:

- JIRA (task and issue tracking)
- Microsoft Outlook (email and calendar)  
- Confluence (documentation and pages)
- Team Planning (Excel-based resource planning)
- Priority System (AI-powered task prioritization)

Guidelines:
- Be helpful, concise, and professional
- Use the provided data to give specific, actionable insights
- Format responses with emojis and clear structure
- If data is missing, explain what you need to help better
- Always provide context for your recommendations
- Introduce yourself as "Smartstart Assistant" when appropriate`;

        if (Object.keys(toolResults).length > 0) {
            prompt += "\n\nYou have executed tools and received the following data:\n";
            for (const [toolName, result] of Object.entries(toolResults)) {
                if (result.success) {
                    prompt += `\n${toolName}: Successfully retrieved data`;
                } else {
                    prompt += `\n${toolName}: Error - ${result.error}`;
                }
            }
        }

        if (context.focusUser) {
            prompt += `\n\nContext: Focus on user "${context.focusUser}"`;
        }

        return prompt;
    }

    /**
     * Prepare messages for LLM consumption
     */
    prepareMessagesForLLM(userMessage, toolResults) {
        const messages = [];

        // Add recent conversation history (last 4 messages for context)
        const recentHistory = this.conversationHistory.slice(-4);
        messages.push(...recentHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        })));

        // Add current user message with tool results if available
        let currentMessage = userMessage;
        if (Object.keys(toolResults).length > 0) {
            currentMessage += "\n\nData retrieved from systems:\n" + JSON.stringify(toolResults, null, 2);
        }

        messages.push({
            role: 'user',
            content: currentMessage
        });

        return messages;
    }

    /**
     * Fallback structured response if LLM is not available
     */
    generateStructuredResponse(userMessage, toolResults) {
        if (Object.keys(toolResults).length === 0) {
            return this.generateFallbackResponse(userMessage);
        }

        let response = "Based on the information I found:\n\n";

        // Process tool results
        for (const [toolName, result] of Object.entries(toolResults)) {
            if (result.error) {
                response += `❌ ${toolName}: ${result.error}\n`;
                continue;
            }

            switch (toolName) {
                case 'get_my_tasks':
                    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                        response += `📋 **JIRA Tasks** (${result.data.length} found for ${result.summary?.assignee || 'user'}):\n`;
                        result.data.slice(0, 5).forEach((issue, i) => {
                            response += `${i + 1}. **${issue.key}**: ${issue.summary}\n`;
                            response += `   Status: ${issue.status} | Priority: ${issue.priority}\n`;
                        });
                        if (result.data.length > 5) {
                            response += `   ... and ${result.data.length - 5} more tasks\n`;
                        }
                    } else if (result.success && Array.isArray(result.data) && result.data.length === 0) {
                        response += `📋 **JIRA Tasks**: No active tasks found for ${result.summary?.assignee || 'user'}\n`;
                    } else {
                        response += `❌ **JIRA Tasks**: Unable to retrieve tasks - ${result.error || 'Unknown error'}\n`;
                    }
                    break;

                case 'get_calendar_events':
                    if (result.success && result.data?.events) {
                        response += `📅 **Upcoming Events** (${result.data.events.length} found):\n`;
                        result.data.events.slice(0, 5).forEach((event, i) => {
                            response += `${i + 1}. ${event.subject} - ${event.start}\n`;
                        });
                    }
                    break;

                case 'analyze_team_member':
                    if (result.success && result.data?.summary) {
                        const summary = result.data.summary;
                        response += `👥 **Team Analysis**:\n`;
                        response += `- Total Tasks: ${summary.totalTasks}\n`;
                        response += `- Total Hours: ${summary.totalHours}h\n`;
                        response += `- Working Days: ${summary.totalWorkingDays}\n`;
                    }
                    break;

                case 'get_priority_dashboard':
                    if (result.success && result.data) {
                        response += `⚡ **Priority Dashboard**:\n`;
                        response += `- High Priority Items: ${result.data.highPriorityCount || 0}\n`;
                        response += `- Urgent Actions Needed: ${result.data.urgentCount || 0}\n`;
                    }
                    break;
            }
            response += "\n";
        }

        return response;
    }

    /**
     * Generate fallback response for general queries
     */
    generateFallbackResponse(userMessage) {
        // Handle empty or whitespace-only messages with detailed guidance
        if (!userMessage || userMessage.trim() === '') {
            return "Hi! I'm Smartstart Assistant. I can provide:\n" +
                "� Your daily plan and schedule\n" +
                "� Task updates and project status\n" +
                "� Team member information\n" +
                "� Email summaries and calendar events\n" +
                "⚡ Urgent items that need attention\n" +
                "� Quick access to documentation\n\n" +
                "Just tell me what you need!";
        }

        // Standard responses for non-empty queries
        const responses = [
            "Hello! I'm Smartstart Assistant. I can help you with JIRA tasks, Outlook emails/calendar, team planning, Confluence pages, and priority management. What would you like to know?",
            "Hi there! I'm Smartstart Assistant and I have access to your JIRA, Outlook, Confluence, and team planning data. How can I assist you today?",
            "Welcome! I'm Smartstart Assistant. You can ask me about tasks, emails, calendar events, team member workloads, or search for documents. What do you need?"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Get available tools for MCP registration
     */
    getTools() {
        return [
            {
                name: 'chat',
                description: 'Chat with Smartstart Assistant that can access JIRA, Outlook, Confluence, and team planning data',
                inputSchema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Your message or question'
                        },
                        context: {
                            type: 'object',
                            description: 'Optional context for the conversation',
                            properties: {
                                focusUser: { type: 'string' },
                                timeframe: { type: 'string' },
                                priority: { type: 'string' }
                            }
                        }
                    },
                    required: ['message']
                }
            },
            {
                name: 'chat_history',
                description: 'Get recent conversation history with the AI assistant',
                inputSchema: {
                    type: 'object',
                    properties: {
                        limit: {
                            type: 'number',
                            description: 'Number of recent messages to retrieve',
                            default: 10
                        }
                    }
                }
            },
            {
                name: 'clear_chat_history',
                description: 'Clear the conversation history with the AI assistant',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            }
        ];
    }

    /**
     * Handle tool calls from MCP
     */
    async handleToolCall(toolName, args) {
        switch (toolName) {
            case 'chat':
                return await this.chat(args.message, args.context || {});

            case 'chat_history':
                return {
                    success: true,
                    data: {
                        history: this.conversationHistory.slice(-(args.limit || 10)),
                        totalMessages: this.conversationHistory.length
                    }
                };

            case 'clear_chat_history':
                this.conversationHistory = [];
                return {
                    success: true,
                    message: 'Chat history cleared'
                };

            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    /**
     * Utility methods
     */
    trimHistory() {
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
    }

    generateConversationId() {
        return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }
}

module.exports = LLMChatAssistant;