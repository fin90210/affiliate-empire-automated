
#!/bin/bash

# Daily Automation Script for Affiliate Empire
# This script runs the daily automation workflow

# Set working directory
cd /home/ubuntu/affiliate_empire/app

# Load environment variables
source .env

# Create logs directory if it doesn't exist
mkdir -p logs

# Set log file with timestamp
LOG_FILE="logs/daily-$(date +%Y%m%d).log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Starting daily automation workflow..."

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    log "❌ Node.js not found. Please install Node.js."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log "❌ npm not found. Please install npm."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    log "📦 Installing dependencies..."
    npm install >> "$LOG_FILE" 2>&1
    if [ $? -ne 0 ]; then
        log "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Run the daily automation
log "🤖 Executing daily automation..."
npm run automation daily >> "$LOG_FILE" 2>&1

# Check exit code
if [ $? -eq 0 ]; then
    log "✅ Daily automation completed successfully"
    
    # Optional: Send success notification
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
             -H "Content-Type: application/json" \
             -d "{\"text\":\"✅ Daily automation completed successfully at $(date)\"}" \
             >> "$LOG_FILE" 2>&1
    fi
else
    log "❌ Daily automation failed"
    
    # Optional: Send failure notification
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
             -H "Content-Type: application/json" \
             -d "{\"text\":\"❌ Daily automation failed at $(date). Check logs: $LOG_FILE\"}" \
             >> "$LOG_FILE" 2>&1
    fi
    
    exit 1
fi

# Cleanup old logs (keep last 30 days)
find logs/ -name "daily-*.log" -mtime +30 -delete 2>/dev/null

log "🏁 Daily automation script completed"
