import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTaskContext } from "../context/TaskContext";
import { useState } from "react";
import { pickNextTask } from "../../lib/claude";

export function Home() {
  const navigate = useNavigate();
  const { pendingCount, getWorkingTask, tasks, setNextTask } = useTaskContext();
  const workingTask = getWorkingTask();
  const [showEnergy, setShowEnergy] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);

  const hasAnything = pendingCount > 0 || !!workingTask;

  const handleNext = () => {
    if (workingTask) {
      navigate("/working");
    } else {
      setShowEnergy(true);
    }
  };

  const handleEnergySelect = async (energy: "high" | "medium" | "low") => {
    setSelectedEnergy(energy);
    const pending = tasks.filter(t => t.status === 'pending');
    const pick = await pickNextTask(pending, energy);
    setNextTask(pick.id);
    navigate("/next", { state: { finding: true, energy, pickSource: pick.source } });
  };

  const energyOptions = [
    { label: "🔋 High", value: "high" as const },
    { label: "🔆 Medium", value: "medium" as const },
    { label: "🪫 Low", value: "low" as const },
  ];

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: selectedEnergy ? 0 : 1 }}
      transition={{ duration: 0.3, delay: selectedEnergy ? 0.18 : 0 }}
    >
      {showEnergy && (
      <button
        onClick={() => setShowEnergy(false)}
        className="text-[#444] hover:text-[#666] transition-colors self-start mb-12"
        style={{ fontSize: '13px', letterSpacing: '0.05em' }}
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
          <p
            className="text-[#2e2e2e] tracking-[0.28em] uppercase mb-3"
            style={{ fontSize: "10px" }}
          >
            your flow
          </p>
          <h1
            className="text-white"
            style={{
              fontSize: "56px",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Drift
          </h1>
        </motion.div>

        {/* Status */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {workingTask ? (
            <div className="border border-[#1e1e1e] rounded-2xl p-5">
              <p
                className="text-[#2e2e2e] mb-2"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                In progress
              </p>
              <p
                className="text-[#666] line-clamp-3"
                style={{
                  fontSize: "15px",
                  fontWeight: 300,
                  lineHeight: 1.5,
                }}
              >
                {workingTask.description}
              </p>
            </div>
          ) : pendingCount > 0 ? (
            <p className="text-[#2e2e2e]" style={{ fontSize: "13px" }}>
              {pendingCount} task{pendingCount !== 1 ? "s" : ""} waiting
            </p>
          ) : (
            <p className="text-[#2a2a2a]" style={{ fontSize: "13px" }}>
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
                className="text-[#3a3a3a] mb-5 tracking-[0.2em] uppercase"
                style={{ fontSize: "11px" }}
              >
                How's your energy?
              </p>
              <div className="flex flex-col gap-3">
                {energyOptions.map((option, i) => {
                  const isSelected = selectedEnergy === option.value;
                  const otherSelected =
                    selectedEnergy !== null && !isSelected;

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
                        opacity: {
                          duration: otherSelected ? 0.2 : 0.3,
                          delay: otherSelected ? 0 : i * 0.06,
                        },
                        scale: { duration: 0.3 },
                        y: { duration: 0.3, delay: i * 0.06 },
                      }}
                      className="w-full rounded-2xl py-4 px-6 border transition-colors text-left"
                      style={{
                        color: isSelected ? "#ccc" : "#888",
                        fontSize: "16px",
                        borderColor: isSelected ? "#444" : "#242424",
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
            style={{ background: "#f2f2f2", color: "#0c0c0c" }}
          >
            <span style={{ fontSize: "17px", fontWeight: 400 }}>
              {workingTask ? "Resume task" : "What's next?"}
            </span>
            <span style={{ fontSize: "17px", opacity: 0.4 }}>→</span>
          </button>

          <button
            onClick={() => navigate("/add")}
            className="w-full rounded-2xl py-5 px-6 border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors flex items-center justify-between"
            style={{ color: "#555" }}
          >
            <span style={{ fontSize: "17px", fontWeight: 400 }}>Add task</span>
            <span style={{ fontSize: "17px", opacity: 0.4 }}>+</span>
          </button>

          {workingTask && pendingCount > 0 && (
            <button
              onClick={() => navigate("/next")}
              className="w-full rounded-2xl py-4 px-6 transition-colors"
              style={{ color: "#333", fontSize: "14px" }}
            >
              See what's next →
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}