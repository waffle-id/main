FROM node:20 AS base
WORKDIR /app

# Install dependencies required to build native modules and Puppeteer
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    ca-certificates \
    chromium \
    chromium-sandbox \
    sqlite3 libsqlite3-dev \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package files and install
COPY package.json ./
# COPY package-lock.json ./
# RUN npm ci

# Copy source code
COPY . .

RUN npm i

# Create a database directory if needed
RUN mkdir -p /app/data

# Expose app port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start"]
