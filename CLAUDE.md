# CLAUDE.md — Claude Code Instructions for jussword

> 🚨 **MANDATORY INSTRUCTION FOR CLAUDE CODE**  
> Before analyzing, planning, or executing any changes, read [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md).

## Project Overview
- **Name**: `jussword` (**ju**st a **s**imple **s**ecure pass**word** generator).
- **Stack**: React 18, TypeScript 5.5, Vite 7, Tailwind CSS 3.4, Lucide React.
- **Master Documentation**: [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) contains full architectural specs, component guides, and known bug traps.

## Golden Invariants
1. **Entropy**: Always use `window.crypto.getRandomValues()`. Never use `Math.random()`.
2. **Privacy**: 100% client-side, zero analytics/telemetry, zero network calls for password data.
3. **No Heavy UI Libs**: Keep bundle lean. Never install Radix, Shadcn, MUI, or Chakra.
4. **Single-Screen Bento**: Must fit within standard desktop viewport without page scrolling.
5. **Git Parity**: Always push to both `master` and `main` (`git push origin master && git push origin master:main`).

## Critical Bug Traps
- **Theme FOUT**: Do NOT modify or defer the `<script>` in `index.html` `<head>` that applies `.dark` before DOM paint.
- **Audio Cold-Mount**: Keep `isInitialMount.current` in `src/App.tsx` so audio chime does not pop on initial page load.
- **Pseudo-Word Entropy**: In `src/utils/passwordGenerator.ts`, sayable pseudo-words must calculate character-set entropy, not Diceware passphrases.
- **Background**: Keep the lightweight "Living Entropy Field" in `src/components/InteractiveBackground.tsx`. No flashlight/torch circles, no purple halos.

## Verification Commands
```bash
npm run typecheck   # tsc --noEmit -p tsconfig.app.json
npm run lint        # eslint .
npm run build       # prebuild (sync-context.mjs) + vite build
```
