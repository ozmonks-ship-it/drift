import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [nextTaskId, setNextTaskId] = useState<string | null>(null);
  const [sessionDriftedTasks, setSessionDriftedTasks] = useState<string[]>([]);
  const [isPickingNextTask, setIsPickingNextTask] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
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
    const { data, error } = await supabase
      .from('tasks')
      .insert({ title: description.trim(), status: 'pending', energy: 'medium' })
      .select()
      .single();
    if (!error && data) {
      setTasks(prev => [...prev, {
        id: data.id,
        description: data.title,
        status: data.status,
        createdAt: new Date(data.created_at).getTime(),
      }]);
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
    await supabase.from('tasks').update({ status: 'working' }).eq('id', id);
    await supabase.from('tasks').update({ status: 'pending' }).eq('status', 'working').neq('id', id);
    setTasks(prev => prev.map(t => {
      if (t.id === id) return { ...t, status: 'working' };
      if (t.status === 'working') return { ...t, status: 'pending' };
      return t;
    }));
  }, []);

  const driftTask = useCallback(async (id: string) => {
    const now = new Date().toISOString();
    await supabase.from('tasks').update({ status: 'pending', created_at: now }).eq('id', id);
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'pending', createdAt: Date.now() } : t
    ));
  }, []);

  const binTask = useCallback(async (id: string) => {
    await supabase.from('tasks').update({ status: 'binned' }).eq('id', id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'binned' } : t));
  }, []);

  const completeTask = useCallback(async (id: string) => {
    await supabase.from('tasks').update({ status: 'completed' }).eq('id', id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
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
      setNextTask: setNextTaskId,
      isPickingNextTask,
      setIsPickingNextTask,
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