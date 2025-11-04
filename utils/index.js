/**
 * HTTP Client Utility for JIRA/Confluence API calls
 * Zero external dependencies - uses only Node.js built-in modules
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const config = require('../config');

class HttpClient {
  constructor(baseConfig = {}) {
    this.timeout = baseConfig.timeout || config.HTTP_CONFIG.timeout;
    this.retries = baseConfig.retries || config.HTTP_CONFIG.retries;
    this.rejectUnauthorized = config.HTTP_CONFIG.rejectUnauthorized;
  }

  /**
   * Make an HTTP request
   * @param {string} url - The URL to request
   * @param {object} options - Request options
   * @returns {Promise<object>} - Response data
   */
  async request(url, options = {}) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const requestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Unified-MCP-Server/1.0.0',
          ...options.headers
        },
        timeout: this.timeout,
        rejectUnauthorized: this.rejectUnauthorized
      };

      // Add body length for POST/PUT requests
      if (options.body) {
        const bodyString = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
        requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyString);
      }

      const req = client.request(requestOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = {
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers,
              data: data
            };

            // Try to parse JSON response
            if (data && res.headers['content-type']?.includes('application/json')) {
              try {
                response.data = JSON.parse(data);
              } catch (parseError) {
                // Keep as string if JSON parsing fails
              }
            }

            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}\nResponse: ${data}`));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${this.timeout}ms`));
      });

      // Write body for POST/PUT requests
      if (options.body) {
        const bodyString = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
        req.write(bodyString);
      }

      req.end();
    });
  }

  /**
   * GET request
   */
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(url, body, options = {}) {
    return this.request(url, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put(url, body, options = {}) {
    return this.request(url, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  /**
   * Create Basic Auth header
   */
  createBasicAuth(username, password) {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${credentials}`;
  }
}

/**
 * Text Processing Utility for content analysis
 */
class TextProcessor {
  /**
   * Extract plain text from HTML content
   */
  static htmlToText(html) {
    if (!html || typeof html !== 'string') return '';

    return html
      // Remove script and style elements
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Analyze business content and extract key information
   */
  static analyzeContent(content, title = '') {
    const text = this.htmlToText(content);
    const analysis = {
      title,
      wordCount: text.split(/\s+/).length,
      summary: this.generateSummary(text),
      keyPoints: this.extractKeyPoints(text),
      businessContext: this.identifyBusinessContext(text)
    };

    return analysis;
  }

  /**
   * Generate a summary of the content
   */
  static generateSummary(text, maxLength = 500) {
    if (!text || text.length <= maxLength) return text;

    // Try to cut at sentence boundary
    const truncated = text.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');

    if (lastPeriod > maxLength * 0.8) {
      return truncated.substring(0, lastPeriod + 1);
    }

    return truncated + '...';
  }

  /**
   * Extract key points from text
   */
  static extractKeyPoints(text) {
    const points = [];

    // Look for bullet points, numbered lists, or important sentences
    const lines = text.split(/[.!?]\s+/);

    for (const line of lines) {
      if (line.length > 20 && line.length < 200) {
        // Check if it contains important keywords
        if (this.containsImportantKeywords(line)) {
          points.push(line.trim());
        }
      }
    }

    return points.slice(0, 5); // Return top 5 points
  }

  /**
   * Identify business context from content
   */
  static identifyBusinessContext(text) {
    const contexts = [];
    const lowerText = text.toLowerCase();

    // Banking/Financial keywords
    if (/\b(payment|banking|financial|transaction|credit|debit|loan|account)\b/.test(lowerText)) {
      contexts.push('Financial Services');
    }

    // Technical/Development keywords
    if (/\b(api|development|code|software|system|technical|implementation)\b/.test(lowerText)) {
      contexts.push('Technical/Development');
    }

    // Process/Workflow keywords
    if (/\b(process|workflow|procedure|step|requirement|specification)\b/.test(lowerText)) {
      contexts.push('Business Process');
    }

    // Project Management keywords
    if (/\b(project|milestone|deliverable|timeline|resource|planning)\b/.test(lowerText)) {
      contexts.push('Project Management');
    }

    return contexts;
  }

  /**
   * Check if text contains important keywords
   */
  static containsImportantKeywords(text) {
    const importantWords = [
      'requirement', 'important', 'critical', 'must', 'should', 'will',
      'process', 'procedure', 'step', 'action', 'decision', 'result',
      'issue', 'problem', 'solution', 'implementation', 'development'
    ];

    const lowerText = text.toLowerCase();
    return importantWords.some(word => lowerText.includes(word));
  }
}

// Import priority tools
const priorityTools = require('./priority-tools');

module.exports = {
  HttpClient,
  TextProcessor,
  priorityTools
};