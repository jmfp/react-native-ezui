let staggerMs = 0;
let resetTimer: ReturnType<typeof setTimeout> | null = null;

const STAGGER_STEP_MS = 340;
const STAGGER_RESET_MS = 3200;

export function nextConfettiStaggerDelayMs(): number {
  const d = staggerMs;
  staggerMs += STAGGER_STEP_MS;
  if (resetTimer != null) {
    clearTimeout(resetTimer);
  }
  resetTimer = setTimeout(() => {
    staggerMs = 0;
    resetTimer = null;
  }, STAGGER_RESET_MS);
  return d;
}

let lastCelebrationHapticAt = 0;
const CELEBRATION_HAPTIC_GAP_MS = 420;

export function tryCelebrationHaptic(
  fire: () => void | Promise<void>,
): void {
  const now = Date.now();
  if (now - lastCelebrationHapticAt < CELEBRATION_HAPTIC_GAP_MS) {
    return;
  }
  lastCelebrationHapticAt = now;
  void fire();
}
