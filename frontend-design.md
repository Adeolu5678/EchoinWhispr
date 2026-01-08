# EchoinWhispr Frontend Design System

A comprehensive guide to the premium neon-glass aesthetic design system for EchoinWhispr.

## Design Philosophy

EchoinWhispr's frontend follows a **Premium Neon-Glass Aesthetic** with these core principles:

1. **Dark-First Design** - Deep, rich backgrounds that let content shine
2. **Glassmorphism** - Frosted glass effects with subtle gradients
3. **Neon Accents** - Vibrant purple and fuchsia glow effects
4. **Smooth Motion** - Purposeful animations that enhance UX
5. **Accessibility** - WCAG 2.1 AA compliant contrast ratios

---

## Color Palette

### Primary Colors (Purple)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-500` | `#a855f7` | Main brand color, buttons, links |
| `primary-400` | `#c084fc` | Hover states, highlights |
| `primary-600` | `#9333ea` | Active states, emphasis |

### Accent Colors (Fuchsia)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-500` | `#d946ef` | Secondary highlights, CTAs |
| `accent-400` | `#e879f9` | Hover states |
| `accent-600` | `#c026d3` | Active states |

### Background Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0a0a0b` | Main app background |
| `card` | `#141416` | Card backgrounds |
| `secondary` | `#111113` | Elevated surfaces |

### Semantic Colors
- **Success**: `#10b981` (Emerald)
- **Error**: `#ef4444` (Red)
- **Warning**: `#f59e0b` (Amber)
- **Info**: `#06b6d4` (Cyan)

---

## Typography

### Font Families
```css
--font-inter: 'Inter', system-ui, sans-serif;  /* Body text */
--font-outfit: 'Outfit', system-ui, sans-serif; /* Display headings */
```

### Type Scale
| Class | Size | Usage |
|-------|------|-------|
| `text-sm` | 14px | Captions, labels |
| `text-base` | 16px | Body text |
| `text-lg` | 18px | Lead paragraphs |
| `text-2xl` | 24px | Section headings |
| `text-4xl` | 36px | Page headings |
| `text-6xl` | 60px | Hero headings |

### Font Usage
- **Headings (h1-h3)**: Use `font-display` (Outfit)
- **Body text**: Use `font-sans` (Inter)
- **Code**: Use `font-mono` (JetBrains Mono)

---

## Glassmorphism Effects

### CSS Classes

```css
/* Standard glass effect */
.glass {
  background: rgba(17, 17, 19, 0.75);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Glass card with gradient */
.glass-card {
  background: linear-gradient(135deg, 
    rgba(168, 85, 247, 0.08) 0%, 
    rgba(20, 20, 22, 0.95) 50%,
    rgba(217, 70, 239, 0.05) 100%);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(168, 85, 247, 0.12);
}

/* Interactive glass card with hover glow */
.glass-card-hover:hover {
  border-color: rgba(168, 85, 247, 0.25);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.15);
}
```

---

## Glow Effects

### Text Glow
```css
.text-glow {
  text-shadow: 0 0 60px rgba(168, 85, 247, 0.35);
}
```

### Box Glow
```css
.glow-primary {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.35);
}

.glow-accent {
  box-shadow: 0 0 30px rgba(217, 70, 239, 0.35);
}
```

### Gradient Text
```css
.text-gradient {
  background-image: linear-gradient(135deg, #a855f7, #d946ef, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Animation System

### Available Animations
| Class | Effect | Duration |
|-------|--------|----------|
| `animate-fade-in` | Opacity 0→1 | 300ms |
| `animate-slide-up` | Y+20px→0,fade | 400ms |
| `animate-scale-in` | Scale 0.95→1 | 200ms |
| `animate-float` | Y±20px loop | 6s |
| `animate-shimmer` | Shimmer sweep | 2.5s |
| `animate-pulse-glow` | Glow pulse | 3s |
| `animate-gradient` | Gradient shift | 8s |

### Stagger Animations
```jsx
<div className="stagger-1">First</div>  // 100ms delay
<div className="stagger-2">Second</div> // 200ms delay
<div className="stagger-3">Third</div>  // 300ms delay
```

---

## Component Usage

### Buttons

```jsx
// Primary gradient button
<Button variant="gradient">Get Started</Button>

// Glass button
<Button variant="glass">Learn More</Button>

// Glow button
<Button variant="glow">Special Action</Button>

// Ghost button
<Button variant="ghost">Cancel</Button>
```

### Cards

```jsx
// Standard glass card
<Card>Content</Card>

// Interactive card with hover
<Card variant="interactive">Clickable</Card>

// Elevated card
<Card variant="elevated">Important</Card>
```

### Badges

```jsx
// Glow badge
<Badge variant="glow">New</Badge>

// Gradient badge
<Badge variant="gradient">Premium</Badge>

// With dot indicator
<Badge variant="glow" dot>Live</Badge>
```

### Inputs

```jsx
// Standard input
<Input placeholder="Enter text..." />

// With icon
<Input leftIcon={<Search />} placeholder="Search..." />

// Error state
<Input error placeholder="Invalid input" />
```

---

## Layout Patterns

### Page Layout
```jsx
<div className="min-h-screen pt-20 pb-10 px-4">
  <div className="max-w-4xl mx-auto">
    {/* Header */}
    <header className="glass-card p-6 rounded-2xl mb-8">
      ...
    </header>
    
    {/* Content */}
    <main className="space-y-6">
      ...
    </main>
  </div>
</div>
```

### Background Orbs
```jsx
{/* Decorative background orbs */}
<div className="orb-primary w-96 h-96 -top-20 -left-20" />
<div className="orb-accent w-64 h-64 -bottom-10 -right-10" />
```

---

## Responsive Design

### Breakpoints
| Prefix | Min Width | Typical Device |
|--------|-----------|----------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Approach
```jsx
// Text scaling
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

// Layout changes
<div className="flex flex-col md:flex-row gap-4">
  ...
</div>
```

---

## Accessibility Guidelines

1. **Color Contrast**: All text meets 4.5:1 ratio
2. **Focus States**: Use `focus-visible:ring-2` for keyboard nav
3. **Touch Targets**: Minimum 44x44px for interactive elements
4. **Motion**: Respect `prefers-reduced-motion`
5. **Labels**: All inputs have associated labels
6. **ARIA**: Use proper roles and labels

---

## Best Practices

### Do's ✅
- Use design tokens instead of hardcoded values
- Add `transition-all duration-300` for smooth interactions
- Use `glass-card` for content containers
- Apply `text-gradient` for emphasis sparingly
- Use animations purposefully

### Don'ts ❌
- Don't use pure black `#000000`
- Don't skip hover states
- Don't use multiple competing glow effects
- Don't animate without user purpose
- Don't use light mode colors

---

## File Structure

```
Web/src/
├── app/
│   ├── globals.css      # CSS variables, utilities
│   └── layout.tsx       # Font setup, theme provider
├── components/
│   ├── ui/              # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── Navigation.tsx
│   └── LandingPage.tsx
└── features/
    └── whispers/
        └── components/
            ├── WhisperCard.tsx
            └── WhisperFeed.tsx

design-system/
└── tokens/
    ├── colors.ts        # Color definitions
    └── typography.ts    # Font definitions
```