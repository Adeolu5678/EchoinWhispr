# API Endpoints Documentation

## Overview

EchoinWhispr is an anonymous messaging platform built on a modern Web2 stack. The system architecture combines Convex for backend logic and real-time database capabilities with Clerk for authentication. API endpoints are implemented primarily through Convex functions (Queries, Mutations, and Actions).

- **Convex Functions**: Serverless functions that run on Convex's infrastructure for data persistence, business logic, and third-party integrations.
- **Web API Routes**: Next.js API routes for specific edge cases or integrations not suitable for Convex directly (though most logic resides in Convex).
- **External Services**: Integration with Clerk for identity management and potentially other services for media storage if not using Convex file storage.

## Convex Functions (Backend API)

The core backend logic is implemented in Convex. These functions are called directly from the client using the `convex/react` hooks.

### User Management

#### `mutation users.register(args: { career: string, interests: string[], mood: string })`

- **Description**: Registers a new user and creates their anonymous persona profile linked to their Clerk identity.
- **Parameters**:
  - `career`: User's career (e.g., "Software Engineer")
  - `interests`: Array of user interests (e.g., ["Tech", "Art"])
  - `mood`: Current mood status (e.g., "Creative")
- **Returns**: User ID
- **Auth**: Required (Clerk)

#### `mutation users.updatePersona(args: { career: string, interests: string[], mood: string })`

- **Description**: Updates an existing user's persona information.
- **Parameters**:
  - `career`: Updated career string
  - `interests`: Updated interests array
  - `mood`: Updated mood string
- **Returns**: null
- **Auth**: Required (Clerk)

### Subscription Management

#### `mutation subscriptions.upgrade(args: { planId: string })`

- **Description**: Initiates a subscription upgrade (e.g., via Stripe checkout session creation).
- **Parameters**:
  - `planId`: ID of the plan to subscribe to
- **Returns**: Checkout URL or status

#### `query subscriptions.getStatus(args: {})`

- **Description**: Checks the current user's subscription status.
- **Returns**: Subscription object (status, expiry, plan)

### Query Functions

#### `query users.getProfile(args: { userId: Id<"users"> })`

- **Description**: Retrieves a user's complete anonymous persona.
- **Returns**: User profile object

#### `query users.findMoodMatch(args: { mood: string })`

- **Description**: Finds a random user with matching mood for anonymous matching.
- **Returns**: Matched User ID or null

#### `query users.search(args: { query: string })`

- **Description**: Searches for users by username or public handle.
- **Parameters**:
  - `query`: Search string
- **Returns**: Array of matching user objects

### Admin Functions

#### `mutation admin.updateSettings(args: { setting: string, value: any })`

- **Description**: Updates global platform settings.
- **Auth**: Admin only

## Web API Routes

The web application provides RESTful API endpoints for specific integrations, suchs as webhooks.

### Webhooks

#### `POST /api/webhooks/clerk`

- **Description**: Handles user creation/update events from Clerk.

#### `POST /api/webhooks/stripe`

- **Description**: Handles subscription payment events from Stripe.

## External Services

### File Storage (Convex Storage)

The system uses Convex's built-in file storage for images and attachments.

#### Content Upload

- **uploadUrl**: Generated via `mutation generateUploadUrl`
- **storageId**: Returned after upload, stored in database records

#### Content Retrieval

- **storageId**: Used to generate signed URLs for serving content

### Identity Services (Clerk)

- **Authentication**: Handled via Clerk SDK (Login, Logout, Session Management)
- **User Metadata**: Stored in Clerk and synced to Convex users table

### Encryption

While not using decentralized keys, end-to-end encryption can still be implemented client-side if required for specific "whisper" features, using standard crypto libraries (e.g., Web Crypto API) before sending data to Convex.
