# EchoinWhispr: React Native Application (ReactNative Folder)

This ReactNative folder contains the codebase for the primary mobile application of EchoinWhispr. This application is being developed using React Native with the Expo framework, specifically designed for Android and iOS devices. It will be "vibecoded" using AI agents, with a "Human-in-the-Loop" project management approach to ensure quality and adherence to specifications.

1. Project Overview
The EchoinWhispr React Native application is a key component of our unified platform, providing a mobile-first experience for anonymous one-way messages ("Whispers") that can evolve into two-way conversations. This application will run in parallel with the web application, both sharing the same backend services for a consistent user experience.

2. Technology Stack
The application leverages a modern and efficient technology stack:
Mobile Framework: React Native with Expo (chosen for cross-platform development, AI agent proficiency, and simplified native module management).
Client Framework: React.
Backend & API Layer: Convex (serving as both the real-time database and API layer).
Authentication: Clerk (for robust user sign-up, login, and session management).
Package Management: PNPM (for efficient dependency management within the monorepo).
Hosting: Vercel (for Convex backend functions and potential auxiliary services).

3. Core Functionality (Minimum Viable Product - MVP)
The initial release of the EchoinWhispr React Native application focuses on a lean MVP:
User Authentication: Secure user sign-up and login.
Sending Whispers: Users can compose and send anonymous text messages.
Receiving Whispers: Users can view whispers sent to them in real-time.

4. Scalability & Future Features
The application is built with a modular architecture and integrates feature flags from the outset. This "foundation-first" approach means that while advanced features like conversation evolution, image uploads, profile management, and push notifications are deferred, their underlying architectural hooks are in place for easy, future integration without extensive refactoring. The admin feature to track user device information and location has been explicitly dropped for privacy reasons.

5. Project Management & Development Workflow
Development is managed through a "Human-in-the-Loop" workflow. You will act as the orchestrator, guiding AI agents through tasks managed on a Notion Kanban board. Each task includes an "AI Agent Logbook" entry detailing the prompt, AI output, human review notes, and traceability to specifications. This ensures a transparent, verifiable, and quality-controlled development process for the vibecoded application.
