# User Flows and Navigation Implementation Guide

This document provides detailed instructions for implementing the user flows and navigation structure as specified in the UX Architecture & User Flow Specification and High-Fidelity Mockups.

## Navigation Structure

### Persistent Bottom Tab Bar
Implement a fixed bottom navigation bar with the following tabs:

1. **Search** - Primary navigation to search and discover personas
2. **Mood Match** - Find users with matching current mood
3. **Inbox** - Access to messages with sub-tabs for Chats and Requests
4. **My Persona** - Profile management and subscription

#### Implementation Requirements
- Background: `bg-neutral-800` with `border-t border-neutral-700`
- Active state: Primary-500 icon and text label
- Inactive state: Neutral-400 icon, no text label
- Notification badge: Small Accent-500 dot for Inbox when there are unread requests

### Screen Hierarchy
```
Entry Flow:
├── Connect Wallet (Full screen)
└── Create Persona (Full screen)

Main App (Tab-based):
├── Search
│   ├── Search & Filter (Default)
│   └── View Persona & Send Whisper (Modal)
├── Mood Match
│   └── Mood Match Results (In-place)
├── Inbox
│   ├── Inbox Overview (Default)
│   ├── Whisper Request (Full screen)
│   └── Conversation View (Full screen)
└── My Persona
    └── Edit Persona (In-place)
```

## User Flow Implementations

### Flow 1: New User Onboarding & Persona Creation

#### Screen: Connect Wallet
- **Layout**: Full-screen centered column (`max-w-md mx-auto p-8`)
- **Background**: `bg-neutral-900`
- **Elements**:
  - Logo: "EchoinWhispr" with "Whispr" in Primary-500
  - Tagline: "Connect by Merit. Not by Status." (Neutral-400)
  - Description text (Neutral-100)
  - Primary button: "Connect Wallet" (full-width)
  - Link: "What is a Hedera wallet?" (Primary-400, underline on hover)

#### Screen: Create Persona
- **Layout**: Same as Connect Wallet
- **Elements**:
  - Header: "Create Your Anonymous Persona" (H1)
  - Description: Info about on-chain profile (Neutral-400)
  - Form fields:
    - Career: Text input with placeholder "e.g., Software Engineer"
    - Interests: Tag input field (add tags on enter/space)
    - Current Mood: Dropdown with predefined options
  - Info box: Card with encryption key generation notice
  - Primary button: "Create Persona & Sign" (full-width)

#### Flow Logic
1. On app load, check if user has connected wallet
2. If not connected: Show Connect Wallet screen
3. If connected but no persona: Query contract for `isInitialized`, show Create Persona if false
4. On persona creation: Generate keys client-side, prompt wallet signature, show loading state
5. Success: Navigate to Main Dashboard (Search tab)

### Flow 2: Search, Discover, & Initiate "Whisper"

#### Screen: Search & Filter
- **Header**: "Search" (H2) with "Daily Whispers Left: X" (X in Accent-500)
- **Content**:
  - Filter inputs: Career (text) and Interests (tag input) in horizontal layout
  - Loading state: Full overlay with spinner and "Syncing user directory..."
  - Results: Vertical list of Persona Cards

#### Persona Card Component
- **Style**: Card with Neutral-800 background, Neutral-700 border, 16px rounded corners
- **Content**:
  - Top-left: "Mood: [Mood]" (Bold, color based on mood: Creative=Accent-500, others=Neutral-100)
  - Main title: Career (H3, Neutral-100)
  - Tags: Interest tags (Neutral-700 background, Neutral-100 text)
- **Interaction**: Tap to open View Persona modal

#### Screen: View Persona & Send Whisper (Modal)
- **Layout**: Bottom slide-up modal on Neutral-900 overlay
- **Content**:
  - Header: "Anonymous Persona" (H2)
  - Mood display: "Mood: [Mood]" (Bold, color-coded)
  - Career (H3)
  - Interests: Tag list
  - Divider
  - "Send your Whisper" section (H3)
  - Text area: "Send an anonymous, encrypted message..." placeholder
  - Helper: "... (X left today)" (X in Accent-500)
  - Button bar: "Attach Image" (Secondary) + "Send Whisper" (Primary)

#### Flow Logic
1. On Search tab load: Show loading state, sync user directory from contract
2. Enable filters after sync completes
3. Client-side filtering of downloaded personas
4. On persona tap: Open modal with full profile
5. On "Send Whisper": Check subscription and daily limit
6. If limit reached: Show Daily Limit Reached modal
7. If within limit: Proceed with encryption workflow

### Flow 3: Receive, Read, & Reply

#### Screen: Inbox
- **Loading State**: Spinner with "Please, wait while your messages are being updated..."
- **Tabs**: "Chats" (active) and "Requests (X)" (with Accent-500 badge)
- **Chats Tab**: List of conversation items
  - Style: Neutral-800 background, Neutral-700 bottom border
  - Content: Anonymous icon, Career (Bold), message preview (Neutral-400), timestamp (Neutral-600)
- **Requests Tab**: Same list but for pending requests

#### Screen: Whisper Request
- **Layout**: Full screen (covers tab bar)
- **Header**: Back arrow (Primary-500), "New Whisper" title
- **Info Box**: Card explaining accept action
- **Message Content**: Decrypted text in Paragraph style
- **Action Bar**: "Accept Conversation" button (Primary, full-width)

#### Screen: Conversation View
- **Layout**: Full screen
- **Header**: Back arrow, "Chat with '[Career]'" title
- **Chat Window**: Neutral-900 background
  - Their messages: Neutral-800 bubble, left-aligned, 16px rounded
  - Your messages: Primary-500 bubble, right-aligned, 16px rounded
- **Input Bar**: Neutral-800 background
  - Attach button (paperclip icon)
  - Text input (pill-shaped, Neutral-700 border)
  - Send button (paper plane icon)

#### Flow Logic
1. On Inbox load: Show loading, sync HCS messages
2. Filter messages by user's mailHash and active reply hashes
3. Decrypt and display messages
4. New conversations go to Requests tab
5. On Accept: Move to Chats tab, navigate to Conversation View
6. Replies are always free (no subscription check)

## Additional Screens

### Screen: Mood Match
- **Header**: "Find a Mood Match" (H2)
- **Content**: Current mood display with "Find Match" button (Accent)
- **Result**: Single Persona Card fades in after match

### Screen: Daily Limit Reached (Modal)
- **Layout**: Centered modal on overlay
- **Content**:
  - Warning icon (Warning color)
  - "Daily Whisper Limit Reached" header
  - Explanation text with time remaining
  - Subscription options: HBAR and HTS payment methods
  - "No thanks, I'll wait" link

### Screen: Edit Persona
- **Layout**: In-place within My Persona tab
- **Content**: Same form as Create Persona, pre-populated
- **Subscription Section**: Status display (Free/Premium with color coding)
- **Button**: "Manage Subscription" (Secondary)

## Implementation Requirements

### State Management
- **Wallet Connection**: Track connection status and account ID
- **Persona Data**: Store local copy of user's profile
- **Subscription Status**: Cache subscription end timestamp
- **Daily Limits**: Track whispers sent today (localStorage)
- **Message State**: Maintain conversation threads and reply hashes
- **Sync States**: Loading indicators for decentralized operations

### Navigation Logic
- **Authentication Guards**: Redirect to Connect Wallet if not connected
- **Persona Guards**: Redirect to Create Persona if no profile
- **Tab Persistence**: Remember active tab on app reload
- **Modal Management**: Handle modal stack and back navigation

### Error Handling
- **Network Errors**: Retry mechanisms for contract calls
- **Wallet Rejections**: Clear error messages for signature failures
- **Sync Failures**: Graceful degradation with cached data
- **Encryption Errors**: Fallback UI for failed decryption

## References
- [UX Architecture & User Flow Specification](Documentations/UI-UX Specifications/UX Architecture & User Flow Specification/)
- [High-Fidelity Mockups](Documentations/UI-UX Specifications/UI/High-Fidelity Mockups/)
- [Key User Flows](Documentations/UI-UX Specifications/UX Architecture & User Flow Specification/4. Key User Flows (Text-Based).md)
- [Information Architecture](Documentations/UI-UX Specifications/UX Architecture & User Flow Specification/5. Information Architecture (IA).md)