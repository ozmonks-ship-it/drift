import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { fetchUserContext } from '../../lib/userContext';

export function RequireUserContext() {
  const location = useLocation();
  const contextReadyFromNav = Boolean(
    (location.state as { contextReady?: boolean } | null)?.contextReady
  );
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>(
    contextReadyFromNav ? 'ready' : 'loading'
  );

  useEffect(() => {
    if (contextReadyFromNav) {
      setStatus('ready');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    fetchUserContext().then((ctx) => {
      if (!cancelled) setStatus(ctx ? 'ready' : 'missing');
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname, contextReadyFromNav]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col min-h-[100dvh] items-center justify-center gap-6">
        <div className="flex items-center gap-[7px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block rounded-full bg-solm-3"
              style={{ width: 5, height: 5, opacity: 0.4 }}
            />
          ))}
        </div>
        <p
          className="text-solm-5 tracking-[0.25em] uppercase"
          style={{ fontSize: '10px' }}
        >
          loading
        </p>
      </div>
    );
  }

  if (status === 'missing') {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RedirectIfOnboarded({ children }: { children: React.ReactNode }) {
  const [hasContext, setHasContext] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchUserContext().then((ctx) => {
      if (!cancelled) setHasContext(!!ctx);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (hasContext === null) {
    return (
      <div className="flex flex-col min-h-[100dvh] items-center justify-center">
        <p className="text-solm-5 tracking-[0.25em] uppercase" style={{ fontSize: '10px' }}>
          loading
        </p>
      </div>
    );
  }

  if (hasContext) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
