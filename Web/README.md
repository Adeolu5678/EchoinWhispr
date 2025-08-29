# EchoinWhispr: Web Application (Web Folder)

This Web folder contains the complete codebase for the EchoinWhispr web application. This application is being meticulously rebuilt from the ground up using a modern, scalable technology stack to provide a seamless and intuitive user experience that mirrors the functionality of the primary mobile application.

1. Project Overview
The EchoinWhispr web application is a core component of the unified EchoinWhispr ecosystem, designed to facilitate anonymous one-way messages ("Whispers") that can evolve into two-way conversations. This web interface offers broad accessibility, allowing users to engage with the platform from any device with a web browser.

2. Technology Stack
The web application is built on a robust and modern technology stack, chosen for its performance, scalability, and developer experience.
Client Framework: React with Next.js
Next.js is utilized for its powerful features, including server-side rendering (SSR) and static site generation (SSG), which enhance performance, SEO, and user experience.
Styling: Tailwind CSS and Shadcn
Tailwind CSS provides a utility-first approach for rapid and consistent styling. Shadcn UI components offer a set of beautifully designed and accessible UI primitives, built on top of Tailwind.
Backend & API Layer: Convex
Convex serves as both the real-time database and API layer, simplifying data management and providing live updates across the application.
Authentication: Clerk
Clerk provides a comprehensive, secure, and easily integratable authentication service, handling user sign-up, login, and session management.
Hosting: Vercel
Vercel offers an optimized hosting platform for Next.js applications, providing seamless deployments, global CDN, and serverless functions.
Package Management: PNPM
PNPM is used for efficient package management, especially beneficial in monorepo setups, offering speed and disk space savings.

3. Core Functionality (Minimum Viable Product - MVP)
The initial release of the EchoinWhispr web application focuses on a lean Minimum Viable Product (MVP) to ensure rapid development and a solid foundation.
User Authentication: Secure user sign-up and login via Clerk.
Sending Whispers: Users can compose and send anonymous one-way text messages.
Receiving Whispers: Users can view whispers sent to them.

4. Scalability & Future Features
The application is designed with a modular architecture and incorporates feature flags to enable easy integration of future functionalities without extensive refactoring. This "foundation-first" approach means that while certain advanced features are not active in the MVP, the structural elements are in place for their seamless addition in later iterations. Future features include (but are not limited to):
Conversation Evolution: Transitioning one-way whispers into two-way, mutually revealed conversations.
Image Uploads: Functionality to attach images to whispers or for profile pictures.
Profile Management: Comprehensive user profile customization.
Location-Based Features: Future integration of location-specific functionalities.

5. Project Management & Development Workflow
Development of the web application follows a "Human-in-the-Loop" workflow. AI agents generate code based on detailed prompts, and you, as the sole human developer, act as the project orchestrator.
Kanban Workflow: Tasks are managed on a Notion Kanban board, progressing through Backlog, To Do, Vibecoding in Progress, Ready for Review, Testing, and Done states.
AI Agent Logbook: Each task card serves as a logbook entry, meticulously documenting the AI prompt, generated output, review notes, and traceability links to the main specification.
This structured approach ensures transparency, quality, and efficient iteration throughout the development process.
