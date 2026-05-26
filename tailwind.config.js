/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4f46e5', // Indigo-600 for primary actions
        'save-success': '#22c55e',  // Green-500 for successful saves/positive status
        'churn-warning': '#ef4444', // Red-500 for high-priority churn risk
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}