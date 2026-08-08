import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff9f4",
          100: "#d7f0e3",
          500: "#1f9d63",
          600: "#187d4f",
          700: "#146340",
        },
      },
    },
  },
  plugins: [],
};

export default config;
