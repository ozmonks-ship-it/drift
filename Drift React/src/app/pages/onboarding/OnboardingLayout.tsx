import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { OnboardingProvider, useOnboardingContext } from '../../context/OnboardingContext';
import { fetchUserContext } from '../../../lib/userContext';

function OnboardingBootstrap() {
  const { loadFromUserContext } = useOnboardingContext();

  useEffect(() => {
    fetchUserContext().then((ctx) => {
      if (ctx) loadFromUserContext(ctx);
    });
  }, [loadFromUserContext]);

  return <Outlet />;
}

export function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <OnboardingBootstrap />
    </OnboardingProvider>
  );
}
