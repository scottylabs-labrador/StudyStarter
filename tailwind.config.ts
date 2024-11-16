import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";


export default {
  
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
    colors: {
      'darkbg': '#161616',
      'darkSidebar':'#29363C',
      'darkAccent': '#258EBD',
      'darkHighlight':'#C9DEE7',
      'darkSelected':'#275163',
      'white': '#FFFFFF',
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
