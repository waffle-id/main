# 🧇 Waffle Engine (Backend API)

The backend API service for Waffle - a robust Express.js application that powers the decentralized reputation platform with MongoDB integration and blockchain connectivity.

## 🌟 Features

- **🔐 JWT Authentication**: Secure user authentication and authorization
- **🌐 RESTful API**: Well-structured API endpoints for all platform features
- **🔗 Blockchain Integration**: Ethereum blockchain connectivity via Viem
- **📡 WebSocket Support**: Real-time communication for live updates
- **🗄️ MongoDB Integration**: Efficient data storage with Mongoose ODM
- **🤖 Web Scraping**: Puppeteer integration for data collection
- **⚡ TypeScript**: Full type safety and modern development experience

## 🚀 Tech Stack

### Core Framework

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe JavaScript development
- **Node.js** - JavaScript runtime environment

### Database & ODM

- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling

### Authentication & Security

- **JSON Web Token (JWT)** - Secure authentication tokens
- **bcrypt** - Password hashing and security
- **CORS** - Cross-Origin Resource Sharing configuration

### Blockchain Integration

- **Viem** - TypeScript interface for Ethereum
- **Ethers.js** - Ethereum wallet and provider utilities

### Real-time Communication

- **WebSockets (ws)** - Real-time bidirectional communication
- **Express-WS** - WebSocket integration for Express

### Additional Tools

- **Puppeteer** - Headless browser for web scraping
- **AMQP** - Message queue integration
- **dotenv** - Environment variable management

## 📁 Project Structure

```text
engine/
├── src/
│   ├── config.ts              # Application configuration
│   ├── index.ts               # Application entry point
│   ├── server.ts              # Express server setup
│   ├── helpers/               # Utility functions
│   │   ├── nonce-store.ts     # Nonce management for auth
│   │   └── verify-signature.ts # Signature verification
│   ├── middleware/            # Express middleware
│   │   ├── authMiddleware.ts  # Authentication middleware
│   │   └── errorHandler.ts    # Error handling middleware
│   ├── packages/              # External package integrations
│   │   ├── mongodb/           # MongoDB connection and models
│   │   └── viem/              # Blockchain utilities
│   ├── routes/                # API route definitions
│   │   └── index.ts           # Route aggregation
│   ├── services/              # Business logic services
│   │   ├── account/           # User account management
│   │   ├── badges/            # Badge system logic
│   │   ├── categories/        # Category management
│   │   ├── personas/          # User persona handling
│   │   ├── referral-codes/    # Referral system
│   │   ├── reviews/           # Review management
│   │   └── user-persona-scores/ # Scoring system
│   └── types/                 # TypeScript type definitions
│       └── Persona.ts         # Persona type definitions
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker container configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── tsup.config.ts             # Build configuration
```

## 🛠️ Development Setup

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Navigate to the engine directory**

   ```bash
   cd engine
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/waffle

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # CORS
   FRONTEND_URL=http://localhost:5173

   # Blockchain
   RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
   PRIVATE_KEY=your_private_key_for_blockchain_operations

   # External APIs
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token
   ```

4. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## 📜 Available Scripts

### Local Development

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
```

### Database

```bash
npm run db:seed      # Seed database with initial data
npm run db:reset     # Reset database (development only)
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get current user profile

### User Management

- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:username/profile` - Get public profile

### Reviews

- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create new review
- `GET /api/reviews/:id` - Get specific review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Badges

- `GET /api/badges` - Get all available badges
- `GET /api/badges/user/:userId` - Get user's badges
- `POST /api/badges/award` - Award badge to user

### Leaderboard

- `GET /api/leaderboard` - Get general leaderboard
- `GET /api/leaderboard/:category` - Get category leaderboard

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

## 🔧 Configuration

### MongoDB Schema

Key collections:

- **users** - User accounts and profiles
- **reviews** - User reviews and ratings
- **badges** - Badge definitions and awards
- **categories** - Review categories
- **personas** - User personality types
- **scores** - User reputation scores

### Middleware Configuration

1. **Authentication Middleware**

   - JWT token validation
   - User context injection
   - Protected route handling

2. **Error Handling**

   - Centralized error management
   - Structured error responses
   - Logging integration

3. **CORS Configuration**
   - Frontend domain whitelisting
   - Credential support
   - Method restrictions

## 🔐 Security Features

### Authentication Security

- JWT-based stateless authentication
- Secure password hashing with bcrypt
- Token expiration and refresh mechanisms

### API Security

- Input validation and sanitization
- Rate limiting implementation
- CORS policy enforcement
- SQL injection prevention

### Blockchain Security

- Signature verification for wallet authentication
- Nonce management for replay attack prevention
- Secure private key handling

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t waffle-engine .

# Run with Docker Compose
docker-compose up -d
```

### Environment Configuration

Production environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/waffle
JWT_SECRET=super_secure_production_secret
PORT=3000
```

## 📊 Performance & Monitoring

### Optimization Features

- Database indexing for fast queries
- Connection pooling for MongoDB
- Caching strategies for frequently accessed data
- Efficient pagination for large datasets

### Monitoring

- Request/response logging
- Error tracking and reporting
- Performance metrics collection
- Health check endpoints

## 🧪 Testing

```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run integration tests
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain consistent API response formats
3. Add proper error handling for all endpoints
4. Include input validation
5. Write unit tests for new features

## 🔗 Related Services

- **Frontend**: [../web/README.md](../web/README.md)
- **Scraper Service**: [../scraper/README.md](../scraper/README.md)
- **Smart Contracts**: [../contracts/README.md](../contracts/README.md)

---

Built with ❤️ using Express.js and modern backend technologies
