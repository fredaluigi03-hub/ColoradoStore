import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = 'COLORADO'.split('');

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('colorado-preloaded')) {
      setShow(false);
      return;
    }
    const t1 = setTimeout(() => setDone(true), 1200);
    const t2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('colorado-preloaded', '1');
    }, 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-inchiostro grain"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.7, ease: [0.77, 0, 0.18, 1] },
          }}
        >
          <div className="flex overflow-hidden">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                className="display-text text-carta text-5xl md:text-7xl"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 0 : 1 }}
            transition={{ delay: 1 }}
          >
            <span className="label text-sabbia">STORE · AVELLINO</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
