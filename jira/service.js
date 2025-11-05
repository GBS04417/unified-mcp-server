/**
 * JIRA Service Implementation
 * 
 * Provides comprehensive JIRA API integration using zero external dependencies
 */

const { HttpClient, TextProcessor } = require('../utils');
const config = require('../config');
const mockData = require('../mock-data');
const fs = require('fs');
const path = require('path');

class JiraService {
  constructor() {
    this.httpClient = new HttpClient();
    this.baseUrl = config.JIRA_CONFIG.baseUrl;
    this.username = config.JIRA_CONFIG.username;
    this.password = config.JIRA_CONFIG.decodedPassword;
    this.recentRequests = new Map();
    this.REQUEST_TIMEOUT = 30000; // 30 seconds
  }

  /**
   * Create authorization header
   */
  getAuthHeaders() {
    if (config.JIRA_USE_TEST_MODE) {
      return { 'Authorization': 'Bearer test-token' };
    }

    return {
      'Authorization': this.httpClient.createBasicAuth(this.username, this.password)
    };
  }

  /**
   * Fetch a JIRA issue
   */
  async fetchIssue(issueKey) {
    if (config.JIRA_USE_TEST_MODE) {
      return this.getMockIssue(issueKey);
    }

    const url = `${this.baseUrl}/rest/api/2/issue/${issueKey}?expand=changelog,worklog,comments`;

    try {
      const response = await this.httpClient.get(url, {
        headers: this.getAuthHeaders()
      });

      console.error(`✅ JIRA API Response Status: ${response.status}`);
      return response.data;
    } catch (error) {
      console.error(`❌ JIRA API Error:`, error.message);
      throw new Error(`Failed to fetch JIRA issue ${issueKey}: ${error.message}`);
    }
  }

  /**
   * Search JIRA issues with JQL
   */
  async searchIssues(jql, maxResults = 50) {
    if (config.JIRA_USE_TEST_MODE) {
      return this.getMockSearchResults(jql, maxResults);
    }

    const url = `${this.baseUrl}/rest/api/2/search`;
    const body = {
      jql: jql,
      maxResults: maxResults,
      fields: ['summary', 'status', 'assignee', 'priority', 'created', 'updated', 'worklog']
    };

    try {
      const response = await this.httpClient.post(url, body, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error(`❌ JIRA Search Error:`, error.message);
      throw new Error(`JIRA search failed: ${error.message}`);
    }
  }

  /**
   * Add comment to JIRA issue
   */
  async addComment(issueKey, comment) {
    if (config.JIRA_USE_TEST_MODE) {
      return { id: 'test-comment-id', body: comment };
    }

    const url = `${this.baseUrl}/rest/api/2/issue/${issueKey}/comment`;
    const body = { body: comment };

    try {
      const response = await this.httpClient.post(url, body, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error(`❌ JIRA Add Comment Error:`, error.message);
      throw new Error(`Failed to add comment to ${issueKey}: ${error.message}`);
    }
  }

  /**
   * Get available transitions for an issue
   */
  async getTransitions(issueKey) {
    if (config.JIRA_USE_TEST_MODE) {
      return this.getMockTransitions();
    }

    const url = `${this.baseUrl}/rest/api/2/issue/${issueKey}/transitions`;

    try {
      const response = await this.httpClient.get(url, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error(`❌ JIRA Transitions Error:`, error.message);
      throw new Error(`Failed to get transitions for ${issueKey}: ${error.message}`);
    }
  }

  /**
   * Transition an issue
   */
  async transitionIssue(issueKey, transitionId, comment, assignee, resolution) {
    if (config.JIRA_USE_TEST_MODE) {
      return { success: true, transitionId };
    }

    const url = `${this.baseUrl}/rest/api/2/issue/${issueKey}/transitions`;
    const body = {
      transition: { id: transitionId }
    };

    // Add optional fields
    if (comment || assignee || resolution) {
      body.fields = {};
      if (assignee) body.fields.assignee = { name: assignee };
      if (resolution) body.fields.resolution = { name: resolution };
    }

    if (comment) {
      body.update = {
        comment: [{ add: { body: comment } }]
      };
    }

    try {
      const response = await this.httpClient.post(url, body, {
        headers: this.getAuthHeaders()
      });

      return { success: true, status: response.status };
    } catch (error) {
      console.error(`❌ JIRA Transition Error:`, error.message);
      throw new Error(`Failed to transition ${issueKey}: ${error.message}`);
    }
  }

  /**
   * Update issue fields
   */
  async updateIssue(issueKey, fields) {
    if (config.JIRA_USE_TEST_MODE) {
      return { success: true, fields };
    }

    const url = `${this.baseUrl}/rest/api/2/issue/${issueKey}`;
    const body = { fields: {} };

    // Map field updates
    if (fields.summary) body.fields.summary = fields.summary;
    if (fields.description) body.fields.description = fields.description;
    if (fields.assignee) body.fields.assignee = { name: fields.assignee };
    if (fields.priority) body.fields.priority = { name: fields.priority };

    try {
      const response = await this.httpClient.put(url, body, {
        headers: this.getAuthHeaders()
      });

      return { success: true, status: response.status };
    } catch (error) {
      console.error(`❌ JIRA Update Error:`, error.message);
      throw new Error(`Failed to update ${issueKey}: ${error.message}`);
    }
  }

  // Tool handler methods
  async handleFetch(issueKey) {
    const issueData = await this.fetchIssue(issueKey);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(issueData, null, 2)
      }]
    };
  }

  async handleAnalyze(issueKey) {
    const issueData = await this.fetchIssue(issueKey);
    const analysis = this.analyzeIssue(issueData);
    return {
      content: [{
        type: 'text',
        text: analysis
      }]
    };
  }

  async handleFetchByLabel(label, maxResults = 50) {
    const jql = `labels = "${label}"`;
    const results = await this.searchIssues(jql, maxResults);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }]
    };
  }

  // Fetch JIRA issues by assignee - Enhanced v1.1.0 feature
  // Uses JQL queries for efficient assignee-based searches with optional status filtering
  // Eliminates need for manual sequential ticket checking
  // By default, excludes accomplished/closed tasks to show only active work
  async handleFetchByAssignee(assignee, status = null, maxResults = 500) {
    try {
      console.error(`[DEBUG] Fetching JIRA issues for assignee: ${assignee}, status: ${status || 'active tasks only'}`);

      if (!this.baseUrl) {
        throw new Error('JIRA baseUrl is not configured. Check your .env file.');
      }

      // Build JQL query
      let jql = `assignee = "${assignee}"`;

      if (status) {
        // If specific status is provided, use it
        jql += ` AND status = "${status}"`;
      }
      // Note: Default behavior now fetches all issues and filters client-side

      jql += ' ORDER BY created DESC';

      console.error(`[DEBUG] JQL Query: ${jql}`);

      // Get the raw search results
      const searchResults = await this.searchIssues(jql, maxResults);

      console.error(`[DEBUG] Found ${searchResults.total || 0} total issues for assignee ${assignee}`);

      // Define statuses to INCLUDE when no specific status filter is provided
      // Only show: Open, Task Assigned, Task In Progress, Task On Hold
      const includedStatuses = [
        'Open', 'Task Assigned', 'Task In Progress', 'Task On Hold'
      ];

      let filteredIssues = (searchResults.issues || []);

      // Apply client-side filtering if no specific status filter is provided
      if (!status) {
        const originalCount = filteredIssues.length;
        filteredIssues = filteredIssues.filter(issue => {
          const issueStatus = issue.fields.status?.name || '';
          console.error(`[DEBUG] Checking status: "${issueStatus}"`);

          // Include if status matches (case-insensitive)
          const isIncluded = includedStatuses.some(included =>
            issueStatus.toLowerCase() === included.toLowerCase()
          );

          console.error(`[DEBUG] Status "${issueStatus}" included: ${isIncluded}`);
          return isIncluded;
        });
        console.error(`[DEBUG] After filtering: ${filteredIssues.length} active issues found (was ${originalCount} total)`);
      }

      // Enhanced issue mapping with more detailed information
      const issues = filteredIssues.map(issue => ({
        key: issue.key,
        summary: issue.fields.summary || 'No summary',
        status: issue.fields.status?.name || 'Unknown',
        priority: issue.fields.priority?.name || 'Unknown',
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        reporter: issue.fields.reporter?.displayName || 'Unknown',
        created: issue.fields.created || null,
        updated: issue.fields.updated || null,
        dueDate: issue.fields.duedate || null,
        issueType: issue.fields.issuetype?.name || 'Unknown',
        project: issue.fields.project?.name || 'Unknown',
        labels: issue.fields.labels || [],
        webUrl: `${this.baseUrl}/browse/${issue.key}`,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              assignee: assignee,
              statusFilter: status || 'active tasks only (Open, Task Assigned, Task In Progress, Task On Hold)',
              total: searchResults.total || 0,
              maxResults: searchResults.maxResults || maxResults,
              startAt: searchResults.startAt || 0,
              returnedCount: issues.length,
              filteredStatuses: status ? null : includedStatuses,
              issues: issues
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`[DEBUG] JIRA fetch by assignee error: ${error.message}`);
      throw new Error(`Failed to fetch JIRA issues by assignee: ${error.message}`);
    }
  }

  async handleAddComment(issueKey, comment, confirm = false) {
    // Require confirmation for safety
    if (!confirm) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            confirmationRequired: true,
            issueKey: issueKey,
            comment: comment,
            message: `Confirmation required to post comment to JIRA issue ${issueKey}`,
            instruction: "To proceed, call this tool again with 'confirm: true'"
          }, null, 2)
        }]
      };
    }

    // Check for duplicate requests
    const requestKey = `${issueKey}:${comment.substring(0, 50)}`;
    const now = Date.now();

    if (this.recentRequests.has(requestKey)) {
      const lastRequest = this.recentRequests.get(requestKey);
      if (now - lastRequest < this.REQUEST_TIMEOUT) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: false,
              message: `Duplicate comment detected and prevented for ${issueKey}`,
              note: "Comment was already posted recently"
            }, null, 2)
          }]
        };
      }
    }

    // Record this request
    this.recentRequests.set(requestKey, now);

    // Clean up old requests
    for (const [key, timestamp] of this.recentRequests.entries()) {
      if (now - timestamp > this.REQUEST_TIMEOUT) {
        this.recentRequests.delete(key);
      }
    }

    const result = await this.addComment(issueKey, comment);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          commentId: result.id,
          message: `Comment successfully added to ${issueKey}`
        }, null, 2)
      }]
    };
  }

  async handleListTransitions(issueKey) {
    const transitions = await this.getTransitions(issueKey);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(transitions, null, 2)
      }]
    };
  }

  async handleUpdateTransition(issueKey, transitionId, comment, assignee, resolution) {
    const result = await this.transitionIssue(issueKey, transitionId, comment, assignee, resolution);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: `Issue ${issueKey} successfully transitioned`,
          transitionId
        }, null, 2)
      }]
    };
  }

  async handleUpdateFields(issueKey, fields) {
    const result = await this.updateIssue(issueKey, fields);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: `Issue ${issueKey} successfully updated`,
          updatedFields: Object.keys(fields).filter(key => key !== 'issueKey')
        }, null, 2)
      }]
    };
  }

  async handleGetEditableFields(issueKey) {
    // This would require fetching the edit metadata from JIRA
    // For now, return common editable fields
    const editableFields = [
      'summary', 'description', 'assignee', 'priority', 'labels', 'components'
    ];

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          issueKey,
          editableFields,
          note: "These are common editable fields. Actual fields may vary based on issue type and permissions."
        }, null, 2)
      }]
    };
  }

  // Additional handler methods for complex operations
  async handleFindTestCases(issueKey) {
    const issueData = await this.fetchIssue(issueKey);
    // Implement test case extraction logic
    return {
      content: [{
        type: 'text',
        text: `Test case analysis for ${issueKey} - Feature not yet implemented`
      }]
    };
  }

  async handleAggregateTestCases(label) {
    const jql = `labels = "${label}" AND summary ~ "PEER_TEST_"`;
    const results = await this.searchIssues(jql, 100);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          label,
          totalIssues: results.total,
          peerTestIssues: results.issues?.length || 0,
          issues: results.issues
        }, null, 2)
      }]
    };
  }

  async handleGenerateTestCaseEffortCsv(label, filePath) {
    // Implement CSV generation
    return {
      content: [{
        type: 'text',
        text: `CSV generation for label ${label} - Feature not yet implemented. Would save to: ${filePath}`
      }]
    };
  }

  async handleTestedToTaskClosed(issueKey, comment) {
    // Get available transitions first
    const transitions = await this.getTransitions(issueKey);
    const closeTransition = transitions.transitions?.find(t =>
      t.name.toLowerCase().includes('close') ||
      t.name.toLowerCase().includes('done')
    );

    if (!closeTransition) {
      throw new Error(`No suitable 'close' transition found for ${issueKey}`);
    }

    return await this.handleUpdateTransition(issueKey, closeTransition.id, comment);
  }

  async handleBatchTestedToTaskClosed(issueKeys, comment) {
    const results = [];

    for (const issueKey of issueKeys) {
      try {
        const result = await this.handleTestedToTaskClosed(issueKey, comment);
        results.push({ issueKey, success: true });
      } catch (error) {
        results.push({ issueKey, success: false, error: error.message });
      }
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          batchOperation: 'tested-to-task-closed',
          totalProcessed: issueKeys.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results
        }, null, 2)
      }]
    };
  }

  async handleCsvReport(label, filePath) {
    const jql = `labels = "${label}"`;
    const results = await this.searchIssues(jql, 1000);

    // Generate CSV content
    const csvHeaders = ['Key', 'Summary', 'Status', 'Assignee', 'Priority', 'Created', 'Updated'];
    const csvRows = [csvHeaders.join(',')];

    if (results.issues) {
      for (const issue of results.issues) {
        const row = [
          issue.key,
          `"${(issue.fields.summary || '').replace(/"/g, '""')}"`,
          issue.fields.status?.name || '',
          issue.fields.assignee?.displayName || 'Unassigned',
          issue.fields.priority?.name || '',
          issue.fields.created || '',
          issue.fields.updated || ''
        ];
        csvRows.push(row.join(','));
      }
    }

    // Write CSV file
    try {
      const csvContent = csvRows.join('\n');
      fs.writeFileSync(filePath, csvContent, 'utf8');

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `CSV report generated successfully`,
            filePath,
            recordCount: results.issues?.length || 0,
            totalIssues: results.total
          }, null, 2)
        }]
      };
    } catch (error) {
      throw new Error(`Failed to write CSV file: ${error.message}`);
    }
  }

  // Analysis helper
  analyzeIssue(issueData) {
    const issue = issueData.fields;
    const analysis = [];

    analysis.push(`🎫 JIRA Issue Analysis: ${issueData.key}`);
    analysis.push(`📝 Summary: ${issue.summary}`);
    analysis.push(`📊 Status: ${issue.status?.name}`);
    analysis.push(`👤 Assignee: ${issue.assignee?.displayName || 'Unassigned'}`);
    analysis.push(`⭐ Priority: ${issue.priority?.name || 'Not set'}`);
    analysis.push(`📅 Created: ${issue.created}`);
    analysis.push(`🔄 Updated: ${issue.updated}`);

    if (issue.description) {
      const analysis_desc = TextProcessor.analyzeContent(issue.description, issue.summary);
      analysis.push(`\n📖 Description Analysis:`);
      analysis.push(`Word count: ${analysis_desc.wordCount}`);
      analysis.push(`Key points: ${analysis_desc.keyPoints.join('; ')}`);
      analysis.push(`Business context: ${analysis_desc.businessContext.join(', ')}`);
    }

    return analysis.join('\n');
  }

  // Mock data for test mode - uses organized mock data
  getMockIssue(issueKey) {
    // Find specific issue by key, or return first available
    const issue = mockData.jira.issues.find(i => i.key === issueKey) || mockData.jira.issues[0];

    if (!issue) {
      throw new Error(`Mock issue ${issueKey} not found`);
    }

    // Convert to JIRA API format
    return {
      key: issue.key,
      id: issue.id,
      fields: {
        summary: issue.summary,
        description: issue.description,
        status: issue.status,
        assignee: issue.assignee,
        reporter: issue.reporter,
        priority: issue.priority,
        project: issue.project,
        created: issue.created,
        updated: issue.updated,
        resolutiondate: issue.resolutionDate,
        duedate: issue.dueDate,
        labels: issue.labels,
        components: issue.components,
        fixVersions: issue.fixVersions,
        issuetype: issue.issueType
      },
      webUrl: issue.webUrl
    };
  }

  getMockSearchResults(jql, maxResults = 50) {
    let filtered = [...mockData.jira.issues];

    // Basic JQL parsing for realistic filtering
    if (jql.includes('assignee =')) {
      const assigneeMatch = jql.match(/assignee\s*=\s*"([^"]+)"/);
      if (assigneeMatch) {
        const assigneeName = assigneeMatch[1];
        filtered = filtered.filter(issue =>
          issue.assignee && issue.assignee.displayName.includes(assigneeName)
        );
      }
    }

    if (jql.includes('project =')) {
      const projectMatch = jql.match(/project\s*=\s*"?([^"\s]+)"?/);
      if (projectMatch) {
        const projectKey = projectMatch[1];
        filtered = filtered.filter(issue => issue.project.key === projectKey);
      }
    }

    if (jql.includes('status IN')) {
      const statusMatch = jql.match(/status\s+IN\s*\(([^)]+)\)/);
      if (statusMatch) {
        const statuses = statusMatch[1].split(',').map(s => s.trim().replace(/["']/g, ''));
        filtered = filtered.filter(issue =>
          statuses.some(status => issue.status.name.includes(status))
        );
      }
    }

    // Apply maxResults limit
    const limitedResults = filtered.slice(0, maxResults);

    // Convert to JIRA API search format
    return {
      expand: "names,schema",
      startAt: 0,
      maxResults: maxResults,
      total: filtered.length,
      issues: limitedResults.map(issue => this.getMockIssue(issue.key))
    };
  }

  getMockTransitions() {
    return {
      transitions: [
        { id: '1', name: 'In Progress' },
        { id: '2', name: 'Done' },
        { id: '3', name: 'Close Issue' }
      ]
    };
  }
}

module.exports = { JiraService };