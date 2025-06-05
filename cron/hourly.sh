
#!/bin/bash

# Hourly Automation Script for Affiliate Empire
# This script runs hourly checks and light automation tasks

# Set working directory
cd /home/ubuntu/affiliate_empire/app

# Load environment variables
source .env

# Create logs directory if it doesn't exist
mkdir -p logs

# Set log file with timestamp
LOG_FILE="logs/hourly-$(date +%Y%m%d).log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Get current hour
HOUR=$(date +%H)

log "⏰ Starting hourly automation (Hour: $HOUR)..."

# Social media posting at optimal times
if [[ "$HOUR" == "09" || "$HOUR" == "12" || "$HOUR" == "15" || "$HOUR" == "18" ]]; then
    log "📱 Optimal posting time - running social media automation..."
    npm run automation task social >> "$LOG_FILE" 2>&1
    
    if [ $? -eq 0 ]; then
        log "✅ Social media automation completed"
    else
        log "❌ Social media automation failed"
    fi
fi

# Email sequence processing (every 4 hours)
if [[ "$HOUR" == "08" || "$HOUR" == "12" || "$HOUR" == "16" || "$HOUR" == "20" ]]; then
    log "📧 Processing email sequences..."
    npm run automation task email >> "$LOG_FILE" 2>&1
    
    if [ $? -eq 0 ]; then
        log "✅ Email sequences processed"
    else
        log "❌ Email sequence processing failed"
    fi
fi

# Health check every 6 hours
if [[ "$HOUR" == "06" || "$HOUR" == "12" || "$HOUR" == "18" || "$HOUR" == "00" ]]; then
    log "🏥 Running health check..."
    npm run automation health >> "$LOG_FILE" 2>&1
fi

# Cleanup old hourly logs (keep last 7 days)
find logs/ -name "hourly-*.log" -mtime +7 -delete 2>/dev/null

log "⏰ Hourly automation completed"
