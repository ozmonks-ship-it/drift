import { createBrowserRouter } from 'react-router';
import { lazy, Suspense, type ReactNode } from 'react';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { Add } from './pages/Add';
import { Next } from './pages/Next';
import { Working } from './pages/Working';
import { Done } from './pages/Done';

const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const LoginError = lazy(() => import('./pages/LoginError').then((m) => ({ default: m.LoginError })));
const OnboardingWelcome = lazy(() => import('./pages/OnboardingWelcome').then((m) => ({ default: m.OnboardingWelcome })));
const OnboardingPriorities = lazy(() => import('./pages/OnboardingPriorities').then((m) => ({ default: m.OnboardingPriorities })));
const OnboardingRhythm = lazy(() => import('./pages/OnboardingRhythm').then((m) => ({ default: m.OnboardingRhythm })));
const OnboardingSchedule = lazy(() => import('./pages/OnboardingSchedule').then((m) => ({ default: m.OnboardingSchedule })));
const OnboardingComplete = lazy(() => import('./pages/OnboardingComplete').then((m) => ({ default: m.OnboardingComplete })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const HomeInk = lazy(() => import('./pages/HomeInk').then((m) => ({ default: m.HomeInk })));
const Moment = lazy(() => import('./pages/Moment').then((m) => ({ default: m.Moment })));
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })));

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'add', Component: Add },
      { path: 'next', Component: Next },
      { path: 'working', Component: Working },
      { path: 'done', Component: Done },
      { path: 'login', element: <Lazy><Login /></Lazy> },
      { path: 'login-error', element: <Lazy><LoginError /></Lazy> },
      { path: 'onboarding', element: <Lazy><OnboardingWelcome /></Lazy> },
      { path: 'onboarding/priorities', element: <Lazy><OnboardingPriorities /></Lazy> },
      { path: 'onboarding/rhythm', element: <Lazy><OnboardingRhythm /></Lazy> },
      { path: 'onboarding/schedule', element: <Lazy><OnboardingSchedule /></Lazy> },
      { path: 'onboarding/complete', element: <Lazy><OnboardingComplete /></Lazy> },
      { path: 'settings', element: <Lazy><Settings /></Lazy> },
      { path: 'home-ink', element: <Lazy><HomeInk /></Lazy> },
      { path: 'moment', element: <Lazy><Moment /></Lazy> },
      { path: 'privacy', element: <Lazy><Privacy /></Lazy> },
    ],
  },
]);
