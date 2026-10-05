import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "virtual:jt-styles.css";
import App from "./App.tsx";
import { startAnalytics } from "./lib/analytics.ts";

const root = document.getElementById("root");
if (!root) throw new Error("#root is missing from the page shell");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename="/home">
      <App />
    </BrowserRouter>
  </StrictMode>,
);

startAnalytics();

// For whoever opens the console.
console.log(
  "%cJTech%c\nThis page is TypeScript all the way down, and open source: https://github.com/JTech-Forums/Jtechforums\nTry ⌘K, the arrow keys on the flip phone, or tapping the big logo seven times.",
  "font: 700 28px Geist, system-ui, sans-serif; letter-spacing: -1px;",
  "font: 12px Geist Mono, monospace; line-height: 1.6;",
);
