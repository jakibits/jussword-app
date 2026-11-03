# PROJECT_CONTEXT.md — jussword Master Architectural & AI Context

<!-- AUTO-CONTEXT-METADATA-START -->
| Attribute | Value |
| :--- | :--- |
| **App Name** | `jussword` |
| **Live Production URL** | https://jussword.vercel.app |
| **GitHub Repository** | https://github.com/jakibits/jussword-app |
| **Package Version** | `v1.0.0` |
| **Active Branch** | `master` |
| **Last Commit** | `1929db4` (2026-11-03 18:22:16 +0530) |
| **Context Synced At** | `2026-11-03T12:52:19.567Z` (Automated build hook) |
<!-- AUTO-CONTEXT-METADATA-END -->

> ⚠️ **MANDATORY INSTRUCTION FOR ALL AI CODING AGENTS & LLMs**  
> (Claude Code, Cursor, Windsurf, GitHub Copilot, Antigravity, Aider, Bolt, Replit, Devin, etc.)  
> **READ THIS ENTIRE DOCUMENT BEFORE PROPOSING OR EXECUTING ANY CHANGES.**  
> This file contains the complete architectural blueprints, design tokens, security invariants, and critical bug traps for `jussword`. Disregarding these rules will introduce regressions.

---

## 1. Project Identity & Philosophy

- **Name**: `jussword` (always written in lowercase in UI text, logos, and package identifiers).
- **Phonetic Acronym**: **`ju`**st a **`s`**imple **`s`**ecure pass**`word`** generator.
- **Tagline**: *"Just a simple secure password generator"*.
- **Author**: Jakib ([bio.link/jakib](https://bio.link/jakib) | GitHub: [@jakibits](https://github.com/jakibits) | [Buy Me a Coffee](https://buymeacoffee.com/jakib)).
- **Core Premise**: Most password generators force an unacceptable compromise: either unpronounceable cryptographic soup (`x$9&K#2qL!`) impossible to type on mobile/TVs, or easily crackable dictionary phrases. `jussword` provides hardware-grade entropy with phonetic readability, 100% offline client-side privacy, and zero telemetry.

---

## 2. Inviolable Core Invariants ("The Golden Rules")

Any code modification that breaks these rules is strictly forbidden:

1. **100% Client-Side Entropy (`crypto.getRandomValues`)**  
   All entropy MUST be drawn exclusively from `window.crypto.getRandomValues()` (OS-level CSPRNG).  
   *NEVER use `Math.random()` for character selection, shuffle, or dice rolls.*
2. **Zero Telemetry / Zero Tracking / Zero Backend**  
   `jussword` has no backend, no databases, and no tracking scripts (no Google Analytics, Mixpanel, or telemetry pings). Passwords must NEVER leave the user's browser memory.
3. **PWA & Airplane-Mode Offline Capability**  
   The application is an installable PWA with an active service worker (`public/sw.js`). All assets, fonts, icons, and logic must be statically cacheable and run seamlessly in offline/airplane mode.
4. **No Heavy Component Libraries**  
   Do NOT install bloated UI libraries (e.g. Radix, Shadcn, MUI, Chakra, Mantine, Ant Design). The project relies exclusively on **React 18 + Tailwind CSS 3.4 + Lucide React**. Keep bundle size tiny and performance blistering.
5. **Single-Viewport "No Scroll" Experience**  
   The UI layout is engineered as a Bento grid that fits entirely on a standard 1080p display / laptop screen without page-level vertical scrolling. Mobile screens wrap gracefully into a single column.
6. **Dual Git Branch Parity (`master` & `main`)**  
   The local primary working branch is `master`. The GitHub remote has both `origin/master` and `origin/main`. All deployments MUST be pushed to both:
   ```bash
   git push origin master && git push origin master:main
   ```

---

## 3. The 5 Critical Traps & Pitfalls (Must Read Before Modifying Code)

These are historical traps that have caused severe bugs or regressions in the past. Do not alter their mechanisms without consulting these notes:

### Trap 1: Dark Mode White Flash (FOUT / Flash of Unstyled Theme)
- **Problem**: When a user selects Dark Mode, reloading the page can cause a 100ms white flash before React hydrates and applies the `.dark` class.
- **Solution in place**: In `index.html` within `<head>`, an inline, blocking vanilla JS script executes *immediately* before DOM paint. It reads `localStorage.getItem('jussword-theme')` (or checks `window.matchMedia('(prefers-color-scheme: dark)')`) and immediately sets `document.documentElement.classList.add('dark')`.
- **Rule**: *Never remove, defer, or async this script in `index.html`.*

### Trap 2: Cold-Mount Web Audio Synthesizer Pop
- **Problem**: When the page loads or refreshes, `useEffect` dependencies triggering password generation or theme updates would attempt to play the synthesis chime (`playGenerateSound()`), causing an audible click or unwanted pop on page open.
- **Solution in place**: In `src/App.tsx`, an `isInitialMount = useRef(true)` guard is checked. The audio chime is skipped on initial mount and only activates upon user-initiated clicks or keyboard shortcuts.
- **Rule**: *Maintain the `isInitialMount` guard in any effects tied to password regeneration.*

### Trap 3: Shannon Entropy Calculation on Sayable Pseudo-Words
- **Problem**: `calculateEntropy` previously assumed all `memorable` mode passwords were multi-word Diceware passphrases, calculating pool size as $N = 250$ words ($\approx 8$ bits/word). When users generated a single 14-character sayable pseudo-word with numbers and symbols (e.g. `ZolRonNefDu64=`), the formula divided length by 8, yielding $< 20$ bits of entropy and falsely displaying a red "Very Weak" banner for a mathematically rock-solid password!
- **Solution in place**: In `src/utils/passwordGenerator.ts`, the Diceware formula is ONLY used if `options.memorableStyle === 'passphrase'` AND the password contains valid word separators (`parts.length >= 2`). Otherwise, it evaluates character-set entropy based on uppercase, lowercase, digits, and symbols present.
- **Rule**: *Never collapse pseudo-word entropy calculation into passphrase Diceware calculations.*

### Trap 4: Background Aesthetics & Low GPU Constraints
- **Problem**: A circular flashlight / torch following the cursor or bright purple halo behind the Bento cards looked gimmicky, distracted from the password display, and taxed low-end mobile GPUs.
- **Solution in place**: `src/components/InteractiveBackground.tsx` implements the bespoke **"Living Entropy Field"**. It is a canvas-free, zero-GPU DOM-based background of ~40 faint binary/hex glyphs (`0`, `1`, `x`, `*`, `/`) with slow ambient drift ($\approx 0.03\text{px/frame}$), subtle cursor gravity, and a calm radial resonance wave fired via the `jussword:resonate` custom event on copy/generate.
- **Rule**: *Do NOT reintroduce flashlight/torch circles, canvas WebGL loops, or purple halo backdrops.*

### Trap 5: Branch Desynchronization
- **Problem**: Pushing only to `master` leaves `main` outdated on GitHub, confusing external contributors and third-party automated pipelines.
- **Rule**: *Always push both branches simultaneously.*

---

## 4. File-by-File Architectural Reference

```text
jussword/
├── .github/
│   └── copilot-instructions.md # GitHub Copilot context pointer
├── public/
│   ├── favicon.svg             # Minimalist j* brand lockup icon
│   ├── manifest.webmanifest    # PWA configuration
│   ├── sw.js                   # Offline caching service worker
│   ├── og-preview.png/svg      # High-res social OpenGraph cards
├── scripts/
│   └── sync-context.mjs        # Prebuild hook auto-updating this context file
├── src/
│   ├── components/
│   │   ├── AnimatedLogo.tsx    # Interactive lock/star morphing SVG brand logo
│   │   ├── InfoModal.tsx       # Accessible dialog (About, How It Works, FAQ, Privacy)
│   │   ├── InteractiveBackground.tsx # Low-GPU DOM "Living Entropy Field"
│   │   └── ThemeToggle.tsx     # 3-state toggle: Light / Dark / System
│   ├── context/
│   │   ├── theme-context.ts    # React Theme Context definition & useTheme hook
│   │   └── ThemeContext.tsx    # ThemeProvider with localStorage & media query listener
│   ├── utils/
│   │   ├── haptics.ts          # Web Audio API sound synthesizer & vibration haptics
│   │   └── passwordGenerator.ts # CSPRNG algorithms & Shannon entropy analyzer
│   ├── App.tsx                 # Central state machine, Bento UI layout, hotkeys
│   ├── index.css               # Tailwind directives, custom slider, animations
│   ├── main.tsx                # React DOM root entry
│   └── vite-env.d.ts           # Vite TypeScript environment declarations
├── AGENT.md                    # Universal AI agent pointer
├── CLAUDE.md                   # Anthropic Claude Code pointer
├── .cursorrules                # Cursor & Windsurf IDE rules pointer
├── index.html                  # HTML entry with FOUT script, SEO/GEO metadata, JSON-LD
├── package.json                # Dependencies, build scripts & hooks
├── tsconfig.json / tsconfig.app.json # TypeScript strict mode configs
└── vite.config.ts              # Vite 7 build configuration
```

### Detailed Component & Utility Responsibilities

#### `src/App.tsx`
- **Role**: Primary UI view and state coordinator.
- **State**:
  - `mode`: `'all' | 'readable' | 'memorable' | 'pin'`
  - `memorableStyle`: `'pseudo' | 'passphrase'`
  - `length`: Numeric length (4 to 64 for standard, 8 to 24 for pseudo-words)
  - `wordCount`: 3 to 8 for Diceware passphrases
  - `options`: Include uppercase, lowercase, numbers, symbols, avoid ambiguous (`l, 1, I, O, 0`)
  - `soundEnabled`: Boolean state synced with `localStorage`
  - `copied`: Boolean state with 2-second timeout reset
  - `password`: Current generated string
  - `strength`: Calculated `{ bits, crackTime, strength, color }`
- **Keyboard Shortcuts**:
  - <kbd>Space</kbd> or <kbd>R</kbd>: Regenerate password.
  - <kbd>C</kbd>: Copy to clipboard with visual feedback.
  - <kbd>Esc</kbd>: Dismiss any open modal dialog.
- **Event Bus**: Emits `window.dispatchEvent(new CustomEvent('jussword:resonate', { detail: { x, y, intensity } }))` on password regeneration and copy, driving synesthetic sound, haptic vibration, and visual particle ripple simultaneously.

#### `src/utils/passwordGenerator.ts`
- **Role**: Cryptographic engine and entropy auditor.
- **CSPRNG**: `getCryptoRandomInt(min, max)` uses `crypto.getRandomValues(new Uint32Array(1))` with rejection sampling to eliminate modulo bias.
- **Algorithms**:
  - **All Chars**: Strict sampling from user-selected character sets. Guarantees at least one character from each enabled set.
  - **Sayable Pseudo-Words**: Alternating Consonant-Vowel-Consonant (CVC) phonetic syllables for natural pronounceability without using dictionary words.
  - **Diceware Passphrases**: Curated 250+ clean, distinct, 4-to-7 letter words joined by user-selected separators (`-`, `.`, `_`, space).
  - **Numeric PINs**: Hardware-random digits `0-9`.
- **Entropy & Crack Time**:
  - Formula: $E = L \times \log_2(N)$ bits.
  - Benchmark: $10^{11}$ guesses/second (modern high-end GPU cluster attack).
  - Tiers: `Very Weak` (< 28 bits), `Weak` (28–35), `Fair` (36–59), `Strong` (60–79), `Rock Solid` (80+ bits).

#### `src/utils/haptics.ts`
- **Role**: Zero-dependency Web Audio API synthesizer and tactile haptics.
- **Audio Synthesis**: Uses native browser `AudioContext` with gain decay envelopes to synthesize:
  - `playKeyClick()`: 10ms micro-click at 1200Hz for toggle buttons.
  - `playGenerateSound()`: Rising two-tone harmonic frequency chime (520Hz -> 780Hz).
  - `playCopySound()`: Major third uplifting chord (659.25Hz -> 830.61Hz).
- **Haptic Vibration**: `triggerHaptic(pattern)` invokes `navigator.vibrate(pattern)` with fallbacks for Android/iOS Safari.

#### `src/components/InteractiveBackground.tsx`
- **Role**: Ambient "Living Entropy Field".
- **Design**:
  - 40 DOM particle glyphs (`0`, `1`, `x`, `*`, `/`, `#`).
  - Subtle floating physics ($\approx 0.03\text{px/frame}$) via `requestAnimationFrame`.
  - Gentle mouse/touch gravitational attraction.
  - Listens to `jussword:resonate` to briefly speed up particles and create an expanding soft radial ring from the clicked element.
  - Auto-adjusts opacity for Dark Mode (`rgba(255,255,255,0.04)`) and Light Mode (`rgba(0,0,0,0.04)`).

#### `src/context/ThemeContext.tsx`
- **Role**: Theme provider managing `light`, `dark`, or `system` mode.
- **Storage**: Key `'jussword-theme'` in `localStorage`.
- **System Sync**: Subscribes to `(prefers-color-scheme: dark)` media query for instant OS-level light/dark switches.

---

## 5. Build, Test & Deployment Automation

### Scripts in `package.json`
- `npm run dev`: Starts Vite dev server (configured on port `5000`).
- `npm run prebuild`: Automatically executes `node scripts/sync-context.mjs` to keep `PROJECT_CONTEXT.md` up-to-date with latest commit, version, and timestamp.
- `npm run build`: Runs `prebuild` then `vite build` into `dist/`.
- `npm run typecheck`: Runs strict TypeScript check (`tsc --noEmit -p tsconfig.app.json`).
- `npm run lint`: Runs ESLint 9 checks.
- `npm run update-context`: Manually updates `PROJECT_CONTEXT.md` metadata without full build.

### Deployment Workflow
When pushing changes to production:
1. Run `npm run typecheck` to ensure 0 TypeScript errors.
2. Run `npm run lint` to ensure code style compliance.
3. Run `npm run build` to verify production bundling and trigger `sync-context.mjs`.
4. Commit changes: `git add . && git commit -m "..."`.
5. Push to both branches:
   ```bash
   git push origin master && git push origin master:main
   ```
6. Vercel automatically deploys commits from `main`/`master` to `https://jussword.vercel.app`.

---

## 6. Checklist for Any Code Modification

Before committing any code change or suggesting a plan, verify:
- [ ] Did you avoid adding external UI or CSS component frameworks?
- [ ] Is `window.crypto.getRandomValues()` used for all random generation?
- [ ] Does dark/light mode work without any screen flash on page reload?
- [ ] Does the page mount silently without auto-playing audio?
- [ ] Does pseudo-word entropy calculate correctly when digits/symbols are enabled?
- [ ] Does the UI fit on a 1080p screen without a page scrollbar?
- [ ] Does `npm run typecheck` and `npm run build` pass with exit code 0?
- [ ] Are both `master` and `main` branches updated on GitHub?
