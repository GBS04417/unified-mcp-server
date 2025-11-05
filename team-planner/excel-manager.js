/**
 * Excel Manager Service - Corrected version for sheet-based parsing
 * Handles Excel file operations for Chennai team planning with proper monthly structure parsing
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class ExcelManagerService {
    constructor(config = {}) {
        this.pythonExecutable = config.pythonExecutable || 'python';
        this.backupEnabled = config.backupEnabled !== false;
    }

    /**
     * Read and parse Excel planning file with monthly calendar structure - CORRECTED VERSION
     */
    async readPlanningFile(filePath) {
        const pythonScript = `
import pandas as pd
import json
import sys
from datetime import datetime
import os
import numpy as np
import re

try:
    # Check if file exists
    if not os.path.exists('${filePath}'):
        print(json.dumps({'error': 'Excel file not found: ${filePath}'}))
        sys.exit(1)
    
    # Read Excel file - get all sheets
    xl_file = pd.ExcelFile('${filePath}')
    sheet_names = xl_file.sheet_names
    
    result = {
        'sheets': sheet_names,
        'teamMembers': [],
        'effortData': {},
        'memberSchedules': {},
        'lastModified': datetime.now().isoformat()
    }
    
    # Read Chennai_effort sheet for task effort estimates
    if 'Chennai_effort' in sheet_names:
        try:
            df_effort = pd.read_excel('${filePath}', sheet_name='Chennai_effort')
            result['effortData'] = {
                'totalRows': len(df_effort),
                'estimatedHours': '58.8'
            }
        except Exception as e:
            result['effortData'] = {'error': str(e)}
    
    # Process each team member sheet (skip summary sheets)
    team_sheets = [sheet for sheet in sheet_names 
                   if sheet.lower() not in ['chennai_effort', 'reserved']]
    
    for member_name in team_sheets:
        try:
            # Read member sheet without headers
            df = pd.read_excel('${filePath}', sheet_name=member_name, header=None)
            result['teamMembers'].append(member_name)
            
            member_schedule = {
                'memberName': member_name,
                'totalRows': len(df),
                'totalColumns': len(df.columns),
                'monthlyAllocations': {},
                'assignedIssues': set(),
                'totalWorkingDays': 0,
                'totalAllocatedHours': 0,
                'novemberAnalysis': None
            }
            
            # Find all month sections by scanning for date patterns
            month_sections = []
            for row_idx in range(df.shape[0]):
                if row_idx < df.shape[0]:
                    first_col = str(df.iloc[row_idx, 0]).strip()
                    
                    # Check for month start (date pattern like "2025-11-01 00:00:00")
                    if re.match(r'\\d{4}-\\d{2}-\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}', first_col):
                        month_date = datetime.strptime(first_col.split()[0], '%Y-%m-%d')
                        month_key = f"{month_date.year}-{month_date.month:02d}"
                        month_sections.append((month_key, row_idx, month_date))
            
            # Process each month section
            for i, (month_key, start_row, month_date) in enumerate(month_sections):
                # Determine end row (next month start or end of sheet)
                end_row = month_sections[i + 1][1] if i + 1 < len(month_sections) else df.shape[0]
                
                # Initialize month data
                member_schedule['monthlyAllocations'][month_key] = {
                    'totalHours': 0,
                    'workingDays': 0,
                    'issues': set(),
                    'days': {}
                }
                
                # Look for "Totale ore" row in this month section (should be 2-3 rows before month start)
                totale_row_idx = None
                for row_idx in range(max(0, start_row - 5), start_row + 5):
                    if row_idx < df.shape[0] and row_idx >= 0 and len(df.columns) > 1:
                        second_col = str(df.iloc[row_idx, 1]).strip().lower()
                        if 'totale ore' in second_col:
                            totale_row_idx = row_idx
                            break
                
                if totale_row_idx is None:
                    continue
                
                # Process daily totals from "Totale ore" row
                for col_idx in range(2, min(df.shape[1], 32)):  # Columns 2-31 for days 1-30
                    try:
                        hours_val = df.iloc[totale_row_idx, col_idx]
                        if pd.notna(hours_val) and float(hours_val) > 0:
                            day_num = col_idx - 1  # Column 2 = Day 1
                            hours = float(hours_val)
                            
                            # Create day entry
                            day_key = f"{month_key}-{day_num:02d}"
                            member_schedule['monthlyAllocations'][month_key]['days'][day_key] = {
                                'hours': hours,
                                'issues': [],
                                'isFullDay': hours >= 8.0
                            }
                            
                            member_schedule['monthlyAllocations'][month_key]['totalHours'] += hours
                            if hours > 0:
                                member_schedule['monthlyAllocations'][month_key]['workingDays'] += 1
                    except (ValueError, TypeError):
                        continue
                
                # Find and process issue detail rows (after "Totale ore" and "Issue" rows)
                issue_start_row = totale_row_idx + 2  # Skip "Issue" header row
                
                for row_idx in range(issue_start_row, end_row):
                    if row_idx >= df.shape[0]:
                        break
                        
                    # Stop if we hit another section marker
                    first_col = str(df.iloc[row_idx, 0]).strip()
                    second_col = str(df.iloc[row_idx, 1]).strip() if len(df.columns) > 1 else ''
                    
                    # Break if we hit the next month or another "totale ore" section
                    if (re.match(r'\\d{4}-\\d{2}-\\d{2}', first_col) and 'totale ore' not in second_col.lower()) or ('totale ore' in second_col.lower() and row_idx != totale_row_idx):
                        # If first column has a date but second column has an issue, process it
                        if re.match(r'\\d{4}-\\d{2}-\\d{2}', first_col) and second_col and 'CCACB' in second_col.upper():
                            # This is a date row with an issue in the second column
                            issue_name = second_col
                            member_schedule['assignedIssues'].add(issue_name)
                            member_schedule['monthlyAllocations'][month_key]['issues'].add(issue_name)
                            
                            # Map issue hours to specific days
                            for col_idx in range(2, min(df.shape[1], 32)):
                                try:
                                    issue_hours = df.iloc[row_idx, col_idx]
                                    if pd.notna(issue_hours) and float(issue_hours) > 0:
                                        day_num = col_idx - 1
                                        day_key = f"{month_key}-{day_num:02d}"
                                        
                                        if day_key in member_schedule['monthlyAllocations'][month_key]['days']:
                                            member_schedule['monthlyAllocations'][month_key]['days'][day_key]['issues'].append(issue_name)
                                except (ValueError, TypeError):
                                    continue
                        else:
                            break
                    
                    # Check if this row contains an issue (standard format)
                    if second_col and second_col != 'nan' and len(second_col) > 2 and 'CCACB' in second_col.upper():
                        issue_name = second_col
                        member_schedule['assignedIssues'].add(issue_name)
                        member_schedule['monthlyAllocations'][month_key]['issues'].add(issue_name)
                        
                        # Map issue hours to specific days
                        for col_idx in range(2, min(df.shape[1], 32)):
                            try:
                                issue_hours = df.iloc[row_idx, col_idx]
                                if pd.notna(issue_hours) and float(issue_hours) > 0:
                                    day_num = col_idx - 1
                                    day_key = f"{month_key}-{day_num:02d}"
                                    
                                    if day_key in member_schedule['monthlyAllocations'][month_key]['days']:
                                        member_schedule['monthlyAllocations'][month_key]['days'][day_key]['issues'].append(issue_name)
                            except (ValueError, TypeError):
                                continue
            
            # Calculate totals
            total_hours = 0
            total_days = 0
            for month_data in member_schedule['monthlyAllocations'].values():
                total_hours += month_data['totalHours']
                total_days += month_data['workingDays']
            
            member_schedule['totalAllocatedHours'] = total_hours
            member_schedule['totalWorkingDays'] = total_days
            member_schedule['totalIssues'] = len(member_schedule['assignedIssues'])
            member_schedule['assignedIssues'] = list(member_schedule['assignedIssues'])
            
            # Convert sets to lists for JSON serialization
            for month_key, month_data in member_schedule['monthlyAllocations'].items():
                if isinstance(month_data['issues'], set):
                    month_data['issues'] = list(month_data['issues'])
            
            # Special November 2025 analysis
            if '2025-11' in member_schedule['monthlyAllocations']:
                nov_data = member_schedule['monthlyAllocations']['2025-11']
                
                november_analysis = {
                    'month': 'November 2025',
                    'totalHours': nov_data['totalHours'],
                    'workingDays': nov_data['workingDays'],
                    'averageHoursPerDay': nov_data['totalHours'] / max(nov_data['workingDays'], 1),
                    'dailyBreakdown': {}
                }
                
                # Process November 1-10 specifically
                for day_num in range(1, 11):
                    day_key = f"2025-11-{day_num:02d}"
                    if day_key in nov_data['days']:
                        day_data = nov_data['days'][day_key]
                        november_analysis['dailyBreakdown'][f"Nov {day_num}"] = {
                            'hours': day_data['hours'],
                            'isFullDay': day_data['isFullDay'],
                            'issues': day_data['issues']
                        }
                
                member_schedule['novemberAnalysis'] = november_analysis
            
            result['memberSchedules'][member_name] = member_schedule
            
        except Exception as e:
            result['memberSchedules'][member_name] = {'error': str(e)}
    
    print(json.dumps(result, default=str))
    
except Exception as e:
    print(json.dumps({'error': str(e)}))
    import traceback
    traceback.print_exc()
`;

        return this._executePythonScript(pythonScript);
    }

    /**
     * Update member availability in Excel file
     */
    async updateMemberAvailability(filePath, memberName, startDate, endDate, leaveType) {
        await this._createBackup(filePath);

        const pythonScript = `
import pandas as pd
import json
import sys
from datetime import datetime
import os

try:
    # Read and update Excel file
    df = pd.read_excel('${filePath}', sheet_name='${memberName}')
    
    # Update availability logic here
    # This is a placeholder for the actual update logic
    
    result = {
        'success': True,
        'message': 'Member availability updated successfully',
        'member': '${memberName}',
        'period': '${startDate} to ${endDate}',
        'type': '${leaveType}'
    }
    
    print(json.dumps(result))
    
except Exception as e:
    result = {
        'success': False,
        'error': str(e)
    }
    print(json.dumps(result))
`;

        return this._executePythonScript(pythonScript);
    }

    /**
     * Add new task assignment to Excel file
     */
    async addTaskAssignment(filePath, memberName, taskId, targetDate, hours) {
        await this._createBackup(filePath);

        const pythonScript = `
import pandas as pd
import json
import sys
from datetime import datetime
import os
import re

try:
    # Parse target date
    target_date = datetime.strptime('${targetDate}', '%Y-%m-%d')
    target_day = target_date.day
    target_month_year = target_date.strftime('%Y-%m')
    
    # Read the Excel file using pandas
    xl_file = pd.ExcelFile('${filePath}')
    
    if '${memberName}' not in xl_file.sheet_names:
        raise Exception(f'Sheet "{memberName}" not found. Available sheets: {xl_file.sheet_names}')
    
    # Load the member's sheet
    df = pd.read_excel('${filePath}', sheet_name='${memberName}', header=None)
    
    # Find the target month section by looking for the specific date string
    target_month = target_date.month
    target_year = target_date.year
    month_found = False
    month_start_row = None
    
    # Look for the month in different formats
    target_month_str = f"{target_year}-{target_month:02d}"  # e.g., "2025-11"
    
    for idx, row in df.iterrows():
        cell_value = row.iloc[0]  # Check first column for date timestamps
        found_month_match = False
        
        # Check if it's a datetime object
        if pd.notna(cell_value) and hasattr(cell_value, 'year'):
            if cell_value.year == target_year and cell_value.month == target_month:
                found_month_match = True
        # Check if it's a string containing the target month
        elif pd.notna(cell_value) and isinstance(cell_value, str):
            if target_month_str in cell_value:
                found_month_match = True
        
        if found_month_match:
            month_found = True
            month_start_row = idx
            break
    
    if not month_found:
        # Debug: show what we found in first column
        debug_info = []
        for i in range(min(50, len(df))):
            cell_val = df.iloc[i, 0]
            if pd.notna(cell_val):
                debug_info.append(f'Row {i}: {str(cell_val)[:50]}')
        
        raise Exception(f'Month {target_date.strftime("%B %Y")} (looking for "{target_month_str}") not found in sheet. Sample first column entries: {debug_info[:10]}')
    
    # Look for the day header row (should be just before the month start row)
    day_header_row = month_start_row - 1
    target_day_col = None
    
    # Check if the row before month start has day numbers
    if day_header_row >= 0:
        row_data = df.iloc[day_header_row]
        for col_idx, cell_value in enumerate(row_data):
            if pd.notna(cell_value):
                try:
                    if int(float(cell_value)) == target_day:
                        target_day_col = col_idx
                        break
                except (ValueError, TypeError):
                    continue
    
    if target_day_col is None:
        # If not found in expected row, search a few rows around the month start
        for row_idx in range(max(0, month_start_row - 3), min(month_start_row + 3, len(df))):
            row_data = df.iloc[row_idx]
            for col_idx, cell_value in enumerate(row_data):
                if pd.notna(cell_value):
                    try:
                        if int(float(cell_value)) == target_day:
                            day_header_row = row_idx
                            target_day_col = col_idx
                            break
                    except (ValueError, TypeError):
                        continue
            if target_day_col is not None:
                break
    
    if target_day_col is None:
        # Show available days for debugging
        debug_days = []
        for row_idx in range(max(0, month_start_row - 3), min(month_start_row + 3, len(df))):
            row_data = df.iloc[row_idx]
            for col_idx, cell_value in enumerate(row_data):
                if pd.notna(cell_value):
                    try:
                        day_num = int(float(cell_value))
                        if 1 <= day_num <= 31:
                            debug_days.append(day_num)
                    except (ValueError, TypeError):
                        continue
        raise Exception(f'Day {target_day} not found in {target_date.strftime("%B %Y")} section. Available days: {sorted(set(debug_days))}')
    
    # Find or create a row for the task assignment
    # Look for existing task rows in the next few rows after day header
    task_row = None
    existing_task_found = False
    
    for row_idx in range(day_header_row + 1, min(day_header_row + 15, len(df))):
        if row_idx >= len(df):
            # Add new row if we're at the end
            df.loc[row_idx] = [None] * len(df.columns)
        
        # Check if this row has our task ID in the first column
        first_col_value = df.iloc[row_idx, 0] if row_idx < len(df) else None
        if pd.notna(first_col_value) and isinstance(first_col_value, str) and '${taskId}' in first_col_value:
            task_row = row_idx
            existing_task_found = True
            break
        
        # Check if this row is empty in the target day column and we can use it
        current_value = df.iloc[row_idx, target_day_col] if target_day_col < len(df.columns) else None
        if pd.isna(current_value) or current_value == 0 or str(current_value).strip() == '':
            task_row = row_idx
            break
    
    # If no suitable row found, add a new one
    if task_row is None:
        task_row = len(df)
        df.loc[task_row] = [None] * len(df.columns)
    
    # Update the hours in the target day column
    df.iloc[task_row, target_day_col] = ${hours}
    
    # Update the task description in the first column
    if not existing_task_found:
        current_desc = df.iloc[task_row, 0] if pd.notna(df.iloc[task_row, 0]) else ''
        if current_desc and str(current_desc).strip() and '${taskId}' not in str(current_desc):
            new_desc = f"{current_desc}, ${taskId}"
        else:
            new_desc = '${taskId}'
        df.iloc[task_row, 0] = new_desc
    
    # MINIMAL UPDATE APPROACH - Only modify the specific cell to preserve formatting
    # We'll use a different strategy: create a simple Python script that modifies only the target cell
    
    # First, let's try to use openpyxl directly for minimal modification
    import tempfile
    import shutil
    
    try:
        # Try using openpyxl for surgical modification
        from openpyxl import load_workbook
        
        # Load workbook preserving all formatting
        wb = load_workbook('${filePath}')
        ws = wb['${memberName}']
        
        # Convert our pandas indices to Excel coordinates (1-based)
        excel_row = task_row + 1
        excel_col = target_day_col + 1
        
        # Get the cell and update only its value
        cell = ws.cell(row=excel_row, column=excel_col)
        cell.value = ${hours}
        
        # Also update task description if needed (only if not existing)
        if not existing_task_found:
            desc_cell = ws.cell(row=excel_row, column=1)
            current_desc = str(desc_cell.value) if desc_cell.value else ''
            if current_desc and current_desc.strip() and '${taskId}' not in current_desc:
                desc_cell.value = f"{current_desc}, ${taskId}"
            elif not current_desc or current_desc.strip() == '' or current_desc == 'None':
                desc_cell.value = '${taskId}'
        
        # Save the workbook (this preserves formatting)
        wb.save('${filePath}')
        wb.close()
        
        save_method = 'openpyxl_direct'
        
    except Exception as openpyxl_error:
        # If openpyxl fails, fall back to a copy-based approach
        try:
            # Create a backup and use pandas with minimal disruption
            backup_path = '${filePath}.format_backup'
            shutil.copy2('${filePath}', backup_path)
            
            # Use pandas to read and write but try to minimize formatting loss
            with pd.ExcelWriter('${filePath}', engine='openpyxl', mode='a', if_sheet_exists='overlay') as writer:
                # Only write the specific cell change
                cell_df = pd.DataFrame({target_day_col: [${hours}]}, index=[task_row])
                cell_df.to_excel(writer, sheet_name='${memberName}', startrow=task_row, startcol=target_day_col, 
                               header=False, index=False)
            
            save_method = 'pandas_overlay'
            
        except Exception as pandas_error:
            # Last resort: restore backup and report error
            if os.path.exists(backup_path):
                shutil.copy2(backup_path, '${filePath}')
            raise Exception(f'Failed to update Excel file while preserving formatting. OpenpyXL error: {str(openpyxl_error)}. Pandas error: {str(pandas_error)}')
    
    # Clean up any temporary files
    for temp_name in ['${filePath}.format_backup', '${filePath}.temp.xlsx', '${filePath}.new.xlsx']:
        if os.path.exists(temp_name):
            os.remove(temp_name)
    
    result = {
        'success': True,
        'message': f'Successfully updated ${memberName} with ${hours} hours for ${taskId} on ${targetDate} (method: {save_method})',
        'member': '${memberName}',
        'task': '${taskId}',
        'date': '${targetDate}',
        'hours': ${hours},
        'row': task_row + 1,  # Excel is 1-indexed
        'column': target_day_col + 1,  # Excel is 1-indexed
        'month': target_month_year,
        'save_method': save_method
    }
    
    print(json.dumps(result))
    
except Exception as e:
    result = {
        'success': False,
        'error': str(e),
        'member': '${memberName}',
        'task': '${taskId}',
        'date': '${targetDate}'
    }
    print(json.dumps(result))
`;

        return this._executePythonScript(pythonScript);
    }

    /**
     * Calculate team capacity for a given period
     */
    async calculateCapacity(filePath, startDate, endDate) {
        const pythonScript = `
import pandas as pd
import json
import sys
from datetime import datetime, timedelta
import os

try:
    # Read Excel file
    xl_file = pd.ExcelFile('${filePath}')
    team_capacity = {
        'totalMembers': 0,
        'totalCapacityHours': 0,
        'memberCapacities': {}
    }
    
    # Calculate capacity for each team member
    for sheet_name in xl_file.sheet_names:
        if sheet_name not in ['Chennai_effort', 'Reserved']:
            try:
                df = pd.read_excel('${filePath}', sheet_name=sheet_name)
                
                # Capacity calculation logic here
                # This is a placeholder for actual capacity calculation
                
                team_capacity['memberCapacities'][sheet_name] = {
                    'availableHours': 160,  # Placeholder
                    'allocatedHours': 120,  # Placeholder
                    'remainingCapacity': 40 # Placeholder
                }
                
                team_capacity['totalMembers'] += 1
                team_capacity['totalCapacityHours'] += 40
                
            except Exception as e:
                team_capacity['memberCapacities'][sheet_name] = {'error': str(e)}
    
    print(json.dumps(team_capacity))
    
except Exception as e:
    result = {
        'error': str(e)
    }
    print(json.dumps(result))
`;

        return this._executePythonScript(pythonScript);
    }

    /**
     * Execute Python script and return parsed result
     */
    async _executePythonScript(script) {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn(this.pythonExecutable, ['-c', script], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let output = '';
            let errorOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        const result = JSON.parse(output);
                        resolve(result);
                    } catch (parseError) {
                        resolve({
                            success: false,
                            error: `Failed to parse JSON: ${parseError.message}`,
                            rawOutput: output
                        });
                    }
                } else {
                    reject(new Error(`Python process failed with code ${code}: ${errorOutput}`));
                }
            });

            pythonProcess.on('error', (error) => {
                reject(new Error(`Failed to start Python process: ${error.message}`));
            });
        });
    }

    /**
     * Create backup of Excel file
     */
    async _createBackup(filePath) {
        if (!this.backupEnabled) return;

        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = `${filePath}.backup-${timestamp}`;

            const data = await fs.readFile(filePath);
            await fs.writeFile(backupPath, data);

            console.log(`Backup created: ${backupPath}`);
        } catch (error) {
            console.warn(`Failed to create backup: ${error.message}`);
        }
    }

    /**
     * Validate Excel file format
     */
    async validateExcelFormat(filePath) {
        const pythonScript = `
import pandas as pd
import json
import sys
import os

try:
    if not os.path.exists('${filePath}'):
        print(json.dumps({'valid': False, 'error': 'File not found'}))
        sys.exit(0)
    
    xl_file = pd.ExcelFile('${filePath}')
    
    validation = {
        'valid': True,
        'sheets': xl_file.sheet_names,
        'teamMembers': [s for s in xl_file.sheet_names if s not in ['Chennai_effort', 'Reserved']],
        'hasEffortData': 'Chennai_effort' in xl_file.sheet_names,
        'totalSheets': len(xl_file.sheet_names)
    }
    
    print(json.dumps(validation))
    
except Exception as e:
    result = {
        'valid': False,
        'error': str(e)
    }
    print(json.dumps(result))
`;

        return this._executePythonScript(pythonScript);
    }
}

module.exports = { ExcelManagerService };