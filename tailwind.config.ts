import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";


export default {

  content: ["./src/**/*.tsx"],
  darkMode: 'class',
  safelist: [
    'bg-lightBlush',
    'dark:bg-darkAccent',
    'bg-white',
    'dark:bg-darkSidebar',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
    colors: {
      'white': '#FFFFFF',
      'lightbg': '#F0F4F8',
      'lightBlush': '#F4EFF8',
      'lightSidebar': '#DDEAF0',
      'lightHighlight': '#0CA8EF',
      'black': '#000000',
      'lightGrey': '#F3F7F8',
      'darkbg': '#161616',
      'darkSidebar': '#29363C',
      'darkAccent': '#275163',
      'darkHighlight': '#C9DEE7',
      'darkSelected': '#0CA8EF',
      'joined':'#E8FEF0',
      'joinedText':'#74A385'
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
