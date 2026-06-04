
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import posthog from 'posthog-js'

if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'identified_only', // don't create profiles for anonymous visitors
    capture_pageview: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: true, // protect what users type into the capture box
    },
  })
}

  createRoot(document.getElementById("root")!).render(<App />);
  