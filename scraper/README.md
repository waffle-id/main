# 🧇 Waffle Scraper Service

A high-performance Twitter/X profile scraper service built with Bun, Hono, and SQLite. This standalone service provides reliable Twitter profile data extraction with intelligent caching for the Waffle platform.

## 🌟 Features

- **🚀 Blazing Fast**: Built with Bun runtime for maximum performance
- **🗄️ Intelligent Caching**: 24-hour TTL with SQLite storage
- **🎯 TypeScript**: Full type safety and modern development
- **🌐 CORS Ready**: Frontend integration enabled
- **📊 Comprehensive Data**: Full Twitter profile scraping
- **�️ Quick Avatar Access**: Dedicated avatar endpoint
- **🔄 Force Refresh**: Bypass cache when needed
- **💾 Persistent Storage**: SQLite database with Drizzle ORM

## 🚀 Tech Stack

### Runtime & Framework

- **Bun** - Ultra-fast JavaScript runtime and package manager
- **Hono** - Lightweight, fast web framework
- **TypeScript** - Type-safe development

### Database & ORM

- **SQLite** - Embedded database for caching
- **Drizzle ORM** - Type-safe database queries
- **Better SQLite3** - High-performance SQLite driver

### Web Scraping

- **Puppeteer** - Headless browser automation
- **Puppeteer Core** - Core puppeteer functionality
- **Puppeteer Extra** - Enhanced puppeteer with plugins

### Development Tools

- **TSX** - TypeScript execution
- **Drizzle Kit** - Database migrations and studio

## 📁 Project Structure

```text
scraper/
├── src/
│   ├── index.ts              # Application entry point
│   ├── test.ts               # Testing utilities
│   └── lib/                  # Core utilities and helpers
│       ├── database/         # Database connection and schema
│       ├── scraper/          # Twitter scraping logic
│       └── types/            # TypeScript type definitions
├── drizzle/                  # Database migrations
│   ├── 0000_modern_venom.sql # Initial migration
│   └── meta/                 # Migration metadata
├── database.sqlite           # SQLite database file
├── drizzle.config.ts         # Drizzle ORM configuration
├── docker-compose.yml        # Docker Compose setup
├── Dockerfile                # Container configuration
├── package.json              # Dependencies and scripts
└── bun.lock                  # Bun lockfile
```

## 🛠️ Development Setup

### Prerequisites

- **Bun** v1.0+ - Install from [bun.sh](https://bun.sh)
- **Node.js** v18+ (alternative runtime)

### Installation

1. **Navigate to scraper directory**

   ```bash
   cd scraper
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Initialize database**

   ```bash
   bun run db:push
   ```

4. **Start development server**

   ```bash
   bun run dev
   ```

   The service will be available at `http://localhost:3001`

## 📜 Available Scripts

### Development Scripts

```bash
bun run dev          # Start development server with watch mode
bun run start        # Start production server
bun run build        # Build for production
```

### Database Management

```bash
bun run db:generate  # Generate database migrations
bun run db:migrate   # Apply pending migrations
bun run db:push      # Push schema changes to database
bun run db:studio    # Open Drizzle Studio (database GUI)
```

## 🌐 API Endpoints

### Health Check

```text
GET /health
```

Returns service health status and uptime information.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-07-05T...",
  "uptime": "2h 30m 45s"
}
```

### Get Twitter Profile

```text
GET /profile/:username
```

Returns cached data if available and fresh (within 24 hours), otherwise scrapes fresh data.

**Parameters:**

- `username` - Twitter username (without @)

**Response:**

```json
{
  "data": {
    "fullName": "Elon Musk",
    "username": "elonmusk",
    "bio": "Technology entrepreneur and CEO",
    "avatarUrl": "https://pbs.twimg.com/profile_images/...",
    "followers": "150M",
    "following": "125",
    "tweets": "25.8K",
    "url": "https://x.com/elonmusk",
    "verified": true,
    "location": "Austin, Texas",
    "website": "https://www.tesla.com",
    "joinDate": "June 2009"
  },
  "cached": false,
  "timestamp": "2025-07-05T..."
}
```

### Get Avatar Only

```text
GET /avatar/:username
```

Quick endpoint to get just the avatar URL for UI purposes.

**Response:**

```json
{
  "data": {
    "avatarUrl": "https://pbs.twimg.com/profile_images/...",
    "username": "elonmusk"
  },
  "cached": true
}
```

### Force Refresh Profile

```text
POST /profile/:username/refresh
```

Bypasses cache and scrapes fresh data, updates cache with new information.

**Response:**

```json
{
  "data": {
    /* Same as GET /profile/:username */
  },
  "cached": false,
  "refreshed": true
}
```

### Get All Cached Profiles

```text
GET /profiles
```

Returns all cached profiles with metadata.

**Query Parameters:**

- `limit` (optional) - Maximum number of profiles to return
- `offset` (optional) - Pagination offset

**Response:**

```json
{
  "data": [
    {
      "username": "elonmusk",
      "fullName": "Elon Musk",
      "avatarUrl": "https://...",
      "lastUpdated": "2025-07-05T...",
      "cacheAge": "2h 30m"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### Cache Statistics

```text
GET /stats
```

Returns caching statistics and service metrics.

**Response:**

```json
{
  "totalProfiles": 150,
  "cacheHitRate": 0.85,
  "avgResponseTime": "1.2s",
  "lastCleanup": "2025-07-05T...",
  "databaseSize": "5.2MB"
}
```

## 🗄️ Database Schema

The service uses SQLite with the following schema:

### profiles table

```sql
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  followers TEXT,
  following TEXT,
  tweets TEXT,
  url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  location TEXT,
  website TEXT,
  join_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Cache Management

- **Automatic Cleanup**: Removes profiles older than 24 hours
- **Smart Caching**: Prioritizes frequently accessed profiles
- **Index Optimization**: Optimized queries for fast lookups

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_PATH=./database.sqlite

# Scraping Configuration
SCRAPING_TIMEOUT=30000
USER_AGENT=Mozilla/5.0 (compatible; WaffleBot/1.0)

# Cache Settings
CACHE_TTL=86400  # 24 hours in seconds
MAX_CACHE_SIZE=1000

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000  # 1 minute
```

### Puppeteer Configuration

The scraper uses optimized Puppeteer settings:

- Headless mode for performance
- Disabled images and CSS for speed
- Custom user agent to avoid detection
- Timeout handling for failed requests

## 📊 Performance Optimization

### Caching Strategy

- **24-hour TTL**: Balance between freshness and performance
- **Memory + Disk**: Hot cache in memory, persistent in SQLite
- **Selective Invalidation**: Force refresh when needed

### Scraping Efficiency

- **Headless Browser**: Minimal resource usage
- **Resource Blocking**: Skip unnecessary assets
- **Parallel Processing**: Multiple concurrent scrapes
- **Error Recovery**: Retry mechanism for failed requests

### Database Optimization

- **Indexed Queries**: Fast username lookups
- **Connection Pooling**: Efficient database connections
- **Automatic Vacuum**: Periodic database optimization

## 🚀 Deployment

### Development

```bash
bun run dev
```

### Production

```bash
# Build and start
bun run build
bun run start

# Or use PM2 for process management
pm2 start bun --name waffle-scraper -- run start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t waffle-scraper .

# Run with Docker Compose
docker-compose up -d

# Scale the service
docker-compose up -d --scale scraper=3
```

### Environment Configuration

Production settings:

```env
NODE_ENV=production
PORT=3001
DATABASE_PATH=/data/database.sqlite
CACHE_TTL=43200  # 12 hours for production
```

## 🔐 Security & Best Practices

### Rate Limiting

- Built-in rate limiting to prevent abuse
- IP-based throttling
- Graceful degradation under high load

### Error Handling

- Comprehensive error logging
- Graceful failure modes
- Circuit breaker pattern for external services

### Data Privacy

- No personal data storage beyond public profiles
- Automatic cache expiration
- GDPR-compliant data handling

## 🧪 Testing

### Running Tests

```bash
bun test              # Run all tests
bun test --watch      # Watch mode
bun test --coverage   # Coverage report
```

### Test Categories

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full scraping workflow testing
- **Performance Tests**: Load and stress testing

## 📈 Monitoring & Logging

### Health Checks

- Service uptime monitoring
- Database connectivity checks
- Scraping service availability
- Cache performance metrics

### Logging

- Structured JSON logging
- Request/response logging
- Error tracking and alerting
- Performance metrics collection

## 🤝 Contributing

1. Use Bun for development
2. Follow TypeScript best practices
3. Add tests for new features
4. Maintain API compatibility
5. Update documentation

## 🔗 Integration Examples

### Frontend Integration (React/TypeScript)

```typescript
import { useState, useEffect } from "react";

interface TwitterProfile {
  fullName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followers: string;
}

const useTwitterProfile = (username: string) => {
  const [profile, setProfile] = useState<TwitterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/profile/${username}`);
        if (!response.ok) throw new Error("Profile not found");

        const result = await response.json();
        setProfile(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  return { profile, loading, error };
};
```

### Backend Integration (Node.js/Express)

```javascript
const axios = require("axios");

class TwitterScraperClient {
  constructor(baseURL = "http://localhost:3001") {
    this.client = axios.create({ baseURL });
  }

  async getProfile(username) {
    try {
      const response = await this.client.get(`/profile/${username}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  }

  async getAvatar(username) {
    const response = await this.client.get(`/avatar/${username}`);
    return response.data.data.avatarUrl;
  }

  async refreshProfile(username) {
    const response = await this.client.post(`/profile/${username}/refresh`);
    return response.data;
  }
}

module.exports = TwitterScraperClient;
```

## 🔗 Related Services

- **Frontend**: [../web/README.md](../web/README.md)
- **Backend API**: [../engine/README.md](../engine/README.md)
- **Smart Contracts**: [../contracts/README.md](../contracts/README.md)

---

Built with ⚡ using Bun and modern web scraping technologies

````text

Returns all profiles stored in the database.

## Installation

1. Install dependencies:

```bash
cd scraper
bun install
````

1. Set up environment variables (optional):

```bash
cp .env.example .env
```

1. The database will be automatically initialized on first run.

## Local Development

Start the development server:

```bash
bun run dev
```

The service will be available at `http://localhost:3001`

## Production Deployment

Build and start:

```bash
bun run build
bun run start
```

## Database

The service uses Bun's built-in SQLite database which is automatically initialized on startup. No additional database setup or migrations are required.

Database file location: `./database.sqlite`

## Example Usage

### Frontend Integration (JavaScript/TypeScript)

```typescript
// Get Twitter profile
const response = await fetch("http://localhost:3001/profile/elonmusk");
const { data } = await response.json();

console.log(data);
// {
//   fullName: "Elon Musk",
//   username: "elonmusk",
//   bio: "...",
//   avatarUrl: "https://...",
//   followers: "150M",
//   url: "https://x.com/elonmusk"
// }
```

### Avatar Endpoint Example

```typescript
const response = await fetch("http://localhost:3001/avatar/elonmusk");
const { data } = await response.json();

console.log(data.avatarUrl);
```

## API Error Responses

The API returns consistent error responses:

```json
{
  "error": "Error description",
  "timestamp": "2025-06-29T..."
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad request (missing username)
- `404`: Profile not found or private
- `500`: Internal server error

## Rate Limiting & Best Practices

- Use the cached endpoints when possible
- The service caches profiles for 24 hours
- Avatar-only endpoint is faster for UI purposes
- Consider implementing rate limiting in production

## Technologies Used

- **Runtime**: Bun
- **Web Framework**: Hono
- **Database**: SQLite (Bun built-in)
- **Scraping**: Puppeteer
- **Language**: TypeScript
  .
