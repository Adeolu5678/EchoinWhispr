# TASK-004: Authentication Feature

## 🎯 Objective
Implement the full authentication flow including Sign In, Sign Up, and protected route redirection handling using Riverpod and GoRouter.

## 📋 Requirements
1.  **Auth State Management**:
    -   `AuthState`: Manage current user session and loading states.
    -   Methods: `signIn`, `signUp`, `signOut`, `restoreSession`.
2.  **UI Implementation**:
    -   **Sign In Screen**: Email & Password fields, "Sign In" button, "Create Account" link.
    -   **Sign Up Screen**: Username, Email, Password, "Sign Up" button.
    -   **Styling**: Use `AppTheme` (Dark mode, InputDecorations).
3.  **Routing Integration**:
    -   Update `AppRouter` to listen to `authStateChanges`.
    -   Redirect to `/sign-in` if not authenticated.
    -   Redirect to `/` (Home) if authenticated.

## 🔗 References
-   **Web Auth**: `Web/src/features/authentication/`
-   **Clerk Service**: `lib/services/clerk/clerk_auth_service.dart`

## 🛠️ Implementation Plan
1.  [ ] Create `lib/features/authentication/presentation/providers/auth_provider.dart`.
2.  [ ] Update `lib/core/router/app_router.dart` with `refreshListenable` and redirection logic.
3.  [ ] Implement `SignInScreen` with form validation and error handling.
4.  [ ] Implement `SignUpScreen` with form validation.
5.  [ ] Verify flow: Sign In -> Home -> Sign Out -> Sign In.

## 📝 Notes
-   Use `AsyncValue` for UI state (loading, error, data).
-   Ensure `SecureStorage` persists token so app stays logged in on restart.
