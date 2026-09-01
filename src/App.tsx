import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  Eye,
  EyeOff,
  Sliders,
  BookOpen,
  Lock,
  Hash,
  Sparkles,
  ShieldCheck,
  Speech,
  FileText,
  Github,
  Volume2,
  VolumeX,
  Coffee,
} from 'lucide-react';
import {
  generatePassword,
  analyzePassword,
  VibePreset,
  MemorableStyle,
  GeneratePasswordOptions,
} from './utils/passwordGenerator';
import {
  hapticClick,
  hapticStep,
  hapticGenerate,
  hapticCopy,
  setSoundEnabled,
  isSoundEnabled,
} from './utils/haptics';
import { ThemeToggle } from './components/ThemeToggle';
import { AnimatedLogo } from './components/AnimatedLogo';
import { InfoModal, ModalTab } from './components/InfoModal';

// Strength visual tokens
const STRENGTH_CONFIG = [
  {
    label: 'Very Weak',
    color: 'bg-rose-500',
    textColor: 'text-rose-500 dark:text-rose-400',
  },
  {
    label: 'Weak',
    color: 'bg-orange-500',
    textColor: 'text-orange-500 dark:text-orange-400',
  },
  {
    label: 'Fair',
    color: 'bg-amber-500',
    textColor: 'text-amber-500 dark:text-amber-400',
  },
  {
    label: 'Good',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    label: 'Rock Solid',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-500 dark:text-indigo-400',
  },
];

const PRESET_LENGTHS = [8, 12, 14, 16, 20, 24];
const PIN_LENGTHS = [4, 6, 8, 12];
const SEPARATORS = [
  { label: 'Hyphen (-)', value: '-' },
  { label: 'Dot (.)', value: '.' },
  { label: 'Underscore (_)', value: '_' },
  { label: 'Space ( )', value: ' ' },
];

const WITTY_QUOTES = [
  'built because "password123" is not a security strategy',
  'stop using your dog\'s birthday as your master password',
  'no, "P@ssw0rd!" is not unhackable',
  'because sticky notes under keyboards aren\'t encrypted',
  'made for anyone whose mother\'s maiden name is on Facebook',
  'because "admin123" is not a personality trait',
  'crafted because 123456 has been leaked 8 billion times',
  'adding an exclamation mark at the end fooled no hacker ever',
  'replacing "e" with "3" was cool in 2004, not today',
  'your high school mascot is in a credential stuffing database',
  'because "qwerty" is the universal password of regret',
  'made so you never have to click "Forgot Password" again',
  'your childhood street name is not high-entropy security',
  'friends don\'t let friends reuse Netflix passwords for banking',
  'because "Welcome2026!" isn\'t as clever as your IT department thinks',
  'built for people whose master password is still their phone number',
  'no, capitalising the first letter doesn\'t add 40 bits of entropy',
  'a hacker can guess "monkey123" before your coffee finishes brewing',
  'because "I\'ll change it later" is the biggest lie in tech',
  'say goodbye to SMS password resets sent in plain text',
  'crafted with zero telemetry so not even our servers know your vibes',
  'because your ex still has access to your old Disney+ account',
  'stop setting your wifi password as your universal master key',
  'real passwords have curves, numbers, and zero dictionary words',
  'because brute-force bots have RTX 4090s now',
  'your anniversary date is public on anniversary photos, genius',
  'built because password requirements that ban symbols are criminal',
  'because "letmein" has never kept anyone out',
  'no algorithms were harmed, only predictable passwords',
  'the best password is the one you can say but bots can\'t guess',
  'because rotating "Spring2026!" to "Summer2026!" is not security',
  'your cat\'s name + 123 is currently being tested by a bot in Belarus',
  'made 100% offline because trust is good, math is better',
  'cryptographically certified to annoy credential harvesters',
  'because simple shouldn\'t mean insecure, and secure shouldn\'t mean painful',
];

export default function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(14);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [vibe, setVibe] = useState<VibePreset>('memorable');

  // Memorable mode state
  const [memorableStyle, setMemorableStyle] = useState<MemorableStyle>('pseudowords');
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [includeNumberInMemorable, setIncludeNumberInMemorable] = useState(true);
  const [includeSymbolsInMemorable, setIncludeSymbolsInMemorable] = useState(true);

  // Interaction state
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>('about');
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      hapticClick();
    }
  };

  const openInfoModal = (tab: ModalTab) => {
    hapticClick();
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pick a random witty quote on mount
  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * WITTY_QUOTES.length));
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2000);
  }, []);

  const handleGenerate = useCallback(() => {
    hapticGenerate();
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 350);

    const options: GeneratePasswordOptions = {
      length: vibe === 'pin' ? Math.max(4, Math.min(16, length)) : length,
      uppercase: vibe === 'all' ? uppercase : true,
      lowercase: vibe === 'all' ? lowercase : true,
      numbers: vibe === 'all' ? numbers : includeNumberInMemorable,
      symbols: vibe === 'all' ? symbols : includeSymbolsInMemorable,
      excludeAmbiguous: vibe === 'readable' ? true : excludeAmbiguous,
      vibe,
      memorableStyle,
      wordCount,
      separator,
      capitalize: capitalizeWords,
      includeNumber: includeNumberInMemorable,
    };

    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setIsUserEditing(false);
  }, [
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
    excludeAmbiguous,
    vibe,
    memorableStyle,
    wordCount,
    separator,
    capitalizeWords,
    includeNumberInMemorable,
    includeSymbolsInMemorable,
  ]);

  // Initial and reactive generation
  useEffect(() => {
    if (!isUserEditing) {
      handleGenerate();
    }
  }, [handleGenerate, isUserEditing]);

  // Keyboard shortcut listener (Space/R to regenerate, C to copy)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (document.activeElement === inputRef.current) return;

      if (e.code === 'Space' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleGenerate();
      } else if (
        (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c' && window.getSelection()?.toString() === '')
      ) {
        handleCopy();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Password analysis memoized for zero-lag reactivity
  const analysis = useMemo(() => analyzePassword(password, vibe), [password, vibe]);

  // Clipboard copy handler with reliable fallback
  const handleCopy = async () => {
    if (!password) {
      showToast('Nothing to copy yet');
      return;
    }

    let success = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(password);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = password;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      hapticCopy();
      setCopied(true);
      showToast('Copied to clipboard!');
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Could not copy automatically');
    }
  };

  const handleManualPasswordChange = (val: string) => {
    setPassword(val);
    setIsUserEditing(true);

    if (val.length > 0) {
      setUppercase(/[A-Z]/.test(val));
      setLowercase(/[a-z]/.test(val));
      setNumbers(/[0-9]/.test(val));
      setSymbols(/[^A-Za-z0-9]/.test(val));
      setLength(Math.min(64, Math.max(4, val.length)));
    }
  };

  const handleCharacterToggle = (
    type: 'uppercase' | 'lowercase' | 'numbers' | 'symbols',
    newVal: boolean
  ) => {
    if (vibe !== 'all') return;
    hapticClick();

    const nextState = {
      uppercase: type === 'uppercase' ? newVal : uppercase,
      lowercase: type === 'lowercase' ? newVal : lowercase,
      numbers: type === 'numbers' ? newVal : numbers,
      symbols: type === 'symbols' ? newVal : symbols,
    };

    if (!Object.values(nextState).some(Boolean)) {
      showToast('Pick at least one character type');
      return;
    }

    if (type === 'uppercase') setUppercase(newVal);
    if (type === 'lowercase') setLowercase(newVal);
    if (type === 'numbers') setNumbers(newVal);
    if (type === 'symbols') setSymbols(newVal);
    setIsUserEditing(false);
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % WITTY_QUOTES.length);
  };

  const currentStrength = STRENGTH_CONFIG[analysis.strengthScore] || STRENGTH_CONFIG[0];

  return (
    <div className="min-h-[100dvh] bg-[#F8F9FA] dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 flex flex-col justify-between relative selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Ambient background light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ambient-glow-light dark:ambient-glow-dark w-full h-full" />
      </div>

      {/* Top Header Bar - Scales with screen width */}
      <header className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-1 flex items-center justify-between z-20">
        <AnimatedLogo />
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound & Haptics Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? 'Disable sound haptics' : 'Enable sound haptics'}
            title={soundOn ? 'Mute audio haptics' : 'Unmute audio haptics'}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium backdrop-blur-md border transition-all duration-200 cursor-pointer active:scale-95 ${
              soundOn
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold shadow-xs'
                : 'bg-white/80 dark:bg-[#141622]/80 border-slate-200/80 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <a
            href="https://github.com/jakibits/jussword-app"
            target="_blank"
            rel="noopener noreferrer"
            title="Star on GitHub (Open Source)"
            aria-label="GitHub Repository"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/80 dark:bg-[#141622]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-xs hover:bg-white dark:hover:bg-[#1C1F30] hover:border-slate-300 dark:hover:border-white/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Buy Me a Coffee */}
          <a
            href="https://buymeacoffee.com/jakib"
            target="_blank"
            rel="noopener noreferrer"
            title="Support on Buy Me a Coffee"
            aria-label="Buy Me a Coffee"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50/90 dark:bg-amber-950/40 backdrop-blur-md border border-amber-200/80 dark:border-amber-600/30 text-amber-700 dark:text-amber-300 shadow-xs hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:border-amber-300 dark:hover:border-amber-500/40 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Coffee</span>
          </a>

          <ThemeToggle />
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 animate-toast-in backdrop-blur-xl bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-950 border border-white/10 dark:border-black/10"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Generator Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-2 sm:py-4 z-10">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          
          {/* Subtitle Tagline */}
          <p className="text-center md:text-left text-xs tracking-wider text-slate-400 dark:text-slate-500 select-none pb-2 sm:pb-3">
            <span className="font-semibold text-slate-700 dark:text-slate-200">ju</span>st a{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">s</span>imple{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">s</span>ecure pass
            <span className="font-semibold text-slate-700 dark:text-slate-200">word</span> generator
          </p>

          {/* Responsive Layout Grid: Stack on Mobile, Balanced 2-Column on Tablet/Desktop/4K */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 md:gap-5 items-stretch">
            
            {/* Left Column: Password Display & Action Card (5 cols on desktop) */}
            <div className="md:col-span-5 flex flex-col justify-between gap-3.5 sm:gap-4">
              <div className="bg-white/95 dark:bg-[#12141F]/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden transition-all duration-200 h-full flex flex-col justify-between">
                
                {/* Input & Strength Details */}
                <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-center">
                  <div className="relative flex items-center">
                    <input
                      ref={inputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handleManualPasswordChange(e.target.value)}
                      placeholder="••••••••••••"
                      aria-label="Generated password"
                      data-testid="input-password"
                      spellCheck={false}
                      autoComplete="off"
                      className="w-full bg-slate-50/80 dark:bg-[#0A0B10]/80 border border-slate-200/80 dark:border-white/10 rounded-xl px-3.5 py-3.5 pr-20 font-mono-code text-base sm:text-lg lg:text-xl text-center text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all tracking-wide select-all"
                    />

                    {/* Inline Action Controls */}
                    <div className="absolute right-1.5 flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        title={showPassword ? 'Hide password' : 'Show password'}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy password"
                        title="Copy to clipboard"
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          copied
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-white/10'
                        }`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Metre */}
                  <div className="space-y-2">
                    <div
                      role="meter"
                      aria-label="Password strength"
                      aria-valuemin={0}
                      aria-valuemax={4}
                      aria-valuenow={analysis.strengthScore}
                      aria-valuetext={currentStrength.label}
                      className="flex gap-1.5 h-1.5 w-full"
                    >
                      {[0, 1, 2, 3].map((idx) => {
                        const isActive =
                          idx <= analysis.strengthScore - 1 ||
                          (analysis.strengthScore === 0 && idx === 0 && password.length > 0);
                        return (
                          <div
                            key={idx}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              isActive ? currentStrength.color : 'bg-slate-200 dark:bg-slate-800'
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${currentStrength.textColor}`}>
                          {password ? currentStrength.label : 'Empty'}
                        </span>
                        {analysis.crackTimeEstimate && password && (
                          <span className="text-slate-400 dark:text-slate-500">
                            • {analysis.crackTimeEstimate}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 font-mono-code tabular-nums">
                        {password.length} chars
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Split Bar */}
                <div className="grid grid-cols-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0E1019]/50">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    data-testid="button-generate"
                    aria-label="Generate new password"
                    className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-[#161926] border-r border-slate-100 dark:border-white/5 transition-all duration-150 active:scale-[0.99] cursor-pointer"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin-quick text-indigo-500' : ''}`} />
                    <span>Regenerate <kbd className="hidden lg:inline-block ml-1 px-1 py-0.5 text-[9px] font-mono bg-slate-200/70 dark:bg-white/10 rounded text-slate-500 dark:text-slate-400">Space</kbd></span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    data-testid="button-copy"
                    aria-label="Copy password"
                    className={`flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all duration-150 active:scale-[0.99] cursor-pointer ${
                      copied
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                        : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-[#161926]'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-indigo-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'} <kbd className="hidden lg:inline-block ml-1 px-1 py-0.5 text-[9px] font-mono bg-slate-200/70 dark:bg-white/10 rounded text-slate-500 dark:text-slate-400">C</kbd></span>
                  </button>
                </div>

              </div>

              {/* Discreet Privacy Note on Widescreen */}
              <div className="hidden md:flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 select-none py-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% offline in-browser generation</span>
              </div>
            </div>

            {/* Right Column: Settings Card (7 cols on desktop) */}
            <div className="md:col-span-7">
              <div className="bg-white/95 dark:bg-[#12141F]/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-white/5 transition-all duration-200 h-full flex flex-col justify-between">
                
                {/* Vibe Presets */}
                <div className="p-3.5 sm:p-4 md:p-4.5 space-y-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Vibe
                  </span>

                  <div
                    role="radiogroup"
                    aria-label="Password style preset"
                    className="grid grid-cols-4 gap-1.5 bg-slate-100/80 dark:bg-[#0A0B10]/80 p-1 rounded-xl"
                  >
                    {[
                      { value: 'all', label: 'All', icon: Sliders },
                      { value: 'readable', label: 'Readable', icon: BookOpen },
                      { value: 'memorable', label: 'Memorable', icon: Lock },
                      { value: 'pin', label: 'PIN', icon: Hash },
                    ].map((opt) => {
                      const isSelected = vibe === opt.value;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          data-testid={`button-vibe-${opt.value}`}
                          onClick={() => {
                            hapticClick();
                            setVibe(opt.value as VibePreset);
                            setIsUserEditing(false);
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-white dark:bg-[#1C1F30] text-indigo-600 dark:text-indigo-400 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`} />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mode Specific Controls */}
                <div className="p-3.5 sm:p-4 md:p-4.5 flex-1 flex flex-col justify-center">
                  {vibe === 'memorable' ? (
                    /* Memorable Style Switcher & Options */
                    <div className="space-y-3.5">
                      {/* Sub-style: Pseudo-Words (CVC) vs Passphrase */}
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-100/70 dark:bg-[#0A0B10]/70 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            hapticClick();
                            setMemorableStyle('pseudowords');
                            setIsUserEditing(false);
                          }}
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            memorableStyle === 'pseudowords'
                              ? 'bg-white dark:bg-[#1C1F30] text-indigo-600 dark:text-indigo-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Speech className="w-3.5 h-3.5" />
                          <span>Pseudo-Words (Sayable)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            hapticClick();
                            setMemorableStyle('passphrase');
                            setIsUserEditing(false);
                          }}
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            memorableStyle === 'passphrase'
                              ? 'bg-white dark:bg-[#1C1F30] text-indigo-600 dark:text-indigo-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Real Words (Passphrase)</span>
                        </button>
                      </div>

                      {memorableStyle === 'pseudowords' ? (
                        /* Pronounceable Pseudo-Words Controls (CVC Phonetic Algorithm) */
                        <div className="space-y-3">
                          {/* Length Slider & Quick Chips for Pseudo-words */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Word Length</span>
                              <span className="font-mono-code font-bold text-indigo-600 dark:text-indigo-400">{length} characters</span>
                            </div>

                            <div className="flex gap-1.5">
                              {PRESET_LENGTHS.map((pLen) => (
                                <button
                                  key={pLen}
                                  type="button"
                                  onClick={() => {
                                    hapticClick();
                                    setLength(pLen);
                                    setIsUserEditing(false);
                                  }}
                                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                                    length === pLen
                                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                  }`}
                                >
                                  {pLen}
                                </button>
                              ))}
                            </div>

                            <input
                              type="range"
                              min="4"
                              max="48"
                              value={length}
                              onChange={(e) => {
                                hapticStep();
                                setLength(parseInt(e.target.value, 10));
                                setIsUserEditing(false);
                              }}
                              className="w-full custom-slider"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>4</span>
                              <span>24</span>
                              <span>48</span>
                            </div>
                          </div>

                          {/* Toggles for Pseudo-words */}
                          <div className="grid grid-cols-3 gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                hapticClick();
                                setCapitalizeWords(!capitalizeWords);
                                setIsUserEditing(false);
                              }}
                              className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                                capitalizeWords
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                                  : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-white/10'
                              }`}
                            >
                              Capitalize ({capitalizeWords ? 'Aa' : 'aa'})
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                hapticClick();
                                setIncludeNumberInMemorable(!includeNumberInMemorable);
                                setIsUserEditing(false);
                              }}
                              className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                                includeNumberInMemorable
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                                  : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-white/10'
                              }`}
                            >
                              Add Numbers (123)
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                hapticClick();
                                setIncludeSymbolsInMemorable(!includeSymbolsInMemorable);
                                setIsUserEditing(false);
                              }}
                              className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                                includeSymbolsInMemorable
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                                  : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-white/10'
                              }`}
                            >
                              Add Symbols (!@#)
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Real Word Passphrase Options */
                        <div className="space-y-3">
                          {/* Word Count */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Word Count</span>
                              <span className="font-mono-code font-bold text-indigo-600 dark:text-indigo-400">{wordCount} words</span>
                            </div>
                            <input
                              type="range"
                              min="3"
                              max="8"
                              value={wordCount}
                              onChange={(e) => {
                                hapticStep();
                                setWordCount(parseInt(e.target.value, 10));
                                setIsUserEditing(false);
                              }}
                              className="w-full custom-slider"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>3</span>
                              <span>8</span>
                            </div>
                          </div>

                          {/* Separator Picker */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Separator</label>
                            <div className="grid grid-cols-4 gap-1.5">
                              {SEPARATORS.map((sep) => (
                                <button
                                  key={sep.value}
                                  type="button"
                                  onClick={() => {
                                    hapticClick();
                                    setSeparator(sep.value);
                                    setIsUserEditing(false);
                                  }}
                                  className={`py-1.5 px-1.5 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
                                    separator === sep.value
                                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                                      : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/10 hover:border-slate-300'
                                  }`}
                                >
                                  {sep.value === ' ' ? 'Space' : sep.value}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Toggles for Passphrase */}
                          <div className="grid grid-cols-2 gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                hapticClick();
                                setCapitalizeWords(!capitalizeWords);
                                setIsUserEditing(false);
                              }}
                              className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                                capitalizeWords
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                                  : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-white/10'
                              }`}
                            >
                              Capitalize ({capitalizeWords ? 'On' : 'Off'})
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                hapticClick();
                                setIncludeNumberInMemorable(!includeNumberInMemorable);
                                setIsUserEditing(false);
                              }}
                              className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                                includeNumberInMemorable
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                                  : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-white/10'
                              }`}
                            >
                              Add Number (123)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : vibe === 'pin' ? (
                    /* PIN Code Controls */
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">PIN Length</span>
                        <span className="font-mono-code font-bold text-indigo-600 dark:text-indigo-400">{length} digits</span>
                      </div>

                      <div className="flex gap-2">
                        {PIN_LENGTHS.map((pLen) => (
                          <button
                            key={pLen}
                            type="button"
                            onClick={() => {
                              hapticClick();
                              setLength(pLen);
                              setIsUserEditing(false);
                            }}
                            className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                              length === pLen
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                            }`}
                          >
                            {pLen}
                          </button>
                        ))}
                      </div>

                      <input
                        type="range"
                        min="4"
                        max="16"
                        value={length}
                        onChange={(e) => {
                          hapticStep();
                          setLength(parseInt(e.target.value, 10));
                          setIsUserEditing(false);
                        }}
                        className="w-full custom-slider"
                      />
                    </div>
                  ) : (
                    /* Standard & Readable Mode */
                    <div className="space-y-3.5">
                      {/* Length Slider & Quick Preset Chips */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Password Length</span>
                          <span className="font-mono-code font-bold text-indigo-600 dark:text-indigo-400">
                            {length} characters
                          </span>
                        </div>

                        <div className="flex gap-1.5">
                          {PRESET_LENGTHS.map((pLen) => (
                            <button
                              key={pLen}
                              type="button"
                              onClick={() => {
                                hapticClick();
                                setLength(pLen);
                                setIsUserEditing(false);
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                                length === pLen
                                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                              }`}
                            >
                              {pLen}
                            </button>
                          ))}
                        </div>

                        <input
                          type="range"
                          min="4"
                          max="64"
                          value={length}
                          data-testid="input-length"
                          onChange={(e) => {
                            hapticStep();
                            setLength(parseInt(e.target.value, 10));
                            setIsUserEditing(false);
                          }}
                          className="w-full custom-slider"
                        />

                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>4</span>
                          <span>32</span>
                          <span>64</span>
                        </div>
                      </div>

                      {/* Character Type Toggles */}
                      <div className="space-y-1.5 pt-0.5">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          Characters
                        </span>

                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                          {[
                            { key: 'uppercase' as const, label: 'Uppercase', sample: 'ABC', checked: uppercase },
                            { key: 'lowercase' as const, label: 'Lowercase', sample: 'abc', checked: lowercase },
                            { key: 'numbers' as const, label: 'Numbers', sample: '123', checked: numbers },
                            { key: 'symbols' as const, label: 'Symbols', sample: '!@#', checked: symbols },
                          ].map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              role="checkbox"
                              aria-checked={item.checked}
                              data-testid={`button-char-${item.key}`}
                              onClick={() => handleCharacterToggle(item.key, !item.checked)}
                              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                item.checked
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                                  : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200/80 dark:border-white/10'
                              }`}
                            >
                              <span>{item.label}</span>
                              <span className="font-mono text-[11px] opacity-75">{item.sample}</span>
                            </button>
                          ))}
                        </div>

                        {vibe === 'all' && (
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={excludeAmbiguous}
                            onClick={() => {
                              hapticClick();
                              setExcludeAmbiguous(!excludeAmbiguous);
                              setIsUserEditing(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all mt-1 cursor-pointer ${
                              excludeAmbiguous
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                                : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-white/10'
                            }`}
                          >
                            <span>Avoid lookalike letters</span>
                            <span className="font-mono text-[11px] opacity-75">(0, O, l, 1)</span>
                          </button>
                        )}
                      </div>

                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Witty / Snarky Minimalist Footer - Scales with screen width */}
      <footer className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 text-center text-xs text-slate-400 dark:text-slate-500 z-10 select-none space-y-2">
        {/* Navigation / Info Links for SEO & GEO */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => openInfoModal('about')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            About
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => openInfoModal('how-it-works')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => openInfoModal('faq')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Security FAQ
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => openInfoModal('privacy')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Privacy & Offline
          </button>
        </div>

        {/* Witty Quote */}
        <div>
          <button
            type="button"
            onClick={() => {
              hapticClick();
              nextQuote();
            }}
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1 group cursor-pointer text-[11px] sm:text-xs"
            title="Click for another truth"
          >
            <span>{WITTY_QUOTES[quoteIndex]}</span>
            <Sparkles className="w-3 h-3 text-amber-400/80 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Author & Sponsor Credit */}
        <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-600 flex items-center justify-center gap-1.5 flex-wrap">
          <span>crafted with 💙 by</span>
          <a
            href="https://bio.link/jakib"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            jakib
          </a>
          <span>•</span>
          <a
            href="https://buymeacoffee.com/jakib"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400 hover:underline"
          >
            <Coffee className="w-3 h-3" />
            <span>buy me a coffee</span>
          </a>
        </div>
      </footer>

      {/* Interactive SEO/GEO Content Modal */}
      <InfoModal
        isOpen={isModalOpen}
        activeTab={modalTab}
        onClose={() => setIsModalOpen(false)}
        onSelectTab={setModalTab}
      />
    </div>
  );
}
