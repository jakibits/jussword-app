import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

const ENTROPY_CHARSET = ['*', '•', '0', '1', '#', '/', 'x', '8'];

interface EntropyGlyph {
  id: number;
  baseX: number; // percentage 0-100
  baseY: number; // percentage 0-100
  size: number;  // px size
  char: string;
}

interface ResonanceWave {
  id: number;
  x: number;
  y: number;
}

export function InteractiveBackground() {
  const [waves, setWaves] = useState<ResonanceWave[]>([]);
  const waveIdRef = useRef(0);

  // Generate 26 balanced, organic seed glyph positions across the screen
  const initialGlyphs: EntropyGlyph[] = useMemo(() => {
    const glyphs: EntropyGlyph[] = [];
    const rows = 5;
    const cols = 5;
    let id = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitterX = ((r * 17 + c * 31) % 9) - 4.5;
        const jitterY = ((r * 23 + c * 13) % 9) - 4.5;
        const baseX = Math.max(6, Math.min(94, (c + 0.5) * (100 / cols) + jitterX));
        const baseY = Math.max(8, Math.min(92, (r + 0.5) * (100 / rows) + jitterY));

        const charIndex = (r * 3 + c * 5) % ENTROPY_CHARSET.length;
        const size = 13 + ((r + c) % 4) * 2; // 13px - 19px

        glyphs.push({
          id: id++,
          baseX,
          baseY,
          size,
          char: ENTROPY_CHARSET[charIndex],
        });
      }
    }
    return glyphs;
  }, []);

  // DOM node references for each glyph to achieve 60/120Hz GPU updates with zero React re-renders
  const glyphElementsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphStatesRef = useRef(
    initialGlyphs.map((g) => ({
      ...g,
      pushX: 0,
      pushY: 0,
      targetPushX: 0,
      targetPushY: 0,
      currentChar: g.char,
      lastSwapTime: 0,
    }))
  );

  const pointerRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
    lastActiveTime: 0,
  });

  // Core trigger for resonance waves and safe-tumbler cascades (callable from click, tap, or events)
  const triggerCascade = useCallback((originX: number, originY: number) => {
    // Add expanding resonance wave
    const id = ++waveIdRef.current;
    setWaves((prev) => [...prev.slice(-1), { id, x: originX, y: originY }]);

    // Tumbler cascade: roll nearby glyphs like a combination safe
    const states = glyphStatesRef.current;
    const elements = glyphElementsRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    states.forEach((state, i) => {
      const el = elements[i];
      if (!el) return;

      const gx = (state.baseX / 100) * width;
      const gy = (state.baseY / 100) * height;
      const dist = Math.hypot(originX - gx, originY - gy);

      if (dist < 280) {
        const delay = (dist / 280) * 140;
        setTimeout(() => {
          el.classList.remove('animate-tumbler-tick');
          void el.offsetWidth;
          el.classList.add('animate-tumbler-tick');

          // Scramble to next entropy glyph
          const nextIndex = (ENTROPY_CHARSET.indexOf(state.currentChar) + 1) % ENTROPY_CHARSET.length;
          const nextChar = ENTROPY_CHARSET[nextIndex];
          state.currentChar = nextChar;
          el.innerText = nextChar;
        }, delay);
      }
    });
  }, []);

  // Safe-Tumbler cascade on click or tap
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;
    pointerRef.current.active = true;
    pointerRef.current.lastActiveTime = Date.now();

    triggerCascade(e.clientX, e.clientY);
  }, [triggerCascade]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;
    pointerRef.current.active = true;
    pointerRef.current.lastActiveTime = Date.now();
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      pointerRef.current.x = e.touches[0].clientX;
      pointerRef.current.y = e.touches[0].clientY;
      pointerRef.current.active = true;
      pointerRef.current.lastActiveTime = Date.now();
    }
  }, []);

  const removeWave = (id: number) => {
    setWaves((prev) => prev.filter((w) => w.id !== id));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Listen to custom action event dispatched from Regenerate / Copy in App.tsx
    const handleResonateEvent = (e: Event) => {
      const custom = e as CustomEvent<{ x?: number; y?: number }>;
      const targetX = custom.detail?.x ?? window.innerWidth * 0.38;
      const targetY = custom.detail?.y ?? window.innerHeight * 0.42;
      triggerCascade(targetX, targetY);
    };

    window.addEventListener('jussword:resonate', handleResonateEvent);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Idle Entropy Mutation Timer: Quietly evolves one random glyph every ~2.2 seconds
    let mutationTimer: ReturnType<typeof setInterval> | null = null;
    if (!prefersReducedMotion) {
      mutationTimer = setInterval(() => {
        if (document.hidden) return;

        const states = glyphStatesRef.current;
        const elements = glyphElementsRef.current;
        const randomIndex = Math.floor(Math.random() * states.length);
        const el = elements[randomIndex];
        const state = states[randomIndex];

        if (el && state) {
          el.classList.add('animate-entropy-shimmer');
          const currentIdx = ENTROPY_CHARSET.indexOf(state.currentChar);
          const nextChar = ENTROPY_CHARSET[(currentIdx + 1 + Math.floor(Math.random() * 3)) % ENTROPY_CHARSET.length];
          state.currentChar = nextChar;
          el.innerText = nextChar;

          setTimeout(() => {
            el.classList.remove('animate-entropy-shimmer');
          }, 900);
        }
      }, 2200);
    }

    let animationFrameId: number;

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      const pointer = pointerRef.current;
      const isPointerActive = pointer.active && now - pointer.lastActiveTime < 1800;
      const width = window.innerWidth;
      const height = window.innerHeight;

      const states = glyphStatesRef.current;
      const elements = glyphElementsRef.current;

      for (let i = 0; i < states.length; i++) {
        const state = states[i];
        const el = elements[i];
        if (!el) continue;

        if (!prefersReducedMotion && isPointerActive) {
          const gx = (state.baseX / 100) * width;
          const gy = (state.baseY / 100) * height;
          const dx = pointer.x - gx;
          const dy = pointer.y - gy;
          const dist = Math.hypot(dx, dy);

          if (dist < 170 && dist > 0) {
            // Magnetic wake: gently pushes glyphs away from finger/cursor
            const force = (1 - dist / 170) * 16;
            state.targetPushX = -(dx / dist) * force;
            state.targetPushY = -(dy / dist) * force;

            // Occasionally scramble glyph when cursor glides very close
            if (dist < 80 && now - state.lastSwapTime > 600) {
              state.lastSwapTime = now;
              const nextChar = ENTROPY_CHARSET[(ENTROPY_CHARSET.indexOf(state.currentChar) + 1) % ENTROPY_CHARSET.length];
              state.currentChar = nextChar;
              el.innerText = nextChar;
            }
          } else {
            state.targetPushX = 0;
            state.targetPushY = 0;
          }
        } else {
          state.targetPushX = 0;
          state.targetPushY = 0;
        }

        // Damped spring physics (12% lerp per frame)
        state.pushX += (state.targetPushX - state.pushX) * 0.12;
        state.pushY += (state.targetPushY - state.pushY) * 0.12;

        // Apply hardware-composited 3D transform
        el.style.transform = `translate3d(${state.pushX.toFixed(1)}px, ${state.pushY.toFixed(1)}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('jussword:resonate', handleResonateEvent);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (mutationTimer) clearInterval(mutationTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [handlePointerMove, handleTouchMove, handlePointerDown, triggerCascade]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* The Living Entropy Constellation (interactive faint glyphs with continuous organic drift) */}
      <div className="absolute inset-0">
        {initialGlyphs.map((glyph, i) => (
          <div
            key={glyph.id}
            className="absolute animate-entropy-float"
            style={{
              left: `${glyph.baseX}%`,
              top: `${glyph.baseY}%`,
              animationDelay: `${((i * 0.32) % 4).toFixed(2)}s`,
              animationDuration: `${(5.5 + (i % 3) * 0.8).toFixed(1)}s`,
            }}
          >
            <span
              ref={(el) => {
                glyphElementsRef.current[i] = el;
              }}
              className="inline-block font-mono font-bold select-none text-slate-400 dark:text-indigo-400 opacity-[0.06] dark:opacity-[0.08] transition-opacity duration-300 will-change-transform"
              style={{
                fontSize: `${glyph.size}px`,
              }}
            >
              {glyph.char}
            </span>
          </div>
        ))}
      </div>

      {/* Tactile Safe-Tumbler Resonance Rings on Tap/Click */}
      {waves.map((wave) => (
        <div
          key={wave.id}
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: wave.x, top: wave.y }}
          onAnimationEnd={() => removeWave(wave.id)}
        >
          <div className="w-40 h-40 rounded-full border border-indigo-400/25 dark:border-indigo-400/35 bg-indigo-500/[0.03] dark:bg-indigo-500/[0.04] animate-resonance-wave" />
        </div>
      ))}
    </div>
  );
}
