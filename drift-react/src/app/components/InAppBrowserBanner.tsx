import { isInAppBrowser } from '../../lib/inAppBrowser';

export function InAppBrowserBanner() {
  if (!isInAppBrowser()) {
    return null;
  }

  return (
    <p
      className="text-center rounded-2xl px-4 py-3"
      style={{
        fontSize: '13px',
        fontWeight: 300,
        color: 'var(--solm-text-2)',
        background: 'rgba(242, 242, 242, 0.06)',
        border: '1px solid rgba(242, 242, 242, 0.12)',
      }}
    >
      Please open this in Safari or Chrome to sign in with Google.
    </p>
  );
}
