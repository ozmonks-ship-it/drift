import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTaskContext } from '../context/TaskContext';
import { useState, useEffect } from 'react';

export function Working() {
  const navigate = useNavigate();
  const { getWorkingTask, completeTask, driftTask } = useTaskContext();
  const [completing, setCompleting] = useState(false);
  const [drifting, setDrifting] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const task = getWorkingTask();

  useEffect(() => {
    if (!task && !drifting) {
      navigate('/');
      return;
    }
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, [task, navigate, drifting]);

  const formatElapsed = (s: number) => {
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  };

  const handleComplete = () => {
    if (!task) return;
    setCompleting(true);
    setTimeout(() => {
      completeTask(task.id);
      navigate('/done');
    }, 400);
  };

  const handleDrift = () => {
    if (!task) return;
    setDrifting(true);
    setTimeout(async () => {
      await driftTask(task.id);
      navigate('/');
    }, 300);
  };

  if (!task) return null;

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: completing || drifting ? 0 : 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <p className="text-solm-4" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Working
          </p>
        </div>
        <div className="flex items-center gap-4">
          {elapsed > 0 && (
            <p className="text-solm-3" style={{ fontSize: '12px' }}>
              {formatElapsed(elapsed)}
            </p>
          )}
          <button
            onClick={() => navigate('/add', { state: { returnTo: '/working' } })}
            className="text-solm-3 hover:text-solm-4 transition-colors"
            style={{ fontSize: '22px', lineHeight: 1 }}
            title="Add a task"
          >
            +
          </button>
        </div>
      </div>

      {/* Task */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.p
          className="text-solm-1"
          style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.4 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {task.description}
        </motion.p>

        {completing && (
          <motion.div
            className="mt-8 flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-6 h-6 rounded-full bg-solm-cta-bg flex items-center justify-center">
              <span className="text-solm-cta-fg" style={{ fontSize: '12px' }}>✓</span>
            </div>
            <p className="text-solm-1" style={{ fontSize: '15px' }}>Done.</p>
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          onClick={handleComplete}
          className="w-full rounded-2xl py-5 px-6 transition-all duration-200 hover:opacity-90 flex items-center justify-between bg-solm-cta-bg text-solm-cta-fg"
          style={{ fontSize: '17px', fontWeight: 400 }}
        >
          <span>Done</span>
          <span>✓</span>
        </button>

        <button
          onClick={handleDrift}
          className="w-full rounded-2xl py-5 px-6 border border-solm-border-strong hover:border-solm-border-active transition-colors flex items-center justify-between"
          style={{ color: 'var(--solm-text-2)', fontSize: '17px', fontWeight: 400 }}
        >
          <span>Drift</span>
          <span style={{ color: 'var(--solm-text-4)' }}>~</span>
        </button>
      </motion.div>
    </motion.div>
  );
}