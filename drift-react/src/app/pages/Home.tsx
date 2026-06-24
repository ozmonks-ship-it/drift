import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTaskContext } from "../context/TaskContext";
import React, { useState } from "react";
import posthog from "posthog-js";
import { SolmLogo } from "../components/SolmLogo";
import { MomentPicker, PRESET_MOMENT_LABELS } from "../components/MomentPicker";
import { pickNextTask, type PickUserMode } from "../../lib/claude";
import { fetchUserContext, type UserContext } from "../../lib/userContext";

export function Home() {
  const navigate = useNavigate();
  const { pendingCount, getWorkingTask, tasks, setNextTask, setIsPickingNextTask, clearSessionDriftedTasks, isLoadingTasks } = useTaskContext();
  const workingTask = getWorkingTask();
  const [showMode, setShowMode] = useState(false);
  const [showMomentPicker, setShowMomentPicker] = useState(false);
  const [selectedMode, setSelectedMode] = useState<PickUserMode | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);

  React.useEffect(() => {
    fetchUserContext().then(setUserContext);
  }, []);

  const hasAnything = pendingCount > 0 || !!workingTask;

  const handleNext = () => {
    if (workingTask) {
      navigate("/working");
    } else {
      clearSessionDriftedTasks();
      setShowMode(true);
    }
  };

  const handleModeSelect = async (mode: PickUserMode) => {
    setSelectedMode(mode);
    const pending = tasks.filter(t => t.status === 'pending');
    setIsPickingNextTask(true);
    navigate("/next", { state: { finding: true, mode } });
    try {
      const pick = await pickNextTask(pending, mode, undefined, userContext);
      setNextTask(pick.id);
      navigate("/next", { state: { finding: true, mode, pickSource: pick.source, pickReasoning: pick.reasoning }, replace: true });
    } finally {
      setIsPickingNextTask(false);
    }
  };

  const handleMomentSelect = async (moment: string) => {
    const momentType = PRESET_MOMENT_LABELS.includes(moment) ? 'preset' : 'freeform';
    try {
      posthog.capture('moment_selected', {
        moment_type: momentType,
        moment_value: moment,
        mode: 'right_now',
      });
    } catch {
      // ignore — PostHog may not be initialised in dev
    }

    const mode: PickUserMode = 'right_now';
    setSelectedMode(mode);
    const pending = tasks.filter(t => t.status === 'pending');
    setIsPickingNextTask(true);
    navigate("/next", { state: { finding: true, mode, moment } });
    try {
      const pick = await pickNextTask(pending, mode, undefined, userContext, moment);
      setNextTask(pick.id);
      navigate("/next", {
        state: { finding: true, mode, moment, pickSource: pick.source, pickReasoning: pick.reasoning },
        replace: true,
      });
    } finally {
      setIsPickingNextTask(false);
    }
  };

  const modeOptions: { label: string; value: PickUserMode }[] = [
    { label: "☀️ Let's go", value: "deep" },
    { label: "⚡ Quick one", value: "quick" },
    { label: "📍 Right now I'm…", value: "right_now" },
  ];

  return (
    <AnimatePresence mode="wait">
      {isLoadingTasks ? (
        <motion.div
          key="loader"
          className="flex flex-col min-h-[100dvh] items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          {/* Three-dot breathing loader */}
          <div className="flex items-center gap-[7px]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block rounded-full bg-solm-3"
                style={{ width: 5, height: 5 }}
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
            className="text-solm-5 tracking-[0.25em] uppercase"
            style={{ fontSize: "10px" }}
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            loading
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="home"
          className="flex flex-col min-h-[100dvh] px-8 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedMode ? 0 : 1 }}
          transition={{ duration: 0.3, delay: selectedMode ? 0.18 : 0 }}
        >
      {showMode && (
        <button
          onClick={() => setShowMode(false)}
          className="text-solm-5 hover:text-solm-2 transition-colors self-start mb-12"
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
          <SolmLogo size="lg" className="text-white" />
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
                className="text-solm-3 mb-2"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                In progress
              </p>
              <p
                className="text-solm-2 line-clamp-3"
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
            <p className="text-solm-3" style={{ fontSize: "13px" }}>
              {pendingCount} task{pendingCount !== 1 ? "s" : ""} waiting
            </p>
          ) : (
            <p className="text-solm-5" style={{ fontSize: "13px" }}>
              Nothing here yet.
            </p>
          )}
        </motion.div>

        {/* Mode selector */}
        <AnimatePresence>
          {showMode && (
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
            >
              <p
                className="text-solm-4 mb-5 tracking-[0.2em] uppercase"
                style={{ fontSize: "11px" }}
              >
                Pick your pace
              </p>
              <div className="flex flex-col gap-3">
                {modeOptions.map((option, i) => {
                  const isSelected = selectedMode === option.value;
                  const otherSelected = selectedMode !== null && !isSelected;

                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => {
                        if (option.value === 'right_now') {
                          setShowMomentPicker(true);
                          return;
                        }
                        handleModeSelect(option.value);
                      }}
                      disabled={selectedMode !== null}
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
                        color: isSelected ? "var(--solm-text-2)" : "var(--solm-text-4)",
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
      {!showMode && (
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
            style={{ color: "var(--solm-text-4)" }}
          >
            <span style={{ fontSize: "17px", fontWeight: 400 }}>Add task</span>
            <span style={{ fontSize: "17px", opacity: 0.4 }}>+</span>
          </button>

          {workingTask && pendingCount > 0 && (
            <button
              onClick={() => navigate("/next")}
              className="w-full rounded-2xl py-4 px-6 transition-colors"
              style={{ color: "var(--solm-text-5)", fontSize: "14px" }}
            >
              See what's next →
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="w-full py-3 px-6 transition-colors text-solm-5 hover:text-solm-2"
            style={{ fontSize: "13px", letterSpacing: "0.05em" }}
          >
            Settings
          </button>
        </motion.div>
      )}
    </motion.div>
      )}
      <MomentPicker
        open={showMomentPicker}
        onClose={() => setShowMomentPicker(false)}
        onSelect={handleMomentSelect}
      />
    </AnimatePresence>
  );
}