# EchoinWhispr Monorepo

A monorepo containing the EchoinWhispr application with multiple platform implementations.

## Project Structure

```bash
EchoinWhispr/
├── Web/                    # Next.js web application
├── ReactNative/           # React Native mobile application
├── Flutter/               # Flutter learning project
├── Convex/                # Shared Convex backend
├── packages/              # Shared packages (future use)
├── .kilocode/            # AI agent rules and configurations
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
- For React Native: Expo CLI
- For Flutter: Flutter SDK

### Installation

1. Install dependencies for all workspaces:
   ```bash
   pnpm install
   ```

2. Set up environment variables for each platform (see platform-specific READMEs)

### Development Scripts

- `pnpm dev:web` - Start Next.js development server
- `pnpm dev:rn` - Start React Native/Expo development server
- `pnpm dev:flutter` - Start Flutter development server
- `pnpm convex:dev` - Start Convex development server
- `pnpm build:all` - Build all platforms
- `pnpm lint` - Run linting across all workspaces
- `pnpm test` - Run tests across all workspaces

### Platform-Specific Setup

See the individual README files in each platform directory for detailed setup instructions:

- [Web Application](./Web/README.md)
- [React Native Application](./ReactNative/README.md)
- [Flutter Learning Project](./Flutter/README.md)
- [Convex Backend](./Convex/README.md)

## Development Workflow

1. **Monorepo Management**: All dependencies are managed from the root using pnpm workspaces
2. **Shared Backend**: Convex provides a unified backend for Web and React Native platforms
3. **Authentication**: Clerk handles authentication across all platforms
4. **Code Quality**: ESLint and Prettier ensure consistent code quality

## Contributing

1. Follow the established coding standards in `.kilocode/rules/`
2. Use the unified scripts from the root `package.json`
3. Ensure all platforms are tested before submitting changes
4. Update documentation as needed

## Documentation

- [Software Specification Documentation](./Software Specification Documentation (SSD)/README.md)
- [Platform-Specific Instructions](./Web/Tailored Instructions/README.md)
- [AI Agent Rules](./.kilocode/rules/)

## License

MIT
