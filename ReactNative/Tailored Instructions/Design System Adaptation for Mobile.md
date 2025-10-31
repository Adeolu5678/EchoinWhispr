# Design System Adaptation for Mobile

This document outlines how to adapt the EchoinWhispr design system for React Native mobile app implementation, ensuring consistency with the web version while optimizing for mobile platforms (iOS and Android).

## Color Palette Adaptation

### Core Colors
- **Background**: `#121212` (Neutral-900) - Primary app background
- **Surface**: `#1E1E1E` (Neutral-800) - Cards, modals, navigation bars
- **Border**: `#333333` (Neutral-700) - Subtle borders and dividers
- **Text Primary**: `#F5F5F5` (Neutral-100) - Main text content
- **Text Secondary**: `#A0A0A0` (Neutral-400) - Helper text and inactive elements
- **Text Disabled**: `#555555` (Neutral-600) - Disabled states

### Accent Colors
- **Primary**: `#00A3FF` (Primary-500) - Main actions, active states
- **Primary Hover**: `#008EE6` (Primary-600) - Pressed states
- **Primary Light**: `#66C7FF` (Primary-400) - Focus rings, links
- **Accent**: `#E000FF` (Accent-500) - Mood matching, subscriptions
- **Accent Hover**: `#C700E6` (Accent-600) - Pressed accent states

### Semantic Colors
- **Success**: `#06C270` - Confirmations, active subscriptions
- **Error**: `#FF3B30` - Validation errors, out of whispers
- **Warning**: `#FFC700` - Paywall limits, alerts

## Typography Adaptation

### Font Family
- **Primary Font**: Inter (Regular, Bold weights)
- **Fallback**: System font stack for mobile compatibility

### Text Styles
- **H1 (Screen Title)**: 32px Bold, Neutral-100
- **H2 (Section Header)**: 24px Bold, Neutral-100
- **H3 (Card Title)**: 20px Bold, Neutral-100
- **Body**: 16px Regular, Neutral-100
- **Small (Helper Text)**: 14px Regular, Neutral-400
- **X-Small (Meta)**: 12px Regular, Neutral-600
- **Button Text**: 16px Bold, White/Primary-500

### Mobile-Specific Adjustments
- **Line Height**: 1.5 for all text
- **Letter Spacing**: Default (no additional spacing needed)
- **Font Scaling**: Respect system font size settings for accessibility

## Component Styles for Mobile

### Buttons
- **Border Radius**: 8px (consistent with web)
- **Padding**: 12px 24px (adjust for mobile touch targets: minimum 44px height)
- **Primary Button**: Primary-500 background, White text, 8px radius
- **Secondary Button**: Transparent background, Primary-500 border, Primary-500 text
- **Accent Button**: Accent-500 background, White text, 8px radius
- **Disabled State**: Neutral-700 background, Neutral-600 text

### Inputs
- **Border Radius**: 8px
- **Border**: 1px solid Neutral-700 (default), Primary-500 (focus)
- **Background**: Transparent
- **Text Color**: Neutral-100
- **Placeholder**: Neutral-600
- **Focus Glow**: `box-shadow: 0 0 0 2px rgba(0, 163, 255, 0.3)` (adapt to React Native shadow)

### Cards
- **Border Radius**: 16px
- **Background**: Neutral-800
- **Border**: 1px solid Neutral-700
- **Shadow**: iOS: `shadowColor: '#000000', shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }`
  Android: `elevation: 6`

### Navigation
- **Bottom Tab Bar**: Neutral-800 background, 1px top border Neutral-700
- **Active Tab**: Primary-500 icon, 12px Primary-500 text label
- **Inactive Tab**: Neutral-400 icon, no text label
- **Notification Badge**: 5px Accent-500 dot on icon

### Tags
- **Style**: Pill-shaped (16px border radius), Neutral-700 background, Neutral-100 text, 14px font

## Mobile-Specific Design Considerations

### Touch Targets
- Minimum 44px x 44px for all interactive elements
- Adequate spacing between touch targets (8px minimum)

### Safe Areas
- Account for device notches, home indicators, and status bars
- Use React Native's SafeAreaView or safe area insets

### Platform Adaptations
- **iOS**: Use native blur effects for modals, respect system dark mode
- **Android**: Use Material Design principles where appropriate, handle back button navigation

### Responsive Design
- Use percentage-based widths where possible
- Implement responsive font scaling
- Consider different screen densities and sizes

## Implementation Guidelines

### React Native Libraries
- **Styling**: Use StyleSheet or styled-components
- **Icons**: React Native Vector Icons or Expo Vector Icons
- **Colors/Themes**: Implement a theme provider for consistent color usage

### Accessibility
- Ensure sufficient color contrast ratios
- Support dynamic type for text scaling
- Add accessibility labels for screen readers

### Performance
- Optimize image loading and caching
- Use FlatList for scrollable content
- Implement proper key props for list items

This adaptation maintains the dark, minimalist aesthetic while ensuring optimal mobile usability and performance.