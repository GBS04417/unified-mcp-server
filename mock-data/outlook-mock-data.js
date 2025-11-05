/**
 * Outlook Mock Data - Enterprise Email and Calendar Content
 * Generated realistic data for development and testing
 * Simulates typical business email scenarios, meetings, and calendar events
 */

const outlookMockData = {
    // Users from JIRA data
    users: [
        {
            id: "user1@company.com",
            displayName: "Abrar ul haq N",
            emailAddress: "abrar.ulhaq@company.com",
            department: "Data Engineering",
            title: "Senior ETL Developer"
        },
        {
            id: "user2@company.com",
            displayName: "Dinesh Kumar M",
            emailAddress: "dinesh.kumar@company.com",
            department: "Database Administration",
            title: "Database Architect"
        },
        {
            id: "user3@company.com",
            displayName: "Mani S",
            emailAddress: "mani.s@company.com",
            department: "Data Quality",
            title: "Data Quality Specialist"
        },
        {
            id: "devsparrow84@outlook.com",
            displayName: "Dev Sparrow",
            emailAddress: "devsparrow84@outlook.com",
            department: "Integration Development",
            title: "Email Integration Developer"
        },
        {
            id: "admin@company.com",
            displayName: "System Admin",
            emailAddress: "admin@company.com",
            department: "IT Operations",
            title: "System Administrator"
        },
        {
            id: "manager@company.com",
            displayName: "Project Manager",
            emailAddress: "manager@company.com",
            department: "Project Management",
            title: "Senior Project Manager"
        }
    ],

    // Folders structure
    folders: [
        {
            id: "inbox",
            displayName: "Inbox",
            parentFolderId: null,
            childFolderCount: 2,
            unreadItemCount: 15,
            totalItemCount: 156
        },
        {
            id: "sent",
            displayName: "Sent Items",
            parentFolderId: null,
            childFolderCount: 0,
            unreadItemCount: 0,
            totalItemCount: 89
        },
        {
            id: "drafts",
            displayName: "Drafts",
            parentFolderId: null,
            childFolderCount: 0,
            unreadItemCount: 0,
            totalItemCount: 3
        },
        {
            id: "deleted",
            displayName: "Deleted Items",
            parentFolderId: null,
            childFolderCount: 0,
            unreadItemCount: 0,
            totalItemCount: 23
        },
        {
            id: "projects",
            displayName: "Projects",
            parentFolderId: "inbox",
            childFolderCount: 3,
            unreadItemCount: 8,
            totalItemCount: 45
        },
        {
            id: "portaeh",
            displayName: "PORTAEH",
            parentFolderId: "projects",
            childFolderCount: 0,
            unreadItemCount: 3,
            totalItemCount: 15
        },
        {
            id: "ccacb",
            displayName: "CCACB",
            parentFolderId: "projects",
            childFolderCount: 0,
            unreadItemCount: 5,
            totalItemCount: 22
        },
        {
            id: "alerts",
            displayName: "System Alerts",
            parentFolderId: "inbox",
            childFolderCount: 0,
            unreadItemCount: 2,
            totalItemCount: 8
        }
    ],

    // Email messages
    emails: [
        // PORTAEH related emails
        {
            id: "email1",
            subject: "PORTAEH-3231: ETL Source Unavailable Alert",
            sender: { emailAddress: { address: "admin@company.com", name: "System Admin" } },
            from: { emailAddress: { address: "admin@company.com", name: "System Admin" } },
            toRecipients: [
                { emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" } },
                { emailAddress: { address: "manager@company.com", name: "Project Manager" } }
            ],
            ccRecipients: [
                { emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" } }
            ],
            receivedDateTime: "2025-11-04T09:15:23.000Z",
            sentDateTime: "2025-11-04T09:15:20.000Z",
            hasAttachments: false,
            isRead: false,
            importance: "high",
            bodyPreview: "ALERT: Data source DS001 is currently unavailable. MIDATAMODEL GG process requires immediate attention...",
            body: {
                contentType: "html",
                content: `<div>
<h3 style="color: #d73502;">⚠️ CRITICAL ALERT: Data Source Unavailable</h3>
<p><strong>Issue:</strong> PORTAEH-3231</p>
<p><strong>Data Source:</strong> DS001 (Primary Financial Feed)</p>
<p><strong>Detected:</strong> 2025-11-04 09:15:00 CET</p>
<p><strong>Impact:</strong> MIDATAMODEL GG ETL process cannot proceed</p>

<h4>Immediate Actions Required:</h4>
<ul>
<li>Verify network connectivity to source system</li>
<li>Check source system availability</li>
<li>Activate backup data source if needed</li>
<li>Update stakeholders on ETL delay</li>
</ul>

<h4>System Details:</h4>
<ul>
<li><strong>Process:</strong> MIDATAMODEL_GG_ETL</li>
<li><strong>Expected Runtime:</strong> 02:00 AM CET</li>
<li><strong>Retry Attempts:</strong> 3 (all failed)</li>
<li><strong>Next Retry:</strong> Manual intervention required</li>
</ul>

<p><strong>Contact:</strong> For urgent assistance, contact the on-call engineer at +39-xxx-xxxx-xxx</p>
</div>`
            },
            parentFolderId: "portaeh",
            conversationId: "conv1",
            isDeliveryReceiptRequested: false,
            isReadReceiptRequested: true,
            categories: ["Alert", "High Priority"]
        },

        {
            id: "email2",
            subject: "Re: WF_COGE_DIMENSIONI Workflow Modifications - Status Update",
            sender: { emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" } },
            from: { emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" } },
            toRecipients: [
                { emailAddress: { address: "manager@company.com", name: "Project Manager" } }
            ],
            ccRecipients: [
                { emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" } }
            ],
            receivedDateTime: "2025-11-04T14:30:15.000Z",
            sentDateTime: "2025-11-04T14:30:12.000Z",
            hasAttachments: true,
            isRead: true,
            importance: "normal",
            bodyPreview: "Hi Team, Following up on PORTAEH-3211, the WF_COGE_DIMENSIONI modifications are currently on hold...",
            body: {
                contentType: "html",
                content: `<div>
<p>Hi Team,</p>

<p>Following up on <strong>PORTAEH-3211</strong>, here's the current status of the WF_COGE_DIMENSIONI workflow modifications:</p>

<h4>Current Status: On Hold</h4>
<p>The task has been temporarily placed on hold pending clarification on the new dimensional data requirements from the business team.</p>

<h4>Completed Work:</h4>
<ul>
<li>✅ Analysis of current workflow structure</li>
<li>✅ Identification of modification points</li>
<li>✅ Impact assessment on downstream processes</li>
</ul>

<h4>Pending Items:</h4>
<ul>
<li>⏳ Business requirements clarification</li>
<li>⏳ Approval for schema changes</li>
<li>⏳ Testing environment setup</li>
</ul>

<h4>Next Steps:</h4>
<ol>
<li>Schedule meeting with business stakeholders</li>
<li>Finalize requirements document</li>
<li>Resume development work</li>
</ol>

<p>I've attached the current progress report for your review. Please let me know if you need any additional information.</p>

<p>Best regards,<br/>
Abrar ul haq N<br/>
Senior ETL Developer</p>
</div>`
            },
            parentFolderId: "portaeh",
            conversationId: "conv2",
            isDeliveryReceiptRequested: false,
            isReadReceiptRequested: false,
            categories: ["Work", "Status Update"],
            attachments: [
                {
                    id: "att1",
                    name: "PORTAEH-3211_Progress_Report.pdf",
                    contentType: "application/pdf",
                    size: 234567
                }
            ]
        },

        // CCACB related emails
        {
            id: "email3",
            subject: "CCACB-11894: New ESG Stock Tables - Implementation Complete",
            sender: { emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" } },
            from: { emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" } },
            toRecipients: [
                { emailAddress: { address: "manager@company.com", name: "Project Manager" } },
                { emailAddress: { address: "mani.s@company.com", name: "Mani S" } }
            ],
            ccRecipients: [
                { emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" } }
            ],
            receivedDateTime: "2025-11-04T16:45:08.000Z",
            sentDateTime: "2025-11-04T16:45:05.000Z",
            hasAttachments: true,
            isRead: false,
            importance: "normal",
            bodyPreview: "Team, I'm pleased to announce the successful completion of the ESG APE stock tracking tables...",
            body: {
                contentType: "html",
                content: `<div>
<p>Team,</p>

<p>I'm pleased to announce the successful completion of the ESG APE stock tracking tables for <strong>CCACB-11894</strong>.</p>

<h4>✅ Completed Items:</h4>
<ul>
<li><strong>DW_HS_GAG_STOCK_ESG_APE:</strong> Daily aggregation table created</li>
<li><strong>DW_HS_GAG_STOCK_ESG_APE_MM:</strong> Monthly aggregation table created</li>
<li><strong>Indexes:</strong> Performance indexes implemented</li>
<li><strong>Constraints:</strong> Data integrity constraints added</li>
<li><strong>Documentation:</strong> Confluence pages updated</li>
</ul>

<h4>📊 Table Statistics:</h4>
<ul>
<li><strong>Table Size:</strong> Estimated 50GB annual growth</li>
<li><strong>Partitioning:</strong> Monthly partitions implemented</li>
<li><strong>Performance:</strong> Sub-second query response for standard reports</li>
</ul>

<h4>🔄 Next Steps:</h4>
<ol>
<li><strong>Data Quality Rules:</strong> @Mani S - Please proceed with DQ rule implementation</li>
<li><strong>ETL Integration:</strong> @Abrar ul haq N - Ready for ETL process integration</li>
<li><strong>UAT Testing:</strong> Business team validation required</li>
</ol>

<p>The tables are ready for the next phase of development. Please find the technical specifications and deployment scripts attached.</p>

<p>Best regards,<br/>
Dinesh Kumar M<br/>
Database Architect</p>
</div>`
            },
            parentFolderId: "ccacb",
            conversationId: "conv3",
            isDeliveryReceiptRequested: false,
            isReadReceiptRequested: true,
            categories: ["Work", "Completed"],
            attachments: [
                {
                    id: "att2",
                    name: "ESG_Tables_Schema.sql",
                    contentType: "text/plain",
                    size: 15678
                },
                {
                    id: "att3",
                    name: "Performance_Test_Results.xlsx",
                    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    size: 89432
                }
            ]
        },

        {
            id: "email4",
            subject: "DQ Rules Validation - AIRB Product Portfolio",
            sender: { emailAddress: { address: "mani.s@company.com", name: "Mani S" } },
            from: { emailAddress: { address: "mani.s@company.com", name: "Mani S" } },
            toRecipients: [
                { emailAddress: { address: "manager@company.com", name: "Project Manager" } }
            ],
            ccRecipients: [
                { emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" } },
                { emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" } }
            ],
            receivedDateTime: "2025-11-03T11:20:33.000Z",
            sentDateTime: "2025-11-03T11:20:30.000Z",
            hasAttachments: false,
            isRead: true,
            importance: "normal",
            bodyPreview: "Hi Team, I've completed the DQ rule validation for the AIRB product portfolio tables...",
            body: {
                contentType: "html",
                content: `<div>
<p>Hi Team,</p>

<p>I've completed the DQ rule validation for the AIRB product portfolio tables as part of <strong>CCACB-11885</strong>.</p>

<h4>🔍 Validation Results:</h4>
<table border="1" style="border-collapse: collapse; width: 100%;">
<thead>
<tr style="background-color: #f0f0f0;">
<th>Rule Type</th>
<th>Status</th>
<th>Pass Rate</th>
<th>Issues Found</th>
</tr>
</thead>
<tbody>
<tr>
<td>Completeness</td>
<td>✅ Pass</td>
<td>99.8%</td>
<td>Minor gaps in optional fields</td>
</tr>
<tr>
<td>Validity</td>
<td>⚠️ Warning</td>
<td>95.2%</td>
<td>Invalid product codes identified</td>
</tr>
<tr>
<td>Consistency</td>
<td>✅ Pass</td>
<td>100%</td>
<td>No issues</td>
</tr>
<tr>
<td>Timeliness</td>
<td>✅ Pass</td>
<td>98.7%</td>
<td>Some delayed updates</td>
</tr>
</tbody>
</table>

<h4>🚨 Critical Issues:</h4>
<ul>
<li><strong>Invalid Product Codes:</strong> 847 records with non-existent product references</li>
<li><strong>Data Freshness:</strong> 23 records older than 24-hour SLA</li>
</ul>

<h4>💡 Recommendations:</h4>
<ol>
<li>Implement real-time product code validation</li>
<li>Add automated alerts for SLA breaches</li>
<li>Create exception handling workflow</li>
</ol>

<p>I'll be working on the rule modifications this week. Please let me know if you need more detailed analysis.</p>

<p>Best regards,<br/>
Mani S<br/>
Data Quality Specialist</p>
</div>`
            },
            parentFolderId: "ccacb",
            conversationId: "conv4",
            isDeliveryReceiptRequested: false,
            isReadReceiptRequested: false,
            categories: ["Work", "Data Quality"]
        },

        // System alerts
        {
            id: "email5",
            subject: "Weekly ETL Performance Report - System Health Check",
            sender: { emailAddress: { address: "admin@company.com", name: "System Admin" } },
            from: { emailAddress: { address: "admin@company.com", name: "System Admin" } },
            toRecipients: [
                { emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" } },
                { emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" } },
                { emailAddress: { address: "mani.s@company.com", name: "Mani S" } },
                { emailAddress: { address: "manager@company.com", name: "Project Manager" } }
            ],
            ccRecipients: [],
            receivedDateTime: "2025-11-04T06:00:15.000Z",
            sentDateTime: "2025-11-04T06:00:12.000Z",
            hasAttachments: true,
            isRead: false,
            importance: "normal",
            bodyPreview: "Weekly automated report covering ETL performance metrics, system health indicators, and operational statistics...",
            body: {
                contentType: "html",
                content: `<div>
<h2>📊 Weekly ETL Performance Report</h2>
<p><strong>Report Period:</strong> October 28 - November 4, 2025</p>

<h3>🟢 System Health Overview</h3>
<ul>
<li><strong>Overall Health:</strong> 98.7% (Good)</li>
<li><strong>Uptime:</strong> 99.9%</li>
<li><strong>Failed Jobs:</strong> 3 out of 247 total jobs</li>
<li><strong>Average Processing Time:</strong> 2.3 hours (within SLA)</li>
</ul>

<h3>📈 Performance Metrics</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
<thead>
<tr style="background-color: #e6f3ff;">
<th>System</th>
<th>Jobs Executed</th>
<th>Success Rate</th>
<th>Avg Duration</th>
<th>Trend</th>
</tr>
</thead>
<tbody>
<tr>
<td>PORTAEH</td>
<td>78</td>
<td>97.4%</td>
<td>1.8 hrs</td>
<td>📈 +3%</td>
</tr>
<tr>
<td>CCACB</td>
<td>169</td>
<td>99.4%</td>
<td>2.7 hrs</td>
<td>📉 -1%</td>
</tr>
</tbody>
</table>

<h3>⚠️ Issues Requiring Attention</h3>
<ol>
<li><strong>MIDATAMODEL GG Source Timeout:</strong> Intermittent connectivity issues</li>
<li><strong>Monthly Aggregation Performance:</strong> Slower than baseline</li>
<li><strong>Disk Space:</strong> Warning threshold reached on ETL-PROD-03</li>
</ol>

<h3>🔧 Recommended Actions</h3>
<ul>
<li>Review network configuration for MIDATAMODEL GG</li>
<li>Optimize monthly aggregation queries</li>
<li>Schedule disk cleanup on ETL-PROD-03</li>
</ul>

<p><em>This is an automated report. For questions, contact the ETL support team.</em></p>
</div>`
            },
            parentFolderId: "alerts",
            conversationId: "conv5",
            isDeliveryReceiptRequested: false,
            isReadReceiptRequested: false,
            categories: ["System Report", "Automated"],
            attachments: [
                {
                    id: "att4",
                    name: "ETL_Performance_Details.xlsx",
                    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    size: 156789
                }
            ]
        },

        // Dev Sparrow's emails related to integration projects
        {
            id: "email_devsparrow1",
            subject: "PORTAEH-3305: Outlook Integration Module - Progress Update",
            sender: { emailAddress: { address: "devsparrow84@outlook.com", name: "Dev Sparrow" } },
            from: { emailAddress: { address: "devsparrow84@outlook.com", name: "Dev Sparrow" } },
            toRecipients: [
                { emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" } },
                { emailAddress: { address: "manager@company.com", name: "Project Manager" } }
            ],
            ccRecipients: [
                { emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" } }
            ],
            receivedDateTime: "2025-11-05T11:30:15.000Z",
            sentDateTime: "2025-11-05T11:30:10.000Z",
            hasAttachments: true,
            isRead: false,
            importance: "normal",
            bodyPreview: "Progress update on PORTAEH-3305: Outlook Integration Module implementation. OAuth authentication completed, working on email synchronization...",
            body: {
                contentType: "html",
                content: `<div>
<h3>PORTAEH-3305: Outlook Integration Module - Progress Update</h3>
<p>Hi team,</p>

<p>I'm providing an update on the Outlook Integration Module development:</p>

<h4>✅ Completed:</h4>
<ul>
<li>OAuth 2.0 authentication with Microsoft Graph API</li>
<li>Basic email retrieval functionality</li>
<li>Integration with unified MCP server architecture</li>
<li>Mock data system for testing</li>
</ul>

<h4>🔄 In Progress:</h4>
<ul>
<li>Real-time email synchronization</li>
<li>Cross-system data linking with JIRA tickets</li>
<li>Calendar integration for team planning</li>
<li>Performance optimization</li>
</ul>

<h4>📋 Next Steps:</h4>
<ul>
<li>Complete email synchronization by Nov 8</li>
<li>Integration testing with live JIRA data</li>
<li>Documentation updates</li>
<li>Team demo scheduled for Nov 10</li>
</ul>

<p><strong>Current Status:</strong> On track for Nov 15 deadline</p>
<p><strong>Blockers:</strong> None at this time</p>

<p>Let me know if you have any questions or concerns.</p>

<p>Best regards,<br/>Dev Sparrow</p>
</div>`
            },
            parentFolderId: "projects",
            conversationId: "conv_devsparrow1",
            isDeliveryReceiptRequested: false,
            isReadReceiptRequested: true,
            categories: ["Development", "PORTAEH", "Progress Update"],
            attachments: [
                {
                    id: "att_dev1",
                    name: "Outlook_Integration_Architecture.pdf",
                    contentType: "application/pdf",
                    size: 245678
                }
            ]
        },

        {
            id: "email_devsparrow2",
            subject: "Re: Cross-System Data Synchronization - Technical Discussion",
            sender: { emailAddress: { address: "devsparrow84@outlook.com", name: "Dev Sparrow" } },
            from: { emailAddress: { address: "devsparrow84@outlook.com", name: "Dev Sparrow" } },
            toRecipients: [
                { emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" } }
            ],
            ccRecipients: [
                { emailAddress: { address: "mani.s@company.com", name: "Mani S" } }
            ],
            receivedDateTime: "2025-11-04T16:45:30.000Z",
            sentDateTime: "2025-11-04T16:45:25.000Z",
            hasAttachments: false,
            isRead: true,
            importance: "normal",
            bodyPreview: "Thanks for the detailed technical requirements for PORTAEH-3312. I agree with the approach for real-time sync between JIRA, Confluence, and Outlook...",
            body: {
                contentType: "html",
                content: `<div>
<p>Hi Abrar,</p>

<p>Thanks for the detailed technical requirements for PORTAEH-3312. I agree with your approach for real-time synchronization between JIRA, Confluence, and Outlook systems.</p>

<h4>Technical Approach:</h4>
<ul>
<li><strong>Event-driven architecture:</strong> Using webhooks for real-time updates</li>
<li><strong>Data consistency:</strong> Implementing eventual consistency with conflict resolution</li>
<li><strong>API rate limiting:</strong> Smart queuing to handle Microsoft Graph API limits</li>
<li><strong>Error handling:</strong> Robust retry mechanisms with exponential backoff</li>
</ul>

<h4>Implementation Plan:</h4>
<ol>
<li>Set up webhook endpoints for JIRA and Confluence</li>
<li>Implement message queue for processing sync events</li>
<li>Create data mapping layer for cross-system references</li>
<li>Add monitoring and alerting for sync failures</li>
</ol>

<p>I'll start working on this after completing the current Outlook integration module. Should have initial implementation ready by Nov 20.</p>

<p>Let's schedule a technical review session next week to discuss the architecture in detail.</p>

<p>Best,<br/>Dev</p>
</div>`
            },
            parentFolderId: "projects",
            conversationId: "conv_devsparrow2",
            isDeliveryReceiptRequested: false,
            isReadReceiptRequested: false,
            categories: ["Technical", "Architecture", "PORTAEH"]
        },

        {
            id: "email_devsparrow3",
            subject: "CCACB-11801: Mock Data System Optimization - Completed",
            sender: { emailAddress: { address: "devsparrow84@outlook.com", name: "Dev Sparrow" } },
            from: { emailAddress: { address: "devsparrow84@outlook.com", name: "Dev Sparrow" } },
            toRecipients: [
                { emailAddress: { address: "manager@company.com", name: "Project Manager" } }
            ],
            ccRecipients: [
                { emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" } },
                { emailAddress: { address: "mani.s@company.com", name: "Mani S" } }
            ],
            receivedDateTime: "2025-11-02T15:15:00.000Z",
            sentDateTime: "2025-11-02T15:15:00.000Z",
            hasAttachments: true,
            isRead: true,
            importance: "normal",
            bodyPreview: "CCACB-11801 has been completed successfully. The mock data system has been optimized with improved performance and realistic cross-system references...",
            body: {
                contentType: "html",
                content: `<div>
<h3>✅ CCACB-11801: Mock Data System Optimization - Completed</h3>
<p>Hi team,</p>

<p>I'm pleased to report that CCACB-11801 has been completed successfully.</p>

<h4>🎯 Achievements:</h4>
<ul>
<li>Optimized mock data loading performance by 40%</li>
<li>Added realistic cross-references between JIRA, Confluence, and Outlook data</li>
<li>Improved data consistency across all mock systems</li>
<li>Added new user data for better testing scenarios</li>
<li>Enhanced documentation with usage examples</li>
</ul>

<h4>📊 Performance Improvements:</h4>
<ul>
<li>Mock data initialization: 2.3s → 1.4s (39% improvement)</li>
<li>Cross-system queries: 450ms → 280ms (38% improvement)</li>
<li>Memory usage: Reduced by 25%</li>
</ul>

<h4>🔗 New Cross-System Features:</h4>
<ul>
<li>JIRA issues now reference related Confluence pages</li>
<li>Outlook emails automatically link to relevant JIRA tickets</li>
<li>Calendar events connect with project milestones</li>
<li>Consistent user data across all systems</li>
</ul>

<p>The updated mock data system is now ready for enhanced development and testing workflows.</p>

<p>Documentation has been updated in the repository. Please let me know if you need any clarification.</p>

<p>Best regards,<br/>Dev Sparrow</p>
</div>`
            },
            parentFolderId: "completed",
            conversationId: "conv_devsparrow3",
            isDeliveryReceiptRequested: false,
            isReadReceiptRequested: false,
            categories: ["Completed", "CCACB", "Optimization"],
            attachments: [
                {
                    id: "att_dev2",
                    name: "Mock_Data_Performance_Report.xlsx",
                    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    size: 89456
                }
            ]
        }
    ],

    // Calendar events
    calendarEvents: [
        {
            id: "event1",
            subject: "PORTAEH Sprint Planning - Q4 2025",
            start: {
                dateTime: "2025-11-05T09:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            end: {
                dateTime: "2025-11-05T10:30:00.000Z",
                timeZone: "Europe/Rome"
            },
            location: {
                displayName: "Conference Room A / Teams Meeting",
                address: {
                    street: "Via Roma 123",
                    city: "Milano",
                    state: "Lombardia",
                    countryOrRegion: "Italy"
                }
            },
            organizer: {
                emailAddress: {
                    address: "manager@company.com",
                    name: "Project Manager"
                }
            },
            attendees: [
                {
                    emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" },
                    status: { response: "accepted", time: "2025-11-04T15:30:00.000Z" }
                },
                {
                    emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" },
                    status: { response: "tentative", time: "2025-11-04T16:45:00.000Z" }
                },
                {
                    emailAddress: { address: "mani.s@company.com", name: "Mani S" },
                    status: { response: "accepted", time: "2025-11-04T14:20:00.000Z" }
                }
            ],
            body: {
                contentType: "html",
                content: `<div>
<h3>PORTAEH Sprint Planning - Q4 2025</h3>
<p><strong>Agenda:</strong></p>
<ul>
<li>Review Q3 deliverables and lessons learned</li>
<li>Q4 sprint goals and priorities</li>
<li>PORTAEH-3231 (ETL source availability) - resolution plan</li>
<li>PORTAEH-3211 (WF_COGE_DIMENSIONI) - requirements clarification</li>
<li>PORTAEH-3042 (RG session migration) - timeline review</li>
</ul>

<p><strong>Preparation:</strong></p>
<ul>
<li>Review current sprint backlog</li>
<li>Prepare estimates for pending tasks</li>
<li>Bring blockers and dependencies list</li>
</ul>

<p><strong>Teams Meeting Link:</strong> <a href="https://teams.microsoft.com/l/meetup-join/xxx">Join Meeting</a></p>
</div>`
            },
            importance: "high",
            sensitivity: "normal",
            showAs: "busy",
            type: "singleInstance",
            isAllDay: false,
            isCancelled: false,
            isOrganizer: false,
            responseRequested: true,
            seriesMasterId: null,
            categories: ["Work", "Sprint Planning"]
        },

        {
            id: "event2",
            subject: "CCACB Database Schema Review",
            start: {
                dateTime: "2025-11-06T14:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            end: {
                dateTime: "2025-11-06T15:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            location: {
                displayName: "Teams Meeting",
                address: null
            },
            organizer: {
                emailAddress: {
                    address: "dinesh.kumar@company.com",
                    name: "Dinesh Kumar M"
                }
            },
            attendees: [
                {
                    emailAddress: { address: "mani.s@company.com", name: "Mani S" },
                    status: { response: "accepted", time: "2025-11-04T17:10:00.000Z" }
                },
                {
                    emailAddress: { address: "manager@company.com", name: "Project Manager" },
                    status: { response: "none", time: null }
                }
            ],
            body: {
                contentType: "html",
                content: `<div>
<h3>CCACB Database Schema Review</h3>
<p><strong>Purpose:</strong> Review recently implemented schema changes and plan upcoming modifications</p>

<p><strong>Topics to Cover:</strong></p>
<ul>
<li>ESG APE stock tables (CCACB-11894) - post-implementation review</li>
<li>AR_TITOLARE_EFFETTIVO columns (CCACB-11845) - implementation status</li>
<li>Data quality rule integration with new tables</li>
<li>Performance optimization opportunities</li>
</ul>

<p><strong>Attendees:</strong></p>
<ul>
<li>Dinesh Kumar M (Database Architect) - Organizer</li>
<li>Mani S (Data Quality Specialist)</li>
<li>Project Manager (Optional)</li>
</ul>

<p><strong>Meeting Materials:</strong></p>
<ul>
<li>Schema documentation (will be shared before meeting)</li>
<li>Performance test results</li>
<li>DQ rule specifications</li>
</ul>
</div>`
            },
            importance: "normal",
            sensitivity: "normal",
            showAs: "busy",
            type: "singleInstance",
            isAllDay: false,
            isCancelled: false,
            isOrganizer: true,
            responseRequested: true,
            seriesMasterId: null,
            categories: ["Work", "Technical Review"]
        },

        {
            id: "event3",
            subject: "Monthly Data Quality Review",
            start: {
                dateTime: "2025-11-07T10:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            end: {
                dateTime: "2025-11-07T11:30:00.000Z",
                timeZone: "Europe/Rome"
            },
            location: {
                displayName: "Conference Room B",
                address: {
                    street: "Via Roma 123",
                    city: "Milano",
                    state: "Lombardia",
                    countryOrRegion: "Italy"
                }
            },
            organizer: {
                emailAddress: {
                    address: "mani.s@company.com",
                    name: "Mani S"
                }
            },
            attendees: [
                {
                    emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" },
                    status: { response: "accepted", time: "2025-11-04T18:00:00.000Z" }
                },
                {
                    emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" },
                    status: { response: "accepted", time: "2025-11-04T17:30:00.000Z" }
                },
                {
                    emailAddress: { address: "manager@company.com", name: "Project Manager" },
                    status: { response: "accepted", time: "2025-11-04T16:15:00.000Z" }
                }
            ],
            body: {
                contentType: "html",
                content: `<div>
<h3>Monthly Data Quality Review - November 2025</h3>

<p><strong>Meeting Objectives:</strong></p>
<ul>
<li>Review October 2025 DQ metrics and trends</li>
<li>Discuss recent DQ rule implementations</li>
<li>Plan DQ improvements for November</li>
<li>Address any critical data quality issues</li>
</ul>

<p><strong>Agenda:</strong></p>
<ol>
<li><strong>Monthly DQ Dashboard Review</strong> (15 min)
   <ul>
   <li>Overall DQ score trends</li>
   <li>System-specific metrics (PORTAEH, CCACB)</li>
   <li>Exception volumes and resolution times</li>
   </ul>
</li>
<li><strong>Recent Implementations</strong> (20 min)
   <ul>
   <li>AIRB product portfolio rules (CCACB-11885)</li>
   <li>Subject grouping validations (CCACB-11884)</li>
   <li>ESG stock table rules</li>
   </ul>
</li>
<li><strong>Issues and Escalations</strong> (15 min)
   <ul>
   <li>Critical data quality failures</li>
   <li>Business impact assessment</li>
   <li>Remediation plans</li>
   </ul>
</li>
<li><strong>November Plans</strong> (20 min)
   <ul>
   <li>Upcoming DQ rule implementations</li>
   <li>Process improvements</li>
   <li>Training and documentation needs</li>
   </ul>
</li>
<li><strong>Q&A and Action Items</strong> (10 min)</li>
</ol>

<p><strong>Pre-Meeting Preparation:</strong></p>
<ul>
<li>Review DQ dashboard for October</li>
<li>Prepare any specific questions or concerns</li>
<li>Bring issues that need team discussion</li>
</ul>
</div>`
            },
            importance: "normal",
            sensitivity: "normal",
            showAs: "busy",
            type: "seriesMaster",
            isAllDay: false,
            isCancelled: false,
            isOrganizer: true,
            responseRequested: true,
            seriesMasterId: null,
            categories: ["Work", "Monthly Review", "Data Quality"],
            recurrence: {
                pattern: {
                    type: "absoluteMonthly",
                    interval: 1,
                    dayOfMonth: 7
                },
                range: {
                    type: "noEnd",
                    startDate: "2025-11-07"
                }
            }
        },

        {
            id: "event4",
            subject: "System Maintenance Window - ETL Infrastructure",
            start: {
                dateTime: "2025-11-09T22:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            end: {
                dateTime: "2025-11-10T04:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            location: {
                displayName: "Data Center - Remote Access",
                address: null
            },
            organizer: {
                emailAddress: {
                    address: "admin@company.com",
                    name: "System Admin"
                }
            },
            attendees: [
                {
                    emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" },
                    status: { response: "accepted", time: "2025-11-04T19:30:00.000Z" }
                },
                {
                    emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" },
                    status: { response: "accepted", time: "2025-11-04T19:45:00.000Z" }
                }
            ],
            body: {
                contentType: "html",
                content: `<div>
<h3>⚠️ Scheduled System Maintenance - ETL Infrastructure</h3>

<p><strong>Maintenance Window:</strong> November 9, 2025 - 22:00 CET to November 10, 2025 - 04:00 CET</p>

<p><strong>Systems Affected:</strong></p>
<ul>
<li>ETL-PROD-01, ETL-PROD-02, ETL-PROD-03</li>
<li>Database clusters: PORTAEH-DB, CCACB-DB</li>
<li>Data warehouse staging area</li>
<li>Monitoring and alerting systems</li>
</ul>

<p><strong>Maintenance Activities:</strong></p>
<ul>
<li>Operating system security patches</li>
<li>Database version upgrades</li>
<li>Hardware firmware updates</li>
<li>Network configuration changes</li>
<li>Backup system testing</li>
</ul>

<p><strong>Expected Impact:</strong></p>
<ul>
<li>⛔ ETL processes will be suspended during maintenance</li>
<li>📊 Reporting systems will be unavailable</li>
<li>🔒 Database access restricted to maintenance team only</li>
<li>📧 Email alerts may be delayed</li>
</ul>

<p><strong>Preparation Checklist:</strong></p>
<ul>
<li>✅ All critical ETL jobs rescheduled</li>
<li>✅ Stakeholders notified via email</li>
<li>✅ Rollback procedures prepared</li>
<li>⏳ Final data backup in progress</li>
</ul>

<p><strong>Emergency Contacts:</strong></p>
<ul>
<li>On-call Engineer: +39-xxx-xxxx-xxx</li>
<li>System Admin: admin@company.com</li>
<li>Escalation: manager@company.com</li>
</ul>

<p><em>Post-maintenance validation will begin at 04:00 CET. Normal operations expected to resume by 06:00 CET.</em></p>
</div>`
            },
            importance: "high",
            sensitivity: "normal",
            showAs: "busy",
            type: "singleInstance",
            isAllDay: false,
            isCancelled: false,
            isOrganizer: true,
            responseRequested: true,
            seriesMasterId: null,
            categories: ["Maintenance", "System", "Critical"]
        },

        // Dev Sparrow's calendar events related to integration projects
        {
            id: "event_devsparrow1",
            subject: "PORTAEH-3305: Outlook Integration Development Session",
            start: {
                dateTime: "2025-11-06T08:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            end: {
                dateTime: "2025-11-06T12:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            location: {
                displayName: "Development Lab - Remote",
                address: null
            },
            organizer: {
                emailAddress: {
                    address: "devsparrow84@outlook.com",
                    name: "Dev Sparrow"
                }
            },
            attendees: [
                {
                    emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" },
                    status: { response: "accepted", time: "2025-11-05T10:30:00.000Z" }
                }
            ],
            body: {
                contentType: "html",
                content: `<div>
<h3>PORTAEH-3305: Outlook Integration Development Session</h3>

<p><strong>Focus Areas:</strong></p>
<ul>
<li>Complete OAuth 2.0 authentication implementation</li>
<li>Finalize email synchronization module</li>
<li>Test cross-system data linking with JIRA</li>
<li>Performance optimization and error handling</li>
</ul>

<p><strong>Agenda:</strong></p>
<ol>
<li><strong>Authentication Module</strong> (1 hour)
   <ul>
   <li>Token refresh mechanism</li>
   <li>Error handling for expired tokens</li>
   <li>Multi-tenant support testing</li>
   </ul>
</li>
<li><strong>Email Synchronization</strong> (2 hours)
   <ul>
   <li>Real-time sync implementation</li>
   <li>Delta queries for performance</li>
   <li>Conflict resolution strategies</li>
   </ul>
</li>
<li><strong>JIRA Integration Testing</strong> (1 hour)
   <ul>
   <li>Cross-reference validation</li>
   <li>Live data synchronization tests</li>
   <li>Error scenarios handling</li>
   </ul>
</li>
</ol>

<p><strong>Expected Deliverables:</strong></p>
<ul>
<li>Working OAuth authentication</li>
<li>Email sync functionality</li>
<li>Integration test results</li>
<li>Documentation updates</li>
</ul>
</div>`
            },
            importance: "high",
            sensitivity: "normal",
            showAs: "busy",
            type: "singleInstance",
            isAllDay: false,
            isCancelled: false,
            isOrganizer: true,
            responseRequested: false,
            seriesMasterId: null,
            categories: ["Development", "PORTAEH", "Integration"]
        },

        {
            id: "event_devsparrow2",
            subject: "Team Demo: Email Integration Module",
            start: {
                dateTime: "2025-11-10T14:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            end: {
                dateTime: "2025-11-10T15:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            location: {
                displayName: "Conference Room A / Teams Hybrid",
                address: null
            },
            organizer: {
                emailAddress: {
                    address: "devsparrow84@outlook.com",
                    name: "Dev Sparrow"
                }
            },
            attendees: [
                {
                    emailAddress: { address: "manager@company.com", name: "Project Manager" },
                    status: { response: "accepted", time: "2025-11-05T11:15:00.000Z" }
                },
                {
                    emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" },
                    status: { response: "accepted", time: "2025-11-05T11:20:00.000Z" }
                },
                {
                    emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" },
                    status: { response: "tentative", time: "2025-11-05T11:25:00.000Z" }
                },
                {
                    emailAddress: { address: "mani.s@company.com", name: "Mani S" },
                    status: { response: "accepted", time: "2025-11-05T11:30:00.000Z" }
                }
            ],
            body: {
                contentType: "html",
                content: `<div>
<h3>Team Demo: Email Integration Module</h3>

<p><strong>Demo Overview:</strong></p>
<p>Presentation of the completed Outlook Integration Module for the unified MCP server, including live demonstrations of cross-system functionality.</p>

<p><strong>Demo Agenda:</strong></p>
<ol>
<li><strong>Project Overview</strong> (5 minutes)
   <ul>
   <li>PORTAEH-3305 objectives and scope</li>
   <li>Technical architecture overview</li>
   <li>Integration points with existing systems</li>
   </ul>
</li>
<li><strong>Live Demonstration</strong> (40 minutes)
   <ul>
   <li>OAuth authentication flow</li>
   <li>Email retrieval and synchronization</li>
   <li>Cross-system data linking (JIRA ↔ Outlook)</li>
   <li>Team planner integration</li>
   <li>Real-time updates and notifications</li>
   </ul>
</li>
<li><strong>Technical Deep Dive</strong> (10 minutes)
   <ul>
   <li>Performance metrics and optimization</li>
   <li>Error handling and recovery</li>
   <li>Security and compliance features</li>
   </ul>
</li>
<li><strong>Q&A and Next Steps</strong> (5 minutes)</li>
</ol>

<p><strong>Preparation:</strong></p>
<ul>
<li>Live demo environment ready</li>
<li>Sample data prepared</li>
<li>Performance metrics collected</li>
<li>Documentation updated</li>
</ul>

<p><strong>Teams Link:</strong> <a href="https://teams.microsoft.com/l/meetup-join/devsparrow-demo">Join Demo Meeting</a></p>
</div>`
            },
            importance: "high",
            sensitivity: "normal",
            showAs: "busy",
            type: "singleInstance",
            isAllDay: false,
            isCancelled: false,
            isOrganizer: true,
            responseRequested: true,
            seriesMasterId: null,
            categories: ["Demo", "Team Meeting", "Development"]
        },

        {
            id: "event_devsparrow3",
            subject: "Cross-System Architecture Planning",
            start: {
                dateTime: "2025-11-08T10:00:00.000Z",
                timeZone: "Europe/Rome"
            },
            end: {
                dateTime: "2025-11-08T11:30:00.000Z",
                timeZone: "Europe/Rome"
            },
            location: {
                displayName: "Teams Meeting",
                address: null
            },
            organizer: {
                emailAddress: {
                    address: "devsparrow84@outlook.com",
                    name: "Dev Sparrow"
                }
            },
            attendees: [
                {
                    emailAddress: { address: "abrar.ulhaq@company.com", name: "Abrar ul haq N" },
                    status: { response: "accepted", time: "2025-11-05T12:00:00.000Z" }
                },
                {
                    emailAddress: { address: "dinesh.kumar@company.com", name: "Dinesh Kumar M" },
                    status: { response: "accepted", time: "2025-11-05T12:05:00.000Z" }
                }
            ],
            body: {
                contentType: "html",
                content: `<div>
<h3>Cross-System Architecture Planning Session</h3>

<p><strong>Meeting Purpose:</strong></p>
<p>Technical discussion for PORTAEH-3312: Cross-System Data Synchronization Enhancement planning and architecture design.</p>

<p><strong>Discussion Topics:</strong></p>
<ol>
<li><strong>Current Integration Points</strong> (15 minutes)
   <ul>
   <li>Review existing JIRA ↔ Confluence integration</li>
   <li>Analyze Outlook integration patterns</li>
   <li>Identify synchronization gaps</li>
   </ul>
</li>
<li><strong>Proposed Architecture</strong> (30 minutes)
   <ul>
   <li>Event-driven synchronization model</li>
   <li>Message queue implementation strategy</li>
   <li>Conflict resolution mechanisms</li>
   <li>Performance considerations</li>
   </ul>
</li>
<li><strong>Technical Requirements</strong> (30 minutes)
   <ul>
   <li>API rate limiting strategies</li>
   <li>Error handling and retry logic</li>
   <li>Monitoring and alerting systems</li>
   <li>Data consistency guarantees</li>
   </ul>
</li>
<li><strong>Implementation Plan</strong> (15 minutes)
   <ul>
   <li>Development phases</li>
   <li>Testing strategy</li>
   <li>Rollout timeline</li>
   </ul>
</li>
</ol>

<p><strong>Required Preparation:</strong></p>
<ul>
<li>Review current system architecture documentation</li>
<li>Prepare questions about integration requirements</li>
<li>Consider potential technical challenges</li>
</ul>

<p><strong>Expected Outcomes:</strong></p>
<ul>
<li>Approved architecture design</li>
<li>Technical implementation roadmap</li>
<li>Resource and timeline estimates</li>
<li>Risk assessment and mitigation strategies</li>
</ul>
</div>`
            },
            importance: "normal",
            sensitivity: "normal",
            showAs: "busy",
            type: "singleInstance",
            isAllDay: false,
            isCancelled: false,
            isOrganizer: true,
            responseRequested: true,
            seriesMasterId: null,
            categories: ["Architecture", "Planning", "Technical"]
        }
    ],

    // Search and filter helpers
    searchResults: {
        byFolder: (folderId, maxResults = 25) => {
            const filtered = outlookMockData.emails.filter(email =>
                email.parentFolderId === folderId
            );
            return {
                value: filtered.slice(0, maxResults),
                "@odata.count": filtered.length
            };
        },
        bySubject: (query, maxResults = 25) => {
            const filtered = outlookMockData.emails.filter(email =>
                email.subject.toLowerCase().includes(query.toLowerCase())
            );
            return {
                value: filtered.slice(0, maxResults),
                "@odata.count": filtered.length
            };
        },
        unreadEmails: (maxResults = 25) => {
            const filtered = outlookMockData.emails.filter(email => !email.isRead);
            return {
                value: filtered.slice(0, maxResults),
                "@odata.count": filtered.length
            };
        },
        byImportance: (importance, maxResults = 25) => {
            const filtered = outlookMockData.emails.filter(email =>
                email.importance === importance
            );
            return {
                value: filtered.slice(0, maxResults),
                "@odata.count": filtered.length
            };
        },
        calendarByDateRange: (startDate, endDate) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const filtered = outlookMockData.calendarEvents.filter(event => {
                const eventStart = new Date(event.start.dateTime);
                return eventStart >= start && eventStart <= end;
            });
            return {
                value: filtered,
                "@odata.count": filtered.length
            };
        }
    },

    // Email templates for common scenarios
    templates: {
        statusUpdate: {
            subject: "Status Update: {{taskId}} - {{taskTitle}}",
            body: `<div>
<p>Hi Team,</p>
<p>Here's the current status update for <strong>{{taskId}}</strong>:</p>
<h4>Current Status: {{status}}</h4>
<h4>Completed Items:</h4>
<ul>{{completedItems}}</ul>
<h4>Next Steps:</h4>
<ol>{{nextSteps}}</ol>
<p>Best regards,<br/>{{senderName}}</p>
</div>`
        },
        systemAlert: {
            subject: "🚨 ALERT: {{systemName}} - {{alertType}}",
            body: `<div>
<h3 style="color: #d73502;">⚠️ {{alertType}}: {{alertTitle}}</h3>
<p><strong>System:</strong> {{systemName}}</p>
<p><strong>Detected:</strong> {{timestamp}}</p>
<p><strong>Severity:</strong> {{severity}}</p>
<h4>Details:</h4>
<p>{{alertDetails}}</p>
<h4>Recommended Actions:</h4>
<ul>{{recommendedActions}}</ul>
</div>`
        },
        meetingRequest: {
            subject: "Meeting Request: {{meetingTitle}}",
            body: `<div>
<h3>{{meetingTitle}}</h3>
<p><strong>Purpose:</strong> {{purpose}}</p>
<p><strong>Agenda:</strong></p>
<ul>{{agendaItems}}</ul>
<p><strong>Preparation:</strong></p>
<ul>{{preparationItems}}</ul>
</div>`
        }
    }
};

module.exports = outlookMockData;


