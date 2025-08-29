# Technology Stack & Key Tooling

This file details the core technologies and tools used across the EchoinWhispr project. All AI agents must use these specific technologies and adhere to their best practices.

1. Shared Backend & Authentication
Convex:
Role: Sole backend service for real-time database and API layer.
Directive: All data persistence, fetching, and business logic must occur via Convex queries and mutations. Adhere strictly to the shared schema in #EchoinWhispr/Convex/schema.ts. Implement robust Convex security rules as specified in SSD Section 4.3.4.
Documentation: Official Convex Docs
Clerk:
Role: Handles all user authentication, sign-up, sign-in, and session management.
Directive: Never implement custom authentication logic. Integrate Clerk SDKs as specified for each platform. Ensure secure handling of user sessions.
Documentation: Official Clerk Docs

2. Frontend Frameworks
React (Web & React Native):
Role: Base UI library for both production frontend applications.
Directive: Use React's declarative UI paradigm. Prefer functional components with hooks.
Next.js (Web Application):
Role: Framework for the web application.
Directive: Utilize the App Router. Prefer Server Components where appropriate. Leverage Next.js built-in optimizations (Image, Font optimization).
Documentation: Official Next.js Docs
React Native & Expo (Primary Mobile Application):
Role: Framework for the primary mobile application (Android & iOS).
Directive: Prioritize the Expo managed workflow. Use Expo Router for navigation. Avoid direct native code interaction unless absolutely necessary and explicitly approved.
Documentation: Official React Native Docs, Official Expo Docs
Flutter (Learning Project):
Role: Framework for the personal learning project.
Directive: When assisting with Flutter, focus on guiding the human developer on Flutter/Dart best practices, state management, and custom HTTP API integration with Convex/Clerk.
Documentation: Official Flutter Docs

3. Styling & UI Components
Tailwind CSS:
Role: Utility-first CSS framework for consistent styling across platforms.
Directive: Use Tailwind for all styling. For React Native, integrate NativeWind (or an equivalent compatible solution).
Documentation: Official Tailwind CSS Docs
Shadcn UI (Web Application):
Role: Component library for the web application.
Directive: Prioritize Shadcn components (e.g., Button, Input, Textarea, Card, Toast) for common UI elements in the Web app.
Documentation: Official Shadcn UI Docs

4. Development Tooling
TypeScript:
Role: Language superset for type safety and code quality.
Directive: TypeScript is mandatory for all code (Web, React Native, Convex backend functions). Enable strict type checking. All components, hooks, functions, services, and data models must be strongly typed. Define explicit interfaces for props, state, and API responses.
PNPM:
Role: Package manager for the monorepo.
Directive: Always use pnpm for dependency management.
Git & GitHub:
Role: Version control for the entire monorepo.
Directive: Adhere to specified branching strategies and clear commit message guidelines.
5. Other Tools & Services
Vercel: For hosting the Next.js Web application and potentially auxiliary serverless functions.
Notion: Used for project management (Kanban board) and the AI Agent Logbook.
