# Docker Deployment

Deploy Waffle using Docker containers for a consistent, scalable production environment.

## Prerequisites

- **Docker** v20.10 or higher
- **Docker Compose** v2.0 or higher
- **Git** for cloning the repository

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/waffle-id/main.git
cd waffle/main
```

### 2. Environment Configuration

```bash
# Copy environment files
cp engine/.env.example engine/.env
cp web/.env.example web/.env
cp scraper/.env.example scraper/.env

# Edit configuration files
nano engine/.env
```

### 3. Start Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

## Docker Compose Configuration

### Production docker-compose.yml

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:6.0
    container_name: waffle-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: waffle
    volumes:
      - mongodb_data:/data/db
      - ./mongodb/init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "27017:27017"
    networks:
      - waffle-network

  # Backend API
  engine:
    build:
      context: ./engine
      dockerfile: Dockerfile
      target: production
    container_name: waffle-engine
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:${MONGO_ROOT_PASSWORD}@mongodb:27017/waffle?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      TWITTER_CLIENT_ID: ${TWITTER_CLIENT_ID}
      TWITTER_CLIENT_SECRET: ${TWITTER_CLIENT_SECRET}
      PORT: 3001
    depends_on:
      - mongodb
    ports:
      - "3001:3001"
    volumes:
      - ./engine/uploads:/app/uploads
    networks:
      - waffle-network

  # Scraper Service
  scraper:
    build:
      context: ./scraper
      dockerfile: Dockerfile
    container_name: waffle-scraper
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3002
    volumes:
      - scraper_data:/app/data
    ports:
      - "3002:3002"
    networks:
      - waffle-network

  # Web Frontend
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
      target: production
    container_name: waffle-web
    restart: unless-stopped
    environment:
      NODE_ENV: production
      VITE_API_URL: ${VITE_API_URL}
      VITE_SCRAPER_URL: ${VITE_SCRAPER_URL}
    depends_on:
      - engine
      - scraper
    ports:
      - "80:3000"
    networks:
      - waffle-network

  # AI Analyzer (Optional)
  ai-analyzer:
    build:
      context: ./ai/review-analyzer
      dockerfile: Dockerfile
    container_name: waffle-ai
    restart: unless-stopped
    environment:
      PYTHONPATH: /app
      GRADIO_SERVER_PORT: 7860
    ports:
      - "7860:7860"
    networks:
      - waffle-network

  # Redis Cache (Optional)
  redis:
    image: redis:7-alpine
    container_name: waffle-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - waffle-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: waffle-nginx
    restart: unless-stopped
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    ports:
      - "443:443"
      - "80:80"
    depends_on:
      - web
      - engine
    networks:
      - waffle-network

volumes:
  mongodb_data:
  scraper_data:
  redis_data:

networks:
  waffle-network:
    driver: bridge
```

### Development docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_dev_data:/data/db

  engine:
    build:
      context: ./engine
      dockerfile: Dockerfile
      target: development
    volumes:
      - ./engine:/app
      - /app/node_modules
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://mongodb:27017/waffle_dev
    depends_on:
      - mongodb

  scraper:
    build:
      context: ./scraper
      dockerfile: Dockerfile
    volumes:
      - ./scraper:/app
      - /app/node_modules
    ports:
      - "3002:3002"
    environment:
      NODE_ENV: development

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
      target: development
    volumes:
      - ./web:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      NODE_ENV: development
    depends_on:
      - engine
      - scraper

volumes:
  mongodb_dev_data:
```

## Individual Service Dockerfiles

### Engine Dockerfile

```dockerfile
# engine/Dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS development
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Web Dockerfile

```dockerfile
# web/Dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Scraper Dockerfile

```dockerfile
# scraper/Dockerfile
FROM oven/bun:1-alpine

WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3002
CMD ["bun", "run", "src/index.ts"]
```

## Environment Variables

### .env Template

```bash
# Database
MONGO_ROOT_PASSWORD=your_secure_password
MONGODB_URI=mongodb://admin:your_secure_password@mongodb:27017/waffle?authSource=admin

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key

# Twitter Integration
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Frontend URLs
VITE_API_URL=https://api.yourdomain.com
VITE_SCRAPER_URL=https://scraper.yourdomain.com

# Domain Configuration
DOMAIN=yourdomain.com
SSL_EMAIL=admin@yourdomain.com
```

## Nginx Configuration

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream web {
        server web:3000;
    }
    
    upstream api {
        server engine:3001;
    }
    
    upstream scraper {
        server scraper:3002;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            proxy_pass http://api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /scraper/ {
            proxy_pass http://scraper/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## Management Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d engine

# Scale services
docker-compose up -d --scale engine=3
```

### Monitor Services

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f engine

# Monitor resource usage
docker stats
```

### Update Services

```bash
# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Update specific service
docker-compose up -d --build engine
```

### Backup and Restore

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup
docker cp waffle-mongodb:/backup ./backup

# Restore MongoDB
docker cp ./backup waffle-mongodb:/backup
docker-compose exec mongodb mongorestore /backup
```

## SSL Certificate Setup

### Using Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./nginx/ssl/key.pem
```

## Production Considerations

### Security

- Use strong passwords for all services
- Enable firewall rules for necessary ports only
- Regular security updates for base images
- Monitor for suspicious activity

### Performance

- Configure appropriate resource limits
- Use Redis for caching when needed
- Optimize database queries and indexes
- Monitor performance metrics

### Reliability

- Set up automated backups
- Configure health checks
- Implement log rotation
- Plan for disaster recovery

### Monitoring

- Set up container monitoring (Prometheus + Grafana)
- Configure alerting for critical issues
- Monitor application logs
- Track resource usage trends

---

This Docker deployment setup provides a robust, scalable foundation for running Waffle in production environments while maintaining ease of development and deployment.
