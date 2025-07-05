# Quick Start Guide

Get up and running with Waffle in minutes! This guide will help you set up the entire Waffle ecosystem locally for development or testing.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **Bun** runtime (for scraper service)
- **MongoDB** database
- **Git** version control

### Optional

- **Docker & Docker Compose** (for containerized deployment)
- **Python 3.8+** (for AI services)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/waffle-id/main.git
cd waffle/main
```

### 2. Install Dependencies

Install dependencies for all services:

```bash
# Frontend (Web)
cd web
npm install
cd ..

# Backend (Engine)
cd engine
npm install
cd ..

# Scraper Service
cd scraper
bun install
cd ..

# AI Service (Optional)
cd ai/review-analyzer
pip install -r requirements.txt
cd ../..
```

### 3. Environment Configuration

Copy and configure environment variables:

```bash
# Backend environment
cp engine/.env.example engine/.env

# Frontend environment (if needed)
cp web/.env.example web/.env

# Scraper environment (if needed)
cp scraper/.env.example scraper/.env
```

Edit the environment files with your configuration:

```bash
# Example engine/.env
MONGODB_URI=mongodb://localhost:27017/waffle
JWT_SECRET=your-super-secret-jwt-key
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
PORT=3001
```

### 4. Database Setup

Start MongoDB (if not using Docker):

```bash
# macOS with Homebrew
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongo mongo:latest
```

### 5. Start Services

Start all services in separate terminals:

```bash
# Terminal 1: Frontend (Web)
cd web
npm run dev
# Runs on http://localhost:5173

# Terminal 2: Backend (Engine)
cd engine
npm run dev
# Runs on http://localhost:3001

# Terminal 3: Scraper Service
cd scraper
bun run dev
# Runs on http://localhost:3002

# Terminal 4: AI Service (Optional)
cd ai/review-analyzer
python app.py
# Runs on http://localhost:7860
```

## Verification

### Check Frontend

1. Open [http://localhost:5173](http://localhost:5173)
2. You should see the Waffle homepage
3. Try connecting a wallet (use a testnet)

### Check Backend API

```bash
curl http://localhost:3001/health
# Should return: {"status": "OK", "timestamp": "..."}
```

### Check Scraper Service

```bash
curl http://localhost:3002/health
# Should return: {"status": "OK", "service": "scraper"}
```

## Using Docker (Alternative)

If you prefer Docker, you can start everything with:

```bash
# Start all services
docker-compose up --build

# Or start in background
docker-compose up -d --build
```

This will automatically:

- Start MongoDB
- Build and run all services
- Set up networking between containers

## Next Steps

Once everything is running:

1. **Connect a Wallet**: Use MetaMask or another Web3 wallet on a testnet
2. **Link Twitter**: Authenticate with your Twitter account
3. **Explore Features**: Try creating reviews, earning badges, viewing leaderboards
4. **Check Profiles**: Visit profile pages in both `/profile/x/username` and `/profile/w/0x...` formats

## Common Issues

### Port Conflicts

If you encounter port conflicts, update the ports in:

- `web/vite.config.ts` (frontend)
- `engine/.env` (backend)
- `scraper/src/index.ts` (scraper)

### MongoDB Connection

Ensure MongoDB is running and accessible:

```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017/waffle
```

### Environment Variables

Double-check all required environment variables are set:

```bash
# Check if all env files exist
ls -la engine/.env web/.env scraper/.env
```

## Development Workflow

### Making Changes

1. **Frontend**: Changes auto-reload at [http://localhost:5173](http://localhost:5173)
2. **Backend**: Restart the engine service to see changes
3. **Scraper**: Restart the scraper service for updates
4. **Smart Contracts**: Use Foundry commands in the `contracts/` directory

### Testing

```bash
# Frontend tests
cd web && npm test

# Backend tests
cd engine && npm test

# Smart contract tests
cd contracts && forge test
```

## Production Deployment

For production deployment, see our [Production Setup Guide](../deployment/production.md).

---

🎉 **Congratulations!** You now have Waffle running locally. Start exploring the platform and building trust in the Web3 ecosystem!
