import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { useOnboardingContext } from '../../context/OnboardingContext';
import { upsertUserContext } from '../../../lib/userContext';

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
            type="button"
            onClick={() => onChange(opt)}
            className="rounded-2xl px-4 py-2.5 border transition-all duration-200"
            style={{
              fontSize: '14px',
              fontWeight: 300,
              borderColor: active ? '#ffffff' : '#242424',
              color: active ? '#ffffff' : '#555',
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
            type="button"
            onClick={() => toggle(opt)}
            className="rounded-2xl px-4 py-2.5 border transition-all duration-200"
            style={{
              fontSize: '14px',
              fontWeight: 300,
              borderColor: active ? '#ffffff' : '#242424',
              color: active ? '#ffffff' : '#555',
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromSettings = searchParams.get('from') === 'settings';
  const { draft, setRhythm, toUserContextInput } = useOnboardingContext();
  const [chronotype, setChronotype] = useState<string | null>(draft.chronotype);
  const [focus, setFocus] = useState<string | null>(draft.focus);
  const [tendencies, setTendencies] = useState<string[]>(draft.tendencies);

  useEffect(() => {
    setChronotype(draft.chronotype);
    setFocus(draft.focus);
    setTendencies(draft.tendencies);
  }, [draft.chronotype, draft.focus, draft.tendencies]);

  const canProceed = !!chronotype && !!focus;

  const handleNext = async () => {
    if (!chronotype || !focus) return;
    flushSync(() => setRhythm(chronotype, focus, tendencies));
    if (fromSettings) {
      const { error } = await upsertUserContext(
        toUserContextInput({ chronotype, focus, tendencies })
      );
      if (error) return;
      navigate('/settings');
      return;
    }
    navigate('/onboarding/schedule');
  };

  const handleBack = () => {
    if (fromSettings) {
      navigate('/settings');
      return;
    }
    navigate('/onboarding/priorities');
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
        style={{ fontSize: '13px', letterSpacing: '0.05em', color: '#444' }}
      >
        ← back
      </button>

      {!fromSettings && (
        <p
          className="tracking-[0.25em] uppercase mb-8"
          style={{ fontSize: '11px', color: '#2e2e2e' }}
        >
          2 of 4
        </p>
      )}

      <h2
        className="text-white mb-10"
        style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3 }}
      >
        What does your typical week look like?
      </h2>

      <div className="flex-1 flex flex-col gap-9">
        <div>
          <p
            className="tracking-[0.2em] uppercase mb-4"
            style={{ fontSize: '11px', color: '#3a3a3a' }}
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
            style={{ fontSize: '11px', color: '#3a3a3a' }}
          >
            My focus time is...
          </p>
          <SingleSelect options={FOCUS_OPTIONS} value={focus} onChange={setFocus} />
        </div>

        <div>
          <p
            className="tracking-[0.2em] uppercase mb-4"
            style={{ fontSize: '11px', color: '#3a3a3a' }}
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

      <div className="mt-8">
        <button
          type="button"
          disabled={!canProceed}
          onClick={handleNext}
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-between transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '17px', fontWeight: 400 }}
        >
          <span>{fromSettings ? 'Save' : 'Next'}</span>
          <span>→</span>
        </button>
      </div>
    </motion.div>
  );
}
