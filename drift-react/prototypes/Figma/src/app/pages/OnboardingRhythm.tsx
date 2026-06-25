import { useState } from 'react';
import { motion } from 'motion/react';

const CHRONOTYPE_OPTIONS = ['Morning person', 'Night owl', 'It varies'];
const FOCUS_OPTIONS = ['Short sprints', 'Long blocks', 'It depends'];
const TENDENCY_OPTIONS = [
  'Overload my todo list',
  'Get distracted easily',
  'Struggle to prioritise',
  'Leave things unfinished',
];

function SingleSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="rounded-2xl px-4 py-2.5 border transition-all duration-200"
            style={{
              fontSize: '14px',
              fontWeight: 300,
              borderColor: active ? 'var(--solm-border-emphasis)' : 'var(--solm-border-strong)',
              color: active ? 'var(--solm-text-1)' : 'var(--solm-text-4)',
              background: 'transparent',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function MultiSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((o) => o !== opt) : [...value, opt]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className="rounded-2xl px-4 py-2.5 border transition-all duration-200"
            style={{
              fontSize: '14px',
              fontWeight: 300,
              borderColor: active ? 'var(--solm-border-emphasis)' : 'var(--solm-border-strong)',
              color: active ? 'var(--solm-text-1)' : 'var(--solm-text-4)',
              background: 'transparent',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function OnboardingRhythm() {
  const [chronotype, setChronotype] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [tendencies, setTendencies] = useState<string[]>([]);

  const canProceed = !!chronotype && !!focus;

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
        2 of 4
      </p>

      {/* Question */}
      <h2
        style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3, color: 'var(--solm-text-1)', marginBottom: '40px' }}
      >
        What does your typical week look like?
      </h2>

      {/* Sections */}
      <div className="flex-1 flex flex-col gap-9">
        <div>
          <p
            className="tracking-[0.2em] uppercase mb-4"
            style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
          >
            I&apos;m a...
          </p>
          <SingleSelect
            options={CHRONOTYPE_OPTIONS}
            value={chronotype}
            onChange={setChronotype}
          />
        </div>

        <div>
          <p
            className="tracking-[0.2em] uppercase mb-4"
            style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
          >
            My focus time is...
          </p>
          <SingleSelect options={FOCUS_OPTIONS} value={focus} onChange={setFocus} />
        </div>

        <div>
          <p
            className="tracking-[0.2em] uppercase mb-4"
            style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
          >
            I tend to...
          </p>
          <MultiSelect
            options={TENDENCY_OPTIONS}
            value={tendencies}
            onChange={setTendencies}
          />
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
