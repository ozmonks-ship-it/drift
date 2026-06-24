import { useEffect, useMemo, useState } from "react";
import {
  type BeforeInstallPromptEvent,
  clearDeferredInstallPrompt,
  getDeferredInstallPrompt,
  PWA_INSTALL_AVAILABLE_EVENT,
} from "../../lib/pwaInstall";

const DISMISSED_KEY = "solm.installPrompt.dismissed";
const LEGACY_DISMISSED_KEY = "drift.installPrompt.dismissed";

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

function isIosSafari() {
  const ua = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isWebKit = /WebKit/.test(ua);
  const isCriOS = /CriOS/.test(ua);
  const isFxiOS = /FxiOS/.test(ua);
  return isIos && isWebKit && !isCriOS && !isFxiOS;
}

function wasDismissed() {
  return (
    window.localStorage.getItem(DISMISSED_KEY) === "true" ||
    window.localStorage.getItem(LEGACY_DISMISSED_KEY) === "true"
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() =>
    getDeferredInstallPrompt(),
  );
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode);
  const [dismissed, setDismissed] = useState(wasDismissed);

  const safariNeedsInstructions = useMemo(() => !isInstalled && isIosSafari(), [isInstalled]);
  const canUseNativePrompt = useMemo(() => !isInstalled && deferredPrompt !== null, [deferredPrompt, isInstalled]);
  const shouldShow = !dismissed && (canUseNativePrompt || safariNeedsInstructions);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());
    setDismissed(wasDismissed());

    const syncDeferredPrompt = () => {
      setDeferredPrompt(getDeferredInstallPrompt());
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      clearDeferredInstallPrompt();
    };

    syncDeferredPrompt();
    window.addEventListener(PWA_INSTALL_AVAILABLE_EVENT, syncDeferredPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(PWA_INSTALL_AVAILABLE_EVENT, syncDeferredPrompt);
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
    clearDeferredInstallPrompt();
    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 rounded-2xl border border-solm-border-muted bg-solm-overlay-surface px-4 py-3 text-solm-1 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-solm-1">Install solm</p>
          {canUseNativePrompt ? (
            <p className="mt-1 text-xs text-solm-3">Add solm to your home screen for a faster, app-like experience.</p>
          ) : (
            <p className="mt-1 text-xs text-solm-3">In Safari, tap Share then &quot;Add to Home Screen&quot;.</p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded px-1 text-solm-4 transition hover:text-solm-1"
          aria-label="Dismiss install prompt"
        >
          ×
        </button>
      </div>

      {canUseNativePrompt && (
        <button
          type="button"
          onClick={requestInstall}
          className="mt-3 w-full rounded-xl bg-solm-cta-bg px-4 py-2 text-sm font-medium text-solm-cta-fg transition hover:opacity-90"
        >
          Install app
        </button>
      )}
    </div>
  );
}
