# Mockup-to-Code Guidelines

This document provides pixel-perfect implementation guidelines for translating the High-Fidelity Mockups into code, ensuring the frontend matches the exact specifications.

## Layout and Spacing

### Global Layout Rules
- **Container Width**: `max-w-md` (384px) for mobile-first design
- **Horizontal Padding**: 16px (`p-4`) for most screens, 32px (`p-8`) for entry screens
- **Vertical Spacing**: Use consistent spacing scale:
  - 8px (`space-y-2`)
  - 16px (`space-y-4`)
  - 20px (`space-y-5`)
  - 24px (`space-y-6`)
  - 32px (`space-y-8`)
  - 40px (`space-y-10`)

### Screen-Specific Layouts

#### Entry Screens (Connect Wallet, Create Persona)
```css
.entry-screen {
  @apply min-h-screen bg-neutral-900 flex flex-col justify-center;
}

.entry-content {
  @apply max-w-md mx-auto px-8 py-8;
}
```

#### Main App Screens
```css
.main-screen {
  @apply min-h-screen bg-neutral-900 pb-16; /* Account for tab bar */
}

.screen-content {
  @apply max-w-md mx-auto px-4 py-4;
}
```

#### Modal Screens
```css
.modal-overlay {
  @apply fixed inset-0 bg-neutral-900 bg-opacity-75 flex items-end justify-center z-50;
}

.modal-content {
  @apply bg-neutral-800 rounded-t-2xl w-full max-w-md;
  max-height: 80vh;
  overflow-y: auto;
}
```

## Component Implementations

### Header Bar
```css
.header-bar {
  @apply bg-neutral-800 border-b border-neutral-700 px-4 py-4 flex items-center justify-between;
}

.header-title {
  @apply text-2xl font-bold text-neutral-100;
}

.header-info {
  @apply text-sm text-neutral-400;
}

.header-info .count {
  @apply font-bold text-accent-500;
}
```

### Persona Card
```css
.persona-card {
  @apply bg-neutral-800 border border-neutral-700 rounded-2xl p-6 mb-4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.persona-mood {
  @apply text-sm font-bold mb-2;
}

.persona-mood.creative {
  @apply text-accent-500;
}

.persona-mood.other {
  @apply text-neutral-100;
}

.persona-career {
  @apply text-xl font-bold text-neutral-100 mb-3;
}

.persona-tags {
  @apply flex flex-wrap gap-2;
}
```

### Chat Components

#### Chat List Item
```css
.chat-item {
  @apply bg-neutral-800 border-b border-neutral-700 px-4 py-4 flex items-center;
}

.chat-avatar {
  @apply w-10 h-10 bg-neutral-700 rounded-full mr-4 flex-shrink-0;
}

.chat-content {
  @apply flex-1 min-w-0;
}

.chat-career {
  @apply font-bold text-neutral-100 text-base truncate;
}

.chat-preview {
  @apply text-sm text-neutral-400 mt-1 truncate;
}

.chat-timestamp {
  @apply text-xs text-neutral-600 ml-4 flex-shrink-0;
}
```

#### Message Bubbles
```css
.message-bubble {
  @apply px-4 py-3 rounded-2xl max-w-xs mb-2;
}

.message-bubble.theirs {
  @apply bg-neutral-800 text-neutral-100 self-start;
}

.message-bubble.mine {
  @apply bg-primary-500 text-white self-end;
}
```

### Form Components

#### Input Groups
```css
.input-group {
  @apply mb-5;
}

.input-label {
  @apply text-sm font-medium text-neutral-100 mb-2 block;
}

.input-field {
  @apply w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 text-base;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  @apply border-primary-500;
  box-shadow: 0 0 0 2px rgba(0, 163, 255, 0.3);
}

.input-field.error {
  @apply border-error;
}

.input-error {
  @apply text-sm text-error mt-1;
}
```

#### Tag Input
```css
.tag-input-container {
  @apply flex flex-wrap gap-2 p-3 border border-neutral-700 rounded-lg min-h-[48px];
}

.tag-input {
  @apply flex-1 bg-transparent text-neutral-100 text-base outline-none;
}

.tag-chip {
  @apply bg-neutral-700 text-neutral-100 px-3 py-1 rounded-full text-sm flex items-center gap-2;
}

.tag-remove {
  @apply w-4 h-4 text-neutral-400 hover:text-neutral-100 cursor-pointer;
}
```

### Button Arrangements

#### Button Bars
```css
.button-bar {
  @apply flex gap-4 mt-6;
}

.button-bar .btn {
  @apply flex-1;
}
```

#### Action Bars (Bottom)
```css
.action-bar {
  @apply fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 p-4;
  /* Ensure it appears above tab bar */
  z-index: 40;
}

.action-bar .btn {
  @apply w-full;
}
```

### Loading States

#### Full Screen Loading
```css
.loading-overlay {
  @apply absolute inset-0 bg-neutral-900 bg-opacity-75 flex items-center justify-center z-10;
}

.loading-content {
  @apply text-center;
}

.loading-spinner {
  @apply w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4;
}

.loading-text {
  @apply text-neutral-100 text-base;
}
```

#### Inline Loading
```css
.inline-loading {
  @apply flex items-center justify-center py-8;
}
```

### Tab Implementations

#### In-Page Tabs
```css
.in-page-tabs {
  @apply flex border-b border-neutral-700 mb-6;
}

.in-page-tab {
  @apply px-4 py-3 text-sm font-medium border-b-2 border-transparent flex-1 text-center;
  transition: all 0.2s;
}

.in-page-tab.inactive {
  @apply text-neutral-400;
}

.in-page-tab.active {
  @apply text-primary-500 border-primary-500 font-bold;
}
```

#### Bottom Tab Bar
```css
.tab-bar {
  @apply fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 flex justify-around items-center py-2 px-2 z-50;
}

.tab-item {
  @apply flex flex-col items-center py-2 px-3 relative;
}

.tab-icon {
  @apply w-6 h-6 mb-1;
}

.tab-icon.inactive {
  @apply text-neutral-400;
}

.tab-icon.active {
  @apply text-primary-500;
}

.tab-label {
  @apply text-xs font-medium;
}

.tab-label.inactive {
  @apply text-neutral-400;
}

.tab-label.active {
  @apply text-primary-500;
}

.notification-dot {
  @apply absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full;
}
```

## Responsive Design

### Breakpoint Strategy
- **Mobile First**: Base styles for mobile (320px+)
- **Tablet**: `md:` breakpoint (768px+) - adjust max-width and padding
- **Desktop**: `lg:` breakpoint (1024px+) - center content, add side margins

### Responsive Adjustments
```css
/* Mobile */
.container {
  @apply max-w-md mx-auto px-4;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    @apply max-w-lg px-6;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    @apply max-w-xl px-8;
  }
}
```

## Animation and Transitions

### Modal Transitions
```css
.modal-enter {
  transform: translateY(100%);
}

.modal-enter-active {
  transform: translateY(0%);
  transition: transform 0.3s ease-out;
}

.modal-exit {
  transform: translateY(0%);
}

.modal-exit-active {
  transform: translateY(100%);
  transition: transform 0.3s ease-in;
}
```

### Button Hover States
```css
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

### Loading Animations
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-pulse {
  animation: pulse 2s infinite;
}
```

## Accessibility Implementation

### Focus Management
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-neutral-900;
}
```

### Screen Reader Support
```css
.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
}
```

### Color Contrast
- Ensure all text meets WCAG AA standards
- Use semantic color variables for error/success states
- Provide sufficient contrast for interactive elements

## Performance Optimizations

### Image Loading
```css
.lazy-image {
  @apply opacity-0 transition-opacity duration-300;
}

.lazy-image.loaded {
  @apply opacity-100;
}
```

### Virtual Scrolling for Lists
- Implement virtual scrolling for long chat lists
- Use `react-window` or similar library for performance

### Code Splitting
- Lazy load modal components
- Split code by route for faster initial load

## References
- [High-Fidelity Mockups](Documentations/UI-UX Specifications/UI/High-Fidelity Mockups/)
- [Design System](Documentations/UI-UX Specifications/UI/Design System/)