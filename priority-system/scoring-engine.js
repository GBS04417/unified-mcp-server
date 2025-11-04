/**
 * Priority Scoring Engine
 * Calculates priority scores (0-100) for tasks from different sources
 */

class ScoringEngine {
    constructor(config = {}) {
        // Default scoring weights (configurable)
        this.weights = {
            jira: {
                priority: 0.3,      // Issue priority level weight
                overdue: 0.25,      // Days overdue weight
                dependencies: 0.15, // Dependencies/blockers weight
                assignees: 0.1,     // Team member count weight
                status: 0.2         // Status weight
            },
            confluence: {
                recentActivity: 0.4,  // Recent updates weight
                mentions: 0.3,        // @mentions weight
                urgencyTags: 0.2,     // Urgency labels weight
                collaboration: 0.1    // Activity level weight
            },
            outlook: {
                senderImportance: 0.25, // Sender importance weight
                flagged: 0.2,           // Flagged/important weight
                responseTime: 0.3,      // Days waiting weight
                actionItems: 0.15,      // Action items weight
                threadLength: 0.1       // Thread activity weight
            },
            ...config.weights
        };

        // Urgency keywords for AI analysis
        this.urgencyKeywords = {
            critical: ['urgent', 'critical', 'emergency', 'asap', 'immediate', 'blocker'],
            high: ['important', 'priority', 'deadline', 'escalation', 'client'],
            medium: ['follow up', 'review', 'update', 'meeting'],
            low: ['fyi', 'heads up', 'when possible', 'low priority']
        };

        this.config = config;
    }

    /**
     * Calculate priority score for a JIRA task
     */
    calculateJIRAScore(task) {
        let score = 0;
        const reasoning = [];

        // Base priority level (0-25 points)
        const priorityScore = this.getPriorityScore(task.priority);
        score += priorityScore * this.weights.jira.priority * 100;
        if (priorityScore > 0.6) reasoning.push(`High priority (${task.priority})`);

        // Days overdue (0-30 points)
        const overdueScore = this.getOverdueScore(task.dueDate);
        score += overdueScore * this.weights.jira.overdue * 100;
        if (overdueScore > 0.5) reasoning.push(`${Math.ceil(overdueScore * 30)} days overdue`);

        // Dependencies/blockers (0-15 points)
        const depScore = this.getDependencyScore(task);
        score += depScore * this.weights.jira.dependencies * 100;
        if (depScore > 0.3) reasoning.push('Has blocking dependencies');

        // Assignee count (0-10 points)
        const assigneeScore = this.getAssigneeScore(task.assignee);
        score += assigneeScore * this.weights.jira.assignees * 100;

        // Status weight (0-20 points)
        const statusScore = this.getStatusScore(task.status);
        score += statusScore * this.weights.jira.status * 100;
        if (statusScore > 0.7) reasoning.push('In active progress');

        // AI keyword analysis (bonus 0-10 points)
        const keywordScore = this.analyzeKeywords(task.summary + ' ' + (task.description || ''));
        score += keywordScore * 10;
        if (keywordScore > 0.5) reasoning.push('Contains urgent keywords');

        return {
            score: Math.min(Math.round(score), 100),
            reasoning: reasoning.join(', ') || 'Standard priority calculation'
        };
    }

    /**
     * Calculate priority score for a Confluence page
     */
    calculateConfluenceScore(page) {
        let score = 0;
        const reasoning = [];

        // Recent activity (0-40 points)
        const activityScore = this.getRecentActivityScore(page.lastModified);
        score += activityScore * this.weights.confluence.recentActivity * 100;
        if (activityScore > 0.5) reasoning.push('Recently updated');

        // @mentions analysis (0-30 points)
        const mentionScore = this.getMentionScore(page.content);
        score += mentionScore * this.weights.confluence.mentions * 100;
        if (mentionScore > 0.3) reasoning.push('Contains user mentions');

        // Urgency labels/tags (0-20 points)
        const tagScore = this.getUrgencyTagScore(page.labels);
        score += tagScore * this.weights.confluence.urgencyTags * 100;
        if (tagScore > 0.5) reasoning.push('Tagged as urgent');

        // Collaboration level (0-10 points)
        const collabScore = this.getCollaborationScore(page.version);
        score += collabScore * this.weights.confluence.collaboration * 100;

        // AI keyword analysis
        const keywordScore = this.analyzeKeywords(page.title + ' ' + page.content);
        score += keywordScore * 10;
        if (keywordScore > 0.5) reasoning.push('Contains urgent keywords');

        return {
            score: Math.min(Math.round(score), 100),
            reasoning: reasoning.join(', ') || 'Standard confluence priority'
        };
    }

    /**
     * Calculate priority score for an Outlook email
     */
    calculateOutlookScore(email) {
        let score = 0;
        const reasoning = [];

        // Sender importance (0-25 points)
        const senderScore = this.getSenderImportanceScore(email.from);
        score += senderScore * this.weights.outlook.senderImportance * 100;
        if (senderScore > 0.6) reasoning.push('Important sender');

        // Flagged/marked important (0-20 points)
        const flagScore = this.getFlaggedScore(email);
        score += flagScore * this.weights.outlook.flagged * 100;
        if (flagScore > 0.5) reasoning.push('Flagged as important');

        // Response time (0-30 points)
        const responseScore = this.getResponseTimeScore(email.receivedDateTime);
        score += responseScore * this.weights.outlook.responseTime * 100;
        if (responseScore > 0.5) reasoning.push('Awaiting response');

        // Action items detection (0-15 points)
        const actionScore = this.getActionItemScore(email.subject + ' ' + (email.bodyPreview || ''));
        score += actionScore * this.weights.outlook.actionItems * 100;
        if (actionScore > 0.5) reasoning.push('Contains action items');

        // Thread length (0-10 points)
        const threadScore = this.getThreadScore(email.conversationId);
        score += threadScore * this.weights.outlook.threadLength * 100;

        // AI keyword analysis
        const keywordScore = this.analyzeKeywords(email.subject + ' ' + (email.bodyPreview || ''));
        score += keywordScore * 10;
        if (keywordScore > 0.5) reasoning.push('Contains urgent keywords');

        return {
            score: Math.min(Math.round(score), 100),
            reasoning: reasoning.join(', ') || 'Standard email priority'
        };
    }

    /**
     * Helper methods for score calculations
     */

    getPriorityScore(priority) {
        const priorityMap = {
            'urgent': 1.0, 'critical': 1.0, 'highest': 1.0,
            'high': 0.8, 'major': 0.8,
            'medium': 0.5, 'normal': 0.5,
            'low': 0.2, 'minor': 0.2, 'trivial': 0.1
        };
        return priorityMap[priority?.toLowerCase()] || 0.5;
    }

    getOverdueScore(dueDate) {
        if (!dueDate) return 0;

        const due = new Date(dueDate);
        const now = new Date();
        const daysDiff = Math.ceil((now - due) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 0) return 0; // Not overdue
        if (daysDiff <= 1) return 0.3;
        if (daysDiff <= 3) return 0.5;
        if (daysDiff <= 7) return 0.7;
        if (daysDiff <= 14) return 0.9;
        return 1.0; // Very overdue
    }

    getDependencyScore(task) {
        // Analyze if task has blocking dependencies
        const summary = (task.summary || '').toLowerCase();
        const description = (task.description || '').toLowerCase();

        if (summary.includes('blocker') || description.includes('blocked')) return 0.8;
        if (summary.includes('depends') || description.includes('dependency')) return 0.5;
        if (task.subtasks && task.subtasks.length > 0) return 0.3;

        return 0;
    }

    getAssigneeScore(assignee) {
        // Single assignee gets higher score (more focused)
        if (assignee) return 0.7;
        return 0.3; // Unassigned or multiple assignees
    }

    getStatusScore(status) {
        const statusMap = {
            'in progress': 1.0, 'task assigned': 0.9, 'doing': 0.9,
            'to do': 0.7, 'open': 0.7, 'new': 0.7,
            'task on hold': 0.3, 'blocked': 0.3,
            'done': 0, 'closed': 0, 'resolved': 0
        };
        return statusMap[status?.toLowerCase()] || 0.5;
    }

    getRecentActivityScore(lastModified) {
        if (!lastModified) return 0;

        const modified = new Date(lastModified);
        const now = new Date();
        const hoursDiff = (now - modified) / (1000 * 60 * 60);

        if (hoursDiff <= 2) return 1.0;   // Last 2 hours
        if (hoursDiff <= 24) return 0.8;  // Last 24 hours
        if (hoursDiff <= 48) return 0.6;  // Last 2 days
        if (hoursDiff <= 168) return 0.3; // Last week

        return 0.1;
    }

    getMentionScore(content) {
        if (!content) return 0;

        const mentions = (content.match(/@\w+/g) || []).length;
        return Math.min(mentions * 0.2, 1.0);
    }

    getUrgencyTagScore(labels) {
        if (!labels || !Array.isArray(labels)) return 0;

        const urgentLabels = ['urgent', 'critical', 'asap', 'priority', 'escalation'];
        const hasUrgentLabel = labels.some(label =>
            urgentLabels.some(urgent => label.name?.toLowerCase().includes(urgent))
        );

        return hasUrgentLabel ? 1.0 : 0;
    }

    getCollaborationScore(version) {
        // Higher version numbers indicate more collaboration
        if (!version) return 0;

        if (version > 10) return 1.0;
        if (version > 5) return 0.7;
        if (version > 2) return 0.4;

        return 0.2;
    }

    getSenderImportanceScore(from) {
        if (!from || !from.emailAddress) return 0.3;

        const email = from.emailAddress.address.toLowerCase();
        const name = (from.emailAddress.name || '').toLowerCase();

        // Client domains or manager indicators
        if (email.includes('client') || email.includes('manager') ||
            name.includes('manager') || name.includes('director') ||
            name.includes('ceo') || name.includes('vp')) {
            return 1.0;
        }

        // External domains (potential clients)
        if (!email.includes('bansel.it') && !email.includes('sella')) {
            return 0.8;
        }

        return 0.4; // Internal team member
    }

    getFlaggedScore(email) {
        let score = 0;

        if (email.flag && email.flag.flagStatus === 'flagged') score += 0.7;
        if (email.importance === 'high') score += 0.8;
        if (email.isRead === false) score += 0.3;

        return Math.min(score, 1.0);
    }

    getResponseTimeScore(receivedDateTime) {
        if (!receivedDateTime) return 0;

        const received = new Date(receivedDateTime);
        const now = new Date();
        const daysDiff = (now - received) / (1000 * 60 * 60 * 24);

        if (daysDiff <= 1) return 0.3;
        if (daysDiff <= 3) return 0.5;
        if (daysDiff <= 7) return 0.7;
        if (daysDiff <= 14) return 0.9;

        return 1.0; // Very old
    }

    getActionItemScore(text) {
        if (!text) return 0;

        const actionWords = ['action', 'task', 'todo', 'follow up', 'please', 'need', 'require', 'must', 'should', '?'];
        const lowerText = text.toLowerCase();

        const actionCount = actionWords.reduce((count, word) => {
            return count + (lowerText.includes(word) ? 1 : 0);
        }, 0);

        return Math.min(actionCount * 0.2, 1.0);
    }

    getThreadScore(conversationId) {
        // This would require additional API calls to get thread length
        // For now, return a placeholder score
        return 0.3;
    }

    analyzeKeywords(text) {
        if (!text) return 0;

        const lowerText = text.toLowerCase();

        // Check for critical keywords
        if (this.urgencyKeywords.critical.some(word => lowerText.includes(word))) {
            return 1.0;
        }

        // Check for high priority keywords
        if (this.urgencyKeywords.high.some(word => lowerText.includes(word))) {
            return 0.7;
        }

        // Check for medium priority keywords
        if (this.urgencyKeywords.medium.some(word => lowerText.includes(word))) {
            return 0.4;
        }

        // Check for low priority indicators
        if (this.urgencyKeywords.low.some(word => lowerText.includes(word))) {
            return 0.1;
        }

        return 0.3; // Default score
    }

    /**
     * Determine urgency level based on score
     */
    getUrgencyLevel(score) {
        if (score >= 80) return 'URGENT';
        if (score >= 60) return 'HIGH';
        if (score >= 40) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * Update scoring weights
     */
    updateWeights(newWeights) {
        this.weights = { ...this.weights, ...newWeights };
    }
}

module.exports = ScoringEngine;