/* eslint-disable @typescript-eslint/comma-dangle */
import flowbitePlugin from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './node_modules/flowbite/**/*.js'

  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbitePlugin({ charts: true }),
  ]
}
