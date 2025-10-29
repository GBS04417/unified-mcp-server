/**
 * Microsoft Graph Service
 * Handles all Microsoft Graph API interactions for Outlook integration
 */

const { HttpClient } = require('../../utils');
const { TokenManager } = require('../auth/token-manager');
const config = require('../../config');

class GraphService {
  constructor() {
    this.httpClient = new HttpClient();
    this.tokenManager = new TokenManager();
    this.baseUrl = 'https://graph.microsoft.com/v1.0';
  }

  /**
   * Get authorization headers with access token
   */
  async getAuthHeaders() {
    const accessToken = await this.tokenManager.ensureValidToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Make an authenticated request to Microsoft Graph API
   */
  async graphRequest(endpoint, options = {}) {
    if (config.USE_TEST_MODE) {
      return this.getMockResponse(endpoint, options.method || 'GET');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getAuthHeaders();

    try {
      const response = await this.httpClient.request(url, {
        ...options,
        headers: { ...headers, ...options.headers }
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Graph API Error (${endpoint}):`, error.message);
      throw new Error(`Microsoft Graph API error: ${error.message}`);
    }
  }

  // Email operations
  async listEmails(folder = 'inbox', maxResults = 10, filter, search, unreadOnly = false) {
    let endpoint = `/me/mailFolders/${folder}/messages`;
    let queryParams = [];

    if (maxResults) queryParams.push(`$top=${maxResults}`);
    if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
    if (search) queryParams.push(`$search="${encodeURIComponent(search)}"`);
    if (unreadOnly) queryParams.push(`$filter=isRead eq false`);

    if (queryParams.length > 0) {
      endpoint += '?' + queryParams.join('&');
    }

    const result = await this.graphRequest(endpoint);
    return result.value || [];
  }

  async getEmail(emailId) {
    const endpoint = `/me/messages/${emailId}`;
    return await this.graphRequest(endpoint);
  }

  async sendEmail(emailData) {
    const message = {
      subject: emailData.subject,
      body: {
        contentType: 'HTML',
        content: emailData.body
      },
      toRecipients: emailData.to.map(email => ({
        emailAddress: { address: email }
      }))
    };

    if (emailData.cc && emailData.cc.length > 0) {
      message.ccRecipients = emailData.cc.map(email => ({
        emailAddress: { address: email }
      }));
    }

    if (emailData.bcc && emailData.bcc.length > 0) {
      message.bccRecipients = emailData.bcc.map(email => ({
        emailAddress: { address: email }
      }));
    }

    if (emailData.importance) {
      message.importance = emailData.importance;
    }

    const endpoint = '/me/sendMail';
    return await this.graphRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  async updateEmail(emailId, updates) {
    const endpoint = `/me/messages/${emailId}`;
    return await this.graphRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async searchEmails(query, folder = 'inbox', maxResults = 25) {
    const endpoint = `/me/mailFolders/${folder}/messages?$search="${encodeURIComponent(query)}"&$top=${maxResults}`;
    const result = await this.graphRequest(endpoint);
    return result.value || [];
  }

  // Calendar operations
  async listEvents(maxResults = 10, startDate, endDate) {
    let endpoint = `/me/events?$top=${maxResults}&$orderby=start/dateTime`;
    
    if (startDate && endDate) {
      const filter = `start/dateTime ge '${startDate}' and end/dateTime le '${endDate}'`;
      endpoint += `&$filter=${encodeURIComponent(filter)}`;
    }

    const result = await this.graphRequest(endpoint);
    return result.value || [];
  }

  async createEvent(eventData) {
    const event = {
      subject: eventData.title,
      body: {
        contentType: 'HTML',
        content: eventData.body || ''
      },
      start: {
        dateTime: eventData.startDateTime,
        timeZone: eventData.timeZone || 'UTC'
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: eventData.timeZone || 'UTC'
      }
    };

    if (eventData.attendees && eventData.attendees.length > 0) {
      event.attendees = eventData.attendees.map(email => ({
        emailAddress: { address: email, name: email }
      }));
    }

    if (eventData.location) {
      event.location = { displayName: eventData.location };
    }

    const endpoint = '/me/events';
    return await this.graphRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(event)
    });
  }

  async updateEvent(eventId, updates) {
    const endpoint = `/me/events/${eventId}`;
    return await this.graphRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteEvent(eventId) {
    const endpoint = `/me/events/${eventId}`;
    return await this.graphRequest(endpoint, { method: 'DELETE' });
  }

  // Folder operations
  async listFolders() {
    const endpoint = '/me/mailFolders';
    const result = await this.graphRequest(endpoint);
    return result.value || [];
  }

  async createFolder(name, parentFolderId) {
    const folder = { displayName: name };
    
    let endpoint = '/me/mailFolders';
    if (parentFolderId) {
      endpoint = `/me/mailFolders/${parentFolderId}/childFolders`;
    }

    return await this.graphRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(folder)
    });
  }

  async moveEmail(emailId, destinationFolderId) {
    const endpoint = `/me/messages/${emailId}/move`;
    return await this.graphRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ destinationId: destinationFolderId })
    });
  }

  // Mail rules operations
  async listRules() {
    const endpoint = '/me/mailFolders/inbox/messageRules';
    const result = await this.graphRequest(endpoint);
    return result.value || [];
  }

  async createRule(ruleData) {
    const endpoint = '/me/mailFolders/inbox/messageRules';
    return await this.graphRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(ruleData)
    });
  }

  // Mock responses for test mode
  getMockResponse(endpoint, method) {
    console.error(`🧪 Mock Graph API call: ${method} ${endpoint}`);
    
    if (endpoint.includes('/messages')) {
      if (method === 'GET') {
        return {
          value: [
            {
              id: 'mock-email-1',
              subject: 'Mock Email 1',
              from: { emailAddress: { address: 'test@example.com' } },
              receivedDateTime: new Date().toISOString(),
              isRead: false,
              bodyPreview: 'This is a mock email for testing...',
              body: { content: 'Mock email content', contentType: 'HTML' }
            },
            {
              id: 'mock-email-2',
              subject: 'Mock Email 2',
              from: { emailAddress: { address: 'another@example.com' } },
              receivedDateTime: new Date().toISOString(),
              isRead: true,
              bodyPreview: 'Another mock email...',
              body: { content: 'Another mock email content', contentType: 'HTML' }
            }
          ]
        };
      }
    }

    if (endpoint.includes('/events')) {
      if (method === 'GET') {
        return {
          value: [
            {
              id: 'mock-event-1',
              subject: 'Mock Meeting',
              start: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
              end: { dateTime: new Date(Date.now() + 3600000).toISOString(), timeZone: 'UTC' },
              attendees: []
            }
          ]
        };
      }
    }

    if (endpoint.includes('/mailFolders')) {
      return {
        value: [
          { id: 'inbox', displayName: 'Inbox' },
          { id: 'sent', displayName: 'Sent Items' },
          { id: 'drafts', displayName: 'Drafts' }
        ]
      };
    }

    // Default mock response
    return {
      success: true,
      message: `Mock response for ${method} ${endpoint}`,
      id: 'mock-id-' + Date.now()
    };
  }
}

module.exports = { GraphService };