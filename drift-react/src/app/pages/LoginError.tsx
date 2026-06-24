import { useNavigate } from 'react-router';
import { InAppBrowserBanner } from '../components/InAppBrowserBanner';
import { LoginLogoHero } from '../components/LogoLockup';
import { ThemeToggle } from '../components/ThemeToggle';

type LoginErrorProps = {
  onGoogle: () => void;
  isSubmitting?: boolean;
  inAppBrowser?: boolean;
};

export function LoginError({
  onGoogle,
  isSubmitting = false,
  inAppBrowser = false,
}: LoginErrorProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] px-8 py-12">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <LoginLogoHero />
      </div>

      <div className="flex flex-col gap-4">
        <InAppBrowserBanner />
        <button
          type="button"
          disabled={isSubmitting || inAppBrowser}
          onClick={onGoogle}
          className="w-full rounded-2xl py-5 px-6 flex items-center justify-center gap-3 transition-opacity active:opacity-80 disabled:opacity-60 bg-solm-cta-bg text-solm-cta-fg"
        >
          <GoogleIcon />
          <span style={{ fontSize: '16px', fontWeight: 400 }}>
            Continue with Google
          </span>
        </button>

        {!inAppBrowser && (
          <p
            className="text-center"
            style={{ fontSize: '13px', color: 'var(--solm-text-error)', fontWeight: 300 }}
          >
            Something went wrong. Please try again.
          </p>
        )}
        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="text-center transition-colors text-solm-5 hover:text-solm-3"
          style={{ fontSize: '11px', letterSpacing: '0.06em' }}
        >
          Privacy policy
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
