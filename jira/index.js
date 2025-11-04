/**
 * JIRA Tools for Unified MCP Server
 * 
 * Provides comprehensive JIRA integration including:
 * - Issue management and analysis
 * - Workflow transitions
 * - Testing and QA tools
 * - Reporting and analytics
 */

const { JiraService } = require('./service');

// Define all JIRA tools
const jiraTools = [
  {
    name: 'jira_fetch',
    description: 'Fetch JIRA ticket information with complete details including worklog',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key (e.g., PROJ-123)'
        }
      },
      required: ['issueKey']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleFetch(args.issueKey);
    }
  },

  {
    name: 'jira_analyze',
    description: 'Analyze JIRA ticket with linked content and provide business insights',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key to analyze'
        }
      },
      required: ['issueKey']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleAnalyze(args.issueKey);
    }
  },

  {
    name: 'jira_fetch_by_label',
    description: 'Fetch all JIRA issues with a specified label',
    inputSchema: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
          description: 'JIRA label to search for'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return (default: 50)'
        }
      },
      required: ['label']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleFetchByLabel(args.label, args.maxResults);
    }
  },

  {
    name: 'jira_fetch_by_assignee',
    description: 'Enhanced v1.1.0: Fetch JIRA issues assigned to a user with smart filtering. By default shows only active work (Open, Task Assigned, Task In Progress, Task On Hold). Enhanced with detailed issue info including web URLs, due dates, and project details.',
    inputSchema: {
      type: 'object',
      properties: {
        assignee: {
          type: 'string',
          description: 'Username of the assignee (exact match)'
        },
        status: {
          type: 'string',
          description: 'Filter by specific issue status (optional). If not provided, shows only active tasks: Open, Task Assigned, Task In Progress, Task On Hold'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to fetch from JIRA (default: 500). Client-side filtering may reduce final count.'
        }
      },
      required: ['assignee']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleFetchByAssignee(args.assignee, args.status, args.maxResults);
    }
  },

  {
    name: 'jira_add_comment',
    description: 'Add a comment to a JIRA issue (requires confirmation before posting)',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key (e.g., PROJ-123)'
        },
        comment: {
          type: 'string',
          description: 'Comment text to post'
        },
        confirm: {
          type: 'boolean',
          description: 'Set to true to confirm posting the comment',
          default: false
        }
      },
      required: ['issueKey', 'comment']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleAddComment(args.issueKey, args.comment, args.confirm);
    }
  },

  {
    name: 'jira_list_transitions',
    description: 'List all available transitions for a JIRA issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key'
        }
      },
      required: ['issueKey']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleListTransitions(args.issueKey);
    }
  },

  {
    name: 'jira_update_transition',
    description: 'Update/transition a JIRA issue to a new status',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key'
        },
        transitionId: {
          type: 'string',
          description: 'ID of the transition to perform'
        },
        comment: {
          type: 'string',
          description: 'Optional comment to add with the transition'
        },
        assignee: {
          type: 'string',
          description: 'Optional new assignee'
        },
        resolution: {
          type: 'string',
          description: 'Optional resolution for the issue'
        }
      },
      required: ['issueKey', 'transitionId']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleUpdateTransition(args.issueKey, args.transitionId, args.comment, args.assignee, args.resolution);
    }
  },

  {
    name: 'jira_find_test_cases',
    description: 'Find test cases in JIRA issue comments that contain "Test Report" tables',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key'
        }
      },
      required: ['issueKey']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleFindTestCases(args.issueKey);
    }
  },

  {
    name: 'jira_aggregate_test_cases',
    description: 'Fetch all JIRA issues with a label and aggregate test case counts for issues with summary containing "PEER_TEST_"',
    inputSchema: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
          description: 'JIRA label to search for (e.g., ITRISK_ADHOC_AUG2025)'
        }
      },
      required: ['label']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleAggregateTestCases(args.label);
    }
  },

  {
    name: 'jira_generate_test_case_effort_csv',
    description: 'Generate CSV report with test case counts and testing effort for PEER_TEST_ issues by label',
    inputSchema: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
          description: 'JIRA label to search for (e.g., ORS_R005_072025)'
        },
        filePath: {
          type: 'string',
          description: 'Output file path for the CSV report'
        }
      },
      required: ['label', 'filePath']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleGenerateTestCaseEffortCsv(args.label, args.filePath);
    }
  },

  {
    name: 'jira_tested_to_task_closed',
    description: 'Transition a single JIRA issue from TESTED to TASK CLOSED status',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key (e.g., PROJ-123)'
        },
        comment: {
          type: 'string',
          description: 'Optional comment to add when transitioning'
        }
      },
      required: ['issueKey']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleTestedToTaskClosed(args.issueKey, args.comment);
    }
  },

  {
    name: 'jira_batch_tested_to_task_closed',
    description: 'Batch transition multiple JIRA issues from TESTED to TASK CLOSED status',
    inputSchema: {
      type: 'object',
      properties: {
        issueKeys: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of JIRA issue keys to transition'
        },
        comment: {
          type: 'string',
          description: 'Optional comment to add to all transitions'
        }
      },
      required: ['issueKeys']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleBatchTestedToTaskClosed(args.issueKeys, args.comment);
    }
  },

  {
    name: 'jira_csv_report',
    description: 'Generate CSV report for JIRA issues with a specific label',
    inputSchema: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
          description: 'JIRA label to generate report for'
        },
        filePath: {
          type: 'string',
          description: 'File path where the CSV report should be saved'
        }
      },
      required: ['label', 'filePath']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleCsvReport(args.label, args.filePath);
    }
  },

  {
    name: 'jira_update_fields',
    description: 'Update multiple fields of a JIRA issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key (e.g., PROJ-123)'
        },
        summary: {
          type: 'string',
          description: 'New summary/title for the issue'
        },
        description: {
          type: 'string',
          description: 'New description for the issue'
        },
        assignee: {
          type: 'string',
          description: 'New assignee username'
        },
        priority: {
          type: 'string',
          description: 'Priority level (e.g., High, Medium, Low)'
        }
      },
      required: ['issueKey']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleUpdateFields(args.issueKey, args);
    }
  },

  {
    name: 'jira_get_editable_fields',
    description: 'Get list of editable fields for a JIRA issue to check what can be updated',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'JIRA issue key (e.g., PROJ-123)'
        }
      },
      required: ['issueKey']
    },
    handler: async (args) => {
      const service = new JiraService();
      return await service.handleGetEditableFields(args.issueKey);
    }
  }
];

// Export service instance for priority system
const jiraService = new JiraService();

module.exports = { jiraTools, jiraService };