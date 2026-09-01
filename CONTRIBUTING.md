# Contributing to jussword

Thank you for your interest in contributing to **jussword**! Together, we can make password security fast, effortless, and accessible to everyone.

---

## Code of Conduct

Please be respectful, helpful, and kind when contributing, discussing issues, or reviewing pull requests.

---

## How to Contribute

### 1. Reporting Bugs
- Search existing [Issues](https://github.com/jakibits/jussword-app/issues) to ensure your bug hasn't already been reported.
- Open a new issue with a clear title, description, and steps to reproduce (including browser and OS).

### 2. Suggesting Features
- We love feature suggestions! Open an issue describing:
  - The problem or use case.
  - Your proposed solution or user experience.
  - Any alternative approaches considered.

### 3. Pull Requests
1. Fork the repository and clone your fork locally.
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make your changes and test locally:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
4. Commit your changes with concise, descriptive commit messages.
5. Push to your fork and submit a Pull Request to `main`.

---

## Development Standards

- **TypeScript**: Strict typing with 0 compiler errors.
- **Styling**: Tailwind CSS with consistent design system tokens and responsive layouts.
- **Accessibility**: Ensure keyboard navigation and ARIA attributes are preserved.
- **Performance**: Zero-latency reactivity; use `useMemo` / `useCallback` for expensive cryptographic operations.

---

Thank you for helping make `jussword` better!
