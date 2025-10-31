# EchoinWhispr

A fully decentralized social dApp on Hedera for anonymous persona-based connections, bridging the Web3-Web2 divide with end-to-end encryption, HCS routing, and IPFS storage.

## Overview

EchoinWhispr is a decentralized social application that enables trust by design through immutable smart contracts, anonymous merit-based networking, and a decentralized architecture without central servers. It targets Web3 echo chamber users, Web2 intimidated users, and real-world wall users by providing a Web2-friendly UX with powerful Web3 privacy features.

## Key Features

- **Hedera Wallet Authentication**: Secure, decentralized identity management
- **Persona Management**: Anonymous profiles based on career, interests, and mood
- **Subscription Service**: HTS token-based premium features
- **Search & Matching**: Find connections by career, interests, and mood
- **Anonymous Conversations**: End-to-end encrypted messaging with rich media support
- **Decentralized Storage**: IPFS for content, HCS for routing, no central servers

## Project Structure

```
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

- **Blockchain**: Hedera (Smart Contracts, Consensus Service, Token Service)
- **Frontend**: Next.js (Web), React Native with Expo (Mobile)
- **Storage**: IPFS/Filecoin for decentralized content storage
- **Encryption**: ECIES for end-to-end encryption
- **Authentication**: Hedera WalletConnect
- **Package Manager**: pnpm (Monorepo management)
- **Language**: TypeScript, Solidity

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

2. Set up environment variables (see individual READMEs for details)

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
