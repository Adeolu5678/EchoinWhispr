# Launchpad: Refined UI/UX Specification
**Version:** 2.0
**Focus:** The "Premium" Aesthetic & Interaction Design

---

## 1. Design Philosophy

The Launchpad interface must feel **expensive**. It should evoke the same feeling as unboxing a high-end piece of technology. Every interaction must be deliberate, smooth, and satisfying.

### 1.1. Core Pillars
1.  **Depth & Layering:** We use **Glassmorphism** not just as a trend, but to establish hierarchy. The background is the "world", the panels are the "windows" into content, and the modals are the "focus".
2.  **Motion as Feedback:** Nothing simply "appears". It fades in, slides up, or scales. Motion confirms action.
3.  **Content is King:** The UI chrome recedes. The project logos, the pitch text, and the user avatars take center stage.

---

## 2. The Design System

### 2.1. Color Palette
*   **Background:** `#121212` (Rich Black) - Not `#000000`. It's softer, easier on the eyes, and allows shadows to be visible.
*   **Surface (Glass):** `rgba(30, 30, 30, 0.7)` with `backdrop-filter: blur(12px)`.
*   **Primary Action:** `#00A3FF` (Electric Blue) - Used for "Publish", "Invest", "Connect".
*   **Secondary Action:** `#FFFFFF` (White) - Used for high-contrast text buttons.
*   **Borders:** `rgba(255, 255, 255, 0.1)` - Ultra-subtle 1px borders to define edges without adding visual weight.

### 2.2. Typography
*   **Headings:** `Inter`, Weight 700/600. Tight tracking (-0.02em) for a modern feel.
*   **Body:** `Inter`, Weight 400. High legibility.
*   **Monospace:** `JetBrains Mono` (for code snippets or financial data).

### 2.3. Iconography
*   Use **Lucide React** or **Heroicons**.
*   Stroke width: 1.5px (Thin, elegant).
*   Active icons are filled; inactive are outlined.

---

## 3. Key Component Specs

### 3.1. The "Project Card"
*   **Appearance:** A glass panel with a subtle gradient border.
*   **Hover:** Scales up by 1.02x, shadow deepens, border glows `#00A3FF`.
*   **Content:** Large Logo (Top Left), Title (H3), Tagline (Body), "Traction" Badge (Top Right).

### 3.2. The "Timeline" (Living Pitch)
*   **Structure:** A vertical line connecting "Milestone" nodes.
*   **Node:** A circular icon. When "Verified", it glows Green (`#06C270`).
*   **Animation:** As the user scrolls, the line "fills" up to the current date.

### 3.3. The "Soft Circle" Slider
*   **Interaction:** A draggable slider to set investment amount.
*   **Feedback:** Haptic feedback (if mobile) or visual "snap" at key increments ($10k, $25k, $50k).
*   **Visual:** The bar fills with a gradient from Blue to Magenta as the amount increases.

---

## 4. Transitions & Micro-interactions

*   **Page Transitions:** Smooth fade-in (300ms ease-out). No jarring cuts.
*   **Button Clicks:** Scale down to 0.95x on active (press), scale back to 1.0x on release.
*   **Loading States:** No spinning wheels. Use **Shimmer Effects** (Skeleton Loaders) that match the shape of the content.
*   **Toasts:** Notifications slide in from the bottom-right, glassmorphic style, with a progress bar indicating dismissal time.
