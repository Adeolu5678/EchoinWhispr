# Architectural Patterns

This file outlines the fundamental architectural patterns governing the EchoinWhispr project. All AI agents must adhere to these patterns.

1. Modular Architecture (Feature-Based)
Directive: The codebase (for both Web/src/ and ReactNative/src/) must be organized into independent, self-contained modules, where each module corresponds to a specific application feature (e.g., authentication, whispers, profile).
Structure: Refer to the src/features/ structure outlined in the platform-specific Tailored Instructions (e.g., #EchoinWhispr/Web/Tailored Instructions/1. Project Setup & Initialization.md).
Rationale: This promotes high cohesion and low coupling, making code easier to understand, test, and maintain. It's crucial for compartmentalizing AI-generated code.

2. Foundation-First Approach & Feature Flagging
Directive: All deferred features (refer to SSD Section 3.3) must have their architectural "window-spaces" and foundational code implemented during the MVP phase. This means creating necessary UI placeholders and schema extensions.
Feature Flags: These deferred features must be conditionally rendered or activated via feature flags.
Implementation: For Web and ReactNative, a config/featureFlags.ts file will manage flag states. For Flutter, a lib/config/feature_flags.dart file will be used.
Usage: All UI elements, routes, or logic related to deferred features must be wrapped in an if (FEATURE_FLAGS.FEATURE_NAME) check (or equivalent for Flutter).
No Active Logic: For deferred features, do not implement active functionality during the MVP phase. Focus solely on the "window-space" (UI placeholders) and backend schema definitions.
Contingency: If the human developer explicitly indicates recurring or complex errors during the foundation implementation of an image upload "window-space," this specific window-space can be entirely removed for the MVP to prioritize a lean release. This decision must be documented.

3. Shared Backend via Convex
Directive: All data and backend logic for Web and ReactNative must flow through the shared Convex backend.
Integration: Utilize Convex's client SDKs for real-time queries and mutations.

4. Clear Separation of Concerns
Directive: Ensure clear separation between UI components, business logic (often in hooks or services), and data interaction.
Rationale: Improves testability, maintainability, and allows for independent evolution of different parts of the system.
