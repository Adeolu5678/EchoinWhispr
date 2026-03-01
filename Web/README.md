# EchoinWhispr: Web Application

The primary user interface for the EchoinWhispr platform, built as a modern, high-performance web application using Next.js 14 and the Neon-Glass design system.

## Performance & UX First

This workspace contains the frontend logic, UI components, and client-side integrations for the entire platform. It is optimized for speed, accessibility, and "premium" visual fidelity.

## Key Features (Web)

- **Responsive Neon-Glass UI**: A state-of-the-art dark-first interface with glassmorphism and real-time animations.
- **Dynamic Persona Dashboard**: Manage anonymous personas and switch contexts seamlessly.
- **Adaptive Whisper Feed**: Infinite-scrolling feed of whispers with rich media support.
- **Identity Unmasking**: Guided UI for the mutual identity reveal process.
- **Clerk Auth Integration**: Zero-friction onboarding and secure session management.
- **PWA Ready**: Installable as a progressive web app for mobile devices.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Shadcn UI
- **Animations**: Framer Motion & CSS keyframes
- **State Management**: Convex React Hooks (Reactive)
- **Auth**: Clerk (Clerk v6)
- **Deployment**: Vercel

## Development Workflow

### Setup

1. Ensure root dependencies are installed: `pnpm install`
2. Create `.env.local` in this directory:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   NEXT_PUBLIC_CONVEX_URL=...
   ```

### Commands

- `pnpm dev`: Start the web dev server locally.
- `pnpm build`: Build for production.
- `pnpm start`: Run the production build locally.
- `pnpm lint`: Run ESLint checks.

## Architecture

- **`src/app/`**: Next.js App Router for routes and layouts.
- **`src/components/`**: Atomic UI components and feature-specific components.
- **`src/hooks/`**: Custom React hooks for backend and UI logic.
- **`src/lib/`**: Shared utility functions and configurations.

## Links

- [Design System Guide](../frontend-design.md)
- [API Endpoints](../Documentations/API%20Endpoints.md)
- [Product Requirements (PRD)](../Documentations/Product%20Requirements%20Document%20(PRD).md)
