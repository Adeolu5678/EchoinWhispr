# Design System Implementation Guide

This document provides detailed instructions for implementing the EchoinWhispr design system in the web frontend. All implementations must follow the specifications from the UI-UX Specifications documents.

## Color Palette Implementation

### CSS Custom Properties (Variables)
Define the following color variables in your global CSS file (e.g., `globals.css`):

```css
:root {
  /* Neutrals */
  --neutral-900: #121212; /* Background */
  --neutral-800: #1E1E1E; /* Surface */
  --neutral-700: #333333; /* Border */
  --neutral-600: #555555; /* Text Disabled */
  --neutral-400: #A0A0A0; /* Text Secondary */
  --neutral-100: #F5F5F5; /* Text Primary */
  --white: #FFFFFF;

  /* Core Palette */
  --primary-500: #00A3FF; /* Base */
  --primary-600: #008EE6; /* Hover */
  --primary-400: #66C7FF; /* Light */

  --accent-500: #E000FF; /* Base */
  --accent-600: #C700E6; /* Hover */

  /* Semantic Colors */
  --success: #06C270;
  --error: #FF3B30;
  --warning: #FFC700;
}
```

### Tailwind Configuration
If using Tailwind CSS, extend the theme with these colors:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        neutral: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#333333',
          600: '#555555',
          400: '#A0A0A0',
          100: '#F5F5F5',
        },
        primary: {
          500: '#00A3FF',
          600: '#008EE6',
          400: '#66C7FF',
        },
        accent: {
          500: '#E000FF',
          600: '#C700E6',
        },
        success: '#06C270',
        error: '#FF3B30',
        warning: '#FFC700',
      },
    },
  },
};
```

## Typography Implementation

### Font Setup
1. Import Inter font from Google Fonts or include locally:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
```

2. Set as default font family:
```css
body {
  font-family: 'Inter', sans-serif;
}
```

### Typography Scale
Implement the following text styles using Tailwind classes or custom CSS:

- **H1 (Screen Title)**: `text-3xl font-bold text-neutral-100` (32px)
- **H2 (Section Header)**: `text-2xl font-bold text-neutral-100` (24px)
- **H3 (Card Title)**: `text-xl font-bold text-neutral-100` (20px)
- **Paragraph (Body)**: `text-base text-neutral-100 leading-relaxed` (16px)
- **Small (Helper Text)**: `text-sm text-neutral-400` (14px)
- **X-Small (Meta)**: `text-xs text-neutral-600` (12px)
- **Button Text**: `text-base font-bold` (16px, color varies)

All body and paragraph text must have `line-height: 1.5`.

## Component Styles Implementation

### Buttons

#### Primary Button
```css
.btn-primary {
  @apply bg-primary-500 text-white px-6 py-3 rounded-lg font-bold text-base;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  @apply bg-primary-600;
}

.btn-primary:disabled {
  @apply bg-neutral-700 text-neutral-600 cursor-not-allowed;
}
```

#### Secondary (Outline) Button
```css
.btn-secondary {
  @apply bg-transparent border border-primary-500 text-primary-500 px-6 py-3 rounded-lg font-bold text-base;
  transition: all 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  @apply bg-primary-500 text-white;
}

.btn-secondary:disabled {
  @apply border-neutral-700 text-neutral-600 cursor-not-allowed;
}
```

#### Accent Button
```css
.btn-accent {
  @apply bg-accent-500 text-white px-6 py-3 rounded-lg font-bold text-base;
  transition: background-color 0.2s;
}

.btn-accent:hover:not(:disabled) {
  @apply bg-accent-600;
}
```

### Inputs

#### Text Input
```css
.input-field {
  @apply bg-transparent border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 text-base;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  @apply border-primary-500;
  box-shadow: 0 0 0 2px rgba(0, 163, 255, 0.3);
}

.input-field.error {
  @apply border-error;
}

.input-field::placeholder {
  @apply text-neutral-600;
}
```

#### Text Area
Same as input but with `min-h-[120px]` and `resize-none`.

### Tags (for Interests)
```css
.tag {
  @apply bg-neutral-700 text-neutral-100 px-3 py-1 rounded-full text-sm;
}
```

### Cards
```css
.card {
  @apply bg-neutral-800 border border-neutral-700 rounded-2xl p-6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

### Navigation

#### Bottom Tab Bar
```css
.tab-bar {
  @apply bg-neutral-800 border-t border-neutral-700 flex justify-around items-center py-2;
}

.tab-item {
  @apply flex flex-col items-center py-2 px-4;
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

.notification-badge {
  @apply absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full;
}
```

#### In-Page Tabs
```css
.in-page-tabs {
  @apply border-b border-neutral-700;
}

.in-page-tab {
  @apply px-4 py-2 text-sm font-medium border-b-2 border-transparent;
  transition: all 0.2s;
}

.in-page-tab.inactive {
  @apply text-neutral-400;
}

.in-page-tab.active {
  @apply text-primary-500 border-primary-500 font-bold;
}
```

## Layout Guidelines

### Screen Layouts
- **Background**: Always use `bg-neutral-900`
- **Max Width**: Center content with `max-w-md mx-auto` for mobile-first design
- **Padding**: Use 16px (`p-4`) for general padding, 32px (`p-8`) for entry screens
- **Spacing**: Use consistent spacing with Tailwind's space utilities (space-y-4, space-y-5, etc.)

### Modal Overlays
```css
.modal-overlay {
  @apply fixed inset-0 bg-neutral-900 bg-opacity-75 flex items-end justify-center z-50;
}

.modal-content {
  @apply bg-neutral-800 rounded-t-2xl w-full max-w-md p-6;
  max-height: 80vh;
  overflow-y: auto;
}
```

## Implementation Notes

1. **Dark Theme Only**: The design system is optimized for dark mode. Do not implement light mode.
2. **Mobile-First**: All components should be designed mobile-first with responsive breakpoints.
3. **Accessibility**: Ensure sufficient color contrast ratios and proper focus states.
4. **Consistency**: Use the design tokens consistently across all components.
5. **Performance**: Optimize CSS for fast loading and smooth animations.

## References
- [Color Palette](Documentations/UI-UX Specifications/UI/Design System/1. Color Palette.md)
- [Typography](Documentations/UI-UX Specifications/UI/Design System/2. Typography.md)
- [Component Styles](Documentations/UI-UX Specifications/UI/Design System/3. Component Styles.md)