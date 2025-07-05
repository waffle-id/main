# 🧇 Waffle

**Waffle** is a decentralized reputation and review platform that builds trust in the Web3 ecosystem. Users can create profiles, give and receive reviews, earn badges, and build their on-chain reputation through meaningful interactions.

## 🌟 Features

- **� Multi-Wallet Support**: Connect with RainbowKit or Xellar wallets
- **🐦 Twitter Integration**: Link Twitter profiles for enhanced credibility
- **🏆 Badge System**: Earn badges for various contributions and achievements
- **📊 Leaderboards**: Compete and showcase reputation scores
- **🔍 Profile Analytics**: Comprehensive user profiles with action scores
- **🤖 AI-Powered Reviews**: Intelligent review analysis and scoring
- **📱 Modern UI/UX**: Beautiful, responsive interface with smooth animations

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **Bun** (for scraper service)
- **Docker** (optional, for containerized deployment)
- **MongoDB** (for backend data storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/waffle-id/main.git
   cd waffle/main
   ```

2. **Install dependencies for all services**

   ```bash
   # Frontend
   cd web && npm install && cd ..

   # Backend
   cd engine && npm install && cd ..

   # Scraper
   cd scraper && bun install && cd ..

   # AI Service
   cd ai/review-analyzer && pip install -r requirements.txt && cd ../..
   ```

3. **Set up environment variables**

   ```bash
   # Copy example env files and configure
   cp engine/.env.example engine/.env
   # Edit with your MongoDB URI, JWT secrets, etc.
   ```

4. **Start all services**

   ```bash
   # Terminal 1: Frontend
   cd web && npm run dev

   # Terminal 2: Backend
   cd engine && npm run dev

   # Terminal 3: Scraper
   cd scraper && bun run dev

   # Terminal 4: AI Service (optional)
   cd ai/review-analyzer && python app.py
   ```

---

## 🏗️ Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │◄──►│  Engine (API)   │◄──►│ Smart Contract  │
│   (React Router)│    │   (Express.js)  │    │    (Foundry)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Scraper Service │    │    MongoDB      │    │   Blockchain    │
│    (Bun/Hono)   │    │   Database      │    │   (EVM Chain)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│  AI Analyzer    │
│ (Hugging Face)  │
└─────────────────┘
```

---

## 🚀 Tech Stack

### 📱 Frontend (`/web`)

> _[Frontend Documentation](./web/README.md)_

- **React Router 7** - Full-stack React framework with SSR
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Wagmi + Viem** - Ethereum wallet integration
- **RainbowKit + Xellar** - Multi-wallet support
- **Framer Motion** - Smooth animations
- **GSAP + Three.js** - Advanced animations and 3D graphics
- **ShadCN/UI** - Modern UI components
- **TypeScript** - Type-safe development

### 🧠 Backend (`/engine`)

> _[Backend Documentation](./engine/README.md)_

- **Express.js** - Web application framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **Viem** - Ethereum integration
- **WebSockets** - Real-time communication
- **Puppeteer** - Web scraping capabilities
- **TypeScript** - Type-safe development

### 🤖 Scraper Service (`/scraper`)

> _[Scraper Documentation](./scraper/README.md)_

- **Bun** - Fast JavaScript runtime
- **Hono** - Lightweight web framework
- **SQLite + Drizzle ORM** - Local database with type-safe queries
- **Puppeteer** - Twitter profile scraping
- **TypeScript** - Type-safe development

### 🛠️ Smart Contracts (`/contracts`)

> _[Contract Documentation](./contracts/README.md)_

- **Foundry** - Ethereum development toolkit
- **Solidity** - Smart contract language
- **OpenZeppelin** - Secure contract libraries
- **Forge** - Testing and deployment

### 🤖 AI Service (`/ai`)

> _[AI Documentation](./ai/README.md)_

- **Python** - AI/ML development
- **Hugging Face Transformers** - Pre-trained models
- **Gradio** - ML model interface
- **scikit-learn** - Machine learning utilities
- **PyTorch** - Deep learning framework

---

## 📁 Project Structure

```text
waffle/main/
├── web/                    # Frontend application
│   ├── app/               # React Router app
│   ├── components/        # Reusable UI components
│   ├── routes/           # Application routes
│   └── utils/            # Helper utilities
├── engine/                # Backend API service
│   ├── src/              # Source code
│   ├── services/         # Business logic
│   └── routes/           # API endpoints
├── scraper/               # Twitter scraper service
│   ├── src/              # Source code
│   ├── drizzle/          # Database migrations
│   └── lib/              # Utilities
├── contracts/             # Smart contracts
│   ├── src/              # Contract source
│   ├── test/             # Contract tests
│   └── script/           # Deployment scripts
└── ai/                   # AI/ML services
    └── review-analyzer/   # Review analysis service
```

---

## � Deployment

### Production

#### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

#### Manual Deployment

```bash
# Build frontend
cd web && npm run build

# Build backend
cd engine && npm run build

# Build scraper
cd scraper && bun run build

# Deploy to your preferred platform
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

<!-- - **Live App**: [waffle.id](https://waffle.id) -->
<!-- - **Documentation**: [docs.waffle.id](https://docs.waffle.id) -->
<!-- - **Discord**: [Join our community](https://discord.gg/waffle) -->
<!-- - **Twitter**: [@waffle_id](https://twitter.com/waffle_id) -->

---

> 🧇 Building trust, one waffle at a time ✨
