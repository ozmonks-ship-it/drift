import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Outlet, useLocation } from 'react-router';
import posthog from 'posthog-js';
import { TaskProvider } from '../context/TaskContext';
import { Login } from '../pages/Login';
import { supabase } from '../../lib/supabase';
import { AppShell } from './AppShell';
import { InstallPrompt } from './InstallPrompt';


const PUBLIC_PATHS = new Set(['/privacy']);

export function Root() {
  const location = useLocation();
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

  useEffect(() => {
    if (session === undefined) return;        // still loading, do nothing
    if (session === null) {                   // logged out
      posthog.reset();
      return;
    }
    posthog.identify(session.user.id, {       // logged in
      email: session.user.email,
    });
  }, [session]);

  useEffect(() => {
    posthog.capture('$pageview');
  }, [location.pathname]);

  if (session === undefined) {
    return (
      <AppShell>
        <InstallPrompt />
      </AppShell>
    );
  }

  if (!session) {
    if (PUBLIC_PATHS.has(location.pathname)) {
      return (
        <AppShell>
          <Outlet />
          <InstallPrompt />
        </AppShell>
      );
    }

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