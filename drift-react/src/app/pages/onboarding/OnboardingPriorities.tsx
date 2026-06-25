import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useOnboardingContext } from '../../context/OnboardingContext';
import { upsertUserContext } from '../../../lib/userContext';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromSettings = searchParams.get('from') === 'settings';
  const { draft, setPriorities, toUserContextInput } = useOnboardingContext();
  const [selected, setSelected] = useState<string[]>(draft.priorities);
  const [otherText, setOtherText] = useState(draft.otherPriority);

  useEffect(() => {
    setSelected(draft.priorities);
    setOtherText(draft.otherPriority);
  }, [draft.priorities, draft.otherPriority]);

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

  const otherSelected = selected.includes('Other');
  const canProceed =
    selected.length > 0 && (!otherSelected || otherText.trim().length > 0);

  const handleNext = async () => {
    flushSync(() => setPriorities(selected, otherText.trim()));
    if (fromSettings) {
      const { error } = await upsertUserContext(
        toUserContextInput({ priorities: selected, otherPriority: otherText.trim() })
      );
      if (error) return;
      navigate('/settings');
      return;
    }
    navigate('/onboarding/rhythm');
  };

  const handleBack = () => {
    if (fromSettings) {
      navigate('/settings');
      return;
    }
    navigate('/onboarding');
  };

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <button
        type="button"
        onClick={handleBack}
        className="self-start mb-10 text-solm-5 hover:text-solm-2 transition-colors"
        style={{ fontSize: '13px', letterSpacing: '0.05em' }}
      >
        ← back
      </button>

      {!fromSettings && (
        <p
          className="tracking-[0.25em] uppercase mb-8"
          style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
        >
          1 of 4
        </p>
      )}

      <div className="mb-8">
        <h2
          className="text-solm-1 mb-3"
          style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3 }}
        >
          What matters most in your life right now?
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--solm-text-4)', fontWeight: 300 }}>
          Choose up to 3. You can change these anytime.
        </p>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((option) => {
            const order = orderOf(option);
            const isSelected = order !== null;
            const isDisabled = !isSelected && selected.length >= 3;

            return (
              <button
                key={option}
                type="button"
                onClick={() => !isDisabled && toggle(option)}
                className="rounded-2xl px-4 py-2.5 border transition-all duration-200 flex items-center gap-2"
                style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  borderColor: isSelected ? 'var(--solm-border-emphasis)' : 'var(--solm-border-strong)',
                  color: isSelected ? 'var(--solm-text-1)' : isDisabled ? 'var(--solm-text-5)' : 'var(--solm-text-4)',
                  background: 'transparent',
                  cursor: isDisabled ? 'default' : 'pointer',
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--solm-text-2)',
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

        <AnimatePresence>
          {otherSelected && (
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
                className="w-full rounded-2xl border border-solm-border-strong bg-transparent outline-none transition-colors focus:border-solm-border-focus placeholder:text-solm-5"
                style={{
                  fontSize: '16px',
                  fontWeight: 300,
                  color: 'var(--solm-text-2)',
                  padding: '14px 20px',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <button
          type="button"
          disabled={!canProceed}
          onClick={handleNext}
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-between transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed bg-solm-cta-bg text-solm-cta-fg"
          style={{ fontSize: '17px', fontWeight: 400 }}
        >
          <span>{fromSettings ? 'Save' : 'Next'}</span>
          <span>→</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
