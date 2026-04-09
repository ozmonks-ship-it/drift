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
        className="text-[#444] hover:text-[#666] transition-colors self-start mb-12"
        style={{ fontSize: "13px", letterSpacing: "0.05em" }}
      >
        ← back
      </button>

      {/* Heading */}
      <div className="mb-8">
        <p
          className="text-[#3a3a3a] tracking-[0.25em] uppercase mb-2"
          style={{ fontSize: "11px" }}
        >
          new task
        </p>
        <h2
          className="text-white"
          style={{
            fontSize: "28px",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
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
          className="flex-1 w-full bg-transparent resize-none text-[#d0d0d0] placeholder-[#2e2e2e] outline-none border-b border-[#1e1e1e] focus:border-[#2e2e2e] transition-colors pb-4"
          style={{
            fontSize: "20px",
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        />

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleAdd}
            disabled={!value.trim()}
            className="w-full rounded-2xl py-5 px-6 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: value.trim() ? "#f2f2f2" : "#1a1a1a",
              color: "#0c0c0c",
            }}
          >
            <span style={{ fontSize: "17px", fontWeight: 400 }}>
              Add task
            </span>
          </button>

          <p
            className="text-center text-[#2e2e2e]"
            style={{ fontSize: "11px" }}
          >
            ⌘ + Enter to add
          </p>
        </div>
      </div>
    </motion.div>
  );
}