/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "from-black",
    "via-gray-900",
    "to-gray-800",
    "animate-gradient-xy",
    "bg-gradient-to-br",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // blue-500
          dark: "#1d4ed8", // blue-700
          light: "#60a5fa", // blue-400
        },
        secondary: {
          DEFAULT: "#8b5cf6", // violet-500
          dark: "#6d28d9", // violet-700
          light: "#a78bfa", // violet-400
        },
        background: {
          DEFAULT: "#000", // slate-900
          dark: "#020617", // slate-950
          light: "#1e293b", // slate-800
        },
        accent: {
          DEFAULT: "#7dd3fc", // sky-300
          dark: "#0284c7", // sky-600
          light: "#bae6fd", // sky-200
        },
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "top center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "bottom center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "400% 400%",
            "background-position": "right center",
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "white",
            a: {
              color: "#3b82f6",
              "&:hover": {
                color: "#60a5fa",
              },
            },
            h1: {
              color: "white",
            },
            h2: {
              color: "white",
            },
            h3: {
              color: "white",
            },
            h4: {
              color: "white",
            },
            strong: {
              color: "white",
            },
            code: {
              color: "white",
            },
            blockquote: {
              color: "rgba(255, 255, 255, 0.8)",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
