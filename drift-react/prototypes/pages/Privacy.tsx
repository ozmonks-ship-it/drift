import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export function Privacy() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col min-h-[100dvh] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-10 text-[#444] hover:text-[#666] transition-colors"
        style={{ fontSize: '13px', letterSpacing: '0.05em' }}
      >
        ← back
      </button>

      <div className="flex-1 flex flex-col gap-10 pb-16">

        {/* Header */}
        <div>
          <p className="tracking-[0.25em] uppercase mb-3" style={{ fontSize: '11px', color: '#2e2e2e' }}>
            Legal
          </p>
          <h1 className="text-white mb-2" style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em' }}>
            Privacy at Solm
          </h1>
          <p style={{ fontSize: '13px', color: '#3a3a3a', fontWeight: 300 }}>
            Effective: 4 June 2026
          </p>
        </div>

        <p style={{ fontSize: '15px', fontWeight: 300, color: '#666', lineHeight: 1.7 }}>
          Solm is a small task app, built and run by an individual in Australia. This page explains what data the app collects, where it goes, and what control you have over it. It's written to meet the Australian Privacy Principles (APP) under the Privacy Act 1988 — and to be readable in five minutes.
        </p>
        <p style={{ fontSize: '15px', fontWeight: 300, color: '#666', lineHeight: 1.7 }}>
          If anything here is unclear, email{' '}
          <a href="mailto:ozgurmonkul@gmail.com" className="text-[#888] underline underline-offset-4">
            ozgurmonkul@gmail.com
          </a>{' '}
          and you'll get a real reply.
        </p>

        <Section title="What we collect">
          <ul className="flex flex-col gap-4">
            {[
              ['Account info', 'Your name and email address, from your Google sign-in.'],
              ['Your tasks', 'The title of each task you add. We do not ask for or read attachments, photos, or anything outside the title field.'],
              ['Your personal context', 'The priorities, work style, focus days and any free-text notes you provide during onboarding (or later in Settings). This is what helps Solm pick the right next thing for you.'],
              ['Usage data', 'Pages you visit inside the app, actions you take (e.g. starting a task, marking it done), and a session recording of how you interact with the screen. Recordings have all text inputs masked, so the words you type into Solm are not visible in them.'],
              ['Technical data', 'Device type, browser, approximate location (city-level, from your IP), and basic crash/error logs.'],
            ].map(([label, desc]) => (
              <li key={label} style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
                <span className="text-[#888]">{label} — </span>{desc}
              </li>
            ))}
          </ul>
          <p className="mt-4" style={{ fontSize: '13px', fontWeight: 300, color: '#3a3a3a', lineHeight: 1.6 }}>
            We do not collect: payment information, contact lists, your microphone or camera, your location at street level, or anything from other apps on your device.
          </p>
        </Section>

        <Section title="Why we collect it">
          <ul className="flex flex-col gap-3">
            {[
              'To make Solm work — auth, saving your tasks, picking the next one.',
              'To make Solm better — usage data tells us where new users get stuck and which features are loved or ignored. During this beta period we look at this regularly.',
              'To stay accountable — error logs help us notice and fix bugs.',
            ].map((item) => (
              <li key={item} style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4" style={{ fontSize: '14px', fontWeight: 300, color: '#3a3a3a', lineHeight: 1.6 }}>
            We do not sell your data. We do not run ads. We do not share your data with anyone outside the suppliers listed below.
          </p>
        </Section>

        <Section title="Who else sees your data">
          <p className="mb-6" style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
            To run Solm, we use a small set of third-party services. Each one sees a specific slice of your data:
          </p>
          <div className="rounded-2xl border border-[#1a1a1a] overflow-hidden">
            {[
              ['Google (sign-in)', 'Name, email', 'United States'],
              ['Supabase', 'Account info, tasks, personal context', 'United States'],
              ['Anthropic (Claude)', 'Personal context + task titles', 'United States'],
              ['PostHog', 'Pages, actions, masked recordings', 'United States'],
              ['Vercel', 'Network metadata (IP, request paths)', 'United States'],
            ].map(([service, data, location], i, arr) => (
              <div
                key={service}
                className={`px-5 py-4 flex flex-col gap-1 ${i < arr.length - 1 ? 'border-b border-[#1a1a1a]' : ''}`}
              >
                <p style={{ fontSize: '13px', color: '#888', fontWeight: 400 }}>{service}</p>
                <p style={{ fontSize: '12px', fontWeight: 300, color: '#444', lineHeight: 1.5 }}>{data}</p>
                <p style={{ fontSize: '11px', color: '#2e2e2e', letterSpacing: '0.05em' }}>{location}</p>
              </div>
            ))}
          </div>
          <p className="mt-5" style={{ fontSize: '13px', fontWeight: 300, color: '#3a3a3a', lineHeight: 1.7 }}>
            Cross-border disclosure (APP 8): by using Solm, your data is sent to and stored in the United States by the providers above. If this isn't acceptable to you, please don't use Solm during this beta.
          </p>
        </Section>

        <Section title="Cookies and local storage">
          <p style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
            Solm uses your browser's local storage to keep you signed in and to remember interface preferences. PostHog sets a cookie to recognise your device across sessions. No advertising cookies are used.
          </p>
        </Section>

        <Section title="How long we keep it">
          <ul className="flex flex-col gap-3">
            {[
              ['Account, tasks, personal context', 'Kept while your account exists. Deleted from Supabase within 7 days of an account deletion request.'],
              ['Usage analytics', 'Kept by PostHog for up to 12 months, then deleted automatically.'],
              ['Session recordings', 'Kept by PostHog for up to 30 days, then deleted automatically.'],
              ['Error logs', 'Kept for up to 90 days.'],
            ].map(([label, desc]) => (
              <li key={label} style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
                <span className="text-[#888]">{label} — </span>{desc}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Security">
          <ul className="flex flex-col gap-3">
            {[
              'All connections to Solm use HTTPS.',
              'Database access is restricted by Supabase Row-Level Security, so one user\'s data is not visible to another.',
              'API keys for Anthropic and PostHog are stored as server-side environment variables, never exposed to the browser.',
              'We do not store passwords — sign-in is handled by Google.',
            ].map((item) => (
              <li key={item} style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4" style={{ fontSize: '13px', fontWeight: 300, color: '#3a3a3a', lineHeight: 1.6 }}>
            No system is perfectly secure. If we ever discover that your data has been accessed in an unauthorised way, we will tell you what happened and what we're doing about it, in line with Australia's Notifiable Data Breaches scheme.
          </p>
        </Section>

        <Section title="Your rights">
          <p className="mb-4" style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
            Under the Australian Privacy Principles, you can:
          </p>
          <ul className="flex flex-col gap-3 mb-5">
            {[
              'Ask what we hold about you — email and we\'ll send you a copy.',
              'Correct anything that\'s wrong — most fields you can edit yourself in Settings; for anything else, email.',
              'Ask us to delete your account and all your data — we\'ll do it within 7 days.',
              'Make a complaint — email first; if we can\'t resolve it, you can contact the Office of the Australian Information Commissioner (oaic.gov.au).',
            ].map((item) => (
              <li key={item} style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
            To exercise any of these, email{' '}
            <a href="mailto:ozgurmonkul@gmail.com" className="text-[#888] underline underline-offset-4">
              ozgurmonkul@gmail.com
            </a>.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p style={{ fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
            If we make material changes — new data we collect, new providers we use — we will update this page and note the new effective date at the top. If you're a logged-in user, we'll also surface a notice the next time you open the app.
          </p>
          <p className="mt-4" style={{ fontSize: '13px', color: '#2e2e2e', fontWeight: 300 }}>
            Last updated: 4 June 2026.
          </p>
        </Section>

      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p
        className="tracking-[0.22em] uppercase"
        style={{ fontSize: '11px', color: '#2e2e2e' }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
