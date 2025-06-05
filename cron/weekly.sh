
#!/bin/bash

# Weekly Automation Script for Affiliate Empire
# This script runs the weekly automation workflow

# Set working directory
cd /home/ubuntu/affiliate_empire/app

# Load environment variables
source .env

# Create logs directory if it doesn't exist
mkdir -p logs

# Set log file with timestamp
LOG_FILE="logs/weekly-$(date +%Y%m%d).log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "📅 Starting weekly automation workflow..."

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    log "❌ Node.js not found. Please install Node.js."
    exit 1
fi

# Run the weekly automation
log "🤖 Executing weekly automation..."
npm run automation weekly >> "$LOG_FILE" 2>&1

# Check exit code
if [ $? -eq 0 ]; then
    log "✅ Weekly automation completed successfully"
    
    # Optional: Send success notification
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
             -H "Content-Type: application/json" \
             -d "{\"text\":\"📅 Weekly automation completed successfully at $(date)\"}" \
             >> "$LOG_FILE" 2>&1
    fi
else
    log "❌ Weekly automation failed"
    
    # Optional: Send failure notification
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
             -H "Content-Type: application/json" \
             -d "{\"text\":\"❌ Weekly automation failed at $(date). Check logs: $LOG_FILE\"}" \
             >> "$LOG_FILE" 2>&1
    fi
    
    exit 1
fi

# Cleanup old logs (keep last 12 weeks)
find logs/ -name "weekly-*.log" -mtime +84 -delete 2>/dev/null

log "🏁 Weekly automation script completed"
