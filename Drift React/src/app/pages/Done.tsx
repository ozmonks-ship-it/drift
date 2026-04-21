import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export function Done() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12 items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Checkmark circle */}
        <motion.div
          className="w-16 h-16 rounded-full border border-[#2a2a2a] flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <motion.span
            style={{ fontSize: '22px', color: '#888' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ✓
          </motion.span>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-[#444] tracking-[0.25em] uppercase mb-2" style={{ fontSize: '11px' }}>
            completed
          </p>
          <h2 className="text-white" style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em' }}>
            Nice work.
          </h2>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
