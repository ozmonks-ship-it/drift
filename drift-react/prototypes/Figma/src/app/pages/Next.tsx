import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTaskContext } from '../context/TaskContext';
import { useState, useEffect } from 'react';

type Phase = 'finding' | 'revealing' | 'ready';

export function Next() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getNextTask, getWorkingTask, startTask, driftTask, binTask } = useTaskContext();
  const [exiting, setExiting] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState(false);

  const fromEnergySelect = !!(location.state as any)?.finding;
  const [phase, setPhase] = useState<Phase>(fromEnergySelect ? 'finding' : 'ready');
  const [visible, setVisible] = useState(!fromEnergySelect);

  useEffect(() => {
    if (fromEnergySelect) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [fromEnergySelect]);

  const nextTask = getNextTask();
  const workingTask = getWorkingTask();
  const displayTask = workingTask ?? nextTask;

  // Reset why panel when task changes
  useEffect(() => {
    setShowWhy(false);
  }, [displayTask?.id]);

  useEffect(() => {
    if (phase === 'finding') {
      const t1 = setTimeout(() => setPhase('revealing'), 1100);
      return () => clearTimeout(t1);
    }
    if (phase === 'revealing') {
      const t2 = setTimeout(() => setPhase('ready'), 700);
      return () => clearTimeout(t2);
    }
  }, [phase]);

  const handleStart = () => {
    if (!displayTask) return;
    startTask(displayTask.id);
    navigate('/working');
  };

  const handleDrift = () => {
    if (!displayTask) return;
    setExiting('drift');
    setTimeout(() => {
      driftTask(displayTask.id);
      navigate('/');
    }, 300);
  };

  const handleBin = () => {
    if (!displayTask) return;
    setExiting('bin');
    setTimeout(() => {
      binTask(displayTask.id);
      navigate('/');
    }, 300);
  };

  if (!displayTask) {
    return (
      <motion.div
        className="flex flex-col min-h-[100dvh] px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate('/')}
          className="transition-colors self-start mb-12"
          style={{ fontSize: '13px', letterSpacing: '0.05em', color: 'var(--solm-text-5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--solm-text-3)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--solm-text-5)')}
        >
          ← back
        </button>
        <div className="flex-1 flex flex-col justify-center">
          <p className="tracking-[0.25em] uppercase mb-4" style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}>
            all clear
          </p>
          <h2 className="mb-4" style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.3, color: 'var(--solm-text-1)' }}>
            Nothing to do.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--solm-text-3)' }}>
            Add a task to get started.
          </p>
        </div>
        <button
          onClick={() => navigate('/add')}
          className="w-full rounded-2xl py-5 px-6"
          style={{ background: 'var(--solm-cta-bg)', color: 'var(--solm-cta-fg)', fontSize: '17px' }}
        >
          + Add task
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12 overflow-hidden"
      initial={{ opacity: fromEnergySelect ? 0 : 0, x: fromEnergySelect ? 0 : 24 }}
      animate={{
        opacity: exiting ? 0 : 1,
        x: exiting === 'drift' ? -24 : exiting === 'bin' ? 24 : 0,
      }}
      transition={{ duration: fromEnergySelect ? 0.25 : 0.3 }}
    >
      {/* Back — hidden during finding phase */}
      <AnimatePresence>
        {phase !== 'finding' && visible && (
          <motion.button
            onClick={() => navigate('/')}
            className="transition-colors self-start mb-12"
            style={{ fontSize: '13px', letterSpacing: '0.05em', color: 'var(--solm-text-5)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--solm-text-3)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--solm-text-5)')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            ← back
          </motion.button>
        )}
      </AnimatePresence>

      {/* Finding phase — ripple animation */}
      <AnimatePresence>
        {phase === 'finding' && (
          <motion.div
            key="finding"
            className="absolute inset-0 flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full"
                  style={{ border: '1px solid var(--solm-text-3)' }}
                  initial={{ width: 8, height: 8, opacity: 0.8 }}
                  animate={{
                    width: [8, 64],
                    height: [8, 64],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 1.4,
                    delay: i * 0.42,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              ))}
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--solm-text-4)' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <motion.p
              className="tracking-[0.28em] uppercase"
              style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              finding your task
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task display */}
      <AnimatePresence>
        {phase !== 'finding' && (
          <motion.div
            key="task-content"
            className="flex-1 flex flex-col justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              key={displayTask.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.p
                className="tracking-[0.25em] uppercase mb-6"
                style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                {workingTask ? 'in progress' : 'up next'}
              </motion.p>
              <motion.p
                style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.4, color: 'var(--solm-text-1)' }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {displayTask.description}
              </motion.p>

              {/* Why button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="mt-6"
              >
                <button
                  onClick={() => setShowWhy(v => !v)}
                  className="transition-colors"
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.12em',
                    color: showWhy ? 'var(--solm-text-4)' : 'var(--solm-text-5)',
                  }}
                >
                  {showWhy ? 'close ×' : 'why this? ↓'}
                </button>

                <AnimatePresence>
                  {showWhy && (
                    <motion.div
                      key="why-panel"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="rounded-2xl p-5"
                        style={{ background: 'var(--solm-surface)', border: '1px solid var(--solm-border)' }}
                      >
                        <p
                          className="tracking-[0.2em] uppercase mb-3"
                          style={{ fontSize: '11px', color: 'var(--solm-text-3)' }}
                        >
                          claude's reasoning
                        </p>
                        <p
                          style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.6, color: 'var(--solm-text-4)' }}
                        >
                          This task has been sitting the longest and matches your current energy level. Clearing it now will unblock the most downstream work on your list.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
<motion.div
  className="flex flex-col gap-3"
  initial={{ opacity: 0, y: 16 }}
  animate={{
    opacity: phase === 'ready' ? 1 : 0,
    y: phase === 'ready' ? 0 : 16,
  }}
  style={{ pointerEvents: phase === 'ready' ? 'auto' : 'none' }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
>
            <button
              onClick={handleStart}
              className="w-full rounded-2xl py-5 px-6 transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--solm-cta-bg)', color: 'var(--solm-cta-fg)', fontSize: '17px', fontWeight: 400, textAlign: 'left' }}
            >
              Start →
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleDrift}
                className="flex-1 rounded-2xl py-5 px-6 transition-colors"
                style={{ border: '1px solid var(--solm-border-strong)', color: 'var(--solm-text-4)', fontSize: '16px', fontWeight: 400, textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--solm-border-hover)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--solm-border-strong)')}
              >
                Drift ~
              </button>
              <button
                onClick={handleBin}
                className="flex-1 rounded-2xl py-5 px-6 transition-colors"
                style={{ border: '1px solid var(--solm-border)', color: 'var(--solm-text-3)', fontSize: '16px', fontWeight: 400, textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--solm-border-hover)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--solm-border)')}
              >
                Bin ×
              </button>
            </div>
          </motion.div>

    </motion.div>
  );
}
