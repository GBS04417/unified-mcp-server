/**
 * Rules tools for Outlook integration
 */

const { GraphService } = require('../services/graph-service');

const graphService = new GraphService();

async function handleListRules(args) {
  try {
    const rules = await graphService.listRules();
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          totalRules: rules.length,
          rules: rules.map(rule => ({
            id: rule.id,
            displayName: rule.displayName,
            isEnabled: rule.isEnabled,
            conditions: rule.conditions,
            actions: rule.actions
          }))
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error listing rules: ${error.message}`
      }]
    };
  }
}

async function handleCreateRule(args) {
  const { name, conditions, actions, enabled = true } = args;

  if (!name || !conditions || !actions) {
    throw new Error('Name, conditions, and actions are required');
  }

  try {
    const ruleData = {
      displayName: name,
      isEnabled: enabled,
      conditions,
      actions
    };

    const rule = await graphService.createRule(ruleData);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: 'Rule created successfully',
          ruleId: rule.id,
          displayName: rule.displayName
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error creating rule: ${error.message}`
      }]
    };
  }
}

const rulesTools = [
  {
    name: 'outlook_list_rules',
    description: 'List all mail rules',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    handler: handleListRules
  },

  {
    name: 'outlook_create_rule',
    description: 'Create a new mail rule',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Display name for the rule'
        },
        conditions: {
          type: 'object',
          description: 'Rule conditions (Graph API format)'
        },
        actions: {
          type: 'object',
          description: 'Rule actions (Graph API format)'
        },
        enabled: {
          type: 'boolean',
          description: 'Whether the rule is enabled',
          default: true
        }
      },
      required: ['name', 'conditions', 'actions'],
      additionalProperties: false
    },
    handler: handleCreateRule
  }
];

module.exports = { rulesTools };