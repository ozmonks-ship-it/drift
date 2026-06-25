import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTaskContext } from "../context/TaskContext";
import { useState, useEffect } from "react";
import Icon from "../../imports/Icon-2/Icon-95-183";

const INK = "#1F2A3D";
const CREAM = "#F5F1E8";
const MUTED = "#8A95A6";
const SUBTLE = "#2E3D56";
const DIM = "#3A4559";

export function HomeInk() {
  const navigate = useNavigate();
  const { pendingCount, getWorkingTask } = useTaskContext();
  const workingTask = getWorkingTask();
  const [showEnergy, setShowEnergy] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const hasAnything = pendingCount > 0 || !!workingTask;

  const handleNext = () => {
    if (workingTask) {
      navigate("/working");
    } else {
      setShowEnergy(true);
    }
  };

  const handleEnergySelect = (energy: "high" | "medium" | "low") => {
    setSelectedEnergy(energy);
    setTimeout(() => {
      navigate("/next", { state: { finding: true, energy } });
    }, 380);
  };

  const energyOptions = [
    { label: "🔋 High", value: "high" as const },
    { label: "🔆 Medium", value: "medium" as const },
    { label: "🪫 Low", value: "low" as const },
  ];

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          className="flex flex-col min-h-[100dvh] items-center justify-center gap-6"
          style={{ background: INK }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-[7px]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block rounded-full"
                style={{ width: 5, height: 5, background: DIM }}
                animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -4, 0] }}
                transition={{
                  duration: 1.1,
                  delay: i * 0.18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <motion.p
            style={{ fontSize: "10px", color: DIM, letterSpacing: "0.25em" }}
            className="uppercase"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            loading
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="home"
          className="flex flex-col min-h-[100dvh] px-8 py-12"
          style={{ background: INK }}
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedEnergy ? 0 : 1 }}
          transition={{ duration: 0.3, delay: selectedEnergy ? 0.18 : 0 }}
        >
          {showEnergy && (
            <button
              onClick={() => setShowEnergy(false)}
              className="self-start mb-12 transition-colors"
              style={{ fontSize: "13px", letterSpacing: "0.05em", color: DIM }}
              onMouseEnter={(e) => (e.currentTarget.style.color = MUTED)}
              onMouseLeave={(e) => (e.currentTarget.style.color = DIM)}
            >
              ← back
            </button>
          )}

          {/* Logo / Hero */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Icon + wordmark */}
              <div className="flex items-start gap-4">
                <div
                  style={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    marginTop: 4,
                    ['--fill-0' as string]: CREAM,
                    ['--stroke-0' as string]: CREAM,
                  }}
                >
                  <Icon />
                </div>
                <div className="flex flex-col gap-2">
                  <h1
                    style={{
                      fontSize: "56px",
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      color: CREAM,
                    }}
                  >
                    solm
                  </h1>
                  <p
                    style={{
                      fontSize: "11px",
                      color: MUTED,
                      textTransform: "uppercase",
                      textAlign: "justify",
                      textAlignLast: "justify",
                      letterSpacing: "0.3em",
                      width: "100%",
                    }}
                  >
                    The one thing.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {workingTask ? (
                <div
                  className="rounded-2xl p-5 border"
                  style={{ borderColor: SUBTLE }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: DIM,
                      marginBottom: 8,
                    }}
                  >
                    In progress
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 300,
                      lineHeight: 1.5,
                      color: MUTED,
                    }}
                    className="line-clamp-3"
                  >
                    {workingTask.description}
                  </p>
                </div>
              ) : pendingCount > 0 ? (
                <p style={{ fontSize: "13px", color: DIM }}>
                  {pendingCount} task{pendingCount !== 1 ? "s" : ""} waiting
                </p>
              ) : (
                <p style={{ fontSize: "13px", color: DIM }}>
                  Nothing here yet.
                </p>
              )}
            </motion.div>

            {/* Energy selector */}
            <AnimatePresence>
              {showEnergy && (
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      color: DIM,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: 20,
                    }}
                  >
                    How's your energy?
                  </p>
                  <div className="flex flex-col gap-3">
                    {energyOptions.map((option, i) => {
                      const isSelected = selectedEnergy === option.value;
                      const otherSelected = selectedEnergy !== null && !isSelected;
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => handleEnergySelect(option.value)}
                          disabled={selectedEnergy !== null}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{
                            opacity: otherSelected ? 0 : 1,
                            y: 0,
                            scale: isSelected ? [1, 0.97, 1.01, 1] : 1,
                          }}
                          transition={{
                            opacity: { duration: otherSelected ? 0.2 : 0.3, delay: otherSelected ? 0 : i * 0.06 },
                            scale: { duration: 0.3 },
                            y: { duration: 0.3, delay: i * 0.06 },
                          }}
                          className="w-full rounded-2xl py-4 px-6 border transition-colors text-left"
                          style={{
                            fontSize: "16px",
                            borderColor: isSelected ? MUTED : SUBTLE,
                            color: isSelected ? CREAM : MUTED,
                          }}
                        >
                          {option.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          {!showEnergy && (
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={handleNext}
                disabled={!hasAnything}
                className="w-full rounded-2xl py-5 px-6 transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed flex items-center justify-between"
                style={{ background: CREAM, color: INK }}
              >
                <span style={{ fontSize: "17px", fontWeight: 400 }}>
                  {workingTask ? "Resume task" : "What's next?"}
                </span>
                <span style={{ fontSize: "17px", opacity: 0.4 }}>→</span>
              </button>

              <button
                onClick={() => navigate("/add")}
                className="w-full rounded-2xl py-5 px-6 border transition-colors flex items-center justify-between"
                style={{ borderColor: SUBTLE, color: MUTED }}
              >
                <span style={{ fontSize: "17px", fontWeight: 400 }}>Add task</span>
                <span style={{ fontSize: "17px", opacity: 0.4 }}>+</span>
              </button>

              {workingTask && pendingCount > 0 && (
                <button
                  onClick={() => navigate("/next")}
                  className="w-full rounded-2xl py-4 px-6 transition-colors"
                  style={{ color: DIM, fontSize: "14px" }}
                >
                  See what's next →
                </button>
              )}

              <button
                onClick={() => navigate("/settings")}
                className="w-full py-3 px-6 transition-colors"
                style={{ fontSize: "13px", letterSpacing: "0.05em", color: DIM }}
                onMouseEnter={(e) => (e.currentTarget.style.color = MUTED)}
                onMouseLeave={(e) => (e.currentTarget.style.color = DIM)}
              >
                Settings
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
