/**
 * Confluence Tools for Unified MCP Server
 * 
 * Provides comprehensive Confluence integration including:
 * - Page content fetching and analysis
 * - Page creation and updates
 * - Search functionality
 */

const { ConfluenceService } = require('./service');

// Define all Confluence tools
const confluenceTools = [
  {
    name: 'confluence_fetch',
    description: 'Fetch and analyze Confluence page content with full document extraction',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Complete Confluence URL (e.g., https://domain/wiki/display/SPACE/Page+Title or https://domain/wiki/pages/viewpage.action?pageId=123456)'
        }
      },
      required: ['url']
    },
    handler: async (args) => {
      const service = new ConfluenceService();
      return await service.handleFetch(args.url);
    }
  },

  {
    name: 'confluence_detailed',
    description: 'Get detailed Confluence page analysis with business insights and full content',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Complete Confluence URL for detailed analysis (supports both /display/ and pageId formats)'
        }
      },
      required: ['url']
    },
    handler: async (args) => {
      const service = new ConfluenceService();
      return await service.handleDetailed(args.url);
    }
  },

  {
    name: 'confluence_create_page',
    description: 'Create a new Confluence page with specified title and content',
    inputSchema: {
      type: 'object',
      properties: {
        spaceKey: {
          type: 'string',
          description: 'Confluence space key where the page will be created'
        },
        title: {
          type: 'string',
          description: 'Title of the new page'
        },
        content: {
          type: 'string',
          description: 'Content of the page in Confluence storage format or plain text'
        },
        parentPageId: {
          type: 'string',
          description: 'Optional parent page ID to create the page as a child'
        }
      },
      required: ['spaceKey', 'title', 'content']
    },
    handler: async (args) => {
      const service = new ConfluenceService();
      return await service.handleCreatePage(args.spaceKey, args.title, args.content, args.parentPageId);
    }
  },

  {
    name: 'confluence_update_page',
    description: 'Update an existing Confluence page with new content',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          description: 'ID of the Confluence page to update (optional if url is provided)'
        },
        url: {
          type: 'string',
          description: 'Complete Confluence URL of the page to update (optional if pageId is provided)'
        },
        title: {
          type: 'string',
          description: 'Optional new title for the page'
        },
        content: {
          type: 'string',
          description: 'New content for the page in Confluence storage format or plain text'
        },
        versionComment: {
          type: 'string',
          description: 'Optional comment describing the changes made'
        }
      },
      required: ['content'],
      oneOf: [
        { required: ['pageId'] },
        { required: ['url'] }
      ]
    },
    handler: async (args) => {
      const service = new ConfluenceService();
      return await service.handleUpdatePage(args.pageId, args.url, args.title, args.content, args.versionComment);
    }
  },

  {
    name: 'confluence_search',
    description: 'Search for Confluence pages using CQL (Confluence Query Language)',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'CQL query string to search for pages'
        },
        spaceKey: {
          type: 'string',
          description: 'Optional space key to limit search to specific space'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return (default: 25)'
        }
      },
      required: ['query']
    },
    handler: async (args) => {
      const service = new ConfluenceService();
      return await service.handleSearch(args.query, args.spaceKey, args.maxResults);
    }
  }
];

// Export service instance for priority system
const confluenceService = new ConfluenceService();

module.exports = { confluenceTools, confluenceService };