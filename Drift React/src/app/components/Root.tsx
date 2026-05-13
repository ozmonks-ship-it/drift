import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Outlet } from 'react-router';
import { TaskProvider } from '../context/TaskContext';
import { Login } from '../pages/Login';
import { supabase } from '../../lib/supabase';
import { InstallPrompt } from './InstallPrompt';

export function Root() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session: next } }) => {
      if (!cancelled) setSession(next);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return (
      <div
        className="dark min-h-[100dvh] flex justify-center"
        style={{ background: '#0c0c0c', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <div className="w-full max-w-[420px] min-h-[100dvh] relative" />
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="dark min-h-[100dvh] flex justify-center"
        style={{ background: '#0c0c0c', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <div className="w-full max-w-[420px] min-h-[100dvh] relative">
          <Login />
        </div>
      </div>
    );
  }

  return (
    <TaskProvider>
      <div
        className="dark min-h-[100dvh] flex justify-center"
        style={{ background: '#0c0c0c', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <div className="w-full max-w-[420px] min-h-[100dvh] relative">
          <Outlet />
          <InstallPrompt />
        </div>
      </div>
    </TaskProvider>
  );
}
