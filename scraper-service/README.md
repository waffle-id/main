# Waffle Scraper Service

A standalone Twitter/X profile scraper service built with Bun, Hono, and Drizzle ORM.

## Features

- 🚀 Fast and lightweight API built with Hono
- 🗄️ SQLite database with Drizzle ORM for caching
- 🔄 Intelligent caching (24-hour TTL)
- 🎯 TypeScript with full type safety
- 🌐 CORS enabled for frontend integration
- 📊 Comprehensive Twitter profile scraping
- 🖼️ Dedicated avatar endpoint for quick fetches

## API Endpoints

### Health Check
```
GET /health
```

### Get Twitter Profile
```
GET /profile/:username
```
Returns cached data if available and fresh (within 24 hours), otherwise scrapes fresh data.

### Get Avatar Only
```
GET /avatar/:username
```
Quick endpoint to get just the avatar URL.

### Force Refresh Profile
```
POST /profile/:username/refresh
```
Bypasses cache and scrapes fresh data.

### Get All Cached Profiles
```
GET /profiles
```
Returns all profiles stored in the database.

## Installation

1. Install dependencies:
```bash
cd scraper-service
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Generate database schema:
```bash
bun run db:generate
```

4. Run database migrations:
```bash
bun run db:migrate
```

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

## Database Management

- Generate new migrations: `bun run db:generate`
- Apply migrations: `bun run db:migrate`
- Push schema changes: `bun run db:push`
- Open Drizzle Studio: `bun run db:studio`

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

### Get Avatar Only

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
- **Database**: SQLite with Drizzle ORM
- **Scraping**: Puppeteer
- **Language**: TypeScript
