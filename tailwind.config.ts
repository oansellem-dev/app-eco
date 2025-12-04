import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4CAF50",
          dark: "#2E7D32",
          light: "#A5D6A7",
        },
        earth: "#8D6E63",
        sand: "#F1F8E9",
        ink: "#1A1A1A",
        success: "#00C853",
        warning: "#FF9800",
      },
      boxShadow: {
        'leaf': '0 4px 14px 0 rgba(76, 175, 80, 0.39)',
        'leaf-hover': '0 6px 20px rgba(76, 175, 80, 0.23)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
