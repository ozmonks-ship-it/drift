import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { InAppBrowserBanner } from '../components/InAppBrowserBanner';
import { SolmMark } from '../components/SolmLogo';
import { isInAppBrowser } from '../../lib/inAppBrowser';
import { supabase } from '../../lib/supabase';
import { LoginError } from './LoginError';

export function Login() {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const hash =
      window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
    const hashParams = new URLSearchParams(hash);
    const oauthError =
      search.get('error') ??
      hashParams.get('error') ??
      search.get('error_code') ??
      hashParams.get('error_code');
    if (oauthError) {
      setHasError(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogle = useCallback(async () => {
    setHasError(false);
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    setIsSubmitting(false);
    if (error) {
      setHasError(true);
    }
  }, []);

  const inAppBrowser = isInAppBrowser();

  const scrollToSignIn = () => {
    document.getElementById('sign-in')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (hasError) {
    return (
      <LoginError
        onGoogle={handleGoogle}
        isSubmitting={isSubmitting}
        inAppBrowser={inAppBrowser}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh]" style={{ background: '#0c0c0c' }}>
      <nav
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
        style={{ borderBottom: '0.5px solid #1a1a1a', background: '#0c0c0c' }}
      >
        <div className="flex items-center gap-2 text-solm-1">
          <SolmMark size="sm" />
          <span style={{ fontSize: '15px', fontWeight: 400, letterSpacing: '-0.02em' }}>
            solm
          </span>
          <span
            className="border rounded-full px-2 py-0.5 text-solm-3"
            style={{
              fontSize: '9px',
              borderColor: '#1e1e1e',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Beta
          </span>
        </div>
        <button
          type="button"
          onClick={scrollToSignIn}
          className="border rounded-xl px-4 py-1.5 transition-colors text-solm-5 hover:text-solm-3 hover:border-[#333]"
          style={{ fontSize: '13px', borderColor: '#1e1e1e' }}
        >
          Sign in
        </button>
      </nav>

      <section
        className="px-6 pt-14 pb-12 flex flex-col items-center text-center"
        style={{ borderBottom: '0.5px solid #1a1a1a' }}
      >
        <h1
          className="text-solm-1 mb-3"
          style={{ fontSize: '44px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          The one thing.
        </h1>
        <p
          className="text-solm-2 mb-8"
          style={{ fontSize: '16px', fontWeight: 300, lineHeight: 1.7, maxWidth: '300px' }}
        >
          A focus app that picks your next task — no lists to sort, no decisions to make.
        </p>

        <div className="w-full max-w-[320px] flex flex-col gap-3">
          <InAppBrowserBanner />
          <button
            type="button"
            disabled={isSubmitting || inAppBrowser}
            onClick={handleGoogle}
            className="flex items-center justify-center gap-3 rounded-2xl px-6 py-4 transition-opacity active:opacity-80 disabled:opacity-60"
            style={{ background: '#f2f2f2', color: '#0c0c0c', fontSize: '15px', fontWeight: 500 }}
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
        <p
          className="text-solm-4"
          style={{ fontSize: '12px', marginTop: '12px', fontWeight: 300 }}
        >
          New to Solm? You&apos;ll join the beta queue.
        </p>

        <PhoneMockup />
      </section>

      <section className="px-6 py-12" style={{ borderBottom: '0.5px solid #1a1a1a' }}>
        <p
          className="text-solm-3 tracking-[0.2em] uppercase mb-6"
          style={{ fontSize: '11px' }}
        >
          How it works
        </p>
        <div className="flex flex-col gap-4">
          {[
            {
              n: '01',
              title: 'Capture tasks',
              body: 'Add anything on your mind. Work, personal, errands — all in one place.',
            },
            {
              n: '02',
              title: 'Pick your pace',
              body: 'Got time? Or just a few minutes? Solm adjusts to your energy level.',
            },
            {
              n: '03',
              title: 'Solm picks one',
              body: 'AI surfaces the single best next task. Do it, then get the next one.',
            },
          ].map(({ n, title, body }) => (
            <div
              key={n}
              className="rounded-2xl p-5"
              style={{ background: '#0f0f0f', border: '0.5px solid #1a1a1a' }}
            >
              <p
                className="text-solm-3"
                style={{ fontSize: '11px', marginBottom: '8px', letterSpacing: '0.05em' }}
              >
                {n}
              </p>
              <p
                className="text-solm-2"
                style={{ fontSize: '14px', fontWeight: 400, marginBottom: '6px' }}
              >
                {title}
              </p>
              <p
                className="text-solm-2"
                style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.6 }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-12" style={{ borderBottom: '0.5px solid #1a1a1a' }}>
        <p
          className="text-solm-3 tracking-[0.2em] uppercase mb-6"
          style={{ fontSize: '11px' }}
        >
          Why Solm
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              title: 'No decision fatigue',
              body: 'Stop staring at your list. One task, then the next.',
            },
            {
              title: 'Priority-aware',
              body: 'Knows what matters to you — family, health, work — and picks accordingly.',
            },
            {
              title: 'Works anywhere',
              body: 'Install as an app on iPhone, Android, or desktop. No App Store needed.',
            },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-2xl p-5"
              style={{ border: '0.5px solid #1a1a1a' }}
            >
              <p
                className="text-solm-4"
                style={{ fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}
              >
                {title}
              </p>
              <p
                className="text-solm-2"
                style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.6 }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="sign-in" className="px-6 py-12" style={{ borderBottom: '0.5px solid #1a1a1a' }}>
        <div
          className="rounded-2xl p-8 flex flex-col items-center text-center"
          style={{ background: '#0f0f0f', border: '0.5px solid #1a1a1a' }}
        >
          <h2
            className="text-solm-1 mb-2"
            style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            Already on Solm?
          </h2>
          <p
            className="text-solm-2 mb-6"
            style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.6 }}
          >
            Sign in with the same Google account you used to join.
          </p>
          <div className="w-full flex flex-col gap-3">
            <InAppBrowserBanner />
            <button
              type="button"
              disabled={isSubmitting || inAppBrowser}
              onClick={handleGoogle}
              className="flex items-center justify-center gap-3 rounded-2xl px-5 py-3.5 transition-colors hover:border-[#333] disabled:opacity-60"
              style={{
                border: '0.5px solid #242424',
                background: '#0c0c0c',
                fontSize: '14px',
                fontWeight: 400,
              }}
            >
              <GoogleIcon />
              <span className="text-solm-4">Sign in with Google</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 flex items-center justify-between">
        <p className="text-solm-5" style={{ fontSize: '12px', fontWeight: 300 }}>
          Solm · Beta · Made by Oz
        </p>
        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="transition-colors text-solm-5 hover:text-solm-3"
          style={{ fontSize: '12px' }}
        >
          Privacy
        </button>
      </footer>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div
      className="mt-12 flex flex-col text-left"
      style={{
        width: '158px',
        height: '335px',
        background: '#0c0c0c',
        border: '1.5px solid #2a2a2a',
        borderRadius: '26px',
        boxShadow: '0 0 0 5px #111, 0 28px 56px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: '10px', paddingBottom: '4px', flexShrink: 0 }}
      >
        <span
          className="text-solm-4"
          style={{ fontSize: '7px', fontWeight: 500, letterSpacing: '0.02em' }}
        >
          9:41
        </span>
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#1a1a1a',
            border: '0.5px solid #333',
          }}
        />
        <div className="flex items-center gap-[3px] text-solm-4">
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden>
            <rect x="0" y="2" width="7" height="5" rx="1" fill="currentColor" />
            <rect x="7.5" y="3" width="1.5" height="3" rx="0.5" fill="currentColor" />
          </svg>
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none" aria-hidden>
            <path
              d="M5 1L9 7H1L5 1Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <circle cx="5" cy="4.5" r="1.2" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="px-4 pt-1 pb-1" style={{ flexShrink: 0 }}>
        <span
          className="text-solm-5"
          style={{ fontSize: '7px', letterSpacing: '0.04em' }}
        >
          ← back
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-start px-4">
        <p
          className="text-solm-3 tracking-[0.22em] uppercase"
          style={{ fontSize: '6px', marginBottom: '9px' }}
        >
          up next
        </p>
        <p
          className="text-solm-1"
          style={{
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
            marginBottom: '10px',
          }}
        >
          Book dentist appointment
        </p>
        <span
          className="text-solm-5"
          style={{ fontSize: '6px', letterSpacing: '0.1em' }}
        >
          why this? ↓
        </span>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-[7px]" style={{ flexShrink: 0 }}>
        <div
          className="w-full rounded-xl flex items-center justify-between px-3"
          style={{ background: '#f2f2f2', height: '28px' }}
        >
          <span style={{ fontSize: '10px', fontWeight: 400, color: '#0c0c0c' }}>Start</span>
          <span style={{ fontSize: '9px', color: '#0c0c0c', opacity: 0.4 }}>→</span>
        </div>
        <div className="flex gap-[6px]">
          <div
            className="flex-1 rounded-xl flex items-center px-2.5"
            style={{ border: '0.5px solid #242424', height: '26px' }}
          >
            <span className="text-solm-5" style={{ fontSize: '8px' }}>
              Drift ~
            </span>
          </div>
          <div
            className="flex-1 rounded-xl flex items-center px-2.5"
            style={{ border: '0.5px solid #1e1e1e', height: '26px' }}
          >
            <span className="text-solm-5" style={{ fontSize: '8px' }}>
              Bin ×
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
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
