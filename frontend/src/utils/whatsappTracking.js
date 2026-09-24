// Opening a wa.me link tells us nothing about whether the customer actually
// sent a message — clicking "Contact Us" and immediately closing WhatsApp
// looked identical to a real enquiry. Instead of logging on click, this
// opens the chat and only logs once the customer comes back to this tab
// (WhatsApp app on mobile, or the wa.me tab on desktop), which is the
// closest signal the browser can give us to "they actually went through
// the WhatsApp flow" without a WhatsApp Business API webhook integration.
const MIN_AWAY_MS = 800;
const GIVE_UP_MS = 5 * 60 * 1000;

export function openWhatsAppAndLogOnReturn(url, onReturn) {
  const openedAt = Date.now();
  let settled = false;

  const handleReturn = () => {
    if (settled) return;
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - openedAt < MIN_AWAY_MS) return;
    settled = true;
    cleanup();
    onReturn();
  };

  const cleanup = () => {
    document.removeEventListener('visibilitychange', handleReturn);
    window.removeEventListener('focus', handleReturn);
  };

  document.addEventListener('visibilitychange', handleReturn);
  window.addEventListener('focus', handleReturn);
  setTimeout(() => { settled = true; cleanup(); }, GIVE_UP_MS);

  window.open(url, '_blank', 'noopener,noreferrer');
}
