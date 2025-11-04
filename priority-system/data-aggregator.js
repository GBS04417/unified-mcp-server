/**
 * Data Aggregator Module
 * Combines data from all sources and applies priority scoring
 */

const DataFetcher = require('./data-fetcher');
const ScoringEngine = require('./scoring-engine');

class DataAggregator {
    constructor(jiraService, confluenceService, outlookService, config = {}) {
        this.dataFetcher = new DataFetcher(jiraService, confluenceService, outlookService);
        this.scoringEngine = new ScoringEngine(config.scoring);
        this.config = config;
    }

    /**
     * Generate comprehensive priority report
     */
    async generatePriorityReport(focusUser = null) {
        const startTime = Date.now();
        console.log(`🚀 Generating priority report for: ${focusUser || 'All users'}`);

        try {
            // Fetch all data
            const rawData = await this.dataFetcher.fetchAllData(focusUser);

            // Process and score all items
            const scoredItems = await this.processAndScoreItems(rawData, focusUser);

            // Sort by priority score (highest first)
            scoredItems.sort((a, b) => b.priorityScore - a.priorityScore);

            // Generate summary statistics
            const summary = this.generateSummary(scoredItems, rawData);

            const report = {
                items: scoredItems,
                summary: {
                    ...summary,
                    processingTime: Date.now() - startTime,
                    lastUpdated: new Date().toISOString()
                },
                metadata: {
                    focusUser,
                    generatedAt: new Date().toISOString(),
                    dataFreshness: rawData.fetchedAt,
                    scoringConfig: this.scoringEngine.weights
                }
            };

            console.log(`✅ Priority report generated: ${scoredItems.length} items processed in ${Date.now() - startTime}ms`);
            return report;

        } catch (error) {
            console.error('❌ Error generating priority report:', error.message);
            throw error;
        }
    }

    /**
     * Process and score items from all sources
     */
    async processAndScoreItems(rawData, focusUser) {
        const items = [];

        // Process JIRA tasks
        if (rawData.jira && rawData.jira.tasks) {
            for (const task of rawData.jira.tasks) {
                const scoring = this.scoringEngine.calculateJIRAScore(task);

                items.push({
                    id: task.key || task.id,
                    source: 'jira',
                    title: task.summary || task.title,
                    description: this.truncateText(task.description || '', 200),
                    priorityScore: scoring.score,
                    urgencyLevel: this.scoringEngine.getUrgencyLevel(scoring.score),
                    dueDate: task.dueDate,
                    daysOverdue: this.calculateDaysOverdue(task.dueDate),
                    url: task.webUrl || `https://svil.bansel.it/jira/browse/${task.key}`,
                    metadata: {
                        assignees: [task.assignee].filter(Boolean),
                        status: task.status,
                        priority: task.priority,
                        project: task.project || 'Unknown',
                        issueType: task.issueType || 'Task',
                        created: task.created,
                        updated: task.updated,
                        dependencies: this.extractDependencies(task),
                        aiReasoning: scoring.reasoning
                    }
                });
            }
        }

        // Process Confluence pages
        if (rawData.confluence && rawData.confluence.pages) {
            for (const page of rawData.confluence.pages) {
                const scoring = this.scoringEngine.calculateConfluenceScore(page);

                // Only include pages with meaningful scores
                if (scoring.score > 20) {
                    items.push({
                        id: page.id,
                        source: 'confluence',
                        title: page.title,
                        description: this.truncateText(this.stripHtml(page.content), 200),
                        priorityScore: scoring.score,
                        urgencyLevel: this.scoringEngine.getUrgencyLevel(scoring.score),
                        dueDate: null,
                        daysOverdue: 0,
                        url: `https://confluence.bansel.it${page.url}`,
                        metadata: {
                            space: page.space,
                            version: page.version,
                            lastModifiedBy: page.modifiedBy,
                            lastModified: page.lastModified,
                            labels: page.labels,
                            aiReasoning: scoring.reasoning
                        }
                    });
                }
            }
        }

        // Process Outlook emails
        if (rawData.outlook && rawData.outlook.emails) {
            const allEmails = [
                ...rawData.outlook.emails.recent,
                ...rawData.outlook.emails.unanswered
            ];

            // Deduplicate emails
            const uniqueEmails = this.deduplicateEmails(allEmails);

            for (const email of uniqueEmails) {
                const scoring = this.scoringEngine.calculateOutlookScore(email);

                // Only include emails with meaningful scores
                if (scoring.score > 15) {
                    items.push({
                        id: email.id,
                        source: 'outlook',
                        title: email.subject || 'No Subject',
                        description: this.truncateText(email.bodyPreview || '', 200),
                        priorityScore: scoring.score,
                        urgencyLevel: this.scoringEngine.getUrgencyLevel(scoring.score),
                        dueDate: null,
                        daysOverdue: this.calculateDaysOverdue(email.receivedDateTime, true),
                        url: email.webLink || '#',
                        metadata: {
                            from: email.from?.emailAddress?.address || 'Unknown',
                            fromName: email.from?.emailAddress?.name || 'Unknown',
                            receivedDateTime: email.receivedDateTime,
                            isRead: email.isRead,
                            importance: email.importance,
                            flag: email.flag,
                            conversationId: email.conversationId,
                            aiReasoning: scoring.reasoning
                        }
                    });
                }
            }
        }

        return items;
    }

    /**
     * Generate summary statistics
     */
    generateSummary(items, rawData) {
        const urgentCount = items.filter(item => item.urgencyLevel === 'URGENT').length;
        const highCount = items.filter(item => item.urgencyLevel === 'HIGH').length;
        const overdueCount = items.filter(item => item.daysOverdue > 0).length;

        // Calculate workload capacity
        const totalScore = items.reduce((sum, item) => sum + item.priorityScore, 0);
        const avgScore = items.length > 0 ? Math.round(totalScore / items.length) : 0;

        let capacityLevel = 'OPTIMAL';
        if (urgentCount > 5 || avgScore > 70) capacityLevel = 'OVERLOADED';
        else if (urgentCount > 2 || avgScore > 50) capacityLevel = 'HIGH';
        else if (urgentCount > 0 || avgScore > 30) capacityLevel = 'MODERATE';

        return {
            totalItems: items.length,
            urgentCount,
            highCount,
            mediumCount: items.filter(item => item.urgencyLevel === 'MEDIUM').length,
            lowCount: items.filter(item => item.urgencyLevel === 'LOW').length,
            overdueCount,
            averageScore: avgScore,
            workloadCapacity: capacityLevel,
            sourceBreakdown: {
                jira: items.filter(item => item.source === 'jira').length,
                confluence: items.filter(item => item.source === 'confluence').length,
                outlook: items.filter(item => item.source === 'outlook').length
            },
            topPriorities: items.slice(0, 5).map(item => ({
                title: item.title,
                source: item.source,
                score: item.priorityScore,
                urgency: item.urgencyLevel
            })),
            rawDataSummary: {
                jira: rawData.jira?.summary || {},
                confluence: rawData.confluence?.summary || {},
                outlook: rawData.outlook?.summary || {}
            }
        };
    }

    /**
     * Helper methods
     */

    calculateDaysOverdue(dateStr, isReceivedDate = false) {
        if (!dateStr) return 0;

        const date = new Date(dateStr);
        const now = new Date();

        if (isReceivedDate) {
            // For emails, calculate days since received
            const daysDiff = Math.ceil((now - date) / (1000 * 60 * 60 * 24));
            return Math.max(0, daysDiff);
        } else {
            // For tasks, calculate days past due date
            const daysDiff = Math.ceil((now - date) / (1000 * 60 * 60 * 24));
            return Math.max(0, daysDiff);
        }
    }

    extractDependencies(task) {
        // Extract dependency information from task
        const summary = (task.summary || '').toLowerCase();
        const description = (task.description || '').toLowerCase();

        let depCount = 0;
        if (summary.includes('depends') || description.includes('depends')) depCount++;
        if (summary.includes('blocked') || description.includes('blocked')) depCount++;
        if (task.subtasks && task.subtasks.length > 0) depCount += task.subtasks.length;

        return depCount;
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    stripHtml(html) {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').trim();
    }

    deduplicateEmails(emails) {
        const seen = new Set();
        return emails.filter(email => {
            const key = email.id || email.internetMessageId;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    /**
     * Get greeting message based on time and workload
     */
    getGreeting(focusUser, summary) {
        const hour = new Date().getHours();
        let timeGreeting = 'Hello';

        if (hour < 12) timeGreeting = 'Good morning';
        else if (hour < 17) timeGreeting = 'Good afternoon';
        else timeGreeting = 'Good evening';

        const name = focusUser || 'there';
        let workloadMessage = '';

        if (summary.workloadCapacity === 'OVERLOADED') {
            workloadMessage = "Your workload is quite heavy today. Let's prioritize!";
        } else if (summary.workloadCapacity === 'HIGH') {
            workloadMessage = "You have a busy day ahead. Here are your priorities:";
        } else if (summary.workloadCapacity === 'MODERATE') {
            workloadMessage = "Here's what needs your attention today:";
        } else {
            workloadMessage = "Looking good! Here's your priority overview:";
        }

        return `${timeGreeting}, ${name}! ${workloadMessage}`;
    }

    /**
     * Clear all caches
     */
    clearCache() {
        this.dataFetcher.clearCache();
    }

    /**
     * Update scoring configuration
     */
    updateScoringConfig(config) {
        this.scoringEngine.updateWeights(config);
    }
}

module.exports = DataAggregator;