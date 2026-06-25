import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTaskContext } from "../context/TaskContext";
import { useState, useEffect } from "react";
import { LogoLockup } from "../components/LogoLockup";

export function Home() {
  const navigate = useNavigate();
  const { pendingCount, getWorkingTask } = useTaskContext();
  const workingTask = getWorkingTask();
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
      navigate("/moment");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          className="flex flex-col min-h-[100dvh] items-center justify-center gap-6"
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
                style={{ width: 5, height: 5, background: "var(--solm-text-3)" }}
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
            className="tracking-[0.25em] uppercase"
            style={{ fontSize: "10px", color: "var(--solm-text-5)" }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo / Hero */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <LogoLockup color="var(--solm-text-1)" />
            </motion.div>

            {/* Status */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {workingTask ? (
                <div className="rounded-2xl p-5" style={{ border: "1px solid var(--solm-border)" }}>
                  <p
                    className="mb-2"
                    style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--solm-text-3)" }}
                  >
                    In progress
                  </p>
                  <p
                    className="line-clamp-3"
                    style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.5, color: "var(--solm-text-4)" }}
                  >
                    {workingTask.description}
                  </p>
                </div>
              ) : pendingCount > 0 ? (
                <p style={{ fontSize: "13px", color: "var(--solm-text-3)" }}>
                  {pendingCount} task{pendingCount !== 1 ? "s" : ""} waiting
                </p>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--solm-text-3)" }}>
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
            <button
              onClick={handleNext}
              disabled={!hasAnything}
              className="w-full rounded-2xl py-5 px-6 transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed flex items-center justify-between"
              style={{ background: "var(--solm-cta-bg)", color: "var(--solm-cta-fg)" }}
            >
              <span style={{ fontSize: "17px", fontWeight: 400 }}>
                {workingTask ? "Resume task" : "What's next?"}
              </span>
              <span style={{ fontSize: "17px", opacity: 0.4 }}>→</span>
            </button>

            <button
              onClick={() => navigate("/add")}
              className="w-full rounded-2xl py-5 px-6 transition-colors flex items-center justify-between"
              style={{ border: "1px solid var(--solm-border-strong)", color: "var(--solm-text-4)" }}
            >
              <span style={{ fontSize: "17px", fontWeight: 400 }}>Add task</span>
              <span style={{ fontSize: "17px", opacity: 0.4 }}>+</span>
            </button>

            {workingTask && pendingCount > 0 && (
              <button
                onClick={() => navigate("/next")}
                className="w-full rounded-2xl py-4 px-6 transition-colors"
                style={{ color: "var(--solm-text-4)", fontSize: "14px" }}
              >
                See what's next →
              </button>
            )}

            <button
              onClick={() => navigate("/settings")}
              className="w-full py-3 px-6 transition-colors"
              style={{ fontSize: "13px", letterSpacing: "0.05em", color: "var(--solm-text-5)" }}
            >
              Settings
            </button>

            <button
              onClick={() => navigate("/home-ink")}
              className="w-full py-2 px-6 transition-colors"
              style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--solm-text-5)" }}
            >
              Preview: Ink theme →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
