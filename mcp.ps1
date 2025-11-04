# PowerShell wrapper for run-tool.js
# Usage: .\mcp.ps1 outlook.create-event --subject "Meeting" --attendees "user@domain.com"

param(
    [Parameter(Position=0)]
    [string]$Tool,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

# Set environment variables
$env:NODE_TLS_REJECT_UNAUTHORIZED = '0'

# Check if tool is provided
if (-not $Tool) {
    Write-Host "🛠️  MCP Tool Runner" -ForegroundColor Cyan
    Write-Host "Usage: .\mcp.ps1 <service.tool> [--param value]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\mcp.ps1 outlook.create-event --subject 'Meeting' --attendees 'user@domain.com'"
    Write-Host "  .\mcp.ps1 jira.jira_fetch_by_assignee --assignee 'Abrar ul haq N'"
    Write-Host "  .\mcp.ps1 --help"
    Write-Host ""
    node run-tool.js --help
    exit 0
}

# Run the tool with all arguments
$allArgs = @($Tool) + $Arguments
& node run-tool.js $allArgs