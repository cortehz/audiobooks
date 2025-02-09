/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        crimson: ['CrimsonText'],
        'crimson-semibold': ['CrimsonText-SemiBold'],
        'crimson-bold': ['CrimsonText-Bold'],
        courier: ['CourierPrime'],
      },
    },
  },
  plugins: [],
};
