import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();

  const scrollToSignIn = () => {
    document.getElementById("sign-in")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-[100dvh]" style={{ background: "#0c0c0c" }}>

      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
        style={{ borderBottom: "0.5px solid #1a1a1a", background: "#0c0c0c" }}
      >
        <div className="flex items-center gap-2">
          <NavIcon />
          <span style={{ fontSize: "15px", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em" }}>
            solm
          </span>
          <span
            className="border rounded-full px-2 py-0.5"
            style={{ fontSize: "9px", color: "#2e2e2e", borderColor: "#1e1e1e", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Beta
          </span>
        </div>
        <button
          onClick={scrollToSignIn}
          className="border rounded-xl px-4 py-1.5 transition-colors hover:border-[#333]"
          style={{ fontSize: "13px", color: "#555", borderColor: "#1e1e1e" }}
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section
        className="px-6 pt-14 pb-12 flex flex-col items-center text-center"
        style={{ borderBottom: "0.5px solid #1a1a1a" }}
      >
        <h1
          className="text-white mb-3"
          style={{ fontSize: "44px", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1 }}
        >
          The one thing.
        </h1>
        <p
          className="mb-8"
          style={{ fontSize: "16px", fontWeight: 300, color: "#3a3a3a", lineHeight: 1.7, maxWidth: "300px" }}
        >
          A focus app that picks your next task — no lists to sort, no decisions to make.
        </p>

        <button
          className="flex items-center gap-3 rounded-2xl px-6 py-4 transition-opacity active:opacity-80"
          style={{ background: "#f2f2f2", color: "#0c0c0c", fontSize: "15px", fontWeight: 500 }}
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <p style={{ fontSize: "12px", color: "#2a2a2a", marginTop: "12px", fontWeight: 300 }}>
          New to Solm? You'll join the beta queue.
        </p>

        {/* Phone mockup — Next screen */}
        <PhoneMockup />
      </section>

      {/* How it works */}
      <section className="px-6 py-12" style={{ borderBottom: "0.5px solid #1a1a1a" }}>
        <p
          className="tracking-[0.2em] uppercase mb-6"
          style={{ fontSize: "11px", color: "#2e2e2e" }}
        >
          How it works
        </p>
        <div className="flex flex-col gap-4">
          {[
            { n: "01", title: "Capture tasks", body: "Add anything on your mind. Work, personal, errands — all in one place." },
            { n: "02", title: "Pick your mode", body: "Got time? Or just a few minutes? Solm adjusts to your energy level." },
            { n: "03", title: "Solm picks one", body: "AI surfaces the single best next task. Do it, then get the next one." },
          ].map(({ n, title, body }) => (
            <div
              key={n}
              className="rounded-2xl p-5"
              style={{ background: "#0f0f0f", border: "0.5px solid #1a1a1a" }}
            >
              <p style={{ fontSize: "11px", color: "#2e2e2e", marginBottom: "8px", letterSpacing: "0.05em" }}>{n}</p>
              <p style={{ fontSize: "14px", fontWeight: 400, color: "#ccc", marginBottom: "6px" }}>{title}</p>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "#3a3a3a", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Solm */}
      <section className="px-6 py-12" style={{ borderBottom: "0.5px solid #1a1a1a" }}>
        <p
          className="tracking-[0.2em] uppercase mb-6"
          style={{ fontSize: "11px", color: "#2e2e2e" }}
        >
          Why Solm
        </p>
        <div className="flex flex-col gap-3">
          {[
            { title: "No decision fatigue", body: "Stop staring at your list. One task, then the next." },
            { title: "Priority-aware", body: "Knows what matters to you — family, health, work — and picks accordingly." },
            { title: "Works anywhere", body: "Install as an app on iPhone, Android, or desktop. No App Store needed." },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-2xl p-5"
              style={{ border: "0.5px solid #1a1a1a" }}
            >
              <p style={{ fontSize: "14px", fontWeight: 400, color: "#888", marginBottom: "4px" }}>{title}</p>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "#3a3a3a", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Existing user sign-in */}
      <section id="sign-in" className="px-6 py-12" style={{ borderBottom: "0.5px solid #1a1a1a" }}>
        <div
          className="rounded-2xl p-8 flex flex-col items-center text-center"
          style={{ background: "#0f0f0f", border: "0.5px solid #1a1a1a" }}
        >
          <h2
            className="text-white mb-2"
            style={{ fontSize: "20px", fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            Already on Solm?
          </h2>
          <p
            className="mb-6"
            style={{ fontSize: "14px", fontWeight: 300, color: "#3a3a3a", lineHeight: 1.6 }}
          >
            Sign in with the same Google account you used to join.
          </p>
          <button
            className="flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-colors hover:border-[#333]"
            style={{ border: "0.5px solid #242424", background: "#0c0c0c", color: "#888", fontSize: "14px", fontWeight: 400 }}
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 flex items-center justify-between">
        <p style={{ fontSize: "12px", color: "#2e2e2e", fontWeight: 300 }}>Solm · Beta · Made by Oz</p>
        <button
          onClick={() => navigate("/privacy")}
          className="transition-colors hover:text-[#444]"
          style={{ fontSize: "12px", color: "#1e1e1e" }}
        >
          Privacy
        </button>
      </footer>

    </div>
  );
}

function PhoneMockup() {
  // Pixel 10 body: 152.9 × 72.1 mm → ratio 2.12 : 1
  // Rendered at 158px wide → height = 158 × 2.12 = 335px
  return (
    <div
      className="mt-12 flex flex-col"
      style={{
        width: "158px",
        height: "335px",
        background: "#0c0c0c",
        border: "1.5px solid #2a2a2a",
        borderRadius: "26px",
        boxShadow: "0 0 0 5px #111, 0 28px 56px rgba(0,0,0,0.7)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Status bar — punch-hole camera centred */}
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: "10px", paddingBottom: "4px", flexShrink: 0 }}
      >
        <span style={{ fontSize: "7px", color: "#444", fontWeight: 500, letterSpacing: "0.02em" }}>9:41</span>
        {/* Punch-hole camera */}
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#1a1a1a",
            border: "0.5px solid #333",
          }}
        />
        <div className="flex items-center gap-[3px]">
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <rect x="0" y="2" width="7" height="5" rx="1" fill="#444" />
            <rect x="7.5" y="3" width="1.5" height="3" rx="0.5" fill="#444" />
          </svg>
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path d="M5 1L9 7H1L5 1Z" fill="none" stroke="#444" strokeWidth="1" strokeLinejoin="round"/>
            <circle cx="5" cy="4.5" r="1.2" fill="#444"/>
          </svg>
        </div>
      </div>

      {/* Back */}
      <div className="px-4 pt-1 pb-1" style={{ flexShrink: 0 }}>
        <span style={{ fontSize: "7px", color: "#2e2e2e", letterSpacing: "0.04em" }}>← back</span>
      </div>

      {/* Task content */}
      <div className="flex-1 flex flex-col justify-center px-4">
        <p
          style={{
            fontSize: "6px",
            color: "#2a2a2a",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: "9px",
          }}
        >
          up next
        </p>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 300,
            color: "#e0e0e0",
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
            marginBottom: "10px",
          }}
        >
          Book dentist appointment
        </p>
        <span style={{ fontSize: "6px", color: "#252525", letterSpacing: "0.1em" }}>
          why this? ↓
        </span>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-6 flex flex-col gap-[7px]" style={{ flexShrink: 0 }}>
        <div
          className="w-full rounded-xl flex items-center justify-between px-3"
          style={{ background: "#f2f2f2", height: "28px" }}
        >
          <span style={{ fontSize: "10px", fontWeight: 400, color: "#0c0c0c" }}>Start</span>
          <span style={{ fontSize: "9px", color: "#0c0c0c", opacity: 0.4 }}>→</span>
        </div>
        <div className="flex gap-[6px]">
          <div
            className="flex-1 rounded-xl flex items-center px-2.5"
            style={{ border: "0.5px solid #242424", height: "26px" }}
          >
            <span style={{ fontSize: "8px", color: "#555" }}>Drift ~</span>
          </div>
          <div
            className="flex-1 rounded-xl flex items-center px-2.5"
            style={{ border: "0.5px solid #1e1e1e", height: "26px" }}
          >
            <span style={{ fontSize: "8px", color: "#2e2e2e" }}>Bin ×</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M37.5 73.5C57.3823 73.5 73.5 57.3823 73.5 37.5C73.5 17.6177 57.3823 1.5 37.5 1.5C17.6177 1.5 1.5 17.6177 1.5 37.5C1.5 57.3823 17.6177 73.5 37.5 73.5Z"
        stroke="white"
        strokeWidth="3"
      />
      <circle cx="37.5" cy="37.5" r="15" fill="white" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}
