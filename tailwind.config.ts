import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";


export default {

  content: ["./src/**/*.tsx"],
  darkMode: 'class',
  safelist: [
    'bg-lightAccent',
    'dark:bg-darkAccent',
    'bg-lightSidebar',
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
      'black': '#000000',

      //light mode
      'lightbg': '#f0f9fc',
      'lightSidebar': '#DDEAF0', // sidebar, unselected cards
      'lightAccent': '#c0e1f0',  // selected card, details, profile create and logout buttons, createGroup bg
      'lightSelected': '#30b6f0', // selected page, joined button
      'lightButton': '#84cff0', // logout and create buttons
      'lightInput': '#f0f5f7', // profile input boxes

      //dark mode
      'darkbg': '#171717',
      'darkSidebar': '#2f3e45', // sidebar, unselected cards
      'darkAccent': '#275163', // selected card, details, profile create and logout buttons, createGroup bg
      'darkSelected': '#5ec6f2', // selected page, joined button
      'darkButton': '#3c7d99', // logout and create buttons
      'darkInput': '#DDEAF0', // profile input boxes

      // green joined label
      'joined':'#E8FEF0', 
      'joinedText':'#74A385'
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
