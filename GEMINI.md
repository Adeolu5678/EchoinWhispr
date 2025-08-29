# AI Agent Preamble & Guidelines

Purpose: This GEMINI.md file serves as a comprehensive, always-present context for all AI agents working on the EchoinWhispr project. It consolidates the project's vision, architecture, technology stack, and critical development guidelines. Refer to this document constantly to ensure your generated code aligns with project standards and goals.

1. Project Overview & Core Philosophy
The EchoinWhispr project is developing a dual-platform application (Web & React Native) for anonymous one-way messages ("Whispers") that can evolve into two-way conversations. A separate Flutter project exists for human developer learning.
Core Principles:
Human-in-the-Loop (HITL): You are an AI agent, and your primary role is to generate code based on precise prompts. All your output will be reviewed, tested, and integrated by the human developer.
Vibecoding: Focus on generating clean, functional, and well-structured code that adheres to the project's specifications.
Lean & Scalable: Deliver the MVP features as quickly as possible, ensuring the architecture is easily extensible for future additions.
Maintainability: Code readability, clarity, and adherence to standards are paramount for long-term project health.
Security & Privacy: These are non-negotiable. Always prioritize secure coding practices and respect user privacy.

2. Project & Document Structure
The entire EchoinWhispr project is organized as a monorepo at the root level (EchoinWhispr/). All dependencies are managed via PNPM.
Key Directories:
EchoinWhispr/ (Root)
README.md (General Project Overview - #EchoinWhispr/README.md)
Software Specification Documentation (SSD)/ (Comprehensive Project Requirements)
1. Introduction & Overview.md (#EchoinWhispr/Software Specification Documentation (SSD)/1. Introduction & Overview.md)
2. Unified Technology Stack & Architecture.md (#EchoinWhispr/Software Specification Documentation (SSD)/2. Unified Technology Stack & Architecture.md)
3. Functional Requirements (MVP & Future Iterations).md (#EchoinWhispr/Software Specification Documentation (SSD)/3. Functional Requirements (MVP & Future Iterations).md)
4. Non-Functional Requirements.md (#EchoinWhispr/Software Specification Documentation (SSD)/4. Non-Functional Requirements.md)
5. UI_UX Specifications.md (#EchoinWhispr/Software Specification Documentation (SSD)/5. UI_UX Specifications.md)
6. Platform-Specific Considerations.md (#EchoinWhispr/Software Specification Documentation (SSD)/6. Platform-Specific Considerations.md)
7. Assumptions, Constraints & Dependencies.md (#EchoinWhispr/Software Specification Documentation (SSD)/7. Assumptions, Constraints & Dependencies.md)
8. Quality Assurance & Project Management.md (#EchoinWhispr/Software Specification Documentation (SSD)/8. Quality Assurance & Project Management.md)
9. Traceability Matrix Principles.md (#EchoinWhispr/Software Specification Documentation (SSD)/9. Traceability Matrix Principles.md)
10. Glossary of Terms.md (#EchoinWhispr/Software Specification Documentation (SSD)/10. Glossary of Terms.md)
Web/ (Web Application Codebase - New Next.js project resides here. 'InitialReact' is a previous version.)
README.md (Web App Overview - #EchoinWhispr/Web/README.md)
Tailored Instructions/ (Specific Web Dev Instructions)
1. Project Setup & Initialization.md (#EchoinWhispr/Web/Tailored Instructions/1. Project Setup & Initialization.md)
2. Functional Requirements Implementation (MVP).md (#EchoinWhispr/Web/Tailored Instructions/2. Functional Requirements Implementation (MVP).md)
3. Deferred Features (Foundation-First Approach).md (#EchoinWhispr/Web/Tailored Instructions/3. Deferred Features (Foundation-First Approach).md)
4. Non-Functional Requirements (Web Specific).md (#EchoinWhispr/Web/Tailored Instructions/4. Non-Functional Requirements (Web Specific).md)
5. UI_UX Specifications (Web Specific).md (#EchoinWhispr/Web/Tailored Instructions/5. UI_UX Specifications (Web Specific).md)
6. Development Workflow & AI Interaction.md (#EchoinWhispr/Web/Tailored Instructions/6. Development Workflow & AI Interaction.md)
Flutter/ (Flutter Learning Project Codebase)
README.md (Flutter App Overview - #EchoinWhispr/Flutter/README.md)
Tailored Instructions/ (Specific Flutter Learning Instructions)
1. Project Setup & Initialization.md (#EchoinWhispr/Flutter/Tailored Instructions/1. Project Setup & Initialization.md)
2. Core Functional Requirements Implementation (Learning Goals).md (#EchoinWhispr/Flutter/Tailored Instructions/2. Core Functional Requirements Implementation (Learning Goals).md)
3. Deferred Features (Foundation-First Approach - Learning Focus).md (#EchoinWhispr/Flutter/Tailored Instructions/3. Deferred Features (Foundation-First Approach - Learning Focus).md)
4. Non-Functional Requirements (Flutter Specific Learning).md (#EchoinWhispr/Flutter/Tailored Instructions/4. Non-Functional Requirements (Flutter Specific Learning).md)
5. UI_UX Specifications (Flutter Specific Learning).md (#EchoinWhispr/Flutter/Tailored Instructions/5. UI_UX Specifications (Flutter Specific Learning).md)
6. Development Workflow (Personal Learning).md (#EchoinWhispr/Flutter/Tailored Instructions/6. Development Workflow (Personal Learning).md)
ReactNative/ (Primary Mobile Application Codebase)
README.md (React Native App Overview - #EchoinWhispr/ReactNative/README.md)
Tailored Instructions/ (Specific React Native Dev Instructions)
1. Project Setup & Initialization.md (#EchoinWhispr/ReactNative/Tailored Instructions/1. Project Setup & Initialization.md)
2. Functional Requirements Implementation (MVP).md (#EchoinWhispr/ReactNative/Tailored Instructions/2. Functional Requirements Implementation (MVP).md)
3. Deferred Features (Foundation-First Approach).md (#EchoinWhispr/ReactNative/Tailored Instructions/3. Deferred Features (Foundation-First Approach).md)
4. Non-Functional Requirements (ReactNative Specific).md (#EchoinWhispr/ReactNative/Tailored Instructions/4. Non-Functional Requirements (ReactNative Specific).md)
5. UI_UX Specifications (ReactNative Specific).md (#EchoinWhispr/ReactNative/Tailored Instructions/5. UI_UX Specifications (ReactNative Specific).md)
6. Development Workflow & AI Interaction.md (#EchoinWhispr/ReactNative/Tailored Instructions/6. Development Workflow & AI Interaction.md)
Convex/ (Shared Backend Functions & Schema)
GEMINI.md (This file)
3. Unified Technology Stack & Key Directives
All production applications (Web and ReactNative) share the following core technologies. Flutter is a learning project but will integrate with shared backend services.
3.1. Backend & Authentication
Convex: The sole backend service for real-time database and API. Refer to Official Convex Docs for detailed usage.
Directive: All data persistence, fetching, and business logic must occur via Convex queries and mutations. Adhere to the shared schema defined in Convex/schema.ts. Implement robust Convex security rules.
Clerk: Handles all user authentication and session management. Refer to Official Clerk Docs.
Directive: Never implement custom authentication logic. Integrate Clerk SDKs as specified for each platform. Ensure secure handling of user sessions.
3.2. Frontend Frameworks
React (Web & React Native): Base UI library.
Next.js (Web): For Web application. Refer to Official Next.js Docs.
Directive: Utilize App Router, prefer Server Components where appropriate, and leverage Next.js optimizations.
React Native & Expo (Mobile): For primary mobile application. Refer to Official React Native Docs and Official Expo Docs.
Directive: Prioritize Expo managed workflow. Use Expo Router for navigation.
Flutter (Learning): For the learning project. Refer to Official Flutter Docs.
Directive: Focus on learning Flutter/Dart best practices, state management, and custom integration with Convex/Clerk APIs.
3.3. Styling & UI Components
Tailwind CSS: Utility-first CSS framework. Refer to Official Tailwind CSS Docs.
Directive: Use Tailwind for all styling. For React Native, use NativeWind or equivalent.
Shadcn UI (Web): Component library for Web. Refer to Official Shadcn UI Docs.
Directive: Prioritize Shadcn components for common UI elements in the Web app.
3.4. Development Tooling
TypeScript: Mandatory for all code. Enable strict type checking.
Directive: All components, hooks, functions, services, and data models must be strongly typed. Define interfaces for props, state, and API responses.
PNPM: Package manager for the monorepo.
Directive: Always use pnpm for dependency management.
4. Architectural & Coding Directives
4.1. Modular Architecture (Feature-Based)
Directive: Organize code by feature (e.g., features/authentication, features/whispers), not by file type. This applies to Web/src/ and ReactNative/src/. Refer to SSD Section 2.4.1 and the platform-specific Tailored Instructions for exact structures.
4.2. Feature Flagging
Directive: All deferred features must be wrapped in explicit feature flag checks. Refer to config/featureFlags.ts (for Web/RN) or lib/config/feature_flags.dart (for Flutter).
Action: Implement foundational UI placeholders and schema extensions for future features, but do not implement active logic unless explicitly instructed otherwise by the human developer.
4.3. Code Quality & Standards
Clean Code: Write concise, readable, self-documenting code. Avoid unnecessary complexity.
Comments: Provide clear and comprehensive comments for complex logic, non-obvious implementations, function headers, and component purposes.
TypeScript Everywhere: As noted in Section 3.3.
No alert() or confirm(): Absolutely forbidden in all generated code. Use custom toast notifications or modal components for user feedback.
Input Validation: Implement both client-side and server-side (Convex) input validation.
Error Handling: Implement robust try-catch blocks for all asynchronous operations.
Performance: Optimize for 60 FPS UI responsiveness and fast load times (max 3 seconds cold start).
5. UI/UX Directives
Minimalist & Clean: Focus on essential elements, clear visual hierarchy.
Inter Font: Use "Inter" as the primary font family.
Responsive Design: Ensure layouts adapt gracefully to different screen sizes and orientations. No horizontal scrolling.
Consistent Components: Utilize specified UI component libraries (Shadcn for Web) and Tailwind CSS for consistent styling.
6. Development Workflow & AI Interaction
Prompt Adherence: Your generated code must directly address the requirements in the provided prompt. If the prompt is ambiguous, ask clarifying questions.
Output Format: Provide complete, well-formatted, and runnable code blocks for each component, hook, or function as requested. Ensure correct imports and declare all dependencies.
Self-Correction: If you identify potential issues (performance, security, better patterns), highlight them and suggest improvements.
This GEMINI.md is your constant companion. Consult it with every task to ensure alignment with the EchoinWhispr project's high standards.
