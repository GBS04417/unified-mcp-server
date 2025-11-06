/**
 * Adaptive Chat Assistant Service for Unified MCP Server
 * 
 * Dynamically switches between:
 * - Rule-Based Assistant (when USE_TEST_MODE=true) - Uses mock data, pattern matching
 * - Active Assistant (when USE_TEST_MODE=false) - Uses LLM + live services
 * 
 * This provides the best of both worlds:
 * - Fast, reliable mock data responses for testing/development
 * - Full LLM-powered responses with live services for production
 */

const config = require('../config');

class AdaptiveChatAssistant {
    constructor(options = {}) {
        this.options = options;
        this.activeAssistant = null;
        this.ruleBasedAssistant = null;
        this.currentMode = null;

        // Initialize the appropriate assistant based on configuration
        this.initializeAssistant();

        console.log(`🔧 Adaptive Chat Assistant initialized in ${this.currentMode} mode`);
    }

    /**
     * Initialize the appropriate assistant based on USE_TEST_MODE configuration
     */
    initializeAssistant() {
        // Check if we should use test mode (rule-based assistant)
        const useTestMode = config.USE_TEST_MODE === true || config.USE_TEST_MODE === 'true';

        if (useTestMode) {
            this.currentMode = 'test';
            // Load Rule-Based Assistant for test mode
            const RuleBasedAssistant = require('./rule_based_assistant');
            this.ruleBasedAssistant = new RuleBasedAssistant();
            console.log('✅ Using Rule-Based Assistant (Test Mode) - Mock data enabled');
        } else {
            this.currentMode = 'production';
            // Load Active Assistant for production mode
            const ActiveAssistant = require('./index');
            this.activeAssistant = new ActiveAssistant(this.options);
            console.log('✅ Using Active Assistant (Production Mode) - Live services enabled');
        }
    }

    /**
     * Initialize services (only needed for Active Assistant in production mode)
     */
    async initialize(services) {
        if (this.currentMode === 'production' && this.activeAssistant) {
            await this.activeAssistant.initialize(services);
            console.log('✅ Active Assistant initialized with live services');
        } else {
            console.log('ℹ️ Rule-Based Assistant doesn\'t require service initialization');
        }
    }

    /**
     * Main chat method - routes to appropriate assistant
     */
    async chat(userMessage, context = {}) {
        try {
            // Add mode information to context for debugging
            context.assistantMode = this.currentMode;

            if (this.currentMode === 'test' && this.ruleBasedAssistant) {
                // Use Rule-Based Assistant for test mode
                console.log(`[Adaptive] Using Rule-Based Assistant for: "${userMessage}"`);
                const response = await this.ruleBasedAssistant.chat(userMessage);

                // Standardize response format to match Active Assistant
                return {
                    success: response.success !== false,
                    response: response.response,
                    source: 'rule_based_assistant',
                    mode: 'test',
                    intent: response.intent,
                    entities: response.entities,
                    toolsUsed: [],
                    conversationId: this.generateConversationId()
                };

            } else if (this.currentMode === 'production' && this.activeAssistant) {
                // Use Active Assistant for production mode
                console.log(`[Adaptive] Using Active Assistant for: "${userMessage}"`);
                const response = await this.activeAssistant.chat(userMessage, context);

                // Add mode information to response
                response.source = 'active_assistant';
                response.mode = 'production';

                return response;

            } else {
                throw new Error(`Assistant not properly initialized for mode: ${this.currentMode}`);
            }

        } catch (error) {
            console.error('Adaptive Chat Assistant Error:', error);
            return {
                success: false,
                error: error.message,
                response: `I apologize, but I encountered an error while processing your request in ${this.currentMode} mode. Please try again.`,
                source: 'error_handler',
                mode: this.currentMode
            };
        }
    }

    /**
     * Get configuration information
     */
    getConfiguration() {
        return {
            mode: this.currentMode,
            useTestMode: config.USE_TEST_MODE,
            serviceFlags: {
                jira: config.JIRA_USE_TEST_MODE,
                confluence: config.CONFLUENCE_USE_TEST_MODE,
                outlook: config.OUTLOOK_USE_TEST_MODE
            },
            activeAssistant: this.currentMode === 'production' ? 'Active Assistant (LLM + Live Services)' : null,
            ruleBasedAssistant: this.currentMode === 'test' ? 'Rule-Based Assistant (Mock Data + Patterns)' : null
        };
    }

    /**
     * Switch mode dynamically (useful for testing)
     */
    async switchMode(forceTestMode = null) {
        const oldMode = this.currentMode;

        // Override config temporarily if specified
        if (forceTestMode !== null) {
            const originalConfig = config.USE_TEST_MODE;
            config.USE_TEST_MODE = forceTestMode;
            this.initializeAssistant();
            config.USE_TEST_MODE = originalConfig; // Restore original
        } else {
            this.initializeAssistant();
        }

        console.log(`🔄 Switched from ${oldMode} mode to ${this.currentMode} mode`);
        return this.currentMode;
    }

    /**
     * Get available tools for MCP registration
     */
    getTools() {
        // Base tools that work in both modes
        const baseTools = [
            {
                name: 'chat',
                description: 'Chat with the Adaptive Assistant (automatically uses Rule-Based or Active Assistant based on configuration)',
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
                name: 'get_assistant_mode',
                description: 'Get current assistant mode and configuration',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'switch_assistant_mode',
                description: 'Switch between test mode (Rule-Based) and production mode (Active Assistant)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        testMode: {
                            type: 'boolean',
                            description: 'True for test mode (Rule-Based), false for production mode (Active)'
                        }
                    },
                    required: ['testMode']
                }
            }
        ];

        // Add Active Assistant specific tools if in production mode
        if (this.currentMode === 'production' && this.activeAssistant) {
            const activeTools = this.activeAssistant.getTools();
            // Filter out duplicate 'chat' tool and add others
            const additionalTools = activeTools.filter(tool => tool.name !== 'chat');
            return [...baseTools, ...additionalTools];
        }

        return baseTools;
    }

    /**
     * Handle tool calls from MCP
     */
    async handleToolCall(toolName, args) {
        switch (toolName) {
            case 'chat':
                return await this.chat(args.message, args.context || {});

            case 'get_assistant_mode':
                return {
                    success: true,
                    data: this.getConfiguration()
                };

            case 'switch_assistant_mode':
                const newMode = await this.switchMode(args.testMode);
                return {
                    success: true,
                    data: {
                        previousMode: this.currentMode === 'test' ? 'production' : 'test',
                        newMode: newMode,
                        configuration: this.getConfiguration()
                    }
                };

            default:
                // Delegate to Active Assistant if in production mode
                if (this.currentMode === 'production' && this.activeAssistant) {
                    return await this.activeAssistant.handleToolCall(toolName, args);
                } else {
                    throw new Error(`Tool '${toolName}' not available in ${this.currentMode} mode`);
                }
        }
    }

    /**
     * Get conversation history (delegates to appropriate assistant)
     */
    getConversationHistory() {
        if (this.currentMode === 'test' && this.ruleBasedAssistant) {
            return this.ruleBasedAssistant.conversationHistory || [];
        } else if (this.currentMode === 'production' && this.activeAssistant) {
            return this.activeAssistant.conversationHistory || [];
        }
        return [];
    }

    /**
     * Clear conversation history (delegates to appropriate assistant)
     */
    clearConversationHistory() {
        if (this.currentMode === 'test' && this.ruleBasedAssistant) {
            this.ruleBasedAssistant.conversationHistory = [];
        } else if (this.currentMode === 'production' && this.activeAssistant) {
            this.activeAssistant.conversationHistory = [];
        }
    }

    /**
     * Utility methods
     */
    generateConversationId() {
        return `conv_${this.currentMode}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    /**
     * Get current mode for external access
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * Check if assistant supports mock data
     */
    supportsMockData() {
        return this.currentMode === 'test';
    }

    /**
     * Check if assistant supports live services
     */
    supportsLiveServices() {
        return this.currentMode === 'production';
    }
}

module.exports = AdaptiveChatAssistant;