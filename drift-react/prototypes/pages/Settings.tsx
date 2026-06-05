import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

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
    <div className="rounded-2xl border border-[#1a1a1a] p-5">
      <div className="flex items-center justify-between mb-4">
        <p
          className="tracking-[0.22em] uppercase"
          style={{ fontSize: '10px', color: '#2e2e2e' }}
        >
          {label}
        </p>
        <button
          onClick={onEdit}
          className="transition-colors"
          style={{ fontSize: '12px', color: '#444', letterSpacing: '0.05em' }}
        >
          Edit →
        </button>
      </div>
      {children}
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
          className="transition-colors"
          style={{ fontSize: '13px', letterSpacing: '0.05em', color: '#444' }}
        >
          ← back
        </button>
      </div>

      <p
        className="tracking-[0.25em] uppercase mb-2"
        style={{ fontSize: '11px', color: '#2e2e2e' }}
      >
        your context
      </p>
      <h1
        className="text-white mb-10"
        style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em' }}
      >
        Settings
      </h1>

      {/* Cards */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Priorities */}
        <SectionCard label="Priorities" onEdit={() => {}}>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES_DATA.map((p) => (
              <span
                key={p}
                className="rounded-2xl border border-[#242424] px-3 py-1.5"
                style={{ fontSize: '13px', fontWeight: 300, color: '#555' }}
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
                style={{ fontSize: '10px', color: '#2e2e2e', flexShrink: 0 }}
              >
                Type
              </span>
              <span style={{ fontSize: '14px', fontWeight: 300, color: '#666' }}>
                {RHYTHM_DATA.chronotype}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className="tracking-[0.15em] uppercase"
                style={{ fontSize: '10px', color: '#2e2e2e', flexShrink: 0 }}
              >
                Focus
              </span>
              <span style={{ fontSize: '14px', fontWeight: 300, color: '#666' }}>
                {RHYTHM_DATA.focus}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {RHYTHM_DATA.tendencies.map((t) => (
                <span
                  key={t}
                  className="rounded-2xl border border-[#1e1e1e] px-3 py-1.5"
                  style={{ fontSize: '12px', fontWeight: 300, color: '#444' }}
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
                    className="rounded-xl border"
                    style={{
                      fontSize: '12px',
                      fontWeight: 300,
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: active ? '#383838' : '#1a1a1a',
                      color: active ? '#888' : '#2a2a2a',
                    }}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
            {SCHEDULE_DATA.notes && (
              <p style={{ fontSize: '13px', fontWeight: 300, color: '#3a3a3a', lineHeight: 1.6 }}>
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
          style={{ fontSize: '13px', color: '#2e2e2e', letterSpacing: '0.05em' }}
        >
          Sign out
        </button>
        <button
          onClick={() => navigate('/privacy')}
          className="transition-colors text-[#1e1e1e] hover:text-[#444]"
          style={{ fontSize: '11px', letterSpacing: '0.06em' }}
        >
          Privacy policy
        </button>
      </div>
    </motion.div>
  );
}
