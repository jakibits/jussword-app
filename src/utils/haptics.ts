// Web Audio API & Vibration Haptics Utility
// Zero external assets; generates crisp, tactile acoustic and vibrational feedback in real-time.

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Automatically unlock AudioContext on first touch / click gesture for mobile browsers
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    getAudioContext();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}

/**
 * Trigger subtle, crisp vibration on mobile devices (e.g. Android, supported iOS)
 */
export function triggerHaptic(pattern: number | number[] = 10): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration permissions or platform restrictions
    }
  }
}

/**
 * Play a crisp, subtle mechanical click / tap sound using Web Audio API synthesis
 */
export function playTapSound(frequency = 750, duration = 0.025, volume = 0.04): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.4, now + duration);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // AudioContext blocked or unsupported
  }
}

/**
 * Harmonious pleasant chime for successful copy actions
 */
export function playSuccessChime(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    const playTone = (freq: number, startOffset: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startOffset);

      gain.gain.setValueAtTime(0.035, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + startOffset);
      osc.stop(now + startOffset + dur);
    };

    // Upward 2-tone melodic chime (F5 -> C6)
    playTone(698.46, 0, 0.08);
    playTone(1046.50, 0.05, 0.12);
  } catch {
    // Ignore audio failures
  }
}

/**
 * Crisp spin / roll tick for password generation
 */
export function playSpinTick(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.03);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {
    // Ignore audio failures
  }
}

/**
 * Combined Haptic: Mobile vibration + Desktop audio feedback for standard clicks
 */
export function hapticClick(): void {
  triggerHaptic(8);
  playTapSound(800, 0.02, 0.03);
}

/**
 * Combined Haptic: Mobile vibration + Desktop audio for slider / switch steps
 */
export function hapticStep(): void {
  triggerHaptic(6);
  playTapSound(620, 0.015, 0.02);
}

/**
 * Combined Haptic: Password generation
 */
export function hapticGenerate(): void {
  triggerHaptic([12, 30, 15]);
  playSpinTick();
}

/**
 * Combined Haptic: Successful copy
 */
export function hapticCopy(): void {
  triggerHaptic([15, 40, 20]);
  playSuccessChime();
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}
