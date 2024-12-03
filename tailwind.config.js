/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        blink: 'blink 0.8s step-start infinite', // Faster blink, 0.8s cycle time
        // only the left border will blink
        borderblink: 'borderblink 1.2s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%, 100%': { opacity: 1 },  // Visible
          '25%, 75%': { opacity: 0 },       // Invisible
        },
        borderblink: {
          '0%, 50%, 100%': { borderLeftColor: 'transparent' },  // Left border invisible
          '25%, 75%': { borderLeftColor: '#ff0000' },          // Left border visible (red)
        },
      },
    },
  },
  plugins: [],
}
