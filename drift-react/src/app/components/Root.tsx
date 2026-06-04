import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Outlet } from 'react-router';
import { TaskProvider } from '../context/TaskContext';
import { Login } from '../pages/Login';
import { supabase } from '../../lib/supabase';
import { AppShell } from './AppShell';
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
      <AppShell>
        <InstallPrompt />
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell>
        <Login />
        <InstallPrompt />
      </AppShell>
    );
  }

  return (
    <TaskProvider>
      <AppShell>
        <Outlet />
        <InstallPrompt />
      </AppShell>
    </TaskProvider>
  );
}
