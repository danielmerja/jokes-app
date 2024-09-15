// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, minmax(4px, 1fr))',
      },
      spacing: {
        '1': '4px',
        '4': '1rem',
      },
    },
  },
  plugins: [],
};
