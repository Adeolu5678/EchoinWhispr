# EchoinWhispr

A social application for anonymous persona-based connections, featuring real-time messaging, interest-based matchmaking, and private conversations with Convex as the backend.

## Overview

EchoinWhispr is a social application that enables trust-based connections through anonymous merit-based networking. It provides a familiar UX with powerful privacy features, targeting users who want meaningful connections without revealing their identity until they choose to.

## Key Features

- **Clerk Authentication**: Secure identity management
- **Persona Management**: Anonymous profiles based on career, interests, and mood
- **Premium Features**: Subscription-based enhancements
- **Search & Matching**: Find connections by career, interests, and mood
- **Anonymous Conversations**: Private messaging with rich media support
- **Real-time Backend**: Powered by Convex for live updates

## Project Structure

```bash
EchoinWhispr/
├── Web/                    # Next.js web application
│   └── Tailored Instructions/
│       # AI agent development guidelines
├── Back-End/               # Hedera smart contracts and utilities
│   ├── smart-contracts/    # Solidity contracts on Hedera
│   ├── scripts/           # Deployment scripts
│   └── utilities/         # Client-side encryption and IPFS services
├── design-system/          # Shared design tokens and components
└── Documentations/
    └── Software Specification Documentation (SSD)/
        # Comprehensive project documentation
```

## Technology Stack

- **Frontend**: Next.js (Web), React Native with Expo (Mobile), Flutter (Learning)
- **Backend**: Convex (Real-time database and API)
- **Authentication**: Clerk
- **Package Manager**: pnpm (Monorepo management)
- **Language**: TypeScript (primary), Dart (Flutter)
- **Styling**: Tailwind CSS (Web)

## Current Status (2026)

- **Web**: Production-ready, mobile-responsive PWA-like experience.
- **Mobile**: Native apps in development.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Hedera testnet account with HBAR
- IPFS gateway access (Infura/Pinata recommended)

### Installation

1. Install dependencies for all workspaces:
   ```bash
   pnpm install
   ```

2. Set up environment variables for each platform (see platform-specific READMEs)

### Development Scripts

- `pnpm dev:web` - Start Next.js development server
- `pnpm build:all` - Build all platforms
- `pnpm lint` - Run linting across all workspaces
- `pnpm test` - Run tests across all workspaces

### Platform-Specific Setup

See the individual README files in each directory for detailed setup instructions:

- [Web Application](./Web/README.md)
- [Back-End Services](./Back-End/README.md)
- [Design System](./design-system/README.md)

## Architecture Principles

1. **Decentralized by Design**: No central servers or databases
2. **Privacy-First**: End-to-end encryption, anonymous personas
3. **Trust by Design**: Immutable smart contracts govern all interactions
4. **Web3-Web2 Bridge**: Familiar UX with powerful privacy features
5. **Cost Efficiency**: Optimized for Hedera's low fees and high performance

## Development Workflow

1. **Monorepo Management**: All dependencies managed from root using pnpm workspaces
2. **Decentralized Backend**: Hedera services provide unified backend across platforms
3. **Client-Side Encryption**: Private keys never leave user devices
4. **Code Quality**: ESLint and Prettier ensure consistent code quality

## Contributing

1. Follow the established coding standards
2. Test all changes across platforms
3. Update documentation as needed
4. Ensure decentralization principles are maintained

## Documentation

- [Software Specification Documentation](./Documentations/Software Specification Documentation (SSD)/README.md)
- [Platform-Specific Instructions](./Web/Tailored Instructions/README.md)

## License

MIT
