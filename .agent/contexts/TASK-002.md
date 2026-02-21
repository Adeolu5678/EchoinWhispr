# TASK-002: Core Services Implementation

## 🎯 Objective
Implement the foundational data and authentication layers using HTTP-based interaction for Convex (Backend) and Clerk (Auth), as no official Flutter SDKs exist for these.

## 📋 Requirements
1.  **Secure Storage Service**:
    -   Wrapper around `flutter_secure_storage`.
    -   Methods: `saveToken`, `getToken`, `deleteToken`, `clearAll`.
2.  **Clerk Auth Service**:
    -   Interact with Clerk Backend API via HTTP.
    -   Endpoints: `/v1/client/sign_ins`, `/v1/client/sign_ups`.
    -   Manage Session Token (JWT).
    -   Expose `authStateChanges` stream.
3.  **Convex Client**:
    -   Interact with Convex Functions (`query`, `mutation`) via HTTP.
    -   Endpoint: `https://[CONVEX_URL].convex.cloud/api/function`.
    -   Inject Auth Token in Headers (`Authorization: Bearer [TOKEN]`).
    -   Handle JSON serialization/deserialization.
4.  **WebSocket Client** (Low Priority for this task, but scaffold):
    -   Prepare `ConvexWebSocket` for real-time updates.

## 🔗 References
-   **Convex API**: `https://docs.convex.dev/http-api`
-   **Clerk API**: `https://clerk.com/docs/reference/backend-api`
-   **Web Implementation**: Check `Convex/convex` for function names.

## 🛠️ Implementation Plan
1.  [ ] Create `lib/services/storage/secure_storage_service.dart`.
2.  [ ] Create `lib/services/clerk/clerk_auth_service.dart` with Dio.
3.  [ ] Create `lib/services/convex/convex_client.dart` with Dio.
4.  [ ] Setup Riverpod Providers for these services interactively.

## 📝 Notes
-   Hardcode the Convex URL and Clerk Publishable Key for now (add to `core/constants/api_constants.dart`).
-   Use `dio` for all HTTP requests.
-   Ensure `ConvexClient` can handle standard Convex response format.
