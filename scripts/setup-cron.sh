
#!/bin/bash

# Setup Cron Jobs for Affiliate Empire Automation
# This script configures all necessary cron jobs

echo "🔧 Setting up cron jobs for Affiliate Empire automation..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# Make scripts executable
chmod +x "$APP_DIR/cron/daily.sh"
chmod +x "$APP_DIR/cron/weekly.sh"
chmod +x "$APP_DIR/cron/hourly.sh"

# Create temporary cron file
TEMP_CRON=$(mktemp)

# Get existing cron jobs (excluding our automation jobs)
crontab -l 2>/dev/null | grep -v "# Affiliate Empire Automation" | grep -v "$APP_DIR/cron" > "$TEMP_CRON"

# Add our cron jobs
cat >> "$TEMP_CRON" << EOF

# Affiliate Empire Automation
# Generated on $(date)

# Hourly automation (social media, email sequences)
0 * * * * $APP_DIR/cron/hourly.sh

# Daily automation (content generation, full workflow)
0 6 * * * $APP_DIR/cron/daily.sh

# Weekly automation (keyword research, newsletter)
0 8 * * 1 $APP_DIR/cron/weekly.sh

# Health check twice daily
0 12,0 * * * cd $APP_DIR && npm run automation health

EOF

# Install the new cron jobs
crontab "$TEMP_CRON"

# Clean up
rm "$TEMP_CRON"

# Verify installation
echo "✅ Cron jobs installed successfully!"
echo ""
echo "📅 Scheduled automation:"
echo "  • Hourly: Social media and email sequences"
echo "  • Daily at 6:00 AM: Full content generation workflow"
echo "  • Weekly on Monday at 8:00 AM: Keyword research and newsletter"
echo "  • Health checks at 12:00 PM and 12:00 AM daily"
echo ""
echo "📋 Current cron jobs:"
crontab -l | grep -A 10 "Affiliate Empire Automation"
echo ""
echo "🔍 To view logs:"
echo "  • Daily: npm run logs:daily"
echo "  • Weekly: npm run logs:weekly"
echo "  • Hourly: npm run logs:hourly"
echo ""
echo "⚠️  Make sure to:"
echo "  1. Configure your .env file with API keys"
echo "  2. Test the automation manually first: npm run automation daily"
echo "  3. Monitor logs for the first few runs"
