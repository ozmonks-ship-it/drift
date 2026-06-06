export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent;
  return (
    /Instagram|FBAN|FBAV|Twitter|LinkedIn|Line\/|KAKAOTALK|Snapchat|WhatsApp/.test(
      ua,
    ) || /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua)
  );
}
