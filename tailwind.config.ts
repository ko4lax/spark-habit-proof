import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0d0b08",
        surface: "#13110e",
        border: "#2a2520",
        sage: "#94a99b",
        "sage-hover": "#a8bfb2",
        body: "#6a7a72",
        muted: "#7a7068",
        faint: "#5c5449",
      },
    },
  },
  plugins: [],
};

export default config;
