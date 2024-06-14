/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
    screens: {
      'sm':'300px',
      'md':'700px',
      'lg':'1024px'
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.custom-content pre': {
          '@apply bg-gray-800 text-white p-4 rounded-md overflow-auto': {},
        },
        '.custom-content code': {
          '@apply bg-gray-900 text-green-400 p-1 rounded': {},
        },
        '.custom-content a': {
          '@apply underline text-inherit': {},
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}