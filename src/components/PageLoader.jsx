import { AnimatePresence, motion } from 'framer-motion';

export default function PageLoader({ show, label = 'Loading' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/70 px-8 py-10 text-center text-white shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-slate-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-300" />
              {label}
            </div>
            <p className="text-sm text-slate-300">Preparing content…</p>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.span
                className="absolute inset-y-0 w-1/3 rounded-full bg-white/60"
                initial={{ x: '-100%' }}
                animate={{ x: ['-100%', '130%'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
