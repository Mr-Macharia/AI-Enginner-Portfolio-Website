// Delegated pointer tracking: feeds --mx/--my to the hovered .glass-card for the cursor spotlight.
export function initSpotlight() {
  if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;
  window.addEventListener('pointermove', (e) => {
    const card = (e.target as HTMLElement).closest?.('.glass-card') as HTMLElement | null;
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}
