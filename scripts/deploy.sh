#!/bin/bash
# LFTCM One-Click Deployment Script
# Usage: curl -fsSL https://raw.githubusercontent.com/klmayua/lftcm/main/scripts/deploy.sh | bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
INSTALL_DIR="/opt/lftcm"
DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-}"

# Logging
log() {
    echo -e "${BLUE}[LFTCM Deploy]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# System requirements check
check_requirements() {
    log "Checking system requirements..."

    # Check OS
    if ! [[ -f /etc/os-release ]]; then
        error "Cannot determine OS version"
    fi

    source /etc/os-release
    if ! [[ "$ID" =~ ^(ubuntu|debian)$ ]]; then
        warning "This script is designed for Ubuntu/Debian. Proceed with caution."
    fi

    # Check architecture
    if [[ $(uname -m) != "x86_64" ]]; then
        error "This script requires x86_64 architecture"
    fi

    # Check memory (minimum 2GB)
    local mem_gb
    mem_gb=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$mem_gb" -lt 2 ]; then
        error "Minimum 2GB RAM required (found ${mem_gb}GB)"
    fi

    # Check disk space (minimum 10GB)
    local disk_gb
    disk_gb=$(df / | awk 'NR==2 {print int($4/1024/1024)}')
    if [ "$disk_gb" -lt 10 ]; then
        error "Minimum 10GB free disk space required (found ${disk_gb}GB)"
    fi

    success "System requirements met"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."

    apt-get update
    apt-get install -y \
        curl \
        git \
        nginx \
        certbot \
        python3-certbot-nginx \
        ufw \
        fail2ban \
        logrotate \
        htop \
        ncdu \
        unzip

    # Install Docker
    if ! command -v docker > /dev/null 2>&1; then
        curl -fsSL https://get.docker.com | sh
        usermod -aG docker "${SUDO_USER:-$USER}"
    fi

    # Install Docker Compose
    if ! command -v docker-compose > /dev/null 2>&1; then
        apt-get install -y docker-compose-plugin
    fi

    success "Dependencies installed"
}

# Clone repository
clone_repo() {
    log "Cloning LFTCM repository..."

    if [ -d "$INSTALL_DIR" ]; then
        warning "Directory $INSTALL_DIR exists. Updating..."
        cd "$INSTALL_DIR"
        git pull origin main
    else
        mkdir -p "$INSTALL_DIR"
        git clone https://github.com/klmayua/lftcm.git "$INSTALL_DIR"
        cd "$INSTALL_DIR"
    fi

    success "Repository ready"
}

# Setup environment
setup_environment() {
    log "Setting up environment..."

    # Create directories
    mkdir -p backups
    mkdir -p logs
    mkdir -p apps/web/public/uploads

    # Generate secrets
    JWT_SECRET=$(openssl rand -base64 32)
    DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | fold -w 24 | head -n 1)

    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# LFTCM Production Environment
NODE_ENV=production

# Database
DB_USER=lftcm
DB_PASSWORD=$DB_PASSWORD
DB_NAME=lftcm_prod
DATABASE_URL=postgresql://lftcm:${DB_PASSWORD}@postgres:5432/lftcm_prod?schema=public

# Security
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# URLs (update with your domain)
APP_URL=https://${DOMAIN}
API_URL=https://api.${DOMAIN}
NEXT_PUBLIC_API_URL=https://api.${DOMAIN}
CORS_ORIGINS=https://${DOMAIN},https://api.${DOMAIN},https://admin.${DOMAIN}

# Payment (fill in production values)
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
MTN_MOMO_ENVIRONMENT=sandbox

# VNFTF
VNFTF_API_KEY=
VNFTF_WEBHOOK_SECRET=

# Logging
LOG_LEVEL=info
EOF

        chmod 600 .env
        success "Environment file created at .env"
        warning "Please edit .env with your actual domain and API keys"
    fi
}

# Configure firewall
setup_firewall() {
    log "Configuring firewall..."

    ufw default deny incoming
    ufw default allow outgoing
    ufw allow 22/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'

    # Enable UFW non-interactively
    echo "y" | ufw enable || true

    success "Firewall configured"
}

# Setup SSL
setup_ssl() {
    if [ -z "$DOMAIN" ]; then
        warning "No domain specified. Skipping SSL setup."
        return
    fi

    log "Setting up SSL certificates..."

    # Obtain certificate
    certbot certonly --nginx -d "$DOMAIN" -d "www.$DOMAIN" -d "api.$DOMAIN" --agree-tos --non-interactive --email "$EMAIL"

    # Setup auto-renewal
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet") | crontab -

    success "SSL certificates configured"
}

# Deploy application
deploy() {
    log "Deploying LFTCM ChurchOS..."

    # Build and start services
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d

    # Wait for database
    sleep 10

    # Run migrations
    docker-compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy || true

    # Health check
    sleep 5

    local api_health
    api_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health || echo "000")

    if [ "$api_health" = "200" ]; then
        success "Deployment successful!"
    else
        error "Health check failed. Check logs with: docker-compose -f docker-compose.prod.yml logs"
    fi
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."

    # Create health check cron job
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/lftcm/scripts/health-check.sh") | crontab -

    # Create backup cron job
    (crontab -l 2>/dev/null; echo "0 2 * * * /opt/lftcm/scripts/backup.sh") | crontab -

    success "Monitoring configured"
}

# Main
main() {
    echo "========================================"
    echo "  LFTCM ChurchOS - One-Click Deploy"
    echo "========================================"
    echo ""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain)
                DOMAIN="$2"
                shift 2
                ;;
            --email)
                EMAIL="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [--domain your-domain.com] [--email admin@example.com]"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done

    check_root
    check_requirements
    install_dependencies
    clone_repo
    setup_environment
    setup_firewall
    setup_ssl
    deploy
    setup_monitoring

    echo ""
    echo "========================================"
    echo "  Deployment Complete!"
    echo "========================================"
    echo ""
    echo "Your LFTCM instance is running at:"
    echo "  - Website: https://${DOMAIN}"
    echo "  - API: https://api.${DOMAIN}"
    echo ""
    echo "Next steps:"
    echo "  1. Edit $INSTALL_DIR/.env with your production values"
    echo "  2. Configure your DNS to point to this server"
    echo "  3. Restart services: cd $INSTALL_DIR && docker-compose -f docker-compose.prod.yml up -d"
    echo ""
    echo "Useful commands:"
    echo "  - View logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "  - Check health: ./scripts/health-check.sh"
    echo "  - Backup: ./scripts/backup.sh"
    echo ""
}

main "$@"
