import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

const PRIORITIES_DATA = ['Family', 'Health & Exercise', 'Side project'];
const RHYTHM_DATA = {
  chronotype: 'Morning person',
  focus: 'Short sprints',
  tendencies: ['Overload my todo list', 'Get distracted easily'],
};
const SCHEDULE_DATA = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  notes: 'I pick up kids on Tuesdays, Thursday evenings are date night.',
};

function SectionCard({
  label,
  onEdit,
  children,
}: {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5" style={{ border: '0.5px solid var(--solm-border)' }}>
      <div className="flex items-center justify-between mb-4">
        <p
          className="tracking-[0.22em] uppercase"
          style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
        >
          {label}
        </p>
        <button
          onClick={onEdit}
          className="transition-colors"
          style={{ fontSize: '12px', color: 'var(--solm-text-5)', letterSpacing: '0.05em' }}
        >
          Edit →
        </button>
      </div>
      {children}
    </div>
  );
}

type ThemeOption = 'system' | 'light' | 'dark';
const THEME_OPTIONS: { id: ThemeOption; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light',  label: 'Light' },
  { id: 'dark',   label: 'Dark' },
];

function AppearanceCard() {
  const { mode, setMode } = useTheme();
  return (
    <div className="rounded-2xl p-5" style={{ border: '0.5px solid var(--solm-border)' }}>
      <p
        className="tracking-[0.22em] uppercase mb-4"
        style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
      >
        Appearance
      </p>
      <div
        className="flex rounded-2xl p-1"
        style={{ border: '0.5px solid var(--solm-border)' }}
      >
        {THEME_OPTIONS.map(({ id, label }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="flex-1 rounded-xl py-2 transition-all"
              style={{
                fontSize: '13px',
                fontWeight: active ? 400 : 300,
                color: active ? 'var(--solm-text-1)' : 'var(--solm-text-4)',
                background: active ? 'var(--solm-surface)' : 'transparent',
                border: active ? '0.5px solid var(--solm-border-strong)' : '0.5px solid transparent',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Settings() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors"
          style={{ fontSize: '13px', letterSpacing: '0.05em', color: 'var(--solm-text-5)' }}
        >
          ← back
        </button>
      </div>

      <p
        className="tracking-[0.25em] uppercase mb-2"
        style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
      >
        your context
      </p>
      <h1
        style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--solm-text-1)', marginBottom: '40px' }}
      >
        Settings
      </h1>

      {/* Cards */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Appearance — first card */}
        <AppearanceCard />

        {/* Priorities */}
        <SectionCard label="Priorities" onEdit={() => {}}>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES_DATA.map((p) => (
              <span
                key={p}
                className="rounded-2xl px-3 py-1.5"
                style={{ fontSize: '13px', fontWeight: 300, color: 'var(--solm-text-4)', border: '0.5px solid var(--solm-border-strong)' }}
              >
                {p}
              </span>
            ))}
          </div>
        </SectionCard>

        {/* Rhythm */}
        <SectionCard label="Rhythm" onEdit={() => {}}>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <span
                className="tracking-[0.15em] uppercase"
                style={{ fontSize: '11px', color: 'var(--solm-text-3)', flexShrink: 0 }}
              >
                Type
              </span>
              <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--solm-text-4)' }}>
                {RHYTHM_DATA.chronotype}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className="tracking-[0.15em] uppercase"
                style={{ fontSize: '11px', color: 'var(--solm-text-3)', flexShrink: 0 }}
              >
                Focus
              </span>
              <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--solm-text-4)' }}>
                {RHYTHM_DATA.focus}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {RHYTHM_DATA.tendencies.map((t) => (
                <span
                  key={t}
                  className="rounded-2xl px-3 py-1.5"
                  style={{ fontSize: '12px', fontWeight: 300, color: 'var(--solm-text-5)', border: '0.5px solid var(--solm-border)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Schedule */}
        <SectionCard label="Schedule" onEdit={() => {}}>
          <div className="flex flex-col gap-4">
            <div className="flex gap-1.5 flex-wrap">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const active = SCHEDULE_DATA.days.includes(day);
                return (
                  <span
                    key={day}
                    className="rounded-xl"
                    style={{
                      fontSize: '12px',
                      fontWeight: 300,
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '0.5px solid',
                      borderColor: active ? 'var(--solm-border-active)' : 'var(--solm-border)',
                      color: active ? 'var(--solm-text-3)' : 'var(--solm-text-5)',
                    }}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
            {SCHEDULE_DATA.notes && (
              <p style={{ fontSize: '13px', fontWeight: 300, color: 'var(--solm-text-3)', lineHeight: 1.6 }}>
                {SCHEDULE_DATA.notes}
              </p>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Footer links */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          className="transition-colors"
          style={{ fontSize: '13px', color: 'var(--solm-text-5)', letterSpacing: '0.05em' }}
        >
          Sign out
        </button>
        <button
          onClick={() => navigate('/privacy')}
          className="transition-colors"
          style={{ fontSize: '11px', color: 'var(--solm-text-5)', letterSpacing: '0.06em' }}
        >
          Privacy policy
        </button>
      </div>
    </motion.div>
  );
}
