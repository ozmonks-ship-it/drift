import { useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "drift.installPrompt.dismissed";

function isStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function isIosSafari() {
  const ua = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isWebKit = /WebKit/.test(ua);
  const isCriOS = /CriOS/.test(ua);
  const isFxiOS = /FxiOS/.test(ua);
  return isIos && isWebKit && !isCriOS && !isFxiOS;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const safariNeedsInstructions = useMemo(() => !isInstalled && isIosSafari(), [isInstalled]);
  const canUseNativePrompt = useMemo(() => !isInstalled && deferredPrompt !== null, [deferredPrompt, isInstalled]);
  const shouldShow = !dismissed && (canUseNativePrompt || safariNeedsInstructions);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());
    setDismissed(window.localStorage.getItem(DISMISSED_KEY) === "true");

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    window.localStorage.setItem(DISMISSED_KEY, "true");
  };

  const requestInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 rounded-2xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-[#d9d9d9] shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">Install Drift</p>
          {canUseNativePrompt ? (
            <p className="mt-1 text-xs text-[#a8a8a8]">Add Drift to your home screen for a faster, app-like experience.</p>
          ) : (
            <p className="mt-1 text-xs text-[#a8a8a8]">In Safari, tap Share then "Add to Home Screen".</p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded px-1 text-[#8a8a8a] transition hover:text-white"
          aria-label="Dismiss install prompt"
        >
          ×
        </button>
      </div>

      {canUseNativePrompt && (
        <button
          type="button"
          onClick={requestInstall}
          className="mt-3 w-full rounded-xl bg-[#f2f2f2] px-4 py-2 text-sm font-medium text-[#0c0c0c] transition hover:bg-white"
        >
          Install app
        </button>
      )}
    </div>
  );
}
