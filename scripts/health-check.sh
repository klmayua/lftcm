#!/bin/bash
# LFTCM ChurchOS Health Check Script
# Place in /opt/lftcm/scripts/health-check.sh

set -e

# Configuration
API_URL="http://localhost:4000/health"
WEB_URL="http://localhost:3000"
ALERT_EMAIL="${ALERT_EMAIL:-admin@lftcm.org}"
LOG_FILE="/var/log/lftcm-health.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $1" | tee -a "$LOG_FILE"
}

# Check if running as root (optional)
if [[ $EUID -eq 0 ]]; then
   log "Warning: Running as root is not required"
fi

# Check API health
check_api() {
    local response
    local status

    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" || echo "000")
    status=$response

    if [ "$status" = "200" ]; then
        log "${GREEN}✓ API is healthy${NC}"
        return 0
    else
        log "${RED}✗ API is down (HTTP $status)${NC}"
        return 1
    fi
}

# Check Web health
check_web() {
    local response
    local status

    response=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL" || echo "000")
    status=$response

    if [ "$status" = "200" ] || [ "$status" = "307" ]; then
        log "${GREEN}✓ Web frontend is healthy${NC}"
        return 0
    else
        log "${RED}✗ Web frontend is down (HTTP $status)${NC}"
        return 1
    fi
}

# Check database
check_database() {
    if docker-compose -f /opt/lftcm/docker-compose.prod.yml exec -T postgres pg_isready -U lftcm > /dev/null 2>&1; then
        log "${GREEN}✓ Database is healthy${NC}"
        return 0
    else
        log "${RED}✗ Database is not responding${NC}"
        return 1
    fi
}

# Check Redis
check_redis() {
    if docker-compose -f /opt/lftcm/docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        log "${GREEN}✓ Redis is healthy${NC}"
        return 0
    else
        log "${RED}✗ Redis is not responding${NC}"
        return 1
    fi
}

# Check disk space
check_disk_space() {
    local usage
    usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ "$usage" -gt 90 ]; then
        log "${RED}✗ CRITICAL: Disk usage is at ${usage}%${NC}"
        return 1
    elif [ "$usage" -gt 80 ]; then
        log "${YELLOW}⚠ WARNING: Disk usage is at ${usage}%${NC}"
        return 0
    else
        log "${GREEN}✓ Disk usage is at ${usage}%${NC}"
        return 0
    fi
}

# Check memory usage
check_memory() {
    local usage
    usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')

    if [ "$usage" -gt 90 ]; then
        log "${RED}✗ CRITICAL: Memory usage is at ${usage}%${NC}"
        return 1
    elif [ "$usage" -gt 80 ]; then
        log "${YELLOW}⚠ WARNING: Memory usage is at ${usage}%${NC}"
        return 0
    else
        log "${GREEN}✓ Memory usage is at ${usage}%${NC}"
        return 0
    fi
}

# Check SSL certificate expiry
check_ssl() {
    local domain="${DOMAIN:-your-domain.com}"
    local expiry_date
    local days_until_expiry

    if command -v openssl > /dev/null 2>&1; then
        expiry_date=$(echo | openssl s_client -servername "$domain" -connect "$domain":443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
        days_until_expiry=$(( ($(date -d "$expiry_date" +%s) - $(date +%s)) / 86400 ))

        if [ "$days_until_expiry" -lt 7 ]; then
            log "${RED}✗ CRITICAL: SSL certificate expires in $days_until_expiry days${NC}"
            return 1
        elif [ "$days_until_expiry" -lt 30 ]; then
            log "${YELLOW}⚠ WARNING: SSL certificate expires in $days_until_expiry days${NC}"
            return 0
        else
            log "${GREEN}✓ SSL certificate valid for $days_until_expiry days${NC}"
            return 0
        fi
    fi
}

# Send alert
send_alert() {
    local message="$1"
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "LFTCM Health Alert" "$ALERT_EMAIL" || true
    fi
}

# Main execution
main() {
    local exit_code=0

    log "=========================================="
    log "LFTCM Health Check Starting..."
    log "=========================================="

    # Run all checks
    check_api || exit_code=1
    check_web || exit_code=1
    check_database || exit_code=1
    check_redis || exit_code=1
    check_disk_space || exit_code=1
    check_memory || exit_code=1
    check_ssl || exit_code=1

    log "=========================================="
    if [ $exit_code -eq 0 ]; then
        log "${GREEN}All systems operational${NC}"
    else
        log "${RED}Some systems are experiencing issues${NC}"
        send_alert "LFTCM Health Check Failed. Check logs at $LOG_FILE"
    fi
    log "=========================================="

    return $exit_code
}

# Run main function
main "$@"
