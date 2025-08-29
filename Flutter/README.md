# EchoinWhispr: Flutter Application (Flutter Folder)

This Flutter folder contains the codebase for a separate Flutter mobile application. Unlike the Web and ReactNative projects, this application is designated as a personal learning project and is not part of the primary production build. Its purpose is to serve as a hands-on challenge for you to learn Flutter development by independently re-coding the functionality of the vibecoded React Native application.

1. Project Overview
The Flutter EchoinWhispr application aims to replicate the core functionalities of the primary mobile and web applications, offering a native mobile experience for anonymous one-way messages ("Whispers") that can evolve into two-way conversations. This project provides a practical sandbox for learning Flutter and Dart, allowing for direct comparison and understanding of cross-platform development paradigms.

2. Technology Stack (Learning Context)
While this project is for learning, it will conceptually interact with the same backend services for a realistic development experience.
Mobile Framework: Flutter with Dart
This is the primary learning technology, providing a robust framework for building natively compiled applications for mobile, web, and desktop from a single codebase.
Backend & API Layer: Convex
As with the other applications, Convex will serve as the database and API layer, allowing for real-time data interactions. (Note: Specific Flutter integration with Convex will be a learning exercise.)
Authentication: Clerk
Clerk will handle user authentication, providing a consistent authentication experience across the entire EchoinWhispr ecosystem. (Note: Clerk integration in Flutter will be a learning exercise.)
Package Management: PNPM
PNPM will be used for efficient package management within the monorepo structure.

3. Core Functionality (Learning Goals)
The learning objective is to implement the core MVP features, mirroring those of the ReactNative and Web applications. This includes:
User Authentication: Implementing secure user sign-up and login using Flutter and Clerk.
Sending Whispers: Developing the UI and logic for composing and sending anonymous text messages.
Receiving Whispers: Building the interface for viewing received whispers.

4. Scalability & Future Features (Learning Focus)
This learning project will also focus on understanding and implementing best practices for scalable Flutter application development, including:
Modular Architecture: Organizing the Flutter codebase into feature-based modules to enhance maintainability and understanding.
"Window-space" for Future Features: Exploring how to design for extensibility, setting up architectural patterns that would facilitate the future addition of features like conversation evolution, image uploads, and push notifications, mirroring the ReactNative project's approach.

5. Development Approach (Personal Learning)
This Flutter project is self-directed. It is designed to reinforce software development principles through practical application, using the existing ReactNative application as a functional reference point.
