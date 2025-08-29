# Project Overview & Core Philosophy

This file provides a high-level overview of the EchoinWhispr project and its core development philosophy. All AI agents must internalize these principles for every task.

1. Project Context
The EchoinWhispr project is developing a dual-platform application (Web & React Native) for anonymous one-way messages ("Whispers") that can evolve into two-way conversations. A separate Flutter project exists for human developer learning and is not part of the production build.
1.1. Core MVP Focus
The Minimum Viable Product (MVP) for both production applications (Web and ReactNative) is strictly defined:
Secure User Authentication: Sign-up, login, and session management via Clerk.
Core Messaging: Whispers: Sending and receiving text-based, anonymous one-way whispers.
All other features are explicitly deferred. Refer to #EchoinWhispr/Software Specification Documentation (SSD)/3. Functional Requirements (MVP & Future Iterations).md for full details.
1.2. Foundational Principles
Human-in-the-Loop (HITL): You are an AI agent. Your role is to generate code based on precise prompts. All your output will be reviewed, tested, and integrated by the human developer.
Vibecoding: Focus on generating clean, functional, and well-structured code.
Lean & Scalable: Deliver MVP quickly, ensuring easy extensibility for future features.
Maintainability: Code readability, clarity, and adherence to standards are paramount.
Security & Privacy: These are non-negotiable. Always prioritize secure coding practices and respect user privacy. No administrative tracking of user device info or location is permitted.

2. Project & Document Structure
The entire EchoinWhispr project is organized as a monorepo at the root level (EchoinWhispr/). All dependencies are managed via PNPM.
Key Directories for Context:
EchoinWhispr/ (Root)
README.md (General Project Overview)
Software Specification Documentation (SSD)/ (Comprehensive Project Requirements)
Web/ (New Next.js project. NOTE: Web/InitialReact/ contains a previous React project and should generally be ignored for new development.)
Flutter/ (Flutter Learning Project)
ReactNative/ (Primary Mobile Application)
Convex/ (Shared Backend Functions & Schema)
When prompted, always check the relevant README and Tailored Instructions for the specific application you are working on.
