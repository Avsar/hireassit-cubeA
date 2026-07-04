import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gem: {
          DEFAULT: "#0B6E5B",
          deep: "#085344",
          light: "#0D8A72",
          wash: "#E7F2EE",
          50: "#E7F2EE",
          100: "#C5E0D7",
          600: "#0B6E5B",
          700: "#085344",
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
