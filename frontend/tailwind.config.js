
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation:{
        scale:'scale 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
      },
      keyframes:{
        scale:{
            '0%':{
              transform: 'scale(0.8)'
            },
            '50%':{
              transform: 'scale(1)'
            },
            '100%':{
              transform:'scale(0.8)'
            }
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily:{
        Orbiton:['Orbitron', 'sans-serif'],
        Roboto:['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}

