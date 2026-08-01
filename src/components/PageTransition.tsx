import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PageTransition() {
  const location = useLocation();
  const [key, setKey] = useState('');

  useEffect(() => {
    setKey(location.pathname + Date.now());
  }, [location.pathname]);

  return (
    <motion.div
      key={key}
      className="fixed inset-0 z-[80] pointer-events-none bg-inchiostro"
      initial={{ clipPath: 'inset(0 0 0 0)' }}
      animate={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
    />
  );
}
