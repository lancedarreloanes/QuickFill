/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          orange: '#ee4d2d',
          orangeDark: '#d73211',
          orangeLight: '#ff5722',
          peach: '#fef6f4',
          yellow: '#f6a700',
          blue: '#0088ff',
          teal: '#00bfa5',
          navy: '#1a237e',
          dark: '#212121',
          grayBg: '#f5f5f5',
          border: '#e8e8e8'
        },
        brand: {
          cyan: '#06b6d4',
          cyanDark: '#0891b2',
          cyanLight: '#e0f2fe',
          emerald: '#10b981',
          silver: '#64748b',
          crimson: '#e11d48'
        }
      },
      boxShadow: {
        'shopee': '0 1px 1px 0 rgba(0,0,0,.05)',
        'shopee-hover': '0 1px 20px 0 rgba(0,0,0,.08)',
        'shopee-card': '0 2px 8px 0 rgba(0,0,0,.06)'
      }
    },
  },
  plugins: [],
}

