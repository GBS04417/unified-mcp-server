/**
 * LLM Chat Assistant Service for Unified MCP Server
 * 
 * Provides intelligent chat capabilities that can:
 * - Answer questions about JIRA tasks, Confluence pages, Outlook emails
 * - Execute actions through natural language commands
 * - Provide contextual insights from team planning data
 * - Generate reports and summaries across all integrated services
 */

const config = require('../config');
const LLMProvider = require('./llm-provider');

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

        // Conversation history
        this.conversationHistory = [];
        this.maxHistoryLength = options.maxHistoryLength || 20;

        // Tools registry
        this.availableTools = new Map();
        this.initializeTools();
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

        console.error('✅ Smartstart Assistant initialized with services');
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
     * Chat with the assistant
     */
    async chat(userMessage, context = {}) {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date().toISOString()
            });

            // Analyze user intent and determine if tools are needed
            const intent = await this.analyzeIntent(userMessage);

            let toolResults = {};
            if (intent.needsTools && intent.tools.length > 0) {
                // Execute needed tools
                toolResults = await this.executeTools(intent.tools);
            }

            // Generate response using LLM
            const response = await this.generateResponse(userMessage, toolResults, context);

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
     * Analyze user intent to determine what tools might be needed
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
     * Generate LLM response using configured provider
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