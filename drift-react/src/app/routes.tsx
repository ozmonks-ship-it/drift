import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { RequireUserContext } from './components/RequireUserContext';
import { Home } from './pages/Home';
import { Add } from './pages/Add';
import { Next } from './pages/Next';
import { Working } from './pages/Working';
import { Done } from './pages/Done';
import { OnboardingLayout } from './pages/onboarding/OnboardingLayout';
import { OnboardingWelcomeGate } from './pages/onboarding/OnboardingWelcomeGate';
import { OnboardingPriorities } from './pages/onboarding/OnboardingPriorities';
import { OnboardingRhythm } from './pages/onboarding/OnboardingRhythm';
import { OnboardingSchedule } from './pages/onboarding/OnboardingSchedule';
import { OnboardingComplete } from './pages/onboarding/OnboardingComplete';
import { Settings } from './pages/onboarding/Settings';
import { Privacy } from './pages/Privacy';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { path: 'privacy', Component: Privacy },
      {
        path: 'onboarding',
        Component: OnboardingLayout,
        children: [
          { index: true, Component: OnboardingWelcomeGate },
          { path: 'priorities', Component: OnboardingPriorities },
          { path: 'rhythm', Component: OnboardingRhythm },
          { path: 'schedule', Component: OnboardingSchedule },
          { path: 'complete', Component: OnboardingComplete },
        ],
      },
      {
        Component: RequireUserContext,
        children: [
          { index: true, Component: Home },
          { path: 'add', Component: Add },
          { path: 'next', Component: Next },
          { path: 'working', Component: Working },
          { path: 'done', Component: Done },
          { path: 'settings', Component: Settings },
        ],
      },
    ],
  },
]);
