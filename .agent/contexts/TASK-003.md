# TASK-003: Navigation & App Shell

## 🎯 Objective
Implement the application's routing structure using `go_router` and create the persistent `BottomNavigationBar` shell that houses the main tabs (Search, Mood, Inbox, Profile).

## 📋 Requirements
1.  **Placeholder Screens**: Create basic `StatelessWidget` screens for all main routes:
    -   `SignInScreen`, `SignUpScreen`
    -   `SearchScreen`
    -   `MoodMatchScreen`
    -   `InboxScreen`
    -   `ProfileScreen`
2.  **App Shell**: Create a `MainShell` widget that holds the `BottomNavigationBar` and the `child` (current screen).
3.  **Router Configuration**: Implement `GoRouter` provider:
    -   Define routes: `/sign-in`, `/sign-up`, `/` (Shell Route).
    -   Implement redirection logic (redirect to `/sign-in` if not authenticated - stub for now).
4.  **Bottom Navigation**:
    -   Style according to design (Glassmorphism if possible, or matches AppTheme).
    -   Icons: Search, Mood, Inbox, Person.

## 🔗 References
-   **IA Specs**: `Documentations/UI-UX Specifications/UX Architecture & User Flow Specification/5. Information Architecture (IA).md`
-   **Web Layout**: `Web/src/components/layout/Navbar.tsx` (or similar)

## 🛠️ Implementation Plan
1.  [ ] Create placeholder screens in `lib/features/**/presentation/screens/`.
2.  [ ] Create `lib/shared/widgets/bottom_nav_bar.dart`.
3.  [ ] Create `lib/shared/widgets/app_shell.dart`.
4.  [ ] Create `lib/app_router.dart` (or `core/router/router.dart`).
5.  [ ] Update `lib/app.dart` to use `MaterialApp.router`.

## 📝 Notes
-   Use `StatefulShellRoute.indexedStack` for the bottom nav to preserve state.
-   Ensure routes are named constants in `AppRoutes` class.
