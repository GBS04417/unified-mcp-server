/**
 * Outlook Service Wrapper for Priority System
 */

const { graphService } = require('./services/graph-service');

class OutlookService {
    constructor() {
        this.graphService = graphService;
    }

    // Map the handlers for use by priority system
    get handlers() {
        return {
            'list-emails': require('./email/list'),
            'list-events': require('./calendar/list'),
            'search-emails': require('./email/search')
        };
    }

    // Provide a unified interface for the priority system
    async listEmails(args) {
        return await this.handlers['list-emails'](args);
    }

    async listEvents(args) {
        return await this.handlers['list-events'](args);
    }

    async searchEmails(args) {
        return await this.handlers['search-emails'](args);
    }
}

module.exports = { OutlookService };