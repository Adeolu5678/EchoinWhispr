# Foundational Pre-Development Checklist

Version: 2.0
Date: November 20, 2025
Author: Specs Engineer AI
This document outlines the critical, non-platform-specific foundational steps that must be completed before active development begins for the EchoinWhispr application. These steps are designed to streamline collaboration, prevent technical debt, and ensure a robust and scalable architecture leveraging Convex, Clerk, and modern Web2 standards.

1. Unified Project Management & Communication Hub
   Establish a Single Source of Truth for Tasks: Set up a project management board (e.g., GitHub Projects, Jira, Trello) to track all features, bugs, and tasks for the Web frontend and Backend logic.
   Create a Central Communication Channel: Establish a dedicated channel (e.g., Slack, Discord) for all project-related communication. This prevents information silos and ensures all stakeholders are aligned.

2. Monorepo & Scripting Strategy
   Leverage the Monorepo: The current directory structure is a monorepo. Formally adopt this strategy. This means the single [`package.json`](package.json) at the project root manages all dependencies, and pnpm will be the package manager of choice.
   Standardize Commands: Define a set of unified scripts in the root [`package.json`](package.json) to manage all sub-projects. For example:
   pnpm dev:web: To run the Next.js web app.
   pnpm dev:convex: To run the Convex development server.
   pnpm install: To install all dependencies for all sub-projects simultaneously.
   Why?: This approach simplifies dependency management, ensures consistency, and makes it easier for developers to switch between components without complex environment setups.

3. Backend & API Management (Convex & Clerk)
   Finalize Convex Setup: Initialize the Convex project and ensure the `convex/` directory is properly configured with `schema.ts` and initial functions.
   Configure Clerk Authentication: Set up the Clerk application, obtain API keys, and configure the `ClerkProvider` in the frontend and `ConvexProviderWithClerk` for authenticated backend access.
   Define Database Schema: Draft the initial `convex/schema.ts` to define tables for users, messages, and other core entities, ensuring proper indexing for performance.
   Set up File Storage: Configure Convex File Storage for handling user uploads (images, attachments).

4. Design System & Brand Assets
   Centralize Design: Leverage the existing design-system folder as the single "source of truth" for the entire EchoinWhispr brand. This contains:
   Color Palette: All primary, secondary, and accent colors defined in [`colors.ts`](design-system/tokens/colors.ts).
   Typography: All fonts, sizes, and weights (e.g., defined in design-system/tokens/typography.ts).
   Spacing & Layout Grids: Standardized padding and margin values in design-system/tokens/spacing.ts.
   Component Library: Definitions for all common components (buttons, inputs, cards) in [`components/`](design-system/components/).
   Unified Asset Repository: Create a centralized folder for all brand assets (logos, icons, etc.). This ensures all developers pull from the same, up-to-date source.

5. Continuous Integration / Continuous Deployment (CI/CD)
   Automate Everything: Set up a CI/CD pipeline (e.g., using GitHub Actions, Vercel) for the Web app and Convex functions.
   Minimum Pipeline Stages: Your CI pipeline should, at a minimum, automatically:
   Run the tests for the project.
   Check for linting and formatting issues.
   Build the application for its target platform(s).
   Deployment: Set up automatic deployment to Vercel (frontend) and Convex (backend) on every main branch push. This ensures a consistent, shippable version of the app is always available for testing and review.

6. Documentation & Knowledge Base
   Create a Project Wiki: Establish a central repository for all documentation that doesn't belong in the code itself. This could be a GitHub Wiki or a similar platform.
   What to Document:
   Architecture Diagrams: High-level diagrams of the Convex+Next.js architecture.
   Setup Guides: Step-by-step instructions for new developers to get the project running locally, including Clerk and Convex env setup.
   Decision Logs: A record of key technical and design decisions and the rationale behind them.
   Troubleshooting: Common issues and their solutions.

7. Comprehensive Testing Strategy
   Three Layers of Testing: Before writing any major feature, define a clear testing strategy that includes:
   Unit Tests: To test individual utility functions and helpers.
   Component/Widget Tests: To test UI components in isolation, using the design-system components.
   End-to-End (E2E) Tests: To test the full user flow from a user's perspective (e.g., logging in via Clerk, sending messages via Convex).
   By addressing these foundational elements, you're not just preparing to build the application—you're preparing to build a maintainable, scalable, and collaborative modern web application.

8. App Specific Foundations
   Clerk Integration: Set up `middleware.ts` for route protection and `AuthProvider` wrappers.
   Convex Realtime Setup: Ensure `useQuery` and `useMutation` hooks are working correctly for real-time data updates.
   Subscription Setup: Plan the integration with Stripe (or similar) for premium features, linking payments to Convex user records.
