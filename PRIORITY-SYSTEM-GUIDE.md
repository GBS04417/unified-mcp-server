# 🚀 Advanced Priority System - User Guide

## 🎯 Overview

Your MCP server now includes a sophisticated **AI-powered priority system** that aggregates tasks from JIRA, Confluence, and Outlook, then uses intelligent scoring algorithms to prioritize what needs your attention most.

## ✨ Key Features

### **🧠 Smart Priority Scoring (0-100)**
- **JIRA Tasks**: Analyzes priority, overdue status, dependencies, assignees, and status
- **Confluence Pages**: Evaluates recent activity, @mentions, urgency tags, collaboration level
- **Outlook Emails**: Considers sender importance, flags, response time, action items, thread activity
- **AI Keyword Analysis**: Detects urgency keywords like "ASAP", "urgent", "critical", "immediate"

### **🎨 Urgency Levels**
- **🔴 URGENT (80-100)**: Immediate action required
- **🟠 HIGH (60-79)**: Address within 24 hours
- **🟡 MEDIUM (40-59)**: Schedule for this week
- **🟢 LOW (20-39)**: Monitor and plan

### **📊 Workload Capacity Analysis**
- **OPTIMAL**: Light workload, good balance
- **MODERATE**: Manageable workload
- **HIGH**: Busy day ahead
- **OVERLOADED**: Need to prioritize and delegate

## 🛠️ Available Commands

### **📱 Quick Commands**
```bash
# Smart daily check (urgent items only)
npm run smart-daily

# Complete priority analysis
npm run full-priority

# Dashboard data for UI
npm run dashboard

# Workload capacity analysis
npm run workload-analysis
```

### **🔧 Advanced Commands**
```bash
# Generate comprehensive priority report
node run-tool.js priority.generate_priority_report --focusUser "Your Name"

# Get only urgent and high priority items
node run-tool.js priority.get_urgent_items --focusUser "Your Name"

# Workload analysis with recommendations
node run-tool.js priority.workload_analysis --focusUser "Your Name"

# Dashboard-ready data
node run-tool.js priority.dashboard_data --focusUser "Your Name"

# Clear priority system cache
node run-tool.js priority.clear_cache
```

## 📋 Command Parameters

### **generate_priority_report**
- `focusUser`: Focus on specific user (e.g., "Abrar ul haq N")
- `includeGreeting`: Include personalized greeting (default: true)
- `maxItems`: Maximum items to return (default: 50)
- `minScore`: Minimum priority score threshold (default: 20)

### **get_urgent_items**
- `focusUser`: Focus on specific user
- `urgencyLevels`: Array of urgency levels to include (default: ["URGENT", "HIGH"])

## 📊 Understanding the Output

### **Priority Report Structure**
```json
{
  "greeting": "Good morning, Abrar! You have a busy day ahead...",
  "items": [
    {
      "id": "PORTAEH-3231",
      "source": "jira",
      "title": "EETL - Implement Logic for sources",
      "priorityScore": 85,
      "urgencyLevel": "URGENT",
      "daysOverdue": 2,
      "url": "https://jira.../browse/PORTAEH-3231",
      "metadata": {
        "aiReasoning": "High priority, 2 days overdue, contains urgent keywords"
      }
    }
  ],
  "summary": {
    "workloadCapacity": "HIGH",
    "urgentCount": 3,
    "averageScore": 67
  }
}
```

### **Workload Capacity Indicators**
- **🟢 OPTIMAL (0-30% avg score)**: Light day, good for planning
- **🟡 MODERATE (30-50% avg score)**: Normal workload
- **🟠 HIGH (50-70% avg score)**: Busy day, stay focused
- **🔴 OVERLOADED (70%+ avg score)**: Consider delegating

## 🎨 Dashboard Integration

### **UI-Ready Data**
```bash
npm run dashboard
```

Returns formatted data including:
- **Greeting**: Personalized time-based message
- **Capacity Indicator**: Visual workload gauge with colors
- **Urgency Badges**: Top 8 priority items with color coding
- **Statistics**: Count summaries and breakdowns
- **Recommendations**: AI-generated actionable suggestions

### **Color Coding**
- **Capacity**: 🔴 Overloaded | 🟠 High | 🟡 Moderate | 🟢 Optimal
- **Urgency**: 🔴 Urgent | 🟠 High | 🟡 Medium | 🟢 Low

## 🔥 Smart Features

### **1. Time-Decay Scoring**
Older overdue items automatically score higher to prevent them from being forgotten.

### **2. Context Multipliers**
- Client emails get priority boost
- Manager communications score higher
- Flagged items receive urgency multiplier

### **3. AI Keyword Detection**
Automatically detects urgency in text:
- **Critical**: "urgent", "critical", "emergency", "ASAP", "immediate"
- **High**: "important", "priority", "deadline", "escalation", "client"
- **Medium**: "follow up", "review", "update", "meeting"

### **4. Intelligent Caching**
- 15-minute cache for performance
- Smart cache invalidation
- Background data refresh

### **5. Cross-Platform Deduplication**
Prevents duplicate items across different sources.

## 📈 Scoring Algorithm Details

### **JIRA Task Scoring**
- **Priority Level (30%)**: Urgent/High/Medium/Low mapping
- **Overdue Status (25%)**: Exponential scoring for overdue days
- **Dependencies (15%)**: Blocking items score higher
- **Assignee Count (10%)**: Single assignee = higher focus
- **Status (20%)**: "In Progress" > "To Do" > others

### **Confluence Page Scoring**
- **Recent Activity (40%)**: Last 2 hours = max score
- **@Mentions (30%)**: User mentions increase priority
- **Urgency Tags (20%)**: "urgent", "critical" labels
- **Collaboration (10%)**: Version count indicates activity

### **Outlook Email Scoring**
- **Sender Importance (25%)**: Client/Manager detection
- **Flagged Status (20%)**: Flagged/High importance
- **Response Time (30%)**: Days waiting for response
- **Action Items (15%)**: Detected questions/requests
- **Thread Activity (10%)**: Conversation length

## 🚀 Real-World Usage Examples

### **Morning Routine**
```bash
npm run smart-daily
# Shows only urgent items to tackle first
```

### **Weekly Planning**
```bash
npm run full-priority
# Complete analysis for strategic planning
```

### **Before Meetings**
```bash
npm run workload-analysis
# Check capacity before committing to new tasks
```

### **Dashboard Display**
```bash
npm run dashboard
# Get formatted data for your productivity dashboard
```

## ⚙️ Configuration Options

### **Custom Scoring Weights**
You can adjust the scoring algorithm by modifying weights in the priority system initialization.

### **Cache Management**
```bash
# Clear cache if data seems stale
node run-tool.js priority.clear_cache
```

## 🎯 Best Practices

### **1. Daily Usage**
- Run `npm run smart-daily` each morning
- Focus on URGENT and HIGH items first
- Use workload analysis before planning new tasks

### **2. Weekly Review**
- Generate full priority reports for strategic planning
- Review overdue items and reschedule if needed
- Adjust priorities based on business changes

### **3. Capacity Management**
- If workload shows OVERLOADED, delegate or reschedule
- Use recommendations to improve time management
- Monitor average scores to track workload trends

## 📊 Performance

- **Data Collection**: ~2-5 seconds for all sources
- **Scoring**: ~100ms for 50 items
- **Caching**: 15-minute intelligent cache
- **Memory Usage**: Optimized for minimal footprint

---

**🎉 Your intelligent work prioritization system is ready!**

Transform your daily productivity with AI-powered priority insights that help you focus on what matters most.

```bash
npm run smart-daily  # Start here! 🚀
```