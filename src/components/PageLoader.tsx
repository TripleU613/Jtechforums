import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function PageLoader({ show, label = 'Loading' }) {
  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4 px-6 text-center text-white"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="text-xs uppercase tracking-[0.5em] text-slate-400">{label}</div>
            <p className="text-sm text-slate-200">Preparing content…</p>
            <div className="relative mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
              <motion.span
                className="absolute inset-y-0 w-1/3 rounded-full bg-white/60"
                initial={{ x: '-120%' }}
                animate={{ x: ['-120%', '140%'] }}
                transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
