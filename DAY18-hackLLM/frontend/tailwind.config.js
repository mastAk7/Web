export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff5aa3',
        pink2: '#ff2d8a',
        bgstart: '#080409',
        bgend: '#0f0710'
      },
      boxShadow: {
        'soft-pink': '0 10px 30px rgba(255,45,138,0.06)'
      }
    }
  },
  plugins: []
};

