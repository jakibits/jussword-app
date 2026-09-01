<div align="center">

  <img src="public/favicon.svg" alt="jussword logo" width="84" height="84" />

  # jussword

  **Just a simple, secure password generator for the masses.**

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Zero Telemetry](https://img.shields.io/badge/Privacy-100%25%20Offline-10B981?style=flat-square&logo=shield&logoColor=white)](#-privacy--security)

  [**Live Demo »**](https://jussword.app) • [**Report Bug »**](https://github.com/jakibits/jussword-app/issues) • [**Request Feature »**](https://github.com/jakibits/jussword-app/issues)

</div>

---

## 💡 Why jussword?

Most password generators force you into a frustrating trade-off:
- Either they output unreadable cryptographic soup (`x$9&K#2qL!`) that is impossible to type on your phone, TV, or remember during verification...
- Or they generate weak, predictable patterns that get cracked in seconds.

**jussword** bridges this gap. It combines **hardware-backed cryptographic randomness** (`crypto.getRandomValues`) with **human-friendly phonetic algorithms**, producing memorable, pronounceable, and bulletproof passwords on any device.

---

## ✨ Features

### 🗣️ 1. Phonetic Sayable Pseudo-Words
Generates unique, non-existing, pronounceable words using alternating Consonant-Vowel-Consonant (CVC) syllables (e.g. `WemRofKip98!`, `BikVopSudHag42#`). Easy to read, speak, and type while satisfying 99.9% of corporate/banking password requirements out-of-the-box.

### 📖 2. Diceware Passphrases
Multi-word natural passphrases selected from a curated 200+ word dictionary (e.g. `Thunder-Maple-Breeze-42`) with customizable word counts, separators (`-`, `.`, `_`, space), capitalization, and numbers.

### 🔢 3. Numeric PIN Generator
Fast 4-to-16 digit numeric PIN generation with instant 1-click presets for bank cards, locks, and device passcodes.

### ⚡ 4. Real-time Shannon Entropy & Crack Time Analysis
Calculates mathematical entropy in bits ($E = L \times \log_2(N)$) and realistic brute-force crack times assuming $10^{11}$ guesses/second clusters, updating with zero input lag.

### 🔒 5. 100% Client-Side & Zero Telemetry
- Runs entirely in your browser using the native Web Cryptography API.
- Zero network requests. Zero cookies. Zero user tracking.
- Works offline in airplane mode.

### 🎨 6. Responsive Bento UI & Dark Mode
- Automatically adapts: dual-column Bento layout on widescreen/4K monitors, compact single-column on mobile phones.
- Fits entirely on a single screen without scrolling on standard displays.
- Light, Dark, and System theme synchronization.

### ♿ 7. Keyboard Shortcuts & Accessibility
- <kbd>Space</kbd> or <kbd>R</kbd> to regenerate a password.
- <kbd>C</kbd> to copy to clipboard (with automatic clipboard failover support).
- <kbd>Esc</kbd> to close modals.
- Full WCAG 2.1 AA compliant semantic HTML and ARIA labels.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jakibits/jussword-app.git
   cd jussword-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5000](http://localhost:5000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Static output is generated in the `dist/` directory.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), [Inter](https://fonts.google.com/specimen/Inter), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 📦 Project Structure

```text
jussword/
├── public/                     # Static assets (favicons, OpenGraph cards)
│   ├── favicon.svg             # j* Brand SVG icon
│   └── og-preview.svg          # Social preview image
├── src/
│   ├── components/
│   │   ├── AnimatedLogo.tsx    # Smooth morphing j* -> jussword logo
│   │   ├── InfoModal.tsx       # Accessible SEO/GEO modal dialogs
│   │   └── ThemeToggle.tsx     # Light/Dark/System theme switcher
│   ├── context/
│   │   ├── theme-context.ts    # Theme state context & useTheme hook
│   │   └── ThemeContext.tsx    # ThemeProvider wrapper
│   ├── utils/
│   │   └── passwordGenerator.ts # Core CSPRNG algorithms & Shannon entropy analyzer
│   ├── App.tsx                 # Main application view & responsive bento layout
│   ├── index.css               # Design system tokens, custom range slider, animations
│   └── main.tsx                # Application root
├── eslint.config.js            # ESLint 9 configuration
├── index.html                  # HTML entry with OpenGraph, JSON-LD Schema & GEO tags
├── package.json
├── LICENSE                     # MIT License
└── README.md
```

---

## 🛡️ Privacy & Security

`jussword` is built on a "zero-trust" client-side model:
- **No Remote Servers**: No backend or database is connected. Passwords are never transmitted over HTTP/WebSockets.
- **Hardware-backed CSPRNG**: Random integers are drawn from `window.crypto.getRandomValues()` directly from OS entropy.
- **Auditable**: Pure, transparent TypeScript source code with zero obfuscation.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Security Policy](SECURITY.md).

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  Crafted with 💙 by <a href="https://bio.link/jakib"><strong>jakib</strong></a>
</div>
