import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { supabase } from '../../../lib/supabase';
import {
  fetchUserContext,
  formatPriorityLabel,
  parseWorkStyle,
  type UserContext,
} from '../../../lib/userContext';
import { AppearanceSetting } from '../../components/AppearanceSetting';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    <div className="rounded-2xl border border-solm-border p-5">
      <div className="flex items-center justify-between mb-4">
        <p
          className="tracking-[0.22em] uppercase"
          style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
        >
          {label}
        </p>
        <button
          type="button"
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

export function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ctx, setCtx] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUserContext().then((data) => {
      setCtx(data);
      setLoading(false);
    });
  }, [location.key]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] items-center justify-center">
        <p className="text-solm-5 tracking-[0.25em] uppercase" style={{ fontSize: '10px' }}>
          loading
        </p>
      </div>
    );
  }

  if (!ctx) {
    return null;
  }

  const { chronotype, focus } = parseWorkStyle(ctx.work_style);

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-10">
        <button
          type="button"
          onClick={() => navigate('/')}
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
        className="text-solm-1 mb-10"
        style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em' }}
      >
        Settings
      </h1>

      <div className="flex-1 flex flex-col gap-4">
        <AppearanceSetting />

        <SectionCard
          label="Priorities"
          onEdit={() => navigate('/onboarding/priorities?from=settings')}
        >
          <div className="flex flex-wrap gap-2">
            {ctx.priorities.map((p) => (
              <span
                key={p}
                className="rounded-2xl border border-solm-border-strong px-3 py-1.5"
                style={{ fontSize: '13px', fontWeight: 300, color: 'var(--solm-text-4)' }}
              >
                {formatPriorityLabel(p, ctx.other_priority)}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          label="Rhythm"
          onEdit={() => navigate('/onboarding/rhythm?from=settings')}
        >
          <div className="flex flex-col gap-3">
            {chronotype ? (
              <div className="flex items-baseline gap-3">
                <span
                  className="tracking-[0.15em] uppercase"
                  style={{ fontSize: '11px', color: 'var(--solm-text-3)', flexShrink: 0 }}
                >
                  Type
                </span>
                <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--solm-text-2)' }}>
                  {chronotype}
                </span>
              </div>
            ) : null}
            {focus ? (
              <div className="flex items-baseline gap-3">
                <span
                  className="tracking-[0.15em] uppercase"
                  style={{ fontSize: '11px', color: 'var(--solm-text-3)', flexShrink: 0 }}
                >
                  Focus
                </span>
                <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--solm-text-2)' }}>
                  {focus}
                </span>
              </div>
            ) : null}
            {ctx.tendencies.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {ctx.tendencies.map((t) => (
                  <span
                    key={t}
                    className="rounded-2xl border border-solm-border-strong px-3 py-1.5"
                    style={{ fontSize: '12px', fontWeight: 300, color: 'var(--solm-text-5)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard
          label="Schedule"
          onEdit={() => navigate('/onboarding/schedule?from=settings')}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-1.5 flex-wrap">
              {ALL_DAYS.map((day) => {
                const active = ctx.focus_days.includes(day);
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
                      borderColor: active ? 'var(--solm-border-active)' : 'var(--solm-border)',
                      color: active ? 'var(--solm-text-2)' : 'var(--solm-text-5)',
                    }}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
            {ctx.free_text ? (
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'var(--solm-text-4)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {ctx.free_text}
              </p>
            ) : null}
          </div>
        </SectionCard>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="transition-colors"
          style={{ fontSize: '13px', color: 'var(--solm-text-3)', letterSpacing: '0.05em' }}
        >
          Sign out
        </button>
        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="transition-colors text-solm-5 hover:text-solm-3"
          style={{ fontSize: '11px', letterSpacing: '0.06em' }}
        >
          Privacy policy
        </button>
      </div>
    </motion.div>
  );
}
