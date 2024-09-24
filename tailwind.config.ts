import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      extend: {
        backgroundImage: {
          'csil-pattern': "url('/images/csil_pattern.svg')",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", ...fontFamily.serif],
      },
    },
  },
  plugins: [],
} satisfies Config;
