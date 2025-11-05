/**
 * LLM Provider Integration
 * Supports OpenAI, Anthropic Claude, Azure OpenAI, and Ollama
 */

const https = require('https');
const http = require('http');
const VSCodeCopilotProvider = require('./vscode-copilot-provider');

class LLMProvider {
    constructor(config = {}) {
        this.provider = config.provider || 'openai';
        this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
        this.model = config.model || this.getDefaultModel();
        this.baseURL = config.baseURL || this.getDefaultBaseURL();
        this.temperature = config.temperature || 0.7;
        this.maxTokens = config.maxTokens || 2000;

        // Initialize VS Code Copilot provider if selected
        if (this.provider === 'vscode-copilot') {
            this.vscodeCopilot = new VSCodeCopilotProvider();
        }
    }

    getDefaultModel() {
        switch (this.provider) {
            case 'openai': return 'gpt-4';
            case 'github': return 'gpt-4o';
            case 'vscode-copilot': return 'copilot-chat';
            case 'google': return 'gemini-pro';
            case 'anthropic': return 'claude-3-sonnet-20240229';
            case 'azure': return 'gpt-4';
            case 'ollama': return 'llama2';
            default: return 'gpt-4';
        }
    }

    getDefaultBaseURL() {
        switch (this.provider) {
            case 'openai': return 'https://api.openai.com/v1';
            case 'github': return 'https://models.inference.ai.azure.com';
            case 'google': return 'https://generativelanguage.googleapis.com/v1beta';
            case 'anthropic': return 'https://api.anthropic.com/v1';
            case 'azure': return process.env.AZURE_OPENAI_ENDPOINT || 'https://your-resource.openai.azure.com';
            case 'ollama': return 'http://localhost:11434/v1';
            default: return 'https://api.openai.com/v1';
        }
    }

    /**
     * Generate chat completion
     */
    async generateCompletion(messages, systemPrompt = '') {
        try {
            switch (this.provider) {
                case 'openai':
                case 'github':
                case 'azure':
                    return await this.openAICompletion(messages, systemPrompt);
                case 'google':
                    return await this.googleCompletion(messages, systemPrompt);
                case 'vscode-copilot':
                    return await this.vscodeCopilot.generateCompletion(messages, systemPrompt);
                case 'anthropic':
                    return await this.anthropicCompletion(messages, systemPrompt);
                case 'ollama':
                    return await this.ollamaCompletion(messages, systemPrompt);
                default:
                    throw new Error(`Unsupported provider: ${this.provider}`);
            }
        } catch (error) {
            console.error('LLM completion error:', error);
            throw error;
        }
    }

    /**
     * OpenAI/Azure OpenAI completion
     */
    async openAICompletion(messages, systemPrompt) {
        const requestBody = {
            model: this.model,
            messages: [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                ...messages
            ],
            temperature: this.temperature,
            max_tokens: this.maxTokens
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        if (this.provider === 'azure') {
            headers['api-key'] = this.apiKey;
            delete headers['Authorization'];
        } else if (this.provider === 'github') {
            headers['Authorization'] = `Bearer ${this.apiKey || process.env.GITHUB_TOKEN}`;
        }

        const response = await this.makeHTTPRequest(
            `${this.baseURL}/chat/completions`,
            'POST',
            JSON.stringify(requestBody),
            headers
        );

        return response.choices[0].message.content;
    }

    /**
     * Anthropic Claude completion
     */
    async anthropicCompletion(messages, systemPrompt) {
        const requestBody = {
            model: this.model,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            messages: messages.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }))
        };

        if (systemPrompt) {
            requestBody.system = systemPrompt;
        }

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
        };

        const response = await this.makeHTTPRequest(
            `${this.baseURL}/messages`,
            'POST',
            JSON.stringify(requestBody),
            headers
        );

        return response.content[0].text;
    }

    /**
     * Google Gemini completion
     */
    async googleCompletion(messages, systemPrompt) {
        // Convert messages to Gemini format
        const contents = [];

        if (systemPrompt) {
            contents.push({
                parts: [{ text: systemPrompt }],
                role: 'user'
            });
        }

        for (const message of messages) {
            contents.push({
                parts: [{ text: message.content }],
                role: message.role === 'assistant' ? 'model' : 'user'
            });
        }

        const requestBody = {
            contents: contents,
            generationConfig: {
                temperature: this.temperature,
                maxOutputTokens: this.maxTokens,
                topK: 40,
                topP: 0.95
            }
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        // Use API key as query parameter for Gemini
        const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey || process.env.GOOGLE_API_KEY}`;

        const response = await this.makeHTTPRequest(
            url,
            'POST',
            JSON.stringify(requestBody),
            headers
        );

        return response.candidates[0].content.parts[0].text;
    }

    /**
     * Ollama completion
     */
    async ollamaCompletion(messages, systemPrompt) {
        const requestBody = {
            model: this.model,
            messages: [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                ...messages
            ],
            stream: false
        };

        const response = await this.makeHTTPRequest(
            `${this.baseURL}/chat/completions`,
            'POST',
            JSON.stringify(requestBody),
            { 'Content-Type': 'application/json' }
        );

        return response.choices[0].message.content;
    }

    /**
     * Make HTTP request
     */
    makeHTTPRequest(url, method, body, headers) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHTTPS = urlObj.protocol === 'https:';
            const client = isHTTPS ? https : http;

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHTTPS ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: method,
                headers: {
                    ...headers,
                    'Content-Length': Buffer.byteLength(body || '')
                }
            };

            const req = client.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(jsonData);
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}: ${jsonData.error?.message || data}`));
                        }
                    } catch (parseError) {
                        reject(new Error(`Failed to parse response: ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (body) {
                req.write(body);
            }
            req.end();
        });
    }
}

module.exports = LLMProvider;