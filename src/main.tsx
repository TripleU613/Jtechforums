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
