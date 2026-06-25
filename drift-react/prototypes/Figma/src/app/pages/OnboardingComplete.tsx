import { motion } from 'motion/react';

export function OnboardingComplete() {
  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 flex flex-col justify-center">
        {/* Wave animation */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg
            width="48"
            height="28"
            viewBox="0 0 48 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {[0, 10, 20].map((yOffset, i) => (
              <motion.path
                key={i}
                d={`M0 ${6 + yOffset} Q6 ${2 + yOffset} 12 ${6 + yOffset} Q18 ${10 + yOffset} 24 ${6 + yOffset} Q30 ${2 + yOffset} 36 ${6 + yOffset} Q42 ${10 + yOffset} 48 ${6 + yOffset}`}
                stroke="var(--solm-text-3)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.8, delay: 0.3 + i * 0.15, ease: 'easeOut' },
                  opacity: { duration: 0.4, delay: 0.3 + i * 0.15 },
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--solm-text-1)',
              marginBottom: '16px',
            }}
          >
            You&apos;re all set.
          </h1>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: 'var(--solm-text-3)',
              lineHeight: 1.6,
            }}
          >
            solm knows what matters. Now let it pick.
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
      >
        <button
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-between transition-opacity active:opacity-80"
          style={{ background: 'var(--solm-cta-bg)', color: 'var(--solm-cta-fg)', fontSize: '17px', fontWeight: 400 }}
        >
          <span>Start</span>
          <span>→</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
