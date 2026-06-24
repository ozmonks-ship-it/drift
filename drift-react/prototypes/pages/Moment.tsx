import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { LogoLockup } from '../components/LogoLockup';

const MODES = [
  { id: 'go',    label: '☀️  Let\'s go' },
  { id: 'quick', label: '⚡  Quick one' },
  { id: 'now',   label: '📍  Right now I\'m…' },
];

const MOMENTS = [
  { id: 'transport', emoji: '🚇', label: 'In transport' },
  { id: 'bed',       emoji: '🛌', label: 'In bed' },
  { id: 'waiting',   emoji: '⏳', label: 'Waiting' },
  { id: 'out',       emoji: '🚶', label: 'Out and about' },
  { id: 'other',     emoji: '✏️', label: 'Something else…' },
];

export function Moment() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleModeSelect = (id: string) => {
    if (id === 'now') {
      setShowSheet(true);
      return;
    }
    setSelectedMode(id);
    setTimeout(() => {
      navigate('/next', { state: { finding: true, energy: id === 'go' ? 'high' : 'low' } });
    }, 380);
  };

  const handleMomentSelect = (id: string) => {
    if (id === 'other') {
      setSelectedMoment('other');
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }
    setSelectedMoment(id);
    const label = MOMENTS.find(m => m.id === id)?.label ?? '';
    setTimeout(() => {
      navigate('/next', { state: { finding: true, energy: 'medium', moment: label } });
    }, 340);
  };

  const handleCustomSubmit = () => {
    if (!customText.trim()) return;
    navigate('/next', { state: { finding: true, energy: 'medium', moment: customText.trim() } });
  };

  return (
    <div className="relative flex flex-col min-h-[100dvh] px-8 py-12 overflow-hidden">

      {/* Back — absolute so it doesn't shift layout */}
      <button
        onClick={() => navigate('/')}
        className="absolute text-[#444] hover:text-[#666] transition-colors"
        style={{ top: '48px', left: '32px', fontSize: '13px', letterSpacing: '0.05em' }}
      >
        ← back
      </button>

      {/* Logo + mode picker — same flex-1 justify-center shell as Home */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <LogoLockup color="#ffffff" />
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <p
            className="text-[#3a3a3a] mb-5 tracking-[0.2em] uppercase"
            style={{ fontSize: '11px' }}
          >
            Pick your pace
          </p>

        <div className="flex flex-col gap-3">
          {MODES.map((mode, i) => {
            const isSelected = selectedMode === mode.id;
            const otherSelected = selectedMode !== null && !isSelected;
            return (
              <motion.button
                key={mode.id}
                onClick={() => !selectedMode && handleModeSelect(mode.id)}
                disabled={selectedMode !== null}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: otherSelected ? 0 : 1,
                  y: 0,
                  scale: isSelected ? [1, 0.97, 1.01, 1] : 1,
                }}
                transition={{
                  opacity: { duration: otherSelected ? 0.2 : 0.3, delay: otherSelected ? 0 : i * 0.07 },
                  scale: { duration: 0.3 },
                  y: { duration: 0.3, delay: i * 0.07 },
                }}
                className="w-full rounded-2xl py-4 px-6 border text-left"
                style={{
                  fontSize: '16px',
                  fontWeight: 300,
                  color: isSelected ? '#ccc' : '#888',
                  borderColor: isSelected ? '#444' : '#242424',
                }}
              >
                {mode.label}
              </motion.button>
            );
          })}
        </div>
        </motion.div>
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        {showSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.55)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => { setShowSheet(false); setSelectedMoment(null); setCustomText(''); }}
            />

            {/* Sheet */}
            <motion.div
              className="absolute bottom-0 left-0 right-0"
              style={{ background: '#141414', borderRadius: '24px 24px 0 0', paddingBottom: '48px' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-6">
                <div
                  className="rounded-full"
                  style={{ width: '36px', height: '4px', background: '#252525' }}
                />
              </div>

              {/* Heading */}
              <p
                className="px-8 mb-6 text-white"
                style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '-0.02em' }}
              >
                Where are you?
              </p>

              {/* Options */}
              <div className="flex flex-col px-8">
                {MOMENTS.map((opt, i) => {
                  const isSelected = selectedMoment === opt.id;
                  return (
                    <div key={opt.id}>
                      <button
                        onClick={() => handleMomentSelect(opt.id)}
                        className="w-full flex items-center gap-4 py-4 text-left transition-colors"
                        style={{
                          borderTop: i === 0 ? 'none' : '0.5px solid #1e1e1e',
                        }}
                      >
                        <span style={{ fontSize: '20px', lineHeight: 1, width: '26px', flexShrink: 0 }}>
                          {opt.emoji}
                        </span>
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 300,
                            color: isSelected ? '#fff' : '#555',
                            letterSpacing: '-0.01em',
                            transition: 'color 0.2s',
                          }}
                        >
                          {opt.label}
                        </span>
                        {isSelected && opt.id !== 'other' && (
                          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#555' }}>✓</span>
                        )}
                      </button>

                      {/* "Something else" inline expansion */}
                      <AnimatePresence>
                        {opt.id === 'other' && isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="flex gap-3 pb-4 pt-1">
                              <input
                                ref={inputRef}
                                type="text"
                                value={customText}
                                onChange={e => setCustomText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
                                placeholder="Describe where you are…"
                                className="flex-1 rounded-2xl border border-[#252525] bg-transparent outline-none focus:border-[#3a3a3a] placeholder:text-[#252525]"
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 300,
                                  color: '#888',
                                  padding: '12px 16px',
                                }}
                              />
                              <button
                                onClick={handleCustomSubmit}
                                disabled={!customText.trim()}
                                className="rounded-2xl px-4 transition-opacity disabled:opacity-20 active:opacity-70"
                                style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '14px', fontWeight: 400 }}
                              >
                                Go →
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
