# UI/UX Guidelines

This file outlines the UI/UX design philosophy and mandatory component usage for both the Web and ReactNative applications. All AI agents must adhere to these guidelines to ensure a consistent, intuitive, and pleasant user experience.

1. Design Philosophy
Minimalist & Clean:
Directive: Emphasize simplicity, clarity, and focus on essential content and interactions. Avoid visual clutter.
Mobile-First Design:
Directive: The design process will prioritize the mobile experience, scaling up for larger screens (tablets, desktops) rather than scaling down.
Consistent Look & Feel:
Directive: Maintain a unified brand identity and design language across both web and mobile applications, while respecting native platform conventions (e.g., iOS vs. Android navigation gestures).
Modern Aesthetic:
Directive: Incorporate contemporary design trends: rounded corners on elements, subtle shadow effects for depth (via Tailwind), and a clear, legible typographic hierarchy.
"Nice" Feeling:
Directive: The overall user experience should feel fluid, responsive, and aesthetically pleasing.

2. Core UI Elements & Styling
Color Palette:
Directive: Utilize the defined color palette from the shared design system. These colors will be configured in tailwind.config.js. Ensure sufficient contrast for readability (WCAG 2.1 AA standards).
Typography:
Directive: Use "Inter" as the primary font family across all platforms (load via next/font for Web, expo-font for React Native).
Hierarchy: Establish a consistent set of heading styles (H1, H2, H3) and body text sizes (sm, base, lg) using Tailwind CSS.
Buttons:
Directive: All interactive buttons will be clearly styled, visually distinct, and provide appropriate feedback on press/hover.
Styling: Feature rounded corners and sufficient padding for easy touch targets on mobile.
Web: Use Shadcn Button components, customized with Tailwind.
React Native: Use TouchableOpacity or Button components, styled with Tailwind via NativeWind.
Input Fields:
Directive: Text input fields will be clean, accessible, and provide clear visual cues for focus and validation states.
Web: Use Shadcn Input and Textarea components.
React Native: Use TextInput components, styled with Tailwind via NativeWind.
Navigation Elements:
Web: Implement a clear header for global navigation (e.g., app logo, user avatar/status).
React Native: Utilize a bottom tab navigator for top-level screens (e.g., Home/Inbox, Compose, Profile) and a stack navigator for secondary screens.
Icons:
Directive: Use a consistent icon library. For React Native, @expo/vector-icons (e.g., Ionicons, MaterialIcons) is preferred. For Web, lucide-react is preferred.
Consistency: Ensure icons are consistent in style and size.

3. Navigation Principles
File-Based Routing:
Directive: Both Web (Next.js App Router) and ReactNative (Expo Router) applications will utilize file-system-based routing.
Intuitive Hierarchy:
Directive: Design a logical and predictable flow between screens, allowing users to easily understand their current location and how to navigate back.
Platform Consistency with Adaptability:
Web: Standard browser navigation (back/forward buttons) must function as expected.
React Native: Native navigation gestures (e.g., swipe-back on iOS, Android hardware back button) must be supported.

4. Responsive Design
Directive: Ensure layouts are fully responsive, adapting gracefully to different screen sizes and orientations on all target devices (mobile, tablet, desktop).
No Horizontal Scrolling: The layout must never exhibit horizontal scrolling on any screen size or orientation.
Techniques (Web):
Utilize CSS Flexbox and Grid.
Extensively use Tailwind's responsive utility classes (sm:, md:, lg:, etc.).
Use next/image component for image optimization.
Techniques (React Native):
Use React Native's Flexbox properties and Tailwind's responsive utilities.
Employ density-independent pixels (dp) for sizing.
Use SafeAreaView for proper handling of device safe areas.