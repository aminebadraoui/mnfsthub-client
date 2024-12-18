
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');


module.exports = {

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': colors.cyan,
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      let allColors = theme('colors');
      let newVars = Object.fromEntries(
        Object.entries(allColors).flatMap(([color, value]) => {
          if (typeof value === 'object') {
            return Object.entries(value).map(([shade, hex]) => [`--${color}-${shade}`, hex]);
          }
          return [[`--${color}`, value]];
        })
      );

      addBase({
        ':root': newVars,
      });
    }),
  ],
}