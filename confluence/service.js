/**
 * Confluence Service Implementation
 * 
 * Provides comprehensive Confluence API integration using zero external dependencies
 */

const { HttpClient, TextProcessor } = require('../utils');
const config = require('../config');

class ConfluenceService {
  constructor() {
    this.httpClient = new HttpClient();
    this.baseUrl = config.CONFLUENCE_CONFIG.baseUrl;
    this.username = config.CONFLUENCE_CONFIG.username;
    this.password = config.CONFLUENCE_CONFIG.decodedPassword;
  }

  /**
   * Create authorization header
   */
  getAuthHeaders() {
    if (config.USE_TEST_MODE) {
      return { 'Authorization': 'Bearer test-token' };
    }
    
    return {
      'Authorization': this.httpClient.createBasicAuth(this.username, this.password)
    };
  }

  /**
   * Extract page ID from Confluence URL
   */
  extractPageId(url) {
    // Handle different Confluence URL formats
    const pageIdMatch = url.match(/pageId=(\d+)/);
    if (pageIdMatch) {
      return pageIdMatch[1];
    }

    // For /display/ URLs, we need to resolve them to pageId
    // This is a simplified approach - in reality, you might need to call the API to resolve
    const displayMatch = url.match(/\/display\/([^\/]+)\/(.+)$/);
    if (displayMatch) {
      // We'll need to search for the page by title and space
      return null; // Will handle this in fetchPage method
    }

    return null;
  }

  /**
   * Fetch a Confluence page
   */
  async fetchPage(url) {
    if (config.USE_TEST_MODE) {
      return this.getMockPage(url);
    }

    let apiUrl;
    const pageId = this.extractPageId(url);

    if (pageId) {
      // Direct page ID access
      apiUrl = `${this.baseUrl}/rest/api/content/${pageId}?expand=body.storage,version,space`;
    } else {
      // Try to resolve display URL
      const displayMatch = url.match(/\/display\/([^\/]+)\/(.+)$/);
      if (displayMatch) {
        const spaceKey = displayMatch[1];
        const pageTitle = decodeURIComponent(displayMatch[2].replace(/\+/g, ' '));
        
        // Search for the page by title and space
        apiUrl = `${this.baseUrl}/rest/api/content?spaceKey=${spaceKey}&title=${encodeURIComponent(pageTitle)}&expand=body.storage,version,space`;
      } else {
        throw new Error(`Unable to parse Confluence URL: ${url}`);
      }
    }

    try {
      const response = await this.httpClient.get(apiUrl, {
        headers: this.getAuthHeaders()
      });

      console.error(`✅ Confluence API Response Status: ${response.status}`);
      
      // Handle search results vs direct page
      if (response.data.results) {
        if (response.data.results.length === 0) {
          throw new Error('Page not found');
        }
        return response.data.results[0];
      }
      
      return response.data;
    } catch (error) {
      console.error(`❌ Confluence API Error:`, error.message);
      throw new Error(`Failed to fetch Confluence page: ${error.message}`);
    }
  }

  /**
   * Create a new page
   */
  async createPage(spaceKey, title, content, parentPageId = null) {
    if (config.USE_TEST_MODE) {
      return this.getMockCreatedPage(title, spaceKey);
    }

    const apiUrl = `${this.baseUrl}/rest/api/content`;
    
    const body = {
      type: 'page',
      title: title,
      space: { key: spaceKey },
      body: {
        storage: {
          value: this.formatContent(content),
          representation: 'storage'
        }
      }
    };

    if (parentPageId) {
      body.ancestors = [{ id: parentPageId }];
    }

    try {
      const response = await this.httpClient.post(apiUrl, body, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Confluence Create Page Error:`, error.message);
      throw new Error(`Failed to create page: ${error.message}`);
    }
  }

  /**
   * Update an existing page
   */
  async updatePage(pageId, url, title, content, versionComment) {
    if (config.USE_TEST_MODE) {
      return this.getMockUpdatedPage(pageId || 'mock-page-id');
    }

    // Get page ID if URL was provided
    if (!pageId && url) {
      const pageData = await this.fetchPage(url);
      pageId = pageData.id;
    }

    if (!pageId) {
      throw new Error('Page ID is required for updates');
    }

    // First, get current page to get version number
    const currentPage = await this.fetchPage(`pageId=${pageId}`);
    const nextVersion = currentPage.version.number + 1;

    const apiUrl = `${this.baseUrl}/rest/api/content/${pageId}`;
    
    const body = {
      type: 'page',
      title: title || currentPage.title,
      version: { number: nextVersion },
      body: {
        storage: {
          value: this.formatContent(content),
          representation: 'storage'
        }
      }
    };

    if (versionComment) {
      body.version.message = versionComment;
    }

    try {
      const response = await this.httpClient.put(apiUrl, body, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Confluence Update Page Error:`, error.message);
      throw new Error(`Failed to update page: ${error.message}`);
    }
  }

  /**
   * Search pages using CQL
   */
  async searchPages(query, spaceKey, maxResults = 25) {
    if (config.USE_TEST_MODE) {
      return this.getMockSearchResults(query);
    }

    let cql = query;
    if (spaceKey) {
      cql = `space = ${spaceKey} AND (${query})`;
    }

    const apiUrl = `${this.baseUrl}/rest/api/content/search?cql=${encodeURIComponent(cql)}&limit=${maxResults}&expand=body.view,version,space`;

    try {
      const response = await this.httpClient.get(apiUrl, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Confluence Search Error:`, error.message);
      throw new Error(`Confluence search failed: ${error.message}`);
    }
  }

  /**
   * Format content for Confluence storage format
   */
  formatContent(content) {
    // If content is already in Confluence storage format, return as-is
    if (content.includes('<ac:') || content.includes('<p>')) {
      return content;
    }

    // Convert plain text to basic Confluence storage format
    return content
      .split('\n')
      .map(line => line.trim() ? `<p>${this.escapeHtml(line)}</p>` : '')
      .join('');
  }

  /**
   * Escape HTML characters
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Tool handler methods
  async handleFetch(url) {
    const pageData = await this.fetchPage(url);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(pageData, null, 2)
      }]
    };
  }

  async handleDetailed(url) {
    const pageData = await this.fetchPage(url);
    const analysis = this.analyzePage(pageData);
    return {
      content: [{
        type: 'text',
        text: analysis
      }]
    };
  }

  async handleCreatePage(spaceKey, title, content, parentPageId = null) {
    const result = await this.createPage(spaceKey, title, content, parentPageId);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          pageId: result.id,
          title: result.title,
          url: `${this.baseUrl}/pages/viewpage.action?pageId=${result.id}`,
          message: 'Page created successfully'
        }, null, 2)
      }]
    };
  }

  async handleUpdatePage(pageId, url, title, content, versionComment) {
    const result = await this.updatePage(pageId, url, title, content, versionComment);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          pageId: result.id,
          title: result.title,
          version: result.version.number,
          url: `${this.baseUrl}/pages/viewpage.action?pageId=${result.id}`,
          message: 'Page updated successfully'
        }, null, 2)
      }]
    };
  }

  async handleSearch(query, spaceKey, maxResults = 25) {
    const results = await this.searchPages(query, spaceKey, maxResults);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          query,
          spaceKey,
          totalResults: results.size,
          results: results.results?.map(page => ({
            id: page.id,
            title: page.title,
            space: page.space.key,
            url: `${this.baseUrl}/pages/viewpage.action?pageId=${page.id}`,
            lastModified: page.version.when,
            excerpt: TextProcessor.generateSummary(
              TextProcessor.htmlToText(page.body?.view?.value || ''), 
              200
            )
          })) || []
        }, null, 2)
      }]
    };
  }

  // Analysis helper
  analyzePage(pageData) {
    const analysis = [];
    
    analysis.push(`📄 Confluence Page Analysis: ${pageData.title}`);
    analysis.push(`🏢 Space: ${pageData.space?.name || pageData.space?.key || 'Unknown'}`);
    analysis.push(`🔗 Page ID: ${pageData.id}`);
    analysis.push(`📅 Last Modified: ${pageData.version?.when}`);
    analysis.push(`👤 Last Modified By: ${pageData.version?.by?.displayName || 'Unknown'}`);
    analysis.push(`📊 Version: ${pageData.version?.number}`);
    
    if (pageData.body?.storage?.value) {
      const contentAnalysis = TextProcessor.analyzeContent(
        pageData.body.storage.value, 
        pageData.title
      );
      
      analysis.push(`\n📖 Content Analysis:`);
      analysis.push(`Word count: ${contentAnalysis.wordCount}`);
      analysis.push(`Summary: ${contentAnalysis.summary}`);
      
      if (contentAnalysis.keyPoints.length > 0) {
        analysis.push(`Key points:`);
        contentAnalysis.keyPoints.forEach((point, index) => {
          analysis.push(`  ${index + 1}. ${point}`);
        });
      }
      
      if (contentAnalysis.businessContext.length > 0) {
        analysis.push(`Business context: ${contentAnalysis.businessContext.join(', ')}`);
      }
    }
    
    return analysis.join('\n');
  }

  // Mock data for test mode
  getMockPage(url) {
    return {
      id: 'mock-page-id',
      title: 'Mock Confluence Page',
      space: { key: 'TEST', name: 'Test Space' },
      body: {
        storage: {
          value: '<p>This is a mock Confluence page for testing purposes.</p><p>It contains sample content to demonstrate the MCP server functionality.</p>',
          representation: 'storage'
        }
      },
      version: {
        number: 1,
        when: new Date().toISOString(),
        by: { displayName: 'Test User' }
      }
    };
  }

  getMockCreatedPage(title, spaceKey) {
    return {
      id: 'mock-created-page-id',
      title: title,
      space: { key: spaceKey },
      version: { number: 1 }
    };
  }

  getMockUpdatedPage(pageId) {
    return {
      id: pageId,
      title: 'Updated Mock Page',
      version: { number: 2 }
    };
  }

  getMockSearchResults(query) {
    return {
      size: 2,
      results: [
        {
          id: 'mock-result-1',
          title: `Search Result 1 for: ${query}`,
          space: { key: 'TEST', name: 'Test Space' },
          body: {
            view: {
              value: '<p>This is a mock search result matching your query.</p>'
            }
          },
          version: {
            when: new Date().toISOString(),
            by: { displayName: 'Test User' }
          }
        },
        {
          id: 'mock-result-2',
          title: `Search Result 2 for: ${query}`,
          space: { key: 'TEST', name: 'Test Space' },
          body: {
            view: {
              value: '<p>This is another mock search result.</p>'
            }
          },
          version: {
            when: new Date().toISOString(),
            by: { displayName: 'Test User' }
          }
        }
      ]
    };
  }
}

module.exports = { ConfluenceService };