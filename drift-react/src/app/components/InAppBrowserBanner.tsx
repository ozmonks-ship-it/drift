import { isInAppBrowser } from '../../lib/inAppBrowser';

export function InAppBrowserBanner() {
  if (!isInAppBrowser()) {
    return null;
  }

  return (
    <p
      className="text-center rounded-2xl px-4 py-3 border border-solm-border bg-solm-surface text-solm-2"
      style={{
        fontSize: '13px',
        fontWeight: 300,
      }}
    >
      Please open this in Safari or Chrome to sign in with Google.
    </p>
  );
}
