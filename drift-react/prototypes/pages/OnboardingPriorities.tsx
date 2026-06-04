import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const OPTIONS = [
  'Family',
  'Health & Exercise',
  'Reading',
  'Work',
  'Creative pursuits',
  'Side project',
  'Rest & recovery',
  'Social life',
  'Other',
];

export function OnboardingPriorities() {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');

  const toggle = (option: string) => {
    setSelected((prev) => {
      if (prev.includes(option)) {
        if (option === 'Other') setOtherText('');
        return prev.filter((o) => o !== option);
      }
      if (prev.length >= 3) return prev;
      return [...prev, option];
    });
  };

  const orderOf = (option: string) => {
    const idx = selected.indexOf(option);
    return idx === -1 ? null : idx + 1;
  };

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Back */}
      <button
        className="self-start mb-10 text-[#444] hover:text-[#666] transition-colors"
        style={{ fontSize: '13px', letterSpacing: '0.05em' }}
      >
        ← back
      </button>

      {/* Step indicator */}
      <p
        className="tracking-[0.25em] uppercase mb-8"
        style={{ fontSize: '11px', color: '#2e2e2e' }}
      >
        1 of 4
      </p>

      {/* Question */}
      <div className="mb-8">
        <h2
          className="text-white mb-3"
          style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3 }}
        >
          What matters most in your life right now?
        </h2>
        <p style={{ fontSize: '14px', color: '#3a3a3a', fontWeight: 300 }}>
          Choose up to 3. You can change these anytime.
        </p>
      </div>

      {/* Pills grid */}
      <div className="flex-1">
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((option) => {
            const order = orderOf(option);
            const isSelected = order !== null;
            const isDisabled = !isSelected && selected.length >= 3;

            return (
              <button
                key={option}
                onClick={() => !isDisabled && toggle(option)}
                className="rounded-2xl px-4 py-2.5 border transition-all duration-200 flex items-center gap-2"
                style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  borderColor: isSelected ? '#ffffff' : '#242424',
                  color: isSelected ? '#ffffff' : isDisabled ? '#2a2a2a' : '#555',
                  background: 'transparent',
                  cursor: isDisabled ? 'default' : 'pointer',
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#888',
                      fontWeight: 400,
                      letterSpacing: '0.05em',
                      minWidth: '10px',
                    }}
                  >
                    {order}
                  </span>
                )}
                {option}
              </button>
            );
          })}
        </div>

        {/* Other free-text field */}
        <AnimatePresence>
          {selected.includes('Other') && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <input
                autoFocus
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="What else matters to you?"
                className="w-full rounded-2xl border border-[#1e1e1e] bg-transparent outline-none transition-colors focus:border-[#333] placeholder:text-[#2a2a2a]"
                style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  color: '#888',
                  padding: '14px 20px',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <button
          disabled={selected.length === 0}
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-between transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '17px', fontWeight: 400 }}
        >
          <span>Next</span>
          <span>→</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
