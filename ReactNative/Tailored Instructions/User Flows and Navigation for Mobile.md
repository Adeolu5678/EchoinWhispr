# User Flows and Navigation for Mobile

This document details the mobile adaptation of EchoinWhispr's user flows and navigation structure, optimized for React Native implementation on iOS and Android devices.

## Navigation Architecture

### Bottom Tab Navigation
The app uses a persistent bottom tab bar with four main tabs:

1. **Search** - Primary tab for discovery and messaging
2. **Mood Match** - Secondary feature for mood-based matching
3. **Inbox** - Messaging interface with bifurcated inbox
4. **My Persona** - Profile management

### Navigation Patterns
- **Stack Navigation**: For hierarchical screens (e.g., Inbox → Conversation View)
- **Modal Presentation**: For overlays (e.g., Paywall, Persona View)
- **Bottom Sheet**: For secondary actions and content

## Key User Flows for Mobile

### Flow 1: New User Onboarding & Persona Creation

**Mobile Optimizations:**
- **Screen 1: Connect Wallet**
  - Full-screen layout with centered content
  - QR code scanning integration for WalletConnect
  - Clear call-to-action button with haptic feedback
  - Educational link to Hedera wallet information

- **Screen 2: Create Persona**
  - Vertical scrolling form with proper keyboard handling
  - Tag input with autocomplete for interests
  - Mood selector as horizontal scrollable chips
  - Client-side key generation with progress indicator
  - Transaction signing with clear context

**Navigation:** Onboarding → Main App (Search tab)

### Flow 2: Search, Discover, & Initiate "Whisper"

**Mobile Optimizations:**
- **Search Screen:**
  - Filter inputs as collapsible sections
  - Pull-to-refresh for directory sync
  - Infinite scroll for persona results
  - Loading states with skeleton screens

- **Persona View Modal:**
  - Bottom sheet presentation
  - Swipe gestures for dismissal
  - Message composer with keyboard avoidance
  - Image attachment with camera/gallery picker

- **Paywall Modal:**
  - Native payment sheet integration
  - Subscription options with clear pricing
  - Progress indicators for transaction states

**Navigation:** Search → Persona Modal → Paywall Modal (if needed)

### Flow 3: Receive, Read, & Reply

**Mobile Optimizations:**
- **Inbox Screen:**
  - Tabbed interface (Chats/Requests)
  - Swipe actions for message management
  - Push notifications for new messages
  - Badge indicators for unread counts

- **Whisper Request Screen:**
  - Full-screen modal for important decisions
  - Accept/Reject actions with confirmation
  - Encrypted content display with loading states

- **Conversation View:**
  - Message bubbles with proper alignment
  - Image display with pinch-to-zoom
  - Typing indicators and read receipts
  - Attachment picker with permissions handling

**Navigation:** Inbox → Request Modal → Conversation Screen

## Mobile-Specific Navigation Patterns

### Gesture-Based Navigation
- **Swipe Gestures:**
  - Swipe down to dismiss modals
  - Swipe left/right on messages for actions
  - Swipe back from screen edges

- **Long Press Actions:**
  - Long press on personas for quick actions
  - Long press on messages for context menus

### Hardware Integration
- **Back Button (Android):** Respect system back navigation
- **Home Indicator (iOS):** Proper safe area handling
- **Notch/Dynamic Island:** Adaptive layout adjustments

### Accessibility Navigation
- **VoiceOver/TalkBack:** Proper accessibility labels
- **Keyboard Navigation:** Focus management for form inputs
- **Large Text Support:** Scalable UI elements

## Screen Hierarchy and Transitions

### Main App Structure
```
App Root
├── Onboarding Stack
│   ├── Connect Wallet
│   └── Create Persona
└── Main Tab Navigator
    ├── Search Stack
    │   ├── Search & Filter
    │   ├── Persona View (Modal)
    │   └── Paywall (Modal)
    ├── Mood Match Stack
    │   ├── Mood Match
    │   └── Persona View (Modal)
    ├── Inbox Stack
    │   ├── Inbox (with Tabs)
    │   ├── Whisper Request (Modal)
    │   └── Conversation View
    └── Persona Stack
        └── Edit Persona
```

### Transition Types
- **Push:** Standard screen transitions
- **Modal:** Overlay presentations
- **Bottom Sheet:** Partial screen overlays
- **Fade:** Loading state transitions

## State Management for Navigation

### Navigation State
- **Tab Persistence:** Remember active tab across app launches
- **Stack State:** Maintain navigation history
- **Modal State:** Track open modals and their data

### Deep Linking
- **URL Schemes:** Support for external links to specific screens
- **Push Notification Handling:** Navigate to relevant screens from notifications
- **Universal Links:** Handle web-to-app transitions

## Performance Considerations

### Navigation Performance
- **Lazy Loading:** Load screens on demand
- **Preloading:** Preload adjacent screens
- **Memory Management:** Proper cleanup of navigation stacks

### Animation Performance
- **Native Driver:** Use React Native's native animation driver
- **Optimized Transitions:** Smooth 60fps animations
- **Reduced Motion:** Respect user accessibility preferences

## Error Handling and Fallbacks

### Navigation Errors
- **Invalid Routes:** Graceful fallback to home screen
- **Network Errors:** Offline navigation handling
- **Authentication Errors:** Redirect to wallet connection

### Recovery Flows
- **App Restart:** Restore navigation state
- **Deep Link Failures:** Fallback to appropriate screens
- **Permission Denials:** Alternative UI flows

This mobile navigation structure maintains the web UX principles while leveraging native mobile patterns for optimal user experience.