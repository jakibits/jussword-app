import { useState, useEffect } from 'react';
import { Copy, Check, RotateCw } from 'lucide-react';
import { generatePassword } from './utils/passwordGenerator';
import { useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

type VibePreset = 'all' | 'readable' | 'memorable';

function AppContent() {
  const { effectiveTheme } = useTheme();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(9);
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
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[^A-Za-z0-9]/.test(pwd);

    setUppercase(hasUppercase);
    setLowercase(hasLowercase);
    setNumbers(hasNumbers);
    setSymbols(hasSymbols);
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
      vibe
    });
    setPassword(newPassword);
    setIsUserEditing(false);
  };

  useEffect(() => {
    if (!isUserEditing) {
      handleGenerate();
    }
  }, [length, uppercase, lowercase, numbers, symbols, vibe, isUserEditing]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCharacterTypeChange = (type: 'uppercase' | 'lowercase' | 'numbers' | 'symbols', value: boolean) => {
    if (vibe !== 'all') return;

    const newState = {
      uppercase: type === 'uppercase' ? value : uppercase,
      lowercase: type === 'lowercase' ? value : lowercase,
      numbers: type === 'numbers' ? value : numbers,
      symbols: type === 'symbols' ? value : symbols
    };

    const hasAtLeastOne = newState.uppercase || newState.lowercase || newState.numbers || newState.symbols;

    if (!hasAtLeastOne) {
      showToastMessage('At least one character type should be selected');
      return;
    }

    if (type === 'uppercase') setUppercase(value);
    if (type === 'lowercase') setLowercase(value);
    if (type === 'numbers') setNumbers(value);
    if (type === 'symbols') setSymbols(value);
  };

  return (
    <div className="h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] text-[#111111] dark:text-[#EEEEEE] flex flex-col overflow-hidden smooth-transition">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        <div className="w-full max-w-2xl">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold tracking-tight mb-2">jussword</h1>
            <p className="text-xs text-[#999999] dark:text-[#666666] tracking-wide">
              <span className="font-medium text-[#444444] dark:text-[#AAAAAA]">ju</span>st a simple secure pa<span className="font-medium text-[#444444] dark:text-[#AAAAAA]">ssword</span> generator
            </p>
          </header>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="••••••••••••••••"
                className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333333] p-6 text-2xl font-mono leading-tight text-center text-[#111111] dark:text-[#EEEEEE] placeholder-[#CCCCCC] dark:placeholder-[#555555] hover:border-[#0055FF] focus:border-[#0055FF] focus:outline-none input-focus-ring"
              />
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleGenerate}
                  className="p-3 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333333] hover:bg-[#FAFAFA] dark:hover:bg-[#252525] hover:border-[#0055FF] rounded button-hover-lift"
                  title="Generate"
                >
                  <RotateCw className="w-5 h-5 text-[#111111] dark:text-[#EEEEEE] transition-transform duration-300" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-3 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333333] hover:bg-[#FAFAFA] dark:hover:bg-[#252525] hover:border-[#0055FF] rounded button-hover-lift"
                  title="Copy"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-[#0055FF] animate-slide-down" />
                  ) : (
                    <Copy className="w-5 h-5 text-[#111111] dark:text-[#EEEEEE]" />
                  )}
                </button>
              </div>
            </div>

            {copied && (
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-[#111111] text-white px-6 py-3 text-sm animate-fade-in">
                Copied!
              </div>
            )}

            {showToast && (
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-[#111111] text-white px-6 py-3 text-sm animate-fade-in">
                {toastMessage}
              </div>
            )}

            <div className="space-y-3 smooth-transition">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium uppercase tracking-wide">Length</label>
                <span className="text-xs text-[#666666] dark:text-[#999999] transition-all duration-200">{length}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-1 bg-[#E5E5E5] dark:bg-[#333333] appearance-none cursor-pointer slider smooth-transition"
              />
            </div>

            <div className="border-t border-[#E5E5E5] dark:border-[#333333] pt-3 smooth-transition">
              <h3 className="text-xs font-medium uppercase tracking-wide mb-3">Vibe</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Characters', desc: 'Standard random' },
                  { value: 'readable', label: 'Readable', desc: 'Removes ambiguous characters' },
                  { value: 'memorable', label: 'Memorable', desc: 'Easy to say and remember' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start gap-2 cursor-pointer group smooth-transition"
                  >
                    <input
                      type="radio"
                      name="vibe"
                      value={option.value}
                      checked={vibe === option.value}
                      onChange={(e) => setVibe(e.target.value as VibePreset)}
                      className="mt-0.5 w-4 h-4 accent-[#0055FF] smooth-transition"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium group-hover:text-[#0055FF] smooth-transition">
                        {option.label}
                      </div>
                      <div className="text-xs text-[#666666] dark:text-[#999999]">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className={`border-t border-[#E5E5E5] dark:border-[#333333] pt-3 smooth-transition ${vibe === 'all' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <h3 className="text-xs font-medium uppercase tracking-wide mb-3">Character Types</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Uppercase', type: 'uppercase' as const, checked: uppercase },
                  { label: 'Lowercase', type: 'lowercase' as const, checked: lowercase },
                  { label: 'Numbers', type: 'numbers' as const, checked: numbers },
                  { label: 'Symbols', type: 'symbols' as const, checked: symbols }
                ].map((toggle) => (
                  <label key={toggle.label} className="flex items-center gap-2 cursor-pointer group smooth-transition">
                    <input
                      type="checkbox"
                      checked={toggle.checked}
                      onChange={(e) => handleCharacterTypeChange(toggle.type, e.target.checked)}
                      disabled={vibe !== 'all'}
                      className="w-4 h-4 accent-[#0055FF] disabled:opacity-50 smooth-transition"
                    />
                    <span className="text-sm group-hover:text-[#0055FF] smooth-transition disabled:opacity-50">
                      {toggle.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-3 text-xs text-[#999999] dark:text-[#666666] smooth-transition">
        vibe coded with 💙 by <a href="https://bio.link/jakib" target="_blank" rel="noopener noreferrer" className="font-medium text-[#0055FF] hover:text-[#0044CC] smooth-transition underline">jakib</a>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}
