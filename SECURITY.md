# Security Policy

Security and transparency are the foundational pillars of **jussword**.

---

## Supported Versions

Only the latest release running on the `main` branch is actively supported with security updates.

| Version | Supported |
| :--- | :--- |
| `1.x.x` | ✅ Yes |
| `< 1.0.0` | ❌ No |

---

## Cryptographic Model & Guarantees

- **Hardware Entropy Source**: Password randomness is generated via the W3C Web Cryptography API (`window.crypto.getRandomValues`), seeded by the operating system kernel's entropy pool.
- **Client-Side Execution**: All generation, evaluation, and string manipulation happen strictly in user memory inside the browser sandbox.
- **Zero Transmission**: No keys, seeds, passwords, or metrics are ever sent to any remote server or persistent storage.

---

## Reporting a Vulnerability

If you discover a security vulnerability or potential flaw in our cryptographic implementation:

1. **Do not disclose it publicly.**
2. Reach out directly via the author profile at [bio.link/jakib](https://bio.link/jakib) or email security concerns privately.
3. Provide a detailed summary and proof of concept.

We appreciate your responsible disclosure and will address all valid security concerns promptly.
