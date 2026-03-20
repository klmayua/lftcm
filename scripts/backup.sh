#!/bin/bash
# LFTCM Database Backup Script
# Place in /opt/lftcm/scripts/backup.sh
# Run daily via cron: 0 2 * * * /opt/lftcm/scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="/opt/lftcm/backups"
COMPOSE_FILE="/opt/lftcm/docker-compose.prod.yml"
DB_USER="${DB_USER:-lftcm}"
DB_NAME="${DB_NAME:-lftcm_prod}"
RETENTION_DAYS=7
REMOTE_SYNC="${REMOTE_SYNC:-false}"  # Set to true to enable remote sync
REMOTE_PATH="${REMOTE_PATH:-r2:lftcm-backups}"  # rclone remote path
ALERT_EMAIL="${ALERT_EMAIL:-admin@lftcm.org}"

# Timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE=$(date +%Y-%m-%d)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
log() {
    echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Database backup
backup_database() {
    log "Starting database backup..."

    local backup_file="$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"

    if docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$backup_file"; then
        log "${GREEN}✓ Database backup completed: $backup_file${NC}"

        # Verify backup
        if gunzip -t "$backup_file" 2>/dev/null; then
            log "${GREEN}✓ Backup verified${NC}"
        else
            log "${RED}✗ Backup verification failed!${NC}"
            rm -f "$backup_file"
            return 1
        fi
    else
        log "${RED}✗ Database backup failed!${NC}"
        return 1
    fi
}

# Application backup (configs, uploads)
backup_application() {
    log "Starting application backup..."

    local backup_file="$BACKUP_DIR/app_${TIMESTAMP}.tar.gz"

    tar -czf "$backup_file" \
        -C /opt/lftcm \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='dist' \
        --exclude='backups/*.gz' \
        apps/web/public/uploads \
        2>/dev/null || true

    if [ -f "$backup_file" ]; then
        log "${GREEN}✓ Application backup completed: $backup_file${NC}"
    else
        log "${YELLOW}⚠ No application files to backup${NC}"
    fi
}

# Sync to remote storage
sync_remote() {
    if [ "$REMOTE_SYNC" = "true" ] && command -v rclone > /dev/null 2>&1; then
        log "Syncing to remote storage..."
        if rclone sync "$BACKUP_DIR" "$REMOTE_PATH" --progress; then
            log "${GREEN}✓ Remote sync completed${NC}"
        else
            log "${RED}✗ Remote sync failed${NC}"
        fi
    fi
}

# Cleanup old backups
cleanup() {
    log "Cleaning up old backups..."

    # Remove old database backups
    find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete

    # Remove old application backups
    find "$BACKUP_DIR" -name "app_*.tar.gz" -mtime +$RETENTION_DAYS -delete

    # Clean up Docker
    docker system prune -f --volumes >/dev/null 2>&1 || true

    log "${GREEN}✓ Cleanup completed${NC}"
}

# Calculate backup size
get_backup_size() {
    du -sh "$BACKUP_DIR" | cut -f1
}

# Send notification
notify() {
    local status="$1"
    local size
    size=$(get_backup_size)

    if [ -n "$ALERT_EMAIL" ]; then
        echo "Backup $status. Total backup size: $size" | \
        mail -s "LFTCM Backup $status" "$ALERT_EMAIL" || true
    fi
}

# Main execution
main() {
    log "=========================================="
    log "LFTCM Backup Starting..."
    log "=========================================="

    local exit_code=0

    # Run backups
    backup_database || exit_code=1
    backup_application
    sync_remote
    cleanup

    # Summary
    log "=========================================="
    if [ $exit_code -eq 0 ]; then
        log "${GREEN}Backup completed successfully${NC}"
        notify "SUCCESS"
    else
        log "${RED}Backup completed with errors${NC}"
        notify "FAILED"
    fi
    log "Total backup size: $(get_backup_size)"
    log "=========================================="

    return $exit_code
}

# Run main
main "$@"
