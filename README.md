# EchoinWhispr

A modern social platform for anonymous persona-based connections, featuring real-time messaging, interest-based matchmaking, and private "unmasking" ceremonies. Built with Next.js, Convex, and Clerk.

## Overview

EchoinWhispr enables meaningful psychological connections through anonymous merit-based networking. It provides a familiar, premium UX with powerful privacy features, allowing users to interact via personas (based on career, interests, and mood) without revealing their true identity until they choose to.

## Key Features

- **Persona Management**: Create anonymous profiles defined by your career, interests, and current mood.
- **Whispers**: Send anonymous one-way messages into the "void" or to specific users.
- **Conversations**: Evolve whispers into two-way private chats through mutual interaction.
- **Echo Chambers**: Participate in anonymous group messaging based on specific topics.
- **Resonance Matching**: AI-driven matchmaking based on mood, life phase, and shared interests.
- **Unmasking Ceremony**: A structured process for users to voluntarily reveal their identity to trusted connections.
- **Real-time Backend**: Powered by Convex for instantaneous updates and reactive data.
- **Secure Auth**: Managed by Clerk for robust identity protection and session management.

## Project Structure

```bash
EchoinWhispr/
├── Web/                    # Next.js web application (Frontend)
├── Convex/                 # Convex backend functions and schema
├── design-system/          # Shared design tokens and brand assets
└── Documentations/         # Project specifications and PRDs
```

## Technology Stack

- **Frontend**: Next.js 14+ (React)
- **Backend**: Convex (Real-time database, Serverless functions)
- **Authentication**: Clerk v6
- **Styling**: Tailwind CSS & Shadcn UI (Neon-Glass Aesthetic)
- **Language**: TypeScript
- **Package Manager**: pnpm (Monorepo)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Convex account (for backend development)
- Clerk account (for authentication)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   - Create `.env.local` in the `Web/` directory with your Clerk and Convex keys.
   - Create `.env.local` in the `Convex/` directory with your Convex keys.

### Development

Run the full stack (Frontend + Backend) concurrently:
```bash
pnpm dev:fullstack
```

Individual workspace commands:
- `pnpm dev:web`: Start Next.js dev server.
- `pnpm dev:convex`: Start Convex dev server.

## Architecture Principles

1. **Privacy-First**: User identity is detached from activity until explicit "unmasking".
2. **Real-time Interaction**: Seamless, reactive experience across all features.
3. **Modular Design**: Features are encapsulated for easy scaling and maintenance.
4. **Premium Aesthetics**: High-fidelity "Neon-Glass" design system for a state-of-the-art feel.

## Documentation

- [Product Requirements Document (PRD)](./Documentations/Product%20Requirements%20Document%20(PRD).md)
- [API Endpoints](./Documentations/API%20Endpoints.md)
- [Design System](./frontend-design.md)

## License

MIT
