import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MOMENTS = [
  { id: 'transport', emoji: '🚇', label: 'In transport' },
  { id: 'bed', emoji: '🛌', label: 'In bed' },
  { id: 'waiting', emoji: '⏳', label: 'Waiting' },
  { id: 'out', emoji: '🚶', label: 'Out and about' },
  { id: 'other', emoji: '✏️', label: 'Something else…' },
] as const;

type MomentPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export function MomentPicker({ open, onClose, onSelect }: MomentPickerProps) {
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setSelectedMoment(null);
    setCustomText('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const confirmSelection = (value: string) => {
    onSelect(value);
    reset();
    onClose();
  };

  const handleMomentSelect = (id: string) => {
    if (id === 'other') {
      setSelectedMoment('other');
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }
    setSelectedMoment(id);
    const label = MOMENTS.find(m => m.id === id)?.label ?? '';
    setTimeout(() => confirmSelection(label), 340);
  };

  const handleCustomSubmit = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    confirmSelection(trimmed);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{ background: 'var(--solm-bg)', borderRadius: '24px 24px 0 0', paddingBottom: '48px', borderTop: '0.5px solid #1e1e1e' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex justify-center pt-3 pb-6">
              <div
                className="rounded-full bg-[#242424]"
                style={{ width: '36px', height: '4px' }}
              />
            </div>

            <p
              className="px-8 mb-6 text-solm-1"
              style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '-0.02em' }}
            >
              Right now I'm…
            </p>

            <div className="flex flex-col px-8">
              {MOMENTS.map((opt, i) => {
                const isSelected = selectedMoment === opt.id;
                return (
                  <div key={opt.id}>
                    <button
                      type="button"
                      onClick={() => handleMomentSelect(opt.id)}
                      className="group w-full flex items-center gap-4 py-4 text-left transition-colors"
                      style={{
                        borderTop: i === 0 ? 'none' : '0.5px solid #1e1e1e',
                      }}
                    >
                      <span style={{ fontSize: '20px', lineHeight: 1, width: '26px', flexShrink: 0 }}>
                        {opt.emoji}
                      </span>
                      <span
                        className={isSelected ? 'text-solm-1' : 'text-solm-4 group-hover:text-solm-2'}
                        style={{
                          fontSize: '16px',
                          fontWeight: 300,
                          letterSpacing: '-0.01em',
                          transition: 'color 0.2s',
                        }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && opt.id !== 'other' && (
                        <span className="ml-auto text-solm-3" style={{ fontSize: '11px' }}>✓</span>
                      )}
                    </button>

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
                              className="flex-1 rounded-2xl border border-[#1e1e1e] bg-transparent outline-none transition-colors focus:border-[#333] placeholder:text-solm-5 text-solm-2"
                              style={{
                                fontSize: '14px',
                                fontWeight: 300,
                                padding: '12px 16px',
                              }}
                            />
                            <button
                              type="button"
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
  );
}

export const PRESET_MOMENT_LABELS = MOMENTS.filter(m => m.id !== 'other').map(m => m.label);
