# jussword

A simple, secure password generator built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Generate random passwords with customizable options
- Control password length via a slider
- Toggle character types: Uppercase, Lowercase, Numbers, Symbols
- Three "vibe" presets: All Characters, Readable (no ambiguous chars), Memorable (easy to say)
- Manually edit the generated password
- Copy to clipboard with one click
- Light/dark theme toggle
- Smooth animations and transitions

## Stack

- **React 18** with TypeScript
- **Vite** for dev server and build tooling
- **Tailwind CSS** for styling
- **lucide-react** for icons
- **@supabase/supabase-js** (dependency present but not actively used)

## Project Structure

```
src/
  App.tsx               # Main application component
  main.tsx              # Entry point with ThemeProvider wrapper
  index.css             # Global styles and Tailwind imports
  components/
    ThemeToggle.tsx     # Light/dark mode toggle button
  context/
    ThemeContext.tsx    # Theme state management (light/dark/system)
  utils/
    passwordGenerator.ts # Core password generation logic
public/                 # Static assets
```

## Dev Server

Runs on port 5000 (`npm run dev`). Configured to allow all hosts for Replit's proxied preview.

## Deployment

Static site — build with `npm run build`, output goes to `dist/`.
