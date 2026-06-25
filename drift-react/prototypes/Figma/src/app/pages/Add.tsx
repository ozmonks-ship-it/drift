import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { useTaskContext } from "../context/TaskContext";

export function Add() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo: string =
    (location.state as any)?.returnTo ?? "/";
  const { addTask } = useTaskContext();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleAdd = () => {
    if (!value.trim()) return;
    addTask(value);
    navigate(returnTo);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAdd();
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen px-8 py-12"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back */}
      <button
        onClick={() => navigate(returnTo)}
        className="transition-colors self-start mb-12"
        style={{ fontSize: "13px", letterSpacing: "0.05em", color: "var(--solm-text-5)" }}
      >
        ← back
      </button>

      {/* Heading */}
      <div className="mb-8">
        <p
          className="tracking-[0.25em] uppercase mb-2"
          style={{ fontSize: "11px", color: "var(--solm-text-3)" }}
        >
          new task
        </p>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            color: "var(--solm-text-1)",
          }}
        >
          What's on your mind?
        </h2>
      </div>

      {/* Input */}
      <div className="flex-1 flex flex-col">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your task..."
          className="flex-1 w-full bg-transparent resize-none outline-none transition-colors pb-4"
          style={{
            fontSize: "20px",
            fontWeight: 300,
            lineHeight: 1.6,
            color: "var(--solm-text-2)",
            caretColor: "var(--solm-text-2)",
            borderBottom: "1px solid var(--solm-border-strong)",
            // placeholder color is set via CSS custom property; Tailwind class below handles it
          }}
        />

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleAdd}
            disabled={!value.trim()}
            className="w-full rounded-2xl py-5 px-6 transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              background: value.trim() ? "var(--solm-cta-bg)" : "var(--solm-cta-disabled-bg)",
              color: value.trim() ? "var(--solm-cta-fg)" : "var(--solm-cta-disabled-fg)",
            }}
          >
            <span style={{ fontSize: "17px", fontWeight: 400 }}>
              Add task
            </span>
          </button>

          <p
            className="text-center"
            style={{ fontSize: "11px", color: "var(--solm-text-3)" }}
          >
            ⌘ + Enter to add
          </p>
        </div>
      </div>
    </motion.div>
  );
}
