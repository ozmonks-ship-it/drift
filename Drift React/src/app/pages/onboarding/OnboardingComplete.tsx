import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useOnboardingContext } from '../../context/OnboardingContext';
import { upsertUserContext } from '../../../lib/userContext';

export function OnboardingComplete() {
  const navigate = useNavigate();
  const { draft, toUserContextInput } = useOnboardingContext();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleStart = async () => {
    setSaveError(null);
    setIsSaving(true);
    const { data, error } = await upsertUserContext(toUserContextInput());
    setIsSaving(false);

    if (error || !data) {
      setSaveError(
        error ??
          'Could not save your profile. Make sure the user_context table exists in Supabase.'
      );
      return;
    }

    navigate('/', { replace: true, state: { contextReady: true } });
  };

  const canSave =
    draft.priorities.length > 0 &&
    (!draft.priorities.includes('Other') || draft.otherPriority.trim().length > 0) &&
    !!draft.chronotype &&
    !!draft.focus &&
    draft.focusDays.length > 0;

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 flex flex-col justify-center">
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
                stroke="#2e2e2e"
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

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h1
            className="text-white mb-4"
            style={{
              fontSize: '48px',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            You&apos;re all set.
          </h1>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: '#3a3a3a',
              lineHeight: 1.6,
            }}
          >
            Drift knows what matters. Now let it pick.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="flex flex-col gap-4"
      >
        {saveError ? (
          <p style={{ fontSize: '13px', color: '#7a4a4a', fontWeight: 300, lineHeight: 1.5 }}>
            {saveError}
          </p>
        ) : null}

        {!canSave && !saveError ? (
          <p style={{ fontSize: '13px', color: '#5a5a5a', fontWeight: 300 }}>
            Some answers are missing. Go back and finish the previous steps.
          </p>
        ) : null}

        <button
          type="button"
          disabled={isSaving || !canSave}
          onClick={handleStart}
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-between transition-opacity active:opacity-80 disabled:opacity-60"
          style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '17px', fontWeight: 400 }}
        >
          <span>{isSaving ? 'Saving…' : 'Start drifting'}</span>
          <span>→</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
