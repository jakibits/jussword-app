import { useState, useEffect, useRef } from 'react';
import { Copy, Check, RotateCw } from 'lucide-react';
import { generatePassword } from './utils/passwordGenerator';
import { useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

type VibePreset = 'all' | 'readable' | 'memorable';

const getStrength = (pwd: string): number => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(4, Math.ceil(score * 4 / 6));
};

const getStrengthLabel = (pwd: string): string => {
  if (!pwd) return '';
  const s = getStrength(pwd);
  return ['', 'Weak', 'Fair', 'Good', 'Strong'][s] ?? '';
};

const strengthColors = [
  '',
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-green-400',
];

const strengthTextColors = [
  '',
  'text-red-400',
  'text-orange-400',
  'text-yellow-500',
  'text-green-500',
];

function AppContent() {
  const { effectiveTheme } = useTheme();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [vibe, setVibe] = useState<VibePreset>('all');
  const [copied, setCopied] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const analyzePassword = (pwd: string) => {
    setUppercase(/[A-Z]/.test(pwd));
    setLowercase(/[a-z]/.test(pwd));
    setNumbers(/[0-9]/.test(pwd));
    setSymbols(/[^A-Za-z0-9]/.test(pwd));
    setLength(pwd.length);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setIsUserEditing(true);
    analyzePassword(newPassword);
  };

  const handleGenerate = () => {
    const newPassword = generatePassword({
      length,
      uppercase: vibe === 'all' ? uppercase : true,
      lowercase: vibe === 'all' ? lowercase : true,
      numbers: vibe === 'all' ? numbers : true,
      symbols: vibe === 'all' ? symbols : true,
      vibe,
    });
    setPassword(newPassword);
    setIsUserEditing(false);
  };

  useEffect(() => {
    if (!isUserEditing) {
      handleGenerate();
    }
  }, [length, uppercase, lowercase, numbers, symbols, vibe, isUserEditing]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCharacterTypeChange = (
    type: 'uppercase' | 'lowercase' | 'numbers' | 'symbols',
    value: boolean
  ) => {
    if (vibe !== 'all') return;

    const newState = {
      uppercase: type === 'uppercase' ? value : uppercase,
      lowercase: type === 'lowercase' ? value : lowercase,
      numbers: type === 'numbers' ? value : numbers,
      symbols: type === 'symbols' ? value : symbols,
    };

    if (!Object.values(newState).some(Boolean)) {
      showToastMessage('At least one character type must be selected');
      return;
    }

    if (type === 'uppercase') setUppercase(value);
    if (type === 'lowercase') setLowercase(value);
    if (type === 'numbers') setNumbers(value);
    if (type === 'symbols') setSymbols(value);
    setIsUserEditing(false);
  };

  const strength = getStrength(password);
  const strengthLabel = getStrengthLabel(password);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#EEEEEE] flex flex-col smooth-transition">
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>

      {/* Toast */}
      {(copied || showToast) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#111111] dark:bg-[#EEEEEE] text-white dark:text-[#111111] px-5 py-2.5 rounded-full text-sm font-medium shadow-lg animate-fade-in">
          {copied ? 'Copied to clipboard!' : toastMessage}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">

          {/* Header */}
          <header className="text-center mb-8 animate-fade-up-1">
            <h1 className="text-5xl font-bold tracking-tight mb-2">
              jussword
            </h1>
            <p className="text-xs tracking-wider text-[#AAAAAA] dark:text-[#555555]">
              <span className="font-semibold text-[#555555] dark:text-[#888888]">ju</span>st a simple secure pa
              <span className="font-semibold text-[#555555] dark:text-[#888888]">ssword</span> generator
            </p>
          </header>

          {/* Password Card */}
          <div className="animate-fade-up-2 bg-white dark:bg-[#141414] rounded-2xl border border-[#E5E5E5] dark:border-[#222222] shadow-sm overflow-hidden mb-3">
            {/* Password input */}
            <div className="px-6 pt-6 pb-4">
              <input
                type="text"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="••••••••••••"
                data-testid="input-password"
                className="w-full bg-transparent text-2xl font-mono text-center text-[#111111] dark:text-[#EEEEEE] placeholder-[#DDDDDD] dark:placeholder-[#333333] focus:outline-none tracking-widest"
              />

              {/* Strength meter */}
              <div className="mt-5">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i < strength
                          ? strengthColors[strength]
                          : 'bg-[#EEEEEE] dark:bg-[#252525]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <span className={`text-xs font-medium transition-colors duration-300 ${strengthTextColors[strength] || 'text-transparent'}`}>
                    {strengthLabel || '‎'}
                  </span>
                  <span className="text-xs text-[#BBBBBB] dark:text-[#444444] tabular-nums">
                    {length} chars
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex border-t border-[#F0F0F0] dark:border-[#1E1E1E]">
              <button
                onClick={handleGenerate}
                data-testid="button-generate"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-[#777777] dark:text-[#666666] hover:text-[#0055FF] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-all duration-200 border-r border-[#F0F0F0] dark:border-[#1E1E1E]"
              >
                <RotateCw className="w-4 h-4" />
                Regenerate
              </button>
              <button
                onClick={handleCopy}
                data-testid="button-copy"
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all duration-200 ${
                  copied
                    ? 'text-[#0055FF] bg-[#F0F5FF] dark:bg-[#0A1530]'
                    : 'text-[#777777] dark:text-[#666666] hover:text-[#0055FF] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A]'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Settings Card */}
          <div className="animate-fade-up-3 bg-white dark:bg-[#141414] rounded-2xl border border-[#E5E5E5] dark:border-[#222222] shadow-sm overflow-hidden">

            {/* Length */}
            <div className="px-5 py-4 border-b border-[#F0F0F0] dark:border-[#1E1E1E]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#AAAAAA] dark:text-[#555555]">
                  Length
                </span>
                <span className="text-sm font-bold text-[#0055FF] tabular-nums">{length}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={length}
                data-testid="input-length"
                onChange={(e) => {
                  setLength(parseInt(e.target.value));
                  setIsUserEditing(false);
                }}
                className="w-full h-1.5 bg-[#EEEEEE] dark:bg-[#252525] appearance-none cursor-pointer slider accent-[#0055FF] rounded-full"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-[#CCCCCC] dark:text-[#444444]">1</span>
                <span className="text-[10px] text-[#CCCCCC] dark:text-[#444444]">50</span>
              </div>
            </div>

            {/* Vibe - segmented control */}
            <div className="px-5 py-4 border-b border-[#F0F0F0] dark:border-[#1E1E1E]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#AAAAAA] dark:text-[#555555] block mb-3">
                Vibe
              </span>
              <div className="flex rounded-xl bg-[#F5F5F5] dark:bg-[#0F0F0F] p-1 gap-1">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'readable', label: 'Readable' },
                  { value: 'memorable', label: 'Memorable' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    data-testid={`button-vibe-${opt.value}`}
                    onClick={() => {
                      setVibe(opt.value as VibePreset);
                      setIsUserEditing(false);
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      vibe === opt.value
                        ? 'bg-white dark:bg-[#2A2A2A] text-[#0055FF] shadow-sm'
                        : 'text-[#999999] dark:text-[#555555] hover:text-[#555555] dark:hover:text-[#888888]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Types - pill toggles */}
            <div className={`px-5 py-4 transition-opacity duration-300 ${vibe === 'all' ? 'opacity-100' : 'opacity-35 pointer-events-none'}`}>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#AAAAAA] dark:text-[#555555] block mb-3">
                Characters
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Uppercase', type: 'uppercase' as const, checked: uppercase },
                  { label: 'Lowercase', type: 'lowercase' as const, checked: lowercase },
                  { label: 'Numbers', type: 'numbers' as const, checked: numbers },
                  { label: 'Symbols', type: 'symbols' as const, checked: symbols },
                ].map((toggle) => (
                  <button
                    key={toggle.type}
                    data-testid={`button-char-${toggle.type}`}
                    onClick={() => handleCharacterTypeChange(toggle.type, !toggle.checked)}
                    disabled={vibe !== 'all'}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-200 text-center ${
                      toggle.checked
                        ? 'bg-[#EEF2FF] dark:bg-[#0D1535] text-[#0055FF] border-[#C7D5FF] dark:border-[#162050]'
                        : 'bg-[#F8F8F8] dark:bg-[#1A1A1A] text-[#AAAAAA] dark:text-[#555555] border-[#EEEEEE] dark:border-[#252525]'
                    }`}
                  >
                    {toggle.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <footer className="text-center py-4 text-xs text-[#CCCCCC] dark:text-[#333333] smooth-transition">
        vibe coded with 💙 by{' '}
        <a
          href="https://bio.link/jakib"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#0055FF] hover:text-[#0044CC] transition-colors underline"
        >
          jakib
        </a>
      </footer>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
