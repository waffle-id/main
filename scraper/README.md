# Waffle Scraper Service

A standalone Twitter/X profile scraper service built with Bun, Hono, and SQLite.

## Features

- 🚀 Fast and lightweight API built with Hono
- 🗄️ SQLite database with Bun's built-in SQLite for caching
- 🔄 Intelligent caching (24-hour TTL)
- 🎯 TypeScript with full type safety
- 🌐 CORS enabled for frontend integration
- 📊 Comprehensive Twitter profile scraping
- 🖼️ Dedicated avatar endpoint for quick fetches

## API Endpoints

### Health Check

```text
GET /health
```

### Get Twitter Profile

```text
GET /profile/:username
```

Returns cached data if available and fresh (within 24 hours), otherwise scrapes fresh data.

### Get Avatar Only

```text
GET /avatar/:username
```

Quick endpoint to get just the avatar URL.

### Force Refresh Profile

```text
POST /profile/:username/refresh
```

Bypasses cache and scrapes fresh data.

### Get All Cached Profiles

```text
GET /profiles
```

Returns all profiles stored in the database.

## Installation

1. Install dependencies:

```bash
cd scraper
bun install
```

1. Set up environment variables (optional):

```bash
cp .env.example .env
```

1. The database will be automatically initialized on first run.

## Development

Start the development server:

```bash
bun run dev
```

The service will be available at `http://localhost:3001`

## Production

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
const response = await fetch('http://localhost:3001/profile/elonmusk');
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
const response = await fetch('http://localhost:3001/avatar/elonmusk');
const { data } = await response.json();

console.log(data.avatarUrl);
```

## Error Handling

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
