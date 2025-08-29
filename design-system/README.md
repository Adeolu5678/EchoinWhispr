# EchoinWhspr Design System

A comprehensive design system for the EchoinWhspr project, providing consistent design tokens, components, and utilities across Web and React Native platforms.

## Overview

The EchoinWhspr Design System ensures a unified user experience across all platforms while respecting platform-specific conventions. It follows modern design principles with a mobile-first approach, minimalist aesthetic, and accessible color schemes.

## Core Principles

- **Consistency**: Unified design language across platforms
- **Accessibility**: WCAG 2.1 AA compliant colors and interactions
- **Performance**: Optimized for both web and mobile performance
- **Scalability**: Modular architecture for easy extension
- **Developer Experience**: TypeScript-first with comprehensive documentation

## Structure

```
design-system/
├── tokens/           # Design tokens (colors, typography, spacing)
├── components/       # Reusable UI components
├── utils/           # Utility functions and helpers
├── tailwind.config.ts # Tailwind CSS configuration
└── README.md        # This documentation
```

## Design Tokens

### Colors

The color system uses a structured approach with semantic naming:

```typescript
import { colors } from '@echoinwhspr/design-system';

// Primary brand colors
colors.primary[500] // #0ea5e9

// Semantic colors
colors.success[500]  // #22c55e
colors.error[500]    // #ef4444
colors.warning[500]  // #f59e0b

// Neutral colors
colors.neutral[500]  // #737373

// Text colors
colors.text.primary  // #171717
```

### Typography

Inter font family with a comprehensive type scale:

```typescript
import { typography } from '@echoinwhspr/design-system';

// Font sizes
typography.fontSize.base  // 1rem (16px)
typography.fontSize.lg    // 1.125rem (18px)

// Font weights
typography.fontWeight.normal  // 400
typography.fontWeight.bold    // 700

// Text styles
typography.textStyles.h1
typography.textStyles.body
```

### Spacing

Consistent spacing scale based on 4px increments:

```typescript
import { spacing } from '@echoinwhspr/design-system';

// Spacing scale
spacing[4]   // 1rem (16px)
spacing[8]   // 2rem (32px)
spacing[16]  // 4rem (64px)

// Semantic spacing
semanticSpacing.component.padding.md
semanticSpacing.layout.container.padding.mobile
```

## Components

### Button

A flexible button component with multiple variants and sizes:

```typescript
import { Button } from '@echoinwhspr/design-system';

<Button variant="primary" size="md" onPress={handlePress}>
  Click me
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`
- `size`: `'sm' | 'md' | 'lg'`
- `disabled`: `boolean`
- `loading`: `boolean`
- `onPress`: `() => void`
- `fullWidth`: `boolean`

## Tailwind CSS Integration

The design system integrates seamlessly with Tailwind CSS:

```typescript
// tailwind.config.js
module.exports = {
  presets: [require('@echoinwhspr/design-system/tailwind.config')],
  // Your customizations
};
```

### Custom Utilities

```html
<!-- Text styles -->
<h1 class="text-h1">Heading 1</h1>
<p class="text-body">Body text</p>

<!-- Focus styles -->
<button class="focus-ring">Focusable button</button>

<!-- Touch targets -->
<button class="touch-target">Touch-friendly button</button>

<!-- Safe areas -->
<div class="safe-top safe-bottom">Content with safe areas</div>
```

## Platform-Specific Usage

### Web (Next.js)

```typescript
// In your Next.js app
import { Button } from '@echoinwhspr/design-system';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return (
    <div className={`${inter.className} min-h-screen bg-background-primary`}>
      <Button variant="primary">Web Button</Button>
    </div>
  );
}
```

### React Native (Expo)

```typescript
// In your React Native app
import { Button } from '@echoinwhspr/design-system';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Button variant="primary" onPress={() => console.log('Pressed!')}>
        Native Button
      </Button>
    </SafeAreaView>
  );
}
```

## Utility Functions

### Color Utilities

```typescript
import { colorUtils } from '@echoinwhspr/design-system';

// Get contrast color
const textColor = colorUtils.getContrastColor('#0ea5e9'); // Returns white

// Get semantic color
const successColor = colorUtils.getSemanticColor('success'); // Returns #22c55e
```

### Spacing Utilities

```typescript
import { spacingUtils } from '@echoinwhspr/design-system';

// Responsive spacing
const responsivePadding = spacingUtils.getResponsiveSpacing(4, 'lg'); // Larger on big screens

// Touch targets
const touchSize = spacingUtils.getTouchTargetSize('md'); // 44px minimum
```

### Typography Utilities

```typescript
import { typographyUtils } from '@echoinwhspr/design-system';

// Get heading styles
const h1Styles = typographyUtils.getHeadingStyle(1);

// Get text styles
const bodyStyles = typographyUtils.getTextStyle('base');
```

## Best Practices

### 1. Use Design Tokens

Always use design tokens instead of hardcoded values:

```typescript
// ✅ Good
<View style={{ padding: spacing[4], backgroundColor: colors.primary[500] }} />

// ❌ Bad
<View style={{ padding: 16, backgroundColor: '#0ea5e9' }} />
```

### 2. Semantic Color Usage

Use semantic colors for states and feedback:

```typescript
// ✅ Good
<Text style={{ color: colors.success[600] }}>Success message</Text>

// ❌ Bad
<Text style={{ color: '#16a34a' }}>Success message</Text>
```

### 3. Consistent Spacing

Use the spacing scale for consistent layouts:

```typescript
// ✅ Good
<View style={{ gap: spacing[4], padding: spacing[6] }} />

// ❌ Bad
<View style={{ gap: 12, padding: 20 }} />
```

### 4. Touch Targets

Ensure all interactive elements meet minimum touch target sizes:

```typescript
// ✅ Good
<TouchableOpacity style={{ minHeight: spacing[11], minWidth: spacing[11] }} />

// ❌ Bad
<TouchableOpacity style={{ padding: 8 }} />
```

## Accessibility

The design system follows WCAG 2.1 AA guidelines:

- **Color Contrast**: All text combinations meet 4.5:1 contrast ratio
- **Touch Targets**: Minimum 44px touch targets on mobile
- **Focus States**: Clear focus indicators for keyboard navigation
- **Semantic HTML**: Proper heading hierarchy and ARIA labels

## Contributing

When adding new components or tokens:

1. Follow the established naming conventions
2. Include TypeScript types
3. Add comprehensive documentation
4. Test across both platforms
5. Ensure accessibility compliance

## Migration Guide

### From Existing Styles

1. Replace hardcoded colors with design tokens
2. Update spacing values to use the spacing scale
3. Convert custom components to use design system components
4. Update Tailwind configuration to extend the design system

### Example Migration

```typescript
// Before
<View style={{ backgroundColor: '#007bff', padding: 16 }}>
  <Text style={{ color: '#ffffff', fontSize: 18 }}>Button</Text>
</View>

// After
<View style={{
  backgroundColor: colors.primary[500],
  padding: spacing[4]
}}>
  <Text style={{
    color: colors.text.inverse,
    ...typographyUtils.getTextStyle('lg')
  }}>
    Button
  </Text>
</View>
```

## Version History

- **v1.0.0**: Initial release with core tokens, Button component, and Tailwind integration
- Comprehensive documentation and platform-specific guides

## Support

For questions or issues:
- Check the documentation
- Review the examples
- Create an issue in the project repository
