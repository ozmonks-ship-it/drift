import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'working' | 'completed' | 'binned';
  createdAt: number;
  order: number;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (description: string) => void;
  getNextTask: () => Task | null;
  startTask: (id: string) => void;
  driftTask: (id: string) => void;
  binTask: (id: string) => void;
  completeTask: (id: string) => void;
  getWorkingTask: () => Task | null;
  pendingCount: number;
}

const TaskContext = createContext<TaskContextType | null>(null);

const STORAGE_KEY = 'drift_tasks_v1';

function loadTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((description: string) => {
    const now = Date.now();
    const newTask: Task = {
      id: `task_${now}_${Math.random().toString(36).slice(2)}`,
      description: description.trim(),
      status: 'pending',
      createdAt: now,
      order: now,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const getNextTask = useCallback((): Task | null => {
    const pending = tasks
      .filter(t => t.status === 'pending')
      .sort((a, b) => a.order - b.order);
    return pending[0] ?? null;
  }, [tasks]);

  const getWorkingTask = useCallback((): Task | null => {
    return tasks.find(t => t.status === 'working') ?? null;
  }, [tasks]);

  const startTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) return { ...t, status: 'working' };
        if (t.status === 'working') return { ...t, status: 'pending' };
        return t;
      })
    );
  }, []);

  const driftTask = useCallback((id: string) => {
    const maxOrder = Math.max(...tasks.map(t => t.order), 0);
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: 'pending', order: maxOrder + 1 }
          : t
      )
    );
  }, [tasks]);

  const binTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'binned' } : t))
    );
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'completed' } : t))
    );
  }, []);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      getNextTask,
      startTask,
      driftTask,
      binTask,
      completeTask,
      getWorkingTask,
      pendingCount,
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
