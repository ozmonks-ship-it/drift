export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export const PWA_INSTALL_AVAILABLE_EVENT = "pwa-install-available";

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return window.__pwaInstallPrompt ?? null;
}

export function clearDeferredInstallPrompt(): void {
  window.__pwaInstallPrompt = null;
}

export function captureDeferredInstallPrompt(event: Event): void {
  const installEvent = event as BeforeInstallPromptEvent;
  event.preventDefault();
  window.__pwaInstallPrompt = installEvent;
  window.dispatchEvent(new Event(PWA_INSTALL_AVAILABLE_EVENT));
}
