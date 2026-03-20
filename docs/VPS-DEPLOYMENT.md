# LFTCM ChurchOS VPS Deployment Guide

Optimized deployment guide for production VPS environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Docker Deployment](#docker-deployment)
4. [Nginx Configuration](#nginx-configuration)
5. [SSL/HTTPS Setup](#sslhttps-setup)
6. [Database Migration](#database-migration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup Strategy](#backup-strategy)
9. [Security Hardening](#security-hardening)

---

## Prerequisites

### Minimum VPS Requirements
- **CPU**: 2 cores
- **RAM**: 4GB (8GB recommended)
- **Storage**: 40GB SSD
- **OS**: Ubuntu 22.04 LTS or Debian 12
- **Network**: Public IP, ports 80/443 open

### Required Software
- Docker Engine 24.x
- Docker Compose v2.x
- Nginx
- Certbot (for SSL)

---

## Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx
```

### 2. Install Docker
```bash
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Clone Repository
```bash
cd /opt
sudo git clone https://github.com/klmayua/lftcm.git
sudo chown -R $USER:$USER /opt/lftcm
cd lftcm
```

---

## Docker Deployment

### 1. Environment Configuration
```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env

# Edit with production values
nano apps/api/.env
```

**Critical Production Variables:**
```env
# Database (use strong password)
DATABASE_URL="postgresql://lftcm_prod:STRONG_PASSWORD@postgres:5432/lftcm_prod?schema=public"

# Security (generate with: openssl rand -base64 32)
JWT_SECRET="YOUR_GENERATED_SECRET_HERE"

# Production URLs
APP_URL="https://your-domain.com"
API_URL="https://api.your-domain.com"
CORS_ORIGINS="https://your-domain.com,https://admin.your-domain.com"

# Payment APIs (production keys)
PAYSTACK_SECRET_KEY="sk_live_..."
MTN_MOMO_ENVIRONMENT="production"
```

### 2. Production Docker Compose
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Database Setup
```bash
# Generate Prisma client
docker-compose exec api npx prisma generate

# Run migrations
docker-compose exec api npx prisma migrate deploy

# Seed initial data (optional)
docker-compose exec api npx prisma db seed
```

---

## Nginx Configuration

### 1. Main Site Configuration
```bash
sudo nano /etc/nginx/sites-available/lftcm-web
```

```nginx
upstream web_frontend {
    server localhost:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static files caching
    location /_next/static {
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /static {
        proxy_pass http://web_frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main proxy
    location / {
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

### 2. API Configuration
```bash
sudo nano /etc/nginx/sites-available/lftcm-api
```

```nginx
upstream api_backend {
    server localhost:4000;
    keepalive 64;
}

server {
    listen 80;
    server_name api.your-domain.com;

    client_max_body_size 50M;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Health check
    location /health {
        proxy_pass http://api_backend;
        access_log off;
    }
}
```

### 3. Enable Sites
```bash
sudo ln -s /etc/nginx/sites-available/lftcm-web /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/lftcm-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## SSL/HTTPS Setup

### 1. Obtain Certificates
```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### 2. HTTP/2 Configuration
Add to nginx server blocks after SSL setup:
```nginx
listen 443 ssl http2;
```

---

## Database Migration

### Production Migration Strategy
```bash
# 1. Backup before migration
docker-compose exec postgres pg_dump -U lftcm lftcm_prod > backup_$(date +%Y%m%d).sql

# 2. Run migrations
docker-compose exec api npx prisma migrate deploy

# 3. Verify migration status
docker-compose exec api npx prisma migrate status
```

---

## Monitoring & Logging

### 1. Docker Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f api
docker-compose logs -f web

# Log rotation (create /etc/logrotate.d/docker)
sudo nano /etc/logrotate.d/docker-compose
```

```
/opt/lftcm/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
}
```

### 2. Health Monitoring
```bash
# Create health check script
nano /opt/lftcm/scripts/health-check.sh
```

```bash
#!/bin/bash
# Health check script

API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health)
WEB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$API_HEALTH" != "200" ]; then
    echo "API is down!" | mail -s "LFTCM Alert" admin@your-domain.com
fi

if [ "$WEB_HEALTH" != "200" ]; then
    echo "Web is down!" | mail -s "LFTCM Alert" admin@your-domain.com
fi
```

### 3. Systemd Service
```bash
sudo nano /etc/systemd/system/lftcm.service
```

```ini
[Unit]
Description=LFTCM ChurchOS
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/lftcm
ExecStart=/usr/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable lftcm
sudo systemctl start lftcm
```

---

## Backup Strategy

### 1. Database Backup
```bash
# Create backup script
nano /opt/lftcm/scripts/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/lftcm/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
docker-compose exec -T postgres pg_dump -U lftcm lftcm_prod | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

# Sync to remote (configure rclone first)
# rclone sync $BACKUP_DIR remote:lftcm-backups
```

```bash
chmod +x /opt/lftcm/scripts/backup.sh

# Cron job (daily at 2 AM)
0 2 * * * /opt/lftcm/scripts/backup.sh
```

---

## Security Hardening

### 1. Firewall Configuration
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2ban Setup
```bash
sudo apt install -y fail2ban

# Configure for nginx
sudo nano /etc/fail2ban/jail.local
```

```ini
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
action = iptables-multiport[name=nginx-http-auth,port="http,https"]
logpath = /var/log/nginx/error.log
bantime = 3600
maxretry = 3

[nginx-badbots]
enabled = true
port = http,https
filter = nginx-badbots
logpath = /var/log/nginx/access.log
maxretry = 2
```

```bash
sudo systemctl restart fail2ban
```

### 3. Docker Security
```bash
# Audit Docker containers
docker-bench-security

# Limit container resources in docker-compose.prod.yml
# Add to each service:
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

---

## Performance Tuning

### 1. PostgreSQL Optimization
Add to `docker-compose.prod.yml`:
```yaml
postgres:
  command: >
    postgres
    -c max_connections=100
    -c shared_buffers=256MB
    -c effective_cache_size=768MB
    -c maintenance_work_mem=64MB
    -c checkpoint_completion_target=0.9
    -c wal_buffers=16MB
    -c default_statistics_target=100
    -c random_page_cost=1.1
    -c effective_io_concurrency=200
    -c work_mem=2621kB
    -c min_wal_size=1GB
    -c max_wal_size=4GB
```

### 2. Redis Optimization
```yaml
redis:
  command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

### 3. Nginx Worker Processes
```nginx
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
}
```

---

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check postgres container
docker-compose logs postgres

# Verify network
docker network ls
docker inspect lftcm_default
```

**2. Prisma Migration Errors**
```bash
# Reset and reapply (CAUTION: Data loss)
docker-compose exec api npx prisma migrate reset

# Or mark as resolved
docker-compose exec api npx prisma migrate resolve --applied MIGRATION_NAME
```

**3. Out of Memory**
```bash
# Check memory usage
free -h
docker stats --no-stream

# Add swap file if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Quick Reference Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart service
docker-compose restart api

# Update deployment
git pull
docker-compose build
docker-compose up -d

# Database backup
docker-compose exec postgres pg_dump -U lftcm lftcm_prod > backup.sql

# Database restore
cat backup.sql | docker-compose exec -T postgres psql -U lftcm lftcm_prod

# Check disk space
df -h
docker system df

# Clean up old images
docker image prune -a
```

---

## Support

For issues and support:
- GitHub Issues: https://github.com/klmayua/lftcm/issues
- Documentation: https://docs.lftcm.org
- Email: support@lftcm.org
