import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PageShell from "./components/PageShell.tsx";
import Home from "./pages/Home.tsx";

const About = lazy(() => import("./pages/About.tsx"));
const EGate = lazy(() => import("./pages/EGate.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Maintenance = lazy(() => import("./pages/Maintenance.tsx"));
const ServerError = lazy(() => import("./pages/ServerError.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

export default function App() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="container empty-state" role="status">
            Loading page…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/egate" element={<EGate />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageShell>
  );
}
