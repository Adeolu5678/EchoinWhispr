# TASK-001: Project Setup & Initialization

## 🎯 Objective
Initialize the Flutter project with a scalable Clean Architecture structure, configured dependencies, and core theme foundations to match the EchoinWhispr web application.

## 📋 Requirements
1.  **Project Creation**: Ensure Flutter project exists in `Flutter/` directory.
2.  **Directory Structure**: Create standard folders:
    -   `lib/core/` (constants, theme, utils, errors)
    -   `lib/features/` (auth, whispers, etc.)
    -   `lib/shared/` (widgets, models)
    -   `lib/services/` (convex, clerk, storage)
3.  **Dependencies**: Add essential packages to `pubspec.yaml`:
    -   `flutter_riverpod` (State Management)
    -   `go_router` (Navigation)
    -   `dio`, `web_socket_channel` (Network)
    -   `flutter_secure_storage`, `shared_preferences` (Storage)
    -   `freezed_annotation`, `json_annotation` (Data Models)
    -   `google_fonts` (Typography)
4.  **Theme Configuration**:
    -   Implement `AppTheme` class.
    -   Define colors (Primary, Accent, Background) matching Web app.
    -   Configure standard text styles.
5.  **Environment**: Setup basic environment configuration structure.

## 🔗 References
-   **Web Theme**: `Web/src/app/globals.css` (Tailwind config)
-   **Architecture**: Scalable Folder Structure (Feature-first)

## 🛠️ Implementation Plan
1.  [ ] Verify existing Flutter project or create new one.
2.  [ ] Update `pubspec.yaml` with all required dependencies.
3.  [ ] Create directory structure in `lib/`.
4.  [ ] Create `lib/core/theme/app_colors.dart` and `app_theme.dart`.
5.  [ ] Run `flutter pub get` and verify build.

## 📝 Notes
-   Follow "Feature-First" packaging.
-   Ensure Riverpod `ProviderScope` is at the root.
