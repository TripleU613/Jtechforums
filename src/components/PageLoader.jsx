import { AnimatePresence, motion } from 'framer-motion';

export default function PageLoader({ show, label = 'Loading' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-white shadow-2xl"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-sky-300">{label}</p>
            <h2 className="mt-4 text-xl font-semibold">Preparing content…</h2>
            <p className="mt-2 text-xs text-slate-300">Hang tight for a second.</p>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400"
                initial={{ x: '-100%' }}
                animate={{ x: ['-100%', '0%', '0%', '100%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
