# Security & Privacy Guidelines

This file outlines the critical security and privacy directives for all aspects of the EchoinWhispr project. These are non-negotiable and must be prioritized in every code generation task.

1. Authentication & Authorization
Clerk Integration:
Directive: All user authentication and authorization must be handled exclusively by Clerk. Never attempt to implement custom authentication logic.
Implementation: Integrate Clerk's official SDKs (Next.js for Web, React Native/Expo for Mobile) correctly, as detailed in the platform-specific Tailored Instructions.
Session Management: Rely on Clerk's SDK for secure session management, token handling, and session expiry.
Convex Security Rules:
Directive: Access to Convex data must be strictly controlled by Convex's built-in security rules.
Implementation: All Convex functions (queries and mutations) that interact with user data or sensitive information must include robust authorization checks based on ctx.auth.userId. Ensure users can only read/write data they are explicitly authorized for (e.g., read their own whispers, whispers sent to them; modify their own profile).
Schema: Adhere to the defined Convex/schema.ts for data structure and validation.

2. Data in Transit & at Rest
Data in Transit (Encryption):
Directive: All communication between client applications (Web, React Native), Clerk, and Convex must be encrypted using HTTPS/TLS protocols.
Implementation: Always use https for all API endpoints. Do not allow fallback to HTTP.
Data at Rest (Backend):
Directive: Rely on Convex's robust default security measures for data storage and protection.
Implementation: Ensure Convex functions handle data responsibly. Avoid storing unnecessary sensitive data.
Sensitive Data Handling:
Directive: Never store sensitive user data (e.g., raw passwords, API keys, private tokens) client-side in plain text or in insecure locations.
Implementation: Environment variables (.env files for development) must be used for all API keys and secrets.

3. Input Validation & Protection
Comprehensive Input Validation:
Directive: Implement rigorous server-side (Convex) and client-side input validation to prevent malicious data injection (e.g., XSS, SQL injection variants in document databases) and ensure data integrity.
Server-Side: Mandatory to use Convex's validation utilities (v.string().min(1).max(280), v.id(), v.object()) in all mutations and queries that accept user input.
Client-Side: Implement validation for immediate user feedback.
Cross-Site Scripting (XSS) Prevention:
Directive: All user-generated content displayed in the UI must be properly sanitized to prevent XSS attacks.
Implementation (React/React Native): React/React Native generally escape content by default, but be vigilant when using dangerouslySetInnerHTML (Web) or rendering rich text.

4. User Privacy
No Unnecessary Data Collection:
Directive: Only collect user data that is strictly necessary for the core functionality of the application and for which explicit user consent has been obtained (if applicable).
Explicitly Forbidden: No administrative tracking of user device information or location is permitted. The initial request for this feature has been definitively removed from scope.
Permission Requests:
Directive: When requesting device permissions (e.g., for push notifications, location), provide clear context to the user about why the permission is needed and obtain explicit consent.
Implementation: Follow platform-specific guidelines for permission prompts (iOS and Android).

5. External Dependencies
Third-Party Libraries:
Directive: When integrating third-party libraries, prioritize those with strong security track records and active maintenance.
Vigilance: Be aware of potential security vulnerabilities introduced by external dependencies.
