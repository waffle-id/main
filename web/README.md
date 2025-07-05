# 🧇 Waffle Web Frontend

The frontend application for Waffle - a modern, responsive web interface built with React Router 7 for the decentralized reputation platform.

## 🌟 Features

- **🔗 Multi-Wallet Integration**: RainbowKit and Xellar wallet support
- **🐦 Twitter OAuth**: Seamless Twitter profile linking
- **🎨 Modern UI/UX**: Beautiful interface with smooth animations
- **📱 Responsive Design**: Works perfectly on all devices
- **⚡ Server-Side Rendering**: Fast initial page loads
- **🔄 Real-time Updates**: Live data synchronization
- **🏆 Interactive Components**: Leaderboards, badges, and profiles

## 🚀 Tech Stack

### Core Framework

- **React Router 7** - Full-stack React framework with SSR
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe development

### Styling & UI

- **TailwindCSS** - Utility-first CSS framework
- **ShadCN/UI** - Modern, accessible UI components
- **Radix UI** - Headless UI primitives
- **Framer Motion** - Smooth animations and transitions
- **GSAP** - Advanced animations and effects
- **Three.js** - 3D graphics and visualizations
- **Lenis** - Smooth scrolling

### Web3 Integration

- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **RainbowKit** - Beautiful wallet connection UI
- **Xellar Kit** - Alternative wallet solution

### Data & API

- **TanStack Query** - Powerful data synchronization
- **Axios** - HTTP client for API requests
- **Remix Auth** - Authentication framework
- **Twitter API v2** - Twitter integration

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

## 📁 Project Structure

```text
web/
├── app/                          # React Router application
│   ├── routes/                   # Application routes
│   │   ├── landing/             # Landing page
│   │   ├── profile/             # User profiles
│   │   ├── leaderboard/         # Leaderboard pages
│   │   └── badges/              # Badge system
│   ├── components/              # Reusable components
│   │   ├── layouts/             # Layout components
│   │   ├── shadcn/              # ShadCN UI components
│   │   └── waffle/              # Custom Waffle components
│   ├── services/                # API services
│   ├── utils/                   # Utility functions
│   ├── constants/               # App constants
│   └── assets/                  # Static assets
├── public/                      # Public static files
├── build/                       # Production build output
└── package.json                 # Dependencies and scripts
```

## 🛠️ Development Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** or **pnpm**

### Installation

1. **Navigate to the web directory**

   ```bash
   cd web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   Your application will be available at `http://localhost:5173`

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server with HMR
npm run typecheck    # Run TypeScript type checking
```

### Building

```bash
npm run build        # Create production build
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🌐 Key Routes

- **`/`** - Landing page with platform overview
- **`/profile/:username`** - User profile pages
- **`/leaderboard`** - Community leaderboards
- **`/leaderboard/:category`** - Category-specific leaderboards
- **`/badges`** - Badge system and achievements

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the web directory:

```env
# API Endpoints
VITE_API_BASE_URL=http://localhost:3000
VITE_SCRAPER_BASE_URL=http://localhost:4000

# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Wallet Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id

# Application
VITE_APP_ENV=development
```

### Wallet Configuration

The app supports multiple wallet providers:

- **RainbowKit**: Traditional wallet connection
- **Xellar**: Advanced wallet features

Configure in `app/components/waffle/waffle-provider.tsx`

## 🎨 Styling Guide

### TailwindCSS Classes

- Use utility classes for styling
- Custom components in `app/components/waffle/`
- Design system colors: orange, yellow, and neutral tones

### Component Architecture

- **Layouts**: Header, footer, and page layouts
- **ShadCN**: Pre-built accessible components
- **Waffle**: Custom branded components

### Animation Guidelines

- Use Framer Motion for page transitions
- GSAP for complex animations
- CSS transitions for simple hover effects

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates optimized files in the `build/` directory:

- `build/client/` - Static assets
- `build/server/` - Server-side code

### Docker Deployment

```bash
# Build Docker image
docker build -t waffle-web .

# Run container
docker run -p 3000:3000 waffle-web
```

### Platform Deployment

The built application can be deployed to:

- **Vercel** (recommended for React Router)
- **Netlify**
- **AWS ECS/Fargate**
- **Digital Ocean App Platform**
- **Railway**
- **Fly.io**

## 🧪 Testing

```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:watch   # Run tests in watch mode
```

## 📊 Performance

### Optimization Features

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Analysis**: Analyze bundle size with `npm run analyze`
- **Caching**: Efficient caching strategies

### Monitoring

- Web Vitals tracking
- Error boundary implementation
- Performance monitoring integration

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Add proper error handling
4. Include responsive design
5. Test on multiple devices

## 🔗 Related Services

- **Backend API**: [../engine/README.md](../engine/README.md)
- **Scraper Service**: [../scraper/README.md](../scraper/README.md)
- **Smart Contracts**: [../contracts/README.md](../contracts/README.md)

---

Built with ❤️ using React Router and the modern web stack.
