import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export function OnboardingWelcome() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1
            className="text-white"
            style={{
              fontSize: '56px',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            Drift
          </h1>
          <p
            className="mt-6"
            style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#4a4a4a',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
            }}
          >
            Let&apos;s get to know you so Drift can pick the right things for you.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <button
          type="button"
          onClick={() => navigate('/onboarding/priorities')}
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-between transition-opacity active:opacity-80"
          style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '17px', fontWeight: 400 }}
        >
          <span>Let&apos;s go</span>
          <span>→</span>
        </button>

        <p
          className="text-center"
          style={{ fontSize: '12px', color: '#2e2e2e', fontWeight: 300, letterSpacing: '0.05em' }}
        >
          Takes about 2 minutes
        </p>
      </motion.div>
    </motion.div>
  );
}
