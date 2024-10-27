/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fidelity': {
          'green': '#025742',
          'navy': '#1A1F3D',
        },
        'cream': '#F8F7F2', // Updated to a softer, more neutral cream color
      },
    },
  },
  plugins: [],
}
