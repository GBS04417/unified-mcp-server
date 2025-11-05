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

        console.error('✅ LLM Chat Assistant initialized with services');
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
                return await this.jiraService.fetchTasksByAssignee(params.assignee);
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
                return await this.prioritySystem.handleToolCall('dashboard_data', params);
            }
        });

        this.availableTools.set('search_confluence', {
            description: 'Search Confluence pages and spaces',
            parameters: { query: 'string', spaceKey: 'string?' },
            handler: async (params) => {
                if (!this.confluenceService) return { error: 'Confluence service not available' };
                return await this.confluenceService.searchContent(params.query, params.spaceKey);
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
        const keywords = {
            jira: ['task', 'issue', 'ticket', 'jira', 'assigned', 'bug', 'story'],
            outlook: ['email', 'calendar', 'meeting', 'appointment', 'schedule', 'mail'],
            confluence: ['confluence', 'page', 'document', 'wiki', 'space'],
            team: ['team', 'member', 'workload', 'capacity', 'planning', 'dinesh', 'abrar'],
            priority: ['priority', 'urgent', 'dashboard', 'important', 'deadline']
        };

        const messageLower = message.toLowerCase();
        const detectedServices = [];
        const potentialTools = [];

        // Detect which services might be needed
        for (const [service, serviceKeywords] of Object.entries(keywords)) {
            if (serviceKeywords.some(keyword => messageLower.includes(keyword))) {
                detectedServices.push(service);
            }
        }

        // Map services to specific tools
        if (detectedServices.includes('jira')) {
            if (messageLower.includes('my task') || messageLower.includes('assigned to')) {
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

        if (detectedServices.includes('team')) {
            potentialTools.push('analyze_team_member');
        }

        if (detectedServices.includes('priority')) {
            potentialTools.push('get_priority_dashboard');
        }

        if (detectedServices.includes('confluence')) {
            potentialTools.push('search_confluence');
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

        // Extract user names
        const userNames = ['dinesh', 'abrar', 'sankar', 'arunkumar', 'kamesh', 'architha', 'suresh'];
        for (const name of userNames) {
            if (messageLower.includes(name)) {
                params.memberName = name.charAt(0).toUpperCase() + name.slice(1);
                params.assignee = params.memberName;
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

        // Extract search queries (simple heuristic)
        const searchPhrases = lastUserMessage.match(/"([^"]+)"/);
        if (searchPhrases) {
            params.query = searchPhrases[1];
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
            // Fallback to structured response if LLM fails
            return this.generateStructuredResponse(userMessage, toolResults);
        }
    }

    /**
     * Create system prompt based on available data and context
     */
    createSystemPrompt(toolResults, context) {
        let prompt = `You are an AI assistant integrated with a unified business management system. You have access to:

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
- Always provide context for your recommendations`;

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
                    if (result.success && result.data?.issues) {
                        response += `📋 **JIRA Tasks** (${result.data.issues.length} found):\n`;
                        result.data.issues.slice(0, 5).forEach((issue, i) => {
                            response += `${i + 1}. ${issue.key}: ${issue.fields.summary}\n`;
                        });
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
        const responses = [
            "I can help you with JIRA tasks, Outlook emails/calendar, team planning, Confluence pages, and priority management. What would you like to know?",
            "I have access to your JIRA, Outlook, Confluence, and team planning data. How can I assist you today?",
            "You can ask me about tasks, emails, calendar events, team member workloads, or search for documents. What do you need?"
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
                description: 'Chat with the AI assistant that can access JIRA, Outlook, Confluence, and team planning data',
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