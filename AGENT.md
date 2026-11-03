# AI Agent Instructions for jussword

> 🚨 **CRITICAL MANDATE FOR ALL AI AGENTS & CODING ASSISTANTS**  
> (Antigravity, Aider, Devin, Bolt, Replit, AutoGPT, and autonomous agents)

Before reading code, planning tasks, or writing any code changes:
1. **You MUST read [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) in full.** It is the single source of truth for the architecture, security invariants, design tokens, and past bug traps.
2. **Never violate the 6 Golden Rules** defined in `PROJECT_CONTEXT.md`:
   - 100% Client-side CSPRNG (`window.crypto.getRandomValues`). Never `Math.random()`.
   - Zero telemetry, zero tracking, zero remote transmission of passwords.
   - PWA & Airplane mode offline compatibility (`public/sw.js`).
   - No heavy UI component libraries (only React 18 + Tailwind CSS 3.4 + Lucide React).
   - Single-screen Bento layout without vertical page scrolling on standard 1080p displays.
   - Always push deployments to BOTH `origin/master` and `origin/main`.
3. **Beware the 5 Known Traps**:
   - Dark mode white flash (FOUT) prevented by inline blocking `<head>` script in `index.html`.
   - Silent cold-mount guard (`isInitialMount` in `src/App.tsx`) to avoid audio chime pop on load.
   - Shannon entropy guard: sayable pseudo-words must calculate character-set entropy, not Diceware pool size.
   - Background aesthetic: "Living Entropy Field" canvas-free DOM particles only; no flashlight/torch circles, no purple halos.
   - Branch parity: push both `master` and `main`.
4. **Before committing changes**, always verify:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
