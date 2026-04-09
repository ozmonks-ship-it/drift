import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTaskContext } from '../context/TaskContext';
import { useState } from 'react';

export function Next() {
  const navigate = useNavigate();
  const { getNextTask, getWorkingTask, startTask, driftTask, binTask } = useTaskContext();
  const [exiting, setExiting] = useState<string | null>(null);

  const nextTask = getNextTask();
  const workingTask = getWorkingTask();

  // Show working task if resuming
  const displayTask = workingTask ?? nextTask;

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
        className="flex flex-col min-h-screen px-8 py-12"
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
      className="flex flex-col min-h-screen px-8 py-12"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: exiting ? 0 : 1, x: exiting === 'drift' ? -24 : exiting === 'bin' ? 24 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => navigate('/')}
        className="text-[#444] hover:text-[#666] transition-colors self-start mb-12"
        style={{ fontSize: '13px', letterSpacing: '0.05em' }}
      >
        ← back
      </button>

      {/* Task display */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          key={displayTask.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#3a3a3a] tracking-[0.25em] uppercase mb-6" style={{ fontSize: '11px' }}>
            {workingTask ? 'in progress' : 'up next'}
          </p>

          <p
            className="text-white"
            style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.4 }}
          >
            {displayTask.description}
          </p>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
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
      </div>
    </motion.div>
  );
}
