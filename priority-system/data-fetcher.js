/**
 * Data Fetcher Module
 * Handles data collection from JIRA, Confluence, and Outlook
 */

class DataFetcher {
    constructor(jiraService, confluenceService, outlookService) {
        this.jira = jiraService;
        this.confluence = confluenceService;
        this.outlook = outlookService;
        this.cache = new Map();
        this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
    }

    /**
     * Fetch all data from all sources with caching
     */
    async fetchAllData(focusUser = null) {
        const cacheKey = `all_data_${focusUser || 'default'}`;

        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('📦 Using cached data');
                return cached.data;
            }
        }

        console.log('🔄 Fetching fresh data from all sources...');

        try {
            // Fetch data in parallel for performance
            const [jiraData, confluenceData, outlookData] = await Promise.all([
                this.fetchJIRAData(focusUser),
                this.fetchConfluenceData(focusUser),
                this.fetchOutlookData()
            ]);

            const result = {
                jira: jiraData,
                confluence: confluenceData,
                outlook: outlookData,
                fetchedAt: new Date().toISOString()
            };

            // Cache the result
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;
        } catch (error) {
            console.error('❌ Error fetching data:', error.message);
            throw error;
        }
    }

    /**
     * Fetch JIRA data: Recent tasks + ALL overdue tasks
     */
    async fetchJIRAData(assignee = null) {
        console.log('📊 Fetching JIRA data...');

        try {
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

            // Handle null/undefined assignee - if no specific user, fetch for current user or skip
            let allTasksResult;
            if (assignee && assignee !== 'null' && assignee.trim() !== '') {
                // Fetch tasks for specific assignee
                allTasksResult = await this.jira.handleFetchByAssignee(assignee, null, 200);
            } else {
                // No specific assignee - return empty result or could fetch for current user
                console.log('⚠️ No specific assignee provided, skipping JIRA fetch');
                return {
                    tasks: [],
                    summary: { total: 0, recent: 0, overdue: 0 },
                    note: 'No assignee specified'
                };
            }

            // Parse the result to get the actual task data
            const allTasks = this.parseJIRAResponse(allTasksResult) || [];

            // Filter for recent tasks (last 2 weeks)
            const recentTasks = allTasks.filter(task => {
                if (!task.updated) return false;
                const updated = new Date(task.updated);
                return updated >= twoWeeksAgo;
            });

            // Filter for overdue tasks
            const overdueTasks = allTasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate < new Date();
            });

            // Combine and deduplicate
            const combinedTasks = this.deduplicateTasks([...allTasks]);

            return {
                tasks: combinedTasks,
                summary: {
                    total: combinedTasks.length,
                    recent: recentTasks.length,
                    overdue: overdueTasks.length
                }
            };
        } catch (error) {
            console.error('❌ JIRA fetch error:', error.message);
            return { tasks: [], summary: { total: 0, recent: 0, overdue: 0 }, error: error.message };
        }
    }

    /**
     * Fetch Confluence data: Recent pages and activity
     */
    async fetchConfluenceData(focusUser = null) {
        console.log('📚 Fetching Confluence data...');

        try {
            // Key pages to monitor (can be expanded)
            const keyPages = [
                '/display/ITDQ/Project+Management',
                '/display/ITDQ/Project+Maintenance+%26+Support+Activities'
            ];

            const pages = [];

            for (const pageUrl of keyPages) {
                try {
                    const result = await this.confluence.handleFetch(pageUrl);
                    const pageData = JSON.parse(result.content[0].text);

                    pages.push({
                        id: pageData.id,
                        title: pageData.title,
                        url: pageUrl,
                        lastModified: pageData.version.when,
                        modifiedBy: pageData.version.by?.displayName || 'Unknown',
                        version: pageData.version.number,
                        space: pageData.space?.name || 'Unknown',
                        content: pageData.body?.storage?.value || '',
                        labels: pageData.metadata?.labels || []
                    });
                } catch (pageError) {
                    console.warn(`⚠️ Failed to fetch page ${pageUrl}:`, pageError.message);
                }
            }

            return {
                pages,
                summary: {
                    total: pages.length,
                    recentlyUpdated: pages.filter(p => {
                        const updated = new Date(p.lastModified);
                        const twoDaysAgo = new Date();
                        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                        return updated > twoDaysAgo;
                    }).length
                }
            };
        } catch (error) {
            console.error('❌ Confluence fetch error:', error.message);
            return { pages: [], summary: { total: 0, recentlyUpdated: 0 }, error: error.message };
        }
    }

    /**
     * Fetch Outlook data: Recent emails + ALL unanswered emails
     */
    async fetchOutlookData() {
        console.log('📧 Fetching Outlook data...');

        try {
            // Fetch recent emails (last 50)
            const emailsResult = await this.outlook.listEmails({ count: 50 });
            const emails = this.parseOutlookResponse(emailsResult) || [];

            // Fetch calendar events
            const eventsResult = await this.outlook.listEvents({ count: 20 });
            const events = this.parseOutlookResponse(eventsResult) || [];

            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

            // Filter recent emails
            const recentEmails = emails.filter(email => {
                if (!email.receivedDateTime) return false;
                const received = new Date(email.receivedDateTime);
                return received >= twoWeeksAgo;
            });

            // Find ALL unanswered emails (regardless of date)
            const unansweredEmails = emails.filter(email => {
                return !email.isRead ||
                    (email.flag && email.flag.flagStatus === 'flagged') ||
                    (email.importance && email.importance === 'high');
            });

            return {
                emails: {
                    all: emails,
                    recent: recentEmails,
                    unanswered: unansweredEmails
                },
                events: events,
                summary: {
                    totalEmails: emails.length,
                    recentEmails: recentEmails.length,
                    unansweredEmails: unansweredEmails.length,
                    upcomingEvents: events.length
                }
            };
        } catch (error) {
            console.error('❌ Outlook fetch error:', error.message);
            return {
                emails: { all: [], recent: [], unanswered: [] },
                events: [],
                summary: { totalEmails: 0, recentEmails: 0, unansweredEmails: 0, upcomingEvents: 0 },
                error: error.message
            };
        }
    }

    /**
     * Parse JIRA API response
     */
    parseJIRAResponse(result) {
        try {
            if (result.content && result.content[0]) {
                const responseText = result.content[0].text;

                // Extract JSON from response
                const jsonMatch = responseText.match(/\{.*\}/s);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return parsed.issues || parsed;
                }

                return JSON.parse(responseText);
            }
            return [];
        } catch (error) {
            console.warn('⚠️ Failed to parse JIRA response:', error.message);
            return [];
        }
    }

    /**
     * Parse Outlook API response
     */
    parseOutlookResponse(result) {
        try {
            if (result.content && result.content[0]) {
                const responseText = result.content[0].text;

                const jsonMatch = responseText.match(/\{.*\}/s);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    const data = parsed.value || parsed;
                    return Array.isArray(data) ? data : (data ? [data] : []);
                }

                const parsed = JSON.parse(responseText);
                return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
            }
            return [];
        } catch (error) {
            console.warn('⚠️ Failed to parse Outlook response:', error.message);
            return [];
        }
    }

    /**
     * Remove duplicate JIRA tasks based on key
     */
    deduplicateTasks(tasks) {
        const seen = new Set();
        return tasks.filter(task => {
            const key = task.key || task.id;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    /**
     * Clear cache manually
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }
}

module.exports = DataFetcher;