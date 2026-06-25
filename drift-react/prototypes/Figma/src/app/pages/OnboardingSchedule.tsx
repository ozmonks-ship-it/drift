import { useState } from 'react';
import { motion } from 'motion/react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function OnboardingSchedule() {
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleDay = (day: string) =>
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const canProceed = activeDays.length > 0;

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Back */}
      <button
        className="self-start mb-10 transition-colors"
        style={{ fontSize: '13px', letterSpacing: '0.05em', color: 'var(--solm-text-5)' }}
      >
        ← back
      </button>

      {/* Step indicator */}
      <p
        className="tracking-[0.25em] uppercase mb-8"
        style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
      >
        3 of 4
      </p>

      {/* Question */}
      <h2
        style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3, color: 'var(--solm-text-1)', marginBottom: '40px' }}
      >
        When do you have time for focused work?
      </h2>

      <div className="flex-1 flex flex-col gap-10">
        {/* Day selector */}
        <div>
          <p
            className="tracking-[0.2em] uppercase mb-5"
            style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
          >
            Days of the week
          </p>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day) => {
              const active = activeDays.includes(day);
              return (
                <button
                  key={day}
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

        {/* Free text */}
        <div>
          <p
            className="tracking-[0.2em] uppercase mb-4"
            style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
          >
            Anything else solm should know about your week?
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. I pick up kids on Tuesdays, Thursday evenings are date night..."
            rows={4}
            className="w-full rounded-2xl bg-transparent resize-none outline-none transition-colors"
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: 'var(--solm-text-4)',
              padding: '16px 20px',
              lineHeight: 1.6,
              border: '1px solid var(--solm-border-strong)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--solm-border-focus)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--solm-border-strong)')}
          />
          <style>{`textarea::placeholder { color: var(--solm-text-5); }`}</style>
        </div>
      </div>

      {/* Next */}
      <div className="mt-8">
        <button
          disabled={!canProceed}
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-between transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ background: 'var(--solm-cta-bg)', color: 'var(--solm-cta-fg)', fontSize: '17px', fontWeight: 400 }}
        >
          <span>Next</span>
          <span>→</span>
        </button>
      </div>
    </motion.div>
  );
}
