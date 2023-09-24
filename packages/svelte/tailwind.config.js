import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [
    animate,
    plugin(function ({addVariant, matchUtilities, theme}) {
      addVariant('hocus', ['&:hover', '&:focus']);
      // Square utility
      matchUtilities(
        {
          square: value => ({
            width: value,
            height: value
          })
        },
        {values: theme('spacing')}
      );
    })
  ]
};
