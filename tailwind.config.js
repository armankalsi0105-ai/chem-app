/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hud: {
          dark: '#0a0a0f',
          panel: 'rgba(15, 20, 30, 0.6)',
          border: 'rgba(0, 255, 255, 0.2)',
          neon: '#00ffff',
          text: '#e0f7fa',
          accent: '#00e5ff',
          error: '#ff003c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Space Mono', 'monospace'], // good for HUD numbers
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
        'neon-strong': '0 0 15px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
