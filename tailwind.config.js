/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Switch to dark mode with a single class
  theme: {
    extend: {
      // 🔥 Vibrant Animations for an Engaging UI
      animation: {
        'fade-in-long': 'fadeInLong 1.2s ease-in-out',
        'fade-in-slow': 'fadeInLong 2s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite', // Subtle pulsing for attention
        'bounce-fast': 'bounce 0.5s ease-in-out infinite', // Snappy bounce for interactivity
      },
      keyframes: {
        fadeInLong: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '50%': { opacity: '0.5', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // 🌈 Sleek Custom Colors to Brighten Your Palette
      colors: {
        'brand-blue': '#1E40AF',
        'brand-blue-light': '#3B82F6',
        'brand-pink': '#DB2777',
        'brand-pink-light': '#F472B6',
        'dark-bg': '#1A202C', // Deep elegance for dark mode
        'dark-card': '#2D3748', // Card contrast in dark mode
        'light-bg': '#F9FAFB', // Clean and minimal for light mode
        'light-card': '#FFFFFF', // Crisp white for cards
      },

      // 🖼️ Effortless Spacing for Pro-Level Layouts
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem', // Perfect for hero sections and large designs
      },

      // 🎨 Enhanced Typography for Readability
      fontSize: {
        'xxs': '0.625rem', // Perfect for captions
        '2.5xl': '1.75rem', // Sleek headline size
      },

      // 🛠️ Modern Borders for Sharp Edges
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      // 📱 Breakpoints to Fit Every Device
      screens: {
        'xs': '475px', // Compact for small screens
        '3xl': '1920px', // Extra clarity on ultra-wide screens
      },
    },
  },

  // 🌟 Fine-Tuned Defaults
  corePlugins: {
    container: true, // Keep containers enabled for consistent layouts
  },

  // 🚀 Ready for the Future: Plugin-Free for Now
  plugins: [],
};
