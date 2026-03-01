# API Endpoints Documentation (Convex Backend)

## Overview

EchoinWhispr's backend is powered by **Convex**, providing a reactive, real-time data layer with serverless logic. Clerk handles identity management, which is tightly integrated with Convex.

- **Convex Functions**: Accessible via `useQuery`, `useMutation`, and `useAction` in the frontend.
- **Authentication**: All non-public functions require a valid Clerk session.

---

## Core Modules

### User & Persona Management (`convex/users.ts`)

#### `query users.getCurrentUser`
- **Description**: Retrieves the currently authenticated user's data.
- **Returns**: User object or `null`.

#### `mutation users.getOrCreateCurrentUser`
- **Description**: Initializes a user record upon first login (called after Clerk auth).
- **Returns**: Newly created or existing user object.

#### `mutation users.updateUsername(args: { username: string })`
- **Description**: Sets or updates the user's unique platform handle.

#### `mutation users.updateUserProfile(args: { career?, interests?, mood?, bio?, avatarUrl?, isPublic? })`
- **Description**: Updates the user's anonymous persona and public profile.

---

### Messaging & Whispers (`convex/whispers.ts`)

#### `mutation whispers.sendWhisper(args: { recipientUsername: string, content: string, imageUrl?, location? })`
- **Description**: Sends an anonymous one-way message.
- **Constraints**: 280 character limit; rate-limited to 20/hour.

#### `query whispers.getReceivedWhispers(args: { paginationOpts })`
- **Description**: Paginated list of whispers received by the user.

#### `mutation whispers.replyToWhisper(args: { parentWhisperId: Id, content: string })`
- **Description**: Creates a "Whisper Chain" by replying to your own whisper.

---

### Echo Chambers (`convex/echoChambers.ts`)

#### `mutation echoChambers.create(args: { name: string, topic: string, isPublic: boolean })`
- **Description**: Creates a new anonymous group chat room.

#### `mutation echoChambers.sendMessage(args: { chamberId: Id, content: string })`
- **Description**: Sends a message within a chamber using an anonymous alias.

---

### Resonance & Matching (`convex/resonance.ts`)

#### `query resonance.findMatches`
- **Description**: Finds potential connections based on current mood and shared interests.

#### `mutation resonance.updatePreferences(args: { preferSimilarMood: boolean, matchLifePhase: boolean })`
- **Description**: Tunes the resonance matching algorithm for the user.

---

### Unmasking Ceremony (`convex/unmasking.ts`)

#### `mutation unmasking.request(args: { conversationId: Id })`
- **Description**: Proposes an identity reveal to a connection.
- **Logic**: Identity is only revealed if both parties accept (Mutual Consent).

---

### Admin System (`convex/admin.ts`)

#### `query admin.getAnalytics`
- **Description**: Provides platform growth and engagement metrics.
- **Auth**: Admin/Super-Admin only.

---

## Webhooks (`Web/src/app/api/webhooks/`)

#### `POST /api/webhooks/clerk`
- **Description**: Syncs Clerk user events (creation, deletion, updates) to the Convex database.

---

## File Storage

Uses **Convex Storage** for all media assets.
- **Upload**: Call `generateUploadUrl` mutation, then POST to the returned URL.
- **Access**: Store the `storageId` in document fields to generate signed URLs via `ctx.storage.getUrl()`.
