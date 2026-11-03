# GitHub Copilot Instructions for jussword

Before generating suggestions or planning tasks for `jussword`, consult [`PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md).

## Non-Negotiable Invariants
- **CSPRNG**: Always use `window.crypto.getRandomValues()`. Never `Math.random()`.
- **Zero Telemetry**: No backend, no cookies, no tracking pixels. Everything runs in-browser offline.
- **Dependencies**: Pure React 18, Tailwind CSS 3.4, and Lucide React. Do not import heavy UI frameworks.
- **Design**: Bento grid fitting on a standard 1080p viewport without page scrollbars.
- **Dark Mode FOUT**: Preserve the blocking `<head>` script in `index.html`.
- **Audio Synthesizer**: Ensure `isInitialMount` prevents cold-load audio pops.
- **Entropy Calculation**: Do not use Diceware formula for pseudo-words in `src/utils/passwordGenerator.ts`.
- **Background**: Preserve "Living Entropy Field" in `src/components/InteractiveBackground.tsx`. No flashlight/torch cursor effects or purple backdrop halos.
- **Git Push**: Keep `master` and `main` branches synchronized at all times.
