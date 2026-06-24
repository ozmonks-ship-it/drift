import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { useOnboardingContext } from '../../context/OnboardingContext';
import { upsertUserContext } from '../../../lib/userContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function OnboardingSchedule() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromSettings = searchParams.get('from') === 'settings';
  const { draft, setSchedule, toUserContextInput } = useOnboardingContext();
  const [activeDays, setActiveDays] = useState<string[]>(draft.focusDays);
  const [notes, setNotes] = useState(draft.freeText);

  useEffect(() => {
    setActiveDays(draft.focusDays);
    setNotes(draft.freeText);
  }, [draft.focusDays, draft.freeText]);

  const toggleDay = (day: string) =>
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const canProceed = activeDays.length > 0;

  const handleNext = async () => {
    flushSync(() => setSchedule(activeDays, notes));
    if (fromSettings) {
      const { error } = await upsertUserContext(
        toUserContextInput({ focusDays: activeDays, freeText: notes })
      );
      if (!error) navigate('/settings');
      return;
    }
    navigate('/onboarding/complete');
  };

  const handleBack = () => {
    if (fromSettings) {
      navigate('/settings');
      return;
    }
    navigate('/onboarding/rhythm');
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
        className="self-start mb-10 transition-colors"
        style={{ fontSize: '13px', letterSpacing: '0.05em', color: 'var(--solm-text-5)' }}
      >
        ← back
      </button>

      {!fromSettings && (
        <p
          className="tracking-[0.25em] uppercase mb-8"
          style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
        >
          3 of 4
        </p>
      )}

      <h2
        className="text-solm-1 mb-10"
        style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3 }}
      >
        When do you have time for focused work?
      </h2>

      <div className="flex-1 flex flex-col gap-10">
        <div>
          <p
            className="tracking-[0.2em] uppercase mb-5"
            style={{ fontSize: '11px', color: 'var(--solm-text-4)' }}
          >
            Days of the week
          </p>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day) => {
              const active = activeDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className="rounded-2xl border transition-all duration-200"
                  style={{
                    fontSize: '13px',
                    fontWeight: 300,
                    width: '42px',
                    height: '42px',
                    borderColor: active ? 'var(--solm-border-emphasis)' : 'var(--solm-border-strong)',
                    color: active ? 'var(--solm-text-1)' : 'var(--solm-text-4)',
                    background: 'transparent',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p
            className="tracking-[0.2em] uppercase mb-4"
            style={{ fontSize: '11px', color: 'var(--solm-text-4)' }}
          >
            Anything else solm should know about your week?
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. I pick up kids on Tuesdays, Thursday evenings are date night..."
            rows={4}
            className="w-full rounded-2xl border border-solm-border-strong bg-transparent resize-none outline-none transition-colors focus:border-solm-border-focus placeholder:text-solm-5"
            style={{
              fontSize: '14px',
              fontWeight: 300,
              color: 'var(--solm-text-2)',
              padding: '16px 20px',
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>

      <div className="mt-8">
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
      </div>
    </motion.div>
  );
}
