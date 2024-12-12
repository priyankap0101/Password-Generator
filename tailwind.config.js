/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define custom animations
      animation: {
        'fade-in-long': 'fadeInLong 1.2s ease-in-out',
        'fade-in-slow': 'fadeInLong 2s ease-in-out',
      },
      // Add keyframes for animations
      keyframes: {
        fadeInLong: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '50%': { opacity: '0.5', transform: 'translateY(-10px)' }, // Smooth transition phase
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Extend default spacing, colors, or other utilities if needed
      spacing: {
        '128': '32rem', // Example custom spacing utility
      },
      colors: {
        'brand-blue': '#1E40AF', // Example brand color for customization
        'brand-pink': '#DB2777',
      },
    },
  },
  // Add plugins if necessary for additional utilities
  plugins: [],
};
