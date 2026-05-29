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
        style={{ fontSize: '13px', letterSpacing: '0.05em', color: '#444' }}
      >
        ← back
      </button>

      {/* Step indicator */}
      <p
        className="tracking-[0.25em] uppercase mb-8"
        style={{ fontSize: '11px', color: '#2e2e2e' }}
      >
        3 of 4
      </p>

      {/* Question */}
      <h2
        className="text-white mb-10"
        style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3 }}
      >
        When do you have time for focused work?
      </h2>

      <div className="flex-1 flex flex-col gap-10">
        {/* Day selector */}
        <div>
          <p
            className="tracking-[0.2em] uppercase mb-5"
            style={{ fontSize: '11px', color: '#3a3a3a' }}
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
                    borderColor: active ? '#ffffff' : '#242424',
                    color: active ? '#ffffff' : '#555',
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
            style={{ fontSize: '11px', color: '#3a3a3a' }}
          >
            Anything else solm should know about your week?
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. I pick up kids on Tuesdays, Thursday evenings are date night..."
            rows={4}
            className="w-full rounded-2xl border border-[#1e1e1e] bg-transparent resize-none outline-none transition-colors focus:border-[#333] placeholder:text-[#2a2a2a]"
            style={{
              fontSize: '14px',
              fontWeight: 300,
              color: '#888',
              padding: '16px 20px',
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>

      {/* Next */}
      <div className="mt-8">
        <button
          disabled={!canProceed}
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-between transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '17px', fontWeight: 400 }}
        >
          <span>Next</span>
          <span>→</span>
        </button>
      </div>
    </motion.div>
  );
}
