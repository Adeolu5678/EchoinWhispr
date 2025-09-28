/**
 * EchoinWhspr Web - Tailwind CSS Configuration
 *
 * Web-specific Tailwind configuration that extends the shared design system.
 * Includes Next.js specific optimizations and web-only utilities.
 */

const baseConfig = require('../design-system/tailwind.config');

const webConfig = {
  ...baseConfig,

  // Web-specific content paths
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Include design system components
    '../design-system/components/**/*.{js,ts,jsx,tsx}',
  ],

  // Web-specific theme extensions
  theme: {
    ...baseConfig.theme,
    extend: {
      // Next.js specific utilities
      fontFamily: {
        'inter-var': ['InterVariable', 'Inter', 'system-ui', 'sans-serif'],
      },

      // Web-specific animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      // Web-specific spacing for larger screens
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // Container queries for responsive design
      containers: {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
      },
    },
  },

  // Web-specific plugins
  plugins: [
    ...(baseConfig.plugins || []),

    // Container queries plugin (if installed)
    // require('@tailwindcss/container-queries'),

    // Custom web-specific utilities
    function ({ addUtilities, theme }) {
      const webUtilities = {
        // Web-specific focus styles
        '.focus-visible-ring': {
          '@apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2':
            {},
        },

        // Scroll utilities
        '.scroll-smooth': {
          scrollBehavior: 'smooth',
        },

        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },

        // Selection styles
        '.selection-primary': {
          '::selection': {
            backgroundColor: theme('colors.primary.100'),
            color: theme('colors.primary.900'),
          },
        },

        // Print styles
        '.print-hidden': {
          '@media print': {
            display: 'none',
          },
        },

        '.print-visible': {
          display: 'none',
          '@media print': {
            display: 'block',
          },
        },
      };

      addUtilities(webUtilities);
    },
  ],
};

module.exports = webConfig;