FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    python3 \
    python3-pip \
    build-essential \
    make \
    g++ \
    curl \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install 
# --frozen-lockfile

# Copy source code
COPY . .

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create database directory
RUN mkdir -p /usr/src/app/data

# Expose port
EXPOSE 3001

# Start the application
CMD ["bun", "run", "start"]
