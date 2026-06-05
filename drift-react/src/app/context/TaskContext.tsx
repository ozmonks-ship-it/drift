import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import posthog from 'posthog-js';
import { supabase } from '../../lib/supabase';

export type { PickUserMode } from '../../lib/claude';

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'working' | 'completed' | 'binned';
  createdAt: number;
}

interface TaskContextType {
  tasks: Task[];
  isLoadingTasks: boolean;
  addTask: (description: string) => void;
  getNextTask: () => Task | null;
  startTask: (id: string) => void;
  driftTask: (id: string) => void;
  binTask: (id: string) => void;
  completeTask: (id: string) => void;
  getWorkingTask: () => Task | null;
  pendingCount: number;
  setNextTask: (id: string | null) => void;
  isPickingNextTask: boolean;
  setIsPickingNextTask: (isPicking: boolean) => void;
  sessionDriftedTasks: string[];
  addSessionDriftedTask: (description: string) => void;
  clearSessionDriftedTasks: () => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

// Safe PostHog wrapper — never blocks the app if PostHog isn't ready.
function track(event: string, properties?: Record<string, unknown>) {
  try {
    posthog.capture(event, properties);
  } catch {
    // ignore — PostHog may not be initialised in dev
  }
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [nextTaskId, setNextTaskId] = useState<string | null>(null);
  const [sessionDriftedTasks, setSessionDriftedTasks] = useState<string[]>([]);
  const [isPickingNextTask, setIsPickingNextTask] = useState(false);

  // Tracks when the current "picking" started, so we can report pick latency.
  const pickStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setTasks([]);
          return;
        }

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['pending', 'working', 'drifted'])
          .order('created_at', { ascending: true });
        if (!error && data) {
          setTasks(data.map(row => ({
            id: row.id,
            description: row.title,
            status: row.status,
            createdAt: new Date(row.created_at).getTime(),
          })));
        }
      } finally {
        setIsLoadingTasks(false);
      }
    }
    fetchTasks();
  }, []);

  const addTask = useCallback(async (description: string) => {
    const trimmed = description.trim();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title: trimmed, status: 'pending', energy: 'medium', user_id: user.id })
      .select()
      .single();
    if (!error && data) {
      setTasks(prev => [...prev, {
        id: data.id,
        description: data.title,
        status: data.status,
        createdAt: new Date(data.created_at).getTime(),
      }]);
      track('task_captured', {
        task_id: data.id,
        char_count: trimmed.length,
      });
    }
  }, []);

  const getNextTask = useCallback((): Task | null => {
    if (nextTaskId) {
      return tasks.find(t => String(t.id) === String(nextTaskId) && t.status === 'pending') ?? null;
    }
    const pending = tasks
      .filter(t => t.status === 'pending')
      .sort((a, b) => a.createdAt - b.createdAt);
    return pending[0] ?? null;
  }, [tasks, nextTaskId]);

  const getWorkingTask = useCallback((): Task | null => {
    return tasks.find(t => t.status === 'working') ?? null;
  }, [tasks]);

  const startTask = useCallback(async (id: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('tasks')
      .update({ status: 'working' })
      .eq('id', id)
      .eq('user_id', user.id);
    await supabase
      .from('tasks')
      .update({ status: 'pending' })
      .eq('status', 'working')
      .eq('user_id', user.id)
      .neq('id', id);
    setTasks(prev => prev.map(t => {
      if (t.id === id) return { ...t, status: 'working' };
      if (t.status === 'working') return { ...t, status: 'pending' };
      return t;
    }));
    track('task_started', { task_id: id });
  }, []);

  const driftTask = useCallback(async (id: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date().toISOString();
    await supabase
      .from('tasks')
      .update({ status: 'pending', created_at: now })
      .eq('id', id)
      .eq('user_id', user.id);
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'pending', createdAt: Date.now() } : t
    ));
    track('task_drifted', {
      task_id: id,
      position: sessionDriftedTasks.length + 1,
    });
  }, [sessionDriftedTasks.length]);

  const binTask = useCallback(async (id: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('tasks')
      .update({ status: 'binned' })
      .eq('id', id)
      .eq('user_id', user.id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'binned' } : t));
    track('task_binned', { task_id: id });
  }, []);

  const completeTask = useCallback(async (id: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', id)
      .eq('user_id', user.id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    setNextTaskId(prev => (prev === id ? null : prev));
    track('task_completed', { task_id: id });
  }, []);

  // Wrap setNextTaskId to fire `task_picked` when a non-null id is assigned.
  const setNextTask = useCallback((id: string | null) => {
    if (id !== null) {
      const latency = pickStartedAtRef.current !== null
        ? Date.now() - pickStartedAtRef.current
        : undefined;
      track('task_picked', {
        task_id: id,
        pick_latency_ms: latency,
        had_drifts_before_pick: sessionDriftedTasks.length,
      });
      pickStartedAtRef.current = null;
    }
    setNextTaskId(id);
  }, [sessionDriftedTasks.length]);

  // Wrap setIsPickingNextTask to record when picking started, so we can compute latency.
  const handleSetIsPickingNextTask = useCallback((isPicking: boolean) => {
    if (isPicking) {
      pickStartedAtRef.current = Date.now();
    }
    setIsPickingNextTask(isPicking);
  }, []);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoadingTasks,
      addTask,
      getNextTask,
      startTask,
      driftTask,
      binTask,
      completeTask,
      getWorkingTask,
      pendingCount,
      setNextTask,
      isPickingNextTask,
      setIsPickingNextTask: handleSetIsPickingNextTask,
      sessionDriftedTasks,
      addSessionDriftedTask: (description: string) =>
        setSessionDriftedTasks(prev => [...prev, description]),
      clearSessionDriftedTasks: () => setSessionDriftedTasks([]),
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
}