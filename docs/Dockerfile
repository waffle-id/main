# Build stage
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
RUN npm i -g pm2
COPY . .
RUN npm run build-alt

# Production stage
# FROM nginx:alpine

# Copy built static files
# COPY --from=builder /app/dist /app/builder

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Fix permissions for nginx user
# RUN mkdir -p /var/cache/nginx/client_temp /run && \
#     chown -R nginx:nginx /var/cache/nginx /run

# USER nginx

EXPOSE 8080

# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost:8080/health || exit 1

# CMD ["pm2", "start", "'npm run serve'", "--name", "docs"]

# RUN pm2 start "npm run serve" --name docs

CMD ["npm", "run", "serve"]

# CMD sleep infinity


