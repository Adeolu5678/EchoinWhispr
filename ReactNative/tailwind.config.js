/**
 * EchoinWhspr React Native - Tailwind CSS Configuration
 *
 * React Native specific configuration using NativeWind.
 * Extends the shared design system with mobile-specific optimizations.
 */

const baseConfig = require('../design-system/tailwind.config.ts');

module.exports = {
  ...baseConfig,

  // React Native content paths
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    // Include design system components
    '../design-system/components/**/*.{js,ts,jsx,tsx}',
  ],

  // NativeWind specific configuration
  presets: [baseConfig],

  // React Native specific theme extensions
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,

      // Mobile-specific spacing (density-independent)
      spacing: {
        ...baseConfig.theme?.extend?.spacing,
        // Safe area spacing
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },

      // Mobile-optimized animations
      animation: {
        ...baseConfig.theme?.extend?.animation,
        'fade-in-fast': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.4s ease-in-out',
      },

      keyframes: {
        ...baseConfig.theme?.extend?.keyframes,
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInRight: {
          '0%': { transform: [{ translateX: 20 }], opacity: 0 },
          '100%': { transform: [{ translateX: 0 }], opacity: 1 },
        },
        bounceSubtle: {
          '0%, 100%': { transform: [{ scale: 1 }] },
          '50%': { transform: [{ scale: 1.05 }] },
        },
      },

      // Mobile-specific shadows (limited support)
      boxShadow: {
        ...baseConfig.theme?.extend?.boxShadow,
        'mobile-sm': {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        'mobile-md': {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        'mobile-lg': {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        },
      },
    },
  },

  // NativeWind specific plugins
  plugins: [
    ...(baseConfig.plugins || []),

    // Mobile-specific utilities
    function({ addUtilities }) {
      const mobileUtilities = {
        // Touch target utilities
        '.touch-manipulation': {
          touchAction: 'manipulation',
        },

        // Safe area utilities
        '.safe-area-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-area-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-area-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-area-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },

        // Mobile-specific focus styles
        '.focus-ring-native': {
          // Native platforms handle focus differently
        },

        // Platform-specific styles
        '.ios-only': {
          // iOS specific styles
        },
        '.android-only': {
          // Android specific styles
        },
      };

      addUtilities(mobileUtilities);
    },
  ],

  // NativeWind specific options
  corePlugins: {
    // Disable web-only plugins
    container: false,
    accessibility: false,
    pointerEvents: false,
    visibility: false,
    position: false,
    inset: false,
    isolation: false,
    zIndex: false,
    order: false,
    gridColumn: false,
    gridColumnStart: false,
    gridColumnEnd: false,
    gridRow: false,
    gridRowStart: false,
    gridRowEnd: false,
    float: false,
    clear: false,
    objectFit: false,
    objectPosition: false,
    overflow: false,
    overscrollBehavior: false,
    scrollBehavior: false,
    scrollMargin: false,
    scrollPadding: false,
    listStyleType: false,
    listStylePosition: false,
    appearance: false,
    columns: false,
    breakBefore: false,
    breakInside: false,
    breakAfter: false,
    gridAutoColumns: false,
    gridAutoFlow: false,
    gridAutoRows: false,
    gridTemplateColumns: false,
    gridTemplateRows: false,
    flexDirection: false,
    flexWrap: false,
    placeContent: false,
    placeItems: false,
    alignContent: false,
    alignItems: false,
    justifyContent: false,
    justifyItems: false,
    gap: false,
    space: false,
    divideWidth: false,
    divideColor: false,
    divideStyle: false,
    divideOpacity: false,
    placeSelf: false,
    alignSelf: false,
    justifySelf: false,
  },
};