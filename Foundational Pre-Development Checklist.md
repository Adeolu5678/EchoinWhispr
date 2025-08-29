# Foundational Pre-Development Checklist

Version: 1.0
Date: August 28, 2025
Author: Specs Engineer AI
This document outlines the critical, non-platform-specific foundational steps that must be completed before active development begins. These steps are designed to streamline collaboration, prevent technical debt, and ensure a robust and scalable architecture.

1. Unified Project Management & Communication Hub
Establish a Single Source of Truth for Tasks: Set up a project management board (e.g., GitHub Projects, Jira, Trello) to track all features, bugs, and tasks for all three platforms and the backend.
Create a Central Communication Channel: Establish a dedicated channel (e.g., Slack, Discord) for all project-related communication. This prevents information silos and ensures all stakeholders are aligned.

2. Monorepo & Scripting Strategy
Leverage the Monorepo: The current directory structure is a monorepo. Formally adopt this strategy. This means the single package.json at the project root manages all dependencies, and pnpm will be the package manager of choice.
Standardize Commands: Define a set of unified scripts in the root package.json to manage all sub-projects. For example:
pnpm dev:web: To run the Next.js web app.
pnpm dev:rn: To run the React Native app.
pnpm convex:dev: To run the Convex backend locally.
pnpm install: To install all dependencies for all sub-projects simultaneously.
Why?: This approach simplifies dependency management, ensures consistency, and makes it easier for developers to switch between platforms without complex environment setups.

3. Backend & API Management
Finalize Convex Deployment: Before coding, ensure your Convex backend is deployed to a remote environment (e.g., using npx convex deploy). This provides a stable, shared API endpoint for all three clients to connect to.
Establish a Clear API Versioning Strategy: While the current MVP has a small API surface, it's good practice to decide on a versioning strategy for your Convex functions (e.g., v1/users/createInitialUser). This will be crucial if requirements change or new features are added later.
Set up Webhooks/Triggers: Configure the Clerk-to-Convex webhook. This is a crucial foundational step that ensures user data is synced correctly from Clerk to your database on registration.

4. Design System & Brand Assets
Centralize Design: If a design tool (e.g., Figma, Sketch) is in use, create a single "source of truth" document for the entire EchoinWhispr brand. This will contain:
Color Palette: All primary, secondary, and accent colors.
Typography: All fonts, sizes, and weights (e.g., "Inter" font family).
Spacing & Layout Grids: Standardized padding and margin values.
Component Library: Definitions for all common components (buttons, inputs, cards).
Unified Asset Repository: Create a centralized folder for all brand assets (logos, icons, etc.). This ensures all developers pull from the same, up-to-date source.

5. Continuous Integration / Continuous Deployment (CI/CD)
Automate Everything: Set up a CI/CD pipeline (e.g., using GitHub Actions, CircleCI, or GitLab CI) for all three projects.
Minimum Pipeline Stages: Your CI pipeline should, at a minimum, automatically:
Run the tests for the project.
Check for linting and formatting issues.
Build the application for its target platform(s).
Deployment: Set up automatic deployment to a staging environment on every main branch push. This ensures a consistent, shippable version of the app is always available for testing and review.

6. Documentation & Knowledge Base
Create a Project Wiki: Establish a central repository for all documentation that doesn't belong in the code itself. This could be a GitHub Wiki or a similar platform.
What to Document:
Architecture Diagrams: High-level diagrams of the system architecture.
Setup Guides: Step-by-step instructions for new developers to get the project running locally.
Decision Logs: A record of key technical and design decisions and the rationale behind them.
Troubleshooting: Common issues and their solutions.
7. Comprehensive Testing Strategy
Three Layers of Testing: Before writing any major feature, define a clear testing strategy that includes:
Unit Tests: To test individual functions and methods (e.g., validation logic, utility functions).
Component/Widget Tests: To test UI components in isolation.
End-to-End (E2E) Tests: To test the full user flow from a user's perspective (e.g., signing up, sending a whisper, receiving it).
By addressing these foundational elements, you're not just preparing to build the application—you're preparing to build a maintainable, scalable, and collaborative project.
