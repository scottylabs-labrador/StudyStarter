import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";


export default {
  
  content: ["./src/**/*.tsx"],
  darkMode:'selector',
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
    colors: {
      'darkbg': '#161616',
      'darkSidebar':'#29363C',
      'darkAccent': '#275163',
      'darkHighlight':'#C9DEE7',
      'darkSelected':'#0CA8EF',
      'white': '#FFFFFF',
      'lightbg': '#F0F4F8',
      'lightSidebar': '#DDEAF0',
      'black':'#000000',
      'lightGrey': '#F3F7F8'
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
