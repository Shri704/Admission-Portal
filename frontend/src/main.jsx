import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router/AppRouter.jsx";
import "./index.css";
import { loadTailwind } from "./utils/loadTailwind.js";

const tailwindConfig = {
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#1e40af",
        secondary: "#3b82f6",
        accent: "#6366f1",
        dark: "#0f172a",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0, 0, 0, 0.12)",
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
        "gradient-card": "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
      },
      animation: {
        fadeIn: "fadeIn 1.5s ease-in-out",
        slideUp: "slideUp 0.8s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
};

// Render immediately, load Tailwind in background
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

// Load Tailwind CSS asynchronously
loadTailwind(tailwindConfig)
  .catch((error) => {
    console.error("Failed to load Tailwind CSS CDN:", error);
  })
  .then(() => {
    document.body.classList.add(
      "animated-gradient",
      "min-h-screen",
      "font-inter",
      "text-dark"
    );
  });
