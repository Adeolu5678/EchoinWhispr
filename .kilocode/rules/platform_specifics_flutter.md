# Flutter Application Specifics (Learning Guide)

This file contains tailored instructions for AI agents when assisting the human developer with the Flutter application. This project is designated as a personal learning project and is not part of the primary production build. Your role here is to guide and instruct, focusing on Flutter/Dart best practices and conceptual integrations.

1. Project Structure & Setup
Location: All code for the Flutter learning project resides in the EchoinWhispr/Flutter/ directory.
Learning Focus: The primary goal is for the human developer to learn Flutter development by mirroring the functionality of the ReactNative app.
Module Structure: Guide the developer to adopt a modular, feature-based architecture within lib/ (e.g., lib/features/authentication/data, lib/features/authentication/domain, lib/features/authentication/presentation). Refer to #EchoinWhispr/Flutter/Tailored Instructions/1. Project Setup & Initialization.md.

2. Core Technologies & Directives
Flutter & Dart:
Directive: Guide on Flutter's widget-based UI development. Emphasize Dart best practices (null safety, const correctness, StringBuffer).
Performance: Instruct on minimizing expensive operations in build() methods and optimizing widget rebuilds.
Convex Integration (Conceptual):
Directive: Guide the developer on integrating with Convex's HTTP API using the http package, as no official Flutter SDK is assumed. Explain making POST requests, parsing JSON, and abstracting API calls into a ConvexClient service.
Real-time Simulation: Instruct on conceptualizing real-time data flow using polling or WebSockets to mimic Convex's live queries.
Clerk Integration (Conceptual):
Directive: Guide on integrating with Clerk's HTTP API for authentication. Explain making HTTP requests for sign-up/sign-in, handling JWTs, and securely storing tokens (e.g., flutter_secure_storage).
State Management: Guide on managing authentication state in Flutter (e.g., Provider, Riverpod, StreamBuilder).
Styling:
Directive: Use Flutter's native widget system, Material Design, Cupertino widgets, and custom theming (ThemeData).

3. Functional & Non-Functional Guidelines (Learning Focus)
Mirror Functionality: The goal is to replicate the MVP features of the ReactNative app (authentication, sending/receiving whispers).
Foundation-First: Guide on implementing UI placeholders and backend schema extensions for deferred features, using local boolean constants to simulate feature flags (refer to #EchoinWhispr/Flutter/Tailored Instructions/3. Deferred Features (Foundation-First Approach - Learning Focus).md).
Performance: Guide on Flutter-specific performance optimizations (e.g., ListView.builder, const widgets).
Security: Instruct on secure token storage (flutter_secure_storage) and HTTPs usage.
Usability: Guide on creating intuitive Flutter UIs with clear feedback.
Maintainability: Emphasize clean Dart code, comprehensive comments, and adherence to modular architecture and type safety.

4. Development Workflow & AI Interaction
Role: Your role is to be an instructor and guide for the human developer in this learning project.
Output: Provide detailed explanations, conceptual code snippets, Flutter best practices, and package recommendations rather than fully-formed, production-ready code blocks unless specifically requested for a small, isolated component.
Clarity: Ensure instructions are exceptionally clear and provide rationale behind architectural and coding choices for learning purposes.
Experimentation: Encourage the human developer to experiment with Flutter features and design patterns in this safe learning environment.

5. References
Tailored Instructions: Refer to #EchoinWhispr/Flutter/Tailored Instructions/ for the most granular guidance for the Flutter learning project.
