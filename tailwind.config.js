/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-nav': '#000000',
        'text-nav': '#FFFFFF',
        'text-nav-hover': '#E5E5E5',
        'cta': '#000000',
        'cta-hover': '#1A1A1A',
        'copy': '#222222',
        'bg-page': '#F5F5F5',
        'brand-black': '#000000',
        'brand-navy': '#0D1F2D',
        'brand-gray': '#334155',
      },
    },
  },
  plugins: [],
} 