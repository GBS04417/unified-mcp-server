/**
 * Improved search emails functionality
 */
const { GraphService } = require('../services/graph-service');
const { resolveFolderPath } = require('./folder-utils');

// Email fields to retrieve in search results
const EMAIL_SELECT_FIELDS = [
  'subject',
  'receivedDateTime',
  'from',
  'toRecipients',
  'bodyPreview',
  'hasAttachments',
  'isRead'
].join(',');

/**
 * Search emails handler
 * @param {object} args - Tool arguments
 * @returns {object} - MCP response
 */
async function handleSearchEmails(args) {
  const folder = args.folder || "inbox";
  const count = Math.min(args.count || 10, 50); // Using a sensible default max of 50
  const query = args.query || '';
  const from = args.from || '';
  const to = args.to || '';
  const subject = args.subject || '';
  const hasAttachments = args.hasAttachments;
  const unreadOnly = args.unreadOnly;

  try {
    // Initialize GraphService
    const graphService = new GraphService();

    // Build API endpoint - always resolve the folder ID for consistency
    let endpoint = '/me/messages';
    let resolvedFolderName = folder;

    // Get the folder ID - this ensures we get emails from the specific folder only
    const folderLower = folder.toLowerCase();

    if (folderLower === 'inbox') {
      // For inbox, resolve the folder ID to ensure we get only inbox emails
      const folderResponse = await graphService.graphRequest(
        `/me/mailFolders?$filter=displayName eq 'Inbox'&$select=id,displayName`
      );

      if (folderResponse.value && folderResponse.value.length > 0) {
        endpoint = `/me/mailFolders/${folderResponse.value[0].id}/messages`;
        console.error(`Resolved Inbox to folder ID: ${folderResponse.value[0].id}`);
      }
    } else {
      // For other folders, resolve by display name
      const folderResponse = await graphService.graphRequest(
        `/me/mailFolders?$filter=displayName eq '${folder}'&$select=id,displayName`
      );

      if (folderResponse.value && folderResponse.value.length > 0) {
        endpoint = `/me/mailFolders/${folderResponse.value[0].id}/messages`;
        console.error(`Resolved '${folder}' to folder ID: ${folderResponse.value[0].id}`);
      } else {
        // If folder not found, inform user
        return {
          content: [{
            type: "text",
            text: `Folder '${folder}' not found. Please check the folder name and try again.`
          }]
        };
      }
    }
    console.error(`Searching in folder: ${resolvedFolderName} (${endpoint})`);

    // Execute progressive search
    const response = await progressiveSearch(
      endpoint,
      graphService,
      { query, from, to, subject },
      { hasAttachments, unreadOnly },
      count
    );

    // Pass search terms to formatSearchResults for strict filtering
    return formatSearchResults(response, { query, from, to, subject });
  } catch (error) {
    // Handle authentication errors
    if (error.message === 'Authentication required') {
      return {
        content: [{
          type: "text",
          text: "Authentication required. Please use the 'authenticate' tool first."
        }]
      };
    }

    // General error response
    return {
      content: [{
        type: "text",
        text: `Error searching emails: ${error.message}`
      }]
    };
  }
}

/**
 * Execute a search with progressively simpler fallback strategies
 * @param {string} endpoint - API endpoint
 * @param {string} accessToken - Access token
 * @param {object} searchTerms - Search terms (query, from, to, subject)
 * @param {object} filterTerms - Filter terms (hasAttachments, unreadOnly)
 * @param {number} count - Maximum number of results
 * @returns {Promise<object>} - Search results
 */
async function progressiveSearch(endpoint, graphService, searchTerms, filterTerms, count) {
  // Track search strategies attempted
  const searchAttempts = [];

  // 1. Try combined search (most specific)
  try {
    const params = buildSearchParams(searchTerms, filterTerms, count);
    console.error("Attempting combined search with params:", params);
    searchAttempts.push("combined-search");

    const response = await graphService.graphRequest(`${endpoint}?${new URLSearchParams(params)}`);
    if (response.value && response.value.length > 0) {
      console.error(`Combined search successful: found ${response.value.length} results`);
      return response;
    }
  } catch (error) {
    console.error(`Combined search failed: ${error.message}`);
  }

  // 2. Try each search term individually, starting with most specific
  const searchPriority = ['subject', 'from', 'to', 'query'];

  for (const term of searchPriority) {
    if (searchTerms[term]) {
      try {
        console.error(`Attempting search with only ${term}: "${searchTerms[term]}"`);
        searchAttempts.push(`single-term-${term}`);

        // For single term search, build appropriate filter
        const simplifiedParams = {
          $top: count,
          $select: EMAIL_SELECT_FIELDS,
          $orderby: 'receivedDateTime desc'
        };

        // Build filter conditions based on term
        const filterConditions = [];
        if (term === 'subject') {
          filterConditions.push(`contains(subject, '${searchTerms[term].replace(/'/g, "''")}')`);
        } else if (term === 'from') {
          filterConditions.push(`contains(from/emailAddress/address, '${searchTerms[term].replace(/'/g, "''")}')`);
        } else if (term === 'to') {
          // Check if any recipient matches
          filterConditions.push(`contains(toRecipients/emailAddress/address, '${searchTerms[term].replace(/'/g, "''")}')`);
        } else if (term === 'query') {
          // For general query, search in subject and bodyPreview
          filterConditions.push(`contains(subject, '${searchTerms[term].replace(/'/g, "''")}')`);
        }

        // Add boolean filters if applicable
        addBooleanFilters(simplifiedParams, filterTerms);

        if (filterConditions.length > 0 || simplifiedParams.$filter) {
          if (simplifiedParams.$filter) {
            simplifiedParams.$filter = `(${filterConditions.join(' or ')}) and (${simplifiedParams.$filter})`;
          } else {
            simplifiedParams.$filter = filterConditions.join(' or ');
          }
        }

        const response = await graphService.graphRequest(`${endpoint}?${new URLSearchParams(simplifiedParams)}`);
        if (response.value && response.value.length > 0) {
          console.error(`Search with ${term} successful: found ${response.value.length} results`);
          return response;
        }
      } catch (error) {
        console.error(`Search with ${term} failed: ${error.message}`);
      }
    }
  }

  // 3. Try with only boolean filters
  if (filterTerms.hasAttachments === true || filterTerms.unreadOnly === true) {
    try {
      console.error("Attempting search with only boolean filters");
      searchAttempts.push("boolean-filters-only");

      const filterOnlyParams = {
        $top: count,
        $select: EMAIL_SELECT_FIELDS,
        $orderby: 'receivedDateTime desc'
      };

      // Add the boolean filters
      addBooleanFilters(filterOnlyParams, filterTerms);

      const response = await graphService.graphRequest(`${endpoint}?${new URLSearchParams(filterOnlyParams)}`);
      console.error(`Boolean filter search found ${response.value?.length || 0} results`);
      return response;
    } catch (error) {
      console.error(`Boolean filter search failed: ${error.message}`);
    }
  }

  // 4. Final fallback: fetch a large batch of emails and filter client-side
  console.error("All search strategies failed, falling back to client-side filtering of recent emails");
  searchAttempts.push("client-side-filtering");

  // Fetch a much larger batch (up to 200 emails) to ensure we find matches
  const largeCount = Math.min(200, Math.max(count * 5, 50)); // Fetch at least 50, but up to 5x the requested count
  const basicParams = {
    $top: largeCount,
    $select: EMAIL_SELECT_FIELDS,
    $orderby: 'receivedDateTime desc'
  };

  const response = await graphService.graphRequest(`${endpoint}?${new URLSearchParams(basicParams)}`);
  console.error(`Fetched ${response.value?.length || 0} recent emails for client-side filtering`);

  // Add a note to the response about the search attempts
  response._searchInfo = {
    attemptsCount: searchAttempts.length,
    strategies: searchAttempts,
    originalTerms: searchTerms,
    filterTerms: filterTerms
  };

  return response;
}

/**
 * Build search parameters from search terms and filter terms
 * @param {object} searchTerms - Search terms (query, from, to, subject)
 * @param {object} filterTerms - Filter terms (hasAttachments, unreadOnly)
 * @param {number} count - Maximum number of results
 * @returns {object} - Query parameters
 */
function buildSearchParams(searchTerms, filterTerms, count) {
  const params = {
    $top: count,
    $select: EMAIL_SELECT_FIELDS,
    $orderby: 'receivedDateTime desc'
  };

  // Build filter conditions using OData filter syntax
  const filterConditions = [];

  if (searchTerms.subject) {
    filterConditions.push(`contains(subject, '${searchTerms.subject.replace(/'/g, "''")}')`);
  }

  if (searchTerms.from) {
    filterConditions.push(`contains(from/emailAddress/address, '${searchTerms.from.replace(/'/g, "''")}')`);
  }

  if (searchTerms.to) {
    filterConditions.push(`contains(toRecipients/emailAddress/address, '${searchTerms.to.replace(/'/g, "''")}')`);
  }

  if (searchTerms.query) {
    // For general query, search in subject and bodyPreview
    filterConditions.push(`(contains(subject, '${searchTerms.query.replace(/'/g, "''")}') or contains(bodyPreview, '${searchTerms.query.replace(/'/g, "''")}')`);
  }

  // Add boolean filters
  addBooleanFilters(params, filterTerms);

  // Combine all filter conditions
  if (filterConditions.length > 0) {
    const searchFilter = filterConditions.join(' and ');
    if (params.$filter) {
      params.$filter = `(${searchFilter}) and (${params.$filter})`;
    } else {
      params.$filter = searchFilter;
    }
  }

  return params;
}

/**
 * Add boolean filters to query parameters
 * @param {object} params - Query parameters
 * @param {object} filterTerms - Filter terms (hasAttachments, unreadOnly)
 */
function addBooleanFilters(params, filterTerms) {
  const filterConditions = [];

  if (filterTerms.hasAttachments === true) {
    filterConditions.push('hasAttachments eq true');
  }

  if (filterTerms.unreadOnly === true) {
    filterConditions.push('isRead eq false');
  }

  // Add $filter parameter if we have any filter conditions
  if (filterConditions.length > 0) {
    params.$filter = filterConditions.join(' and ');
  }
}

/**
 * Format search results into a readable text format
 * Applies strict client-side filtering to ensure results match the search criteria
 * @param {object} response - The API response object
 * @param {object} searchTerms - Original search terms for validation
 * @returns {object} - MCP response object
 */
function formatSearchResults(response, searchTerms = {}) {
  if (!response.value || response.value.length === 0) {
    return {
      content: [{
        type: "text",
        text: `No emails found matching your search criteria.`
      }]
    };
  }

  // Check if any search terms are actually specified
  const hasSearchCriteria = Object.values(searchTerms).some(term => term && String(term).trim());

  // Apply strict client-side filtering to ensure results match search criteria
  let filteredEmails = response.value;

  // Only apply filters if search criteria were specified
  if (hasSearchCriteria) {
    // Filter by subject if specified
    if (searchTerms.subject) {
      const subjectLower = searchTerms.subject.toLowerCase();
      filteredEmails = filteredEmails.filter(email =>
        email.subject.toLowerCase().includes(subjectLower)
      );
    }

    // Filter by from if specified
    if (searchTerms.from) {
      const fromLower = searchTerms.from.toLowerCase();
      filteredEmails = filteredEmails.filter(email => {
        const senderEmail = email.from?.emailAddress?.address || '';
        const senderName = email.from?.emailAddress?.name || '';
        return senderEmail.toLowerCase().includes(fromLower) || senderName.toLowerCase().includes(fromLower);
      });
    }

    // Filter by to if specified
    if (searchTerms.to) {
      const toLower = searchTerms.to.toLowerCase();
      filteredEmails = filteredEmails.filter(email => {
        const recipients = email.toRecipients || [];
        return recipients.some(r => {
          const recipEmail = r.emailAddress?.address || '';
          const recipName = r.emailAddress?.name || '';
          return recipEmail.toLowerCase().includes(toLower) || recipName.toLowerCase().includes(toLower);
        });
      });
    }

    // Filter by general query (searches in subject and body preview)
    if (searchTerms.query) {
      const queryLower = searchTerms.query.toLowerCase();
      filteredEmails = filteredEmails.filter(email => {
        const subject = email.subject.toLowerCase();
        const bodyPreview = (email.bodyPreview || '').toLowerCase();
        return subject.includes(queryLower) || bodyPreview.includes(queryLower);
      });
    }

    if (filteredEmails.length === 0) {
      return {
        content: [{
          type: "text",
          text: `No emails found matching your search criteria after strict filtering.`
        }]
      };
    }
  }

  // Format results
  const emailList = filteredEmails.map((email, index) => {
    const sender = email.from?.emailAddress || { name: 'Unknown', address: 'unknown' };
    const date = new Date(email.receivedDateTime).toLocaleString();
    const readStatus = email.isRead ? '' : '[UNREAD] ';

    return `${index + 1}. ${readStatus}${date} - From: ${sender.name} (${sender.address})\nSubject: ${email.subject}\nID: ${email.id}\n`;
  }).join("\n");

  // Add search strategy info if available
  let additionalInfo = '';
  if (response._searchInfo) {
    additionalInfo = `\n(Search used ${response._searchInfo.strategies[response._searchInfo.strategies.length - 1]} strategy)`;
  }

  return {
    content: [{
      type: "text",
      text: `Found ${filteredEmails.length} emails matching your search criteria:${additionalInfo}\n\n${emailList}`
    }]
  };
}

module.exports = handleSearchEmails;
