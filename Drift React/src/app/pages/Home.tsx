import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTaskContext } from '../context/TaskContext';

export function Home() {
  const navigate = useNavigate();
  const { pendingCount, getWorkingTask } = useTaskContext();
  const workingTask = getWorkingTask();

  const hasAnything = pendingCount > 0 || !!workingTask;

  const handleNext = () => {
    if (workingTask) {
      navigate('/working');
    } else {
      navigate('/next');
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo / Hero */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-[#2e2e2e] tracking-[0.28em] uppercase mb-3" style={{ fontSize: '10px' }}>
            your flow
          </p>
          <h1 className="text-white" style={{ fontSize: '56px', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Drift
          </h1>
        </motion.div>

        {/* Status / Context */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {workingTask ? (
            /* In-progress banner */
            <div className="border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-[#2e2e2e] mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                In progress
              </p>
              <p className="text-[#666] line-clamp-3" style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.5 }}>
                {workingTask.description}
              </p>
            </div>
          ) : pendingCount > 0 ? (
            <p className="text-[#2e2e2e]" style={{ fontSize: '13px' }}>
              {pendingCount} task{pendingCount !== 1 ? 's' : ''} waiting
            </p>
          ) : (
            <p className="text-[#2a2a2a]" style={{ fontSize: '13px' }}>
              Nothing here yet.
            </p>
          )}
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Primary: next/resume */}
        <button
          onClick={handleNext}
          disabled={!hasAnything}
          className="w-full rounded-2xl py-5 px-6 transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed flex items-center justify-between"
          style={{
            background: '#f2f2f2',
            color: '#0c0c0c',
          }}
        >
          <span style={{ fontSize: '17px', fontWeight: 400 }}>
            {workingTask ? 'Resume task' : "What's next?"}
          </span>
          <span style={{ fontSize: '17px', opacity: 0.4 }}>→</span>
        </button>

        {/* Secondary: add */}
        <button
          onClick={() => navigate('/add')}
          className="w-full rounded-2xl py-5 px-6 border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors flex items-center justify-between"
          style={{ color: '#555' }}
        >
          <span style={{ fontSize: '17px', fontWeight: 400 }}>Add task</span>
          <span style={{ fontSize: '17px', opacity: 0.4 }}>+</span>
        </button>

        {/* If working task, also show "What's next?" to skip to queue */}
        {workingTask && pendingCount > 0 && (
          <button
            onClick={() => navigate('/next')}
            className="w-full rounded-2xl py-4 px-6 transition-colors"
            style={{ color: '#333', fontSize: '14px' }}
          >
            See what's next →
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
