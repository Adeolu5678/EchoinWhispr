# React Native Application Specifics (Expo)

This file contains tailored instructions for AI agents working on the primary mobile application (React Native with Expo). These directives complement the general project rules and focus on React Native, Expo, and mobile-specific best practices.

1. Project Structure & Setup
Location: All code for the React Native application resides in the EchoinWhispr/ReactNative/ directory.
Expo Router: Utilize Expo Router for file-based routing.
Route Groups: Define route groups for authentication (app/(auth)/) and tab navigation (app/(tabs)/).
Layouts: Use _layout.tsx files for layout components (e.g., ClerkProvider at root, tab bar in (tabs)/_layout.tsx).
Module Structure: Adhere to the modular structure outlined in #EchoinWhispr/ReactNative/Tailored Instructions/1. Project Setup & Initialization.md.

2. Core Technologies & Directives
React Native & Expo:
Managed Workflow: Prioritize using Expo's managed workflow components and SDKs (e.g., expo-notifications, expo-location).
Native Modules: Avoid direct interaction with native modules unless explicitly required by a prompt and carefully justified.
UI Components: Use core React Native components (View, Text, TextInput, FlatList, TouchableOpacity, Image).
React:
Hooks: Use React Hooks for state management and side effects.
Performance: Optimize React Native components to prevent unnecessary re-renders (refer to coding_standards.md).
Styling:
Tailwind CSS (NativeWind): Integrate NativeWind (or similar) to apply Tailwind CSS utility classes directly to React Native components. This is the primary styling mechanism.
Custom Styles: Use StyleSheet.create sparingly for complex, reusable component-specific styles that cannot be achieved with Tailwind.
Convex Client: Integrate the Convex React client SDK for data interactions in React Native.
Clerk Integration: Use Clerk's React Native/Expo SDK for authentication. Implement ClerkProvider and route protection.

3. UI/UX Specifics (React Native)
Mobile-First: Design is strictly mobile-first.
Responsive Design:
Directive: Use React Native's Flexbox properties and Tailwind's responsive utilities for fluid layouts.
Pixels: Use density-independent pixels (dp) for all sizing, padding, and margins.
Safe Areas: Implement SafeAreaView (from react-native-safe-area-context) to correctly handle notches and dynamic islands on iOS.
No Horizontal Scrolling: The application must not have horizontal scrolling on any device or orientation.
Icons: Use @expo/vector-icons (e.g., Ionicons, MaterialIcons) for a consistent icon set.
Feedback: Use custom toast notifications or modals for user feedback (alert() and confirm() are forbidden).

4. Platform-Specific Considerations
Android:
Hardware Back Button: Implement consistent handling of the Android hardware back button (e.g., navigate back, then exit app from root).
Permissions: Follow Android-specific guidelines for requesting
permissions.
iOS:
Safe Area Insets: Correctly use SafeAreaView.
Native Gestures: Ensure swipe-back gestures are supported in navigation stacks.
Permissions: Follow iOS-specific guidelines for requesting permissions.

5. Development Workflow & AI Interaction
Refer to Tailored Instructions: When generating code for the React Native application, always consult the specific guidelines in #EchoinWhispr/ReactNative/Tailored Instructions/. This document provides the most granular instructions for your task.
