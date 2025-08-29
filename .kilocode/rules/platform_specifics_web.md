# Web Application Specifics (Next.js)

This file contains tailored instructions for AI agents working on the Web application. These directives complement the general project rules and focus on Next.js, React, and web-specific best practices.

1. Project Structure & Setup
Location: All code for the Web application resides in the EchoinWhispr/Web/ directory.
Previous Project: IMPORTANT: The EchoinWhispr/Web/InitialReact/ folder contains a previous React project. Do not read, modify, or generate code based on this folder. Focus exclusively on the new Next.js project.
Root Layout: The Web/src/app/layout.tsx is the root layout for the entire application.
Authentication Routes: Authentication-related routes (sign-in, sign-up) are grouped under Web/src/app/(auth)/.
Module Structure: Adhere to the modular structure outlined in #EchoinWhispr/Web/Tailored Instructions/1. Project Setup & Initialization.md.

2. Core Technologies & Directives
Next.js:
App Router: Utilize the Next.js App Router.
Components: Prefer Server Components for data fetching and rendering static/less-interactive parts of the UI. Use Client Components only when interactivity (hooks, event listeners) is required. Clearly delineate client components with 'use client'.
Optimizations: Leverage next/image for image optimization, next/font for font optimization, and Next.js data fetching methods (getServerSideProps, getStaticProps, revalidate) judiciously.
React:
Hooks: Use React Hooks (useState, useEffect, useContext, useCallback, useMemo) for state management and side effects.
Performance: Optimize React components to prevent unnecessary re-renders (refer to coding_standards.md).
Styling:
Tailwind CSS: Exclusively use Tailwind utility classes for styling.
Shadcn UI: Prioritize Shadcn UI components for inputs, buttons, cards, dialogs, toasts, and other common UI elements. Customize Shadcn components using Tailwind as needed.
Convex Client: Integrate the Convex React client SDK for data interactions.
Clerk Integration: Use Clerk's Next.js SDK for authentication. Implement ClerkProvider and route protection middleware.

3. UI/UX Specifics (Web)
Responsive Design:
Directive: Implement fully responsive layouts using Tailwind's responsive prefixes (sm:, md:, lg:, etc.), Flexbox, and Grid. The application must not have horizontal scrolling.
Accessibility:
Directive: Ensure generated HTML is semantic. Where custom interactive components are created, include appropriate ARIA attributes.
Navigation:
Directive: Implement a clear header for global navigation. Use standard HTML <a> tags or next/link for internal navigation.

4. Development Workflow & AI Interaction
Refer to Tailored Instructions: When generating code for the Web application, always consult the specific guidelines in #EchoinWhispr/Web/Tailored Instructions/. This document provides the most granular instructions for your task.
