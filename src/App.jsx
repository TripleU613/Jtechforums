import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageShell from './components/PageShell';
import Home from './pages/Home';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import About from './pages/About';
import EGate from './pages/EGate';
import Contact from './pages/Contact';
import Apps from './pages/Apps';
import SignIn from './pages/SignIn';
import Privacy from './pages/Privacy';
import Maintenance from './pages/Maintenance';
import ServerError from './pages/ServerError';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -24, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <PageShell>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            <Route path="/egate" element={<EGate />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}
