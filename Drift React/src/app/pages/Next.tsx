import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTaskContext } from '../context/TaskContext';
import { useState, useEffect } from 'react';
import { pickNextTask, type PickSource } from '../../lib/claude';

type Phase = 'finding' | 'revealing' | 'ready';

export function Next() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getNextTask, getWorkingTask, startTask, driftTask, binTask, tasks, setNextTask, isPickingNextTask, setIsPickingNextTask, sessionDriftedTasks, addSessionDriftedTask } = useTaskContext();
  const [exiting, setExiting] = useState<string | null>(null);

  const fromEnergySelect = !!(location.state as any)?.finding;
  const [pickSource, setPickSource] = useState<PickSource | null>(((location.state as any)?.pickSource as PickSource | undefined) ?? null);
  const [pickReasoning, setPickReasoning] = useState<string | null>(((location.state as any)?.pickReasoning as string | undefined) ?? null);
  const [phase, setPhase] = useState<Phase>(fromEnergySelect && isPickingNextTask ? 'finding' : 'ready');
  const [visible, setVisible] = useState(!fromEnergySelect);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    const state = (location.state as any) ?? {};
    if ('pickSource' in state) setPickSource((state.pickSource as PickSource | undefined) ?? null);
    if ('pickReasoning' in state) setPickReasoning((state.pickReasoning as string | undefined) ?? null);
  }, [location.state]);
  
  useEffect(() => {
    if (fromEnergySelect) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [fromEnergySelect]);

  const nextTask = getNextTask();
  const workingTask = getWorkingTask();
  const displayTask = workingTask ?? nextTask;

  useEffect(() => {
    setPhase(isPickingNextTask ? 'finding' : 'ready');
  }, [isPickingNextTask]);

  useEffect(() => {
    setShowWhy(false);
  }, [displayTask?.id]);

  const handleStart = async () => {
    if (!displayTask) return;
    await startTask(displayTask.id);
    navigate('/working');
  };

  const handleDrift = () => {
    if (!displayTask) return;
    setExiting('drift');
    setIsPickingNextTask(true);
    setPhase('finding');
    setTimeout(async () => {
      // End exit animation so the finding state can be visible while Claude is in-flight.
      setExiting(null);
      await driftTask(displayTask.id);
      const energy = (location.state as any)?.energy;
      if (energy) {
        const pending = tasks
          .filter(t => t.status === 'pending' && t.id !== displayTask.id);
        try {
          addSessionDriftedTask(displayTask.description);
          const pick = await pickNextTask(pending, energy, [...sessionDriftedTasks, displayTask.description]);
          setNextTask(pick.id);
          setPickSource(pick.source);
          setPickReasoning(pick.reasoning);
          setExiting(null);
        } finally {
          setIsPickingNextTask(false);
        }
      } else {
        setIsPickingNextTask(false);
        navigate('/');
      }
    }, 300);
  };

  const handleBin = () => {
    if (!displayTask) return;
    setExiting('bin');
    setTimeout(async () => {
      await binTask(displayTask.id);
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
          className="text-[#444] hover:text-[#666] transition-colors self-start mb-12"
          style={{ fontSize: '13px', letterSpacing: '0.05em' }}
        >
          ← back
        </button>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[#3a3a3a] tracking-[0.25em] uppercase mb-4" style={{ fontSize: '11px' }}>
            all clear
          </p>
          <h2 className="text-white mb-4" style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            Nothing to do.
          </h2>
          <p className="text-[#3a3a3a]" style={{ fontSize: '15px' }}>
            Add a task to get started.
          </p>
        </div>
        <button
          onClick={() => navigate('/add')}
          className="w-full rounded-2xl py-5 px-6"
          style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '17px' }}
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
            className="text-[#444] hover:text-[#666] transition-colors self-start mb-12"
            style={{ fontSize: '13px', letterSpacing: '0.05em' }}
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
                  className="absolute rounded-full border border-[#333]"
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
                className="w-1.5 h-1.5 rounded-full bg-[#555]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <motion.p
              className="text-[#2e2e2e] tracking-[0.28em] uppercase"
              style={{ fontSize: '10px' }}
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
                className="text-[#3a3a3a] tracking-[0.25em] uppercase mb-6"
                style={{ fontSize: '11px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                {workingTask ? 'in progress' : 'up next'}
              </motion.p>
              {!workingTask && pickSource === 'fallback' && (
                <motion.p
                  className="text-[#6b5a2a] mb-3"
                  style={{ fontSize: '12px' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.08 }}
                >
                  Claude pick was unclear, showing oldest pending task.
                </motion.p>
              )}
              <motion.p
                className="text-white"
                style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.4 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {displayTask.description}
              </motion.p>
              {!workingTask && phase === 'ready' && pickReasoning && (
                <>
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
                        color: showWhy ? '#555' : '#333',
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
                            className="rounded-2xl p-5 border border-[#1e1e1e]"
                            style={{ background: '#0f0f0f' }}
                          >
                            <p
                              className="text-[#2e2e2e] tracking-[0.2em] uppercase mb-3"
                              style={{ fontSize: '10px' }}
                            >
                              claude's reasoning
                            </p>
                            <p
                              className="text-[#4a4a4a]"
                              style={{
                                fontSize: '14px',
                                fontWeight: 300,
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {pickReasoning}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
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
              style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '17px', fontWeight: 400, textAlign: 'left' }}
            >
              Start →
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleDrift}
                className="flex-1 rounded-2xl py-5 px-6 border border-[#242424] hover:border-[#383838] transition-colors"
                style={{ color: '#666', fontSize: '16px', fontWeight: 400, textAlign: 'left' }}
              >
                Drift ~
              </button>
              <button
                onClick={handleBin}
                className="flex-1 rounded-2xl py-5 px-6 border border-[#1e1e1e] hover:border-[#2e2e2e] transition-colors"
                style={{ color: '#3a3a3a', fontSize: '16px', fontWeight: 400, textAlign: 'left' }}
              >
                Bin ×
              </button>
            </div>
          </motion.div>
        
    </motion.div>
  );
}