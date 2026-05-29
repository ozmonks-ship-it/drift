import { RedirectIfOnboarded } from '../../components/RequireUserContext';
import { OnboardingWelcome } from './OnboardingWelcome';

export function OnboardingWelcomeGate() {
  return (
    <RedirectIfOnboarded>
      <OnboardingWelcome />
    </RedirectIfOnboarded>
  );
}
