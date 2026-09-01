import { useEffect } from 'react';
import { X, ShieldCheck, Cpu, HelpCircle, Lock, KeyRound, Github } from 'lucide-react';

export type ModalTab = 'about' | 'how-it-works' | 'faq' | 'privacy';

interface InfoModalProps {
  isOpen: boolean;
  activeTab: ModalTab;
  onClose: () => void;
  onSelectTab: (tab: ModalTab) => void;
}

export function InfoModal({ isOpen, activeTab, onClose, onSelectTab }: InfoModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#121420] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Navigation Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#0A0B12]/70">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'about' as const, label: 'About', icon: KeyRound },
              { id: 'how-it-works' as const, label: 'How It Works', icon: Cpu },
              { id: 'faq' as const, label: 'Security FAQ', icon: HelpCircle },
              { id: 'privacy' as const, label: 'Privacy', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {activeTab === 'about' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
                  <KeyRound className="w-5 h-5 text-indigo-500" />
                  About jussword
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">ju</span>st a{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">s</span>imple{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">s</span>ecure pass
                  <span className="font-semibold text-slate-700 dark:text-slate-200">word</span> generator.
                </p>
              </div>

              <p>
                <strong>jussword</strong> was created with a clear philosophy: password generators shouldn't force you to choose between impenetrable security and human usability.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    100% Client-Side
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All generation occurs strictly in your device's memory using browser-native CSPRNG (<code className="font-mono text-[11px] bg-slate-200/60 dark:bg-white/10 px-1 py-0.5 rounded">crypto.getRandomValues</code>). No data ever leaves your computer.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <Speech className="w-4 h-4 text-indigo-500" />
                    Sayable & Memorable
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unique phonetic pseudo-words and Diceware passphrases that you can actually type on a mobile phone or recite when needed without errors.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Free & Open Source (MIT)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Built for the community. Star, fork, audit, or contribute on GitHub.
                  </p>
                </div>
                <a
                  href="https://github.com/jakibits/jussword-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View on GitHub</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'how-it-works' && (
            <div className="space-y-4 animate-fade-in">
              <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                How Generation Works
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    1. Phonetic Consonant-Vowel-Consonant (CVC) Algorithm
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Constructs pronounceable syllables alternating consonants (<code className="font-mono">b,c,d,f...</code>) and vowels (<code className="font-mono">a,e,i,o,u</code>) with customizable capitalization, numeric tokens, and symbols (e.g., <span className="font-mono text-indigo-500 font-semibold">WemRofKip98!</span>).
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    2. Cryptographic Fisher-Yates Shuffle
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Guarantees at least one character from every active character pool (uppercase, lowercase, numbers, symbols) without positional bias.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    3. Shannon Entropy & Crack Time Estimation
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Shannon entropy bits are computed via <span className="font-mono">E = L × log₂(N)</span>. Crack time estimations assume a massive brute-force cluster executing 100 billion (10¹¹) guesses per second.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4 animate-fade-in">
              <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                Password Security FAQ
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Is length or complexity more important?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>Length is king.</strong> A 16-character pronounceable word or passphrase has exponentially higher mathematical search space than an 8-character complex string with symbols.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Why avoid "P@ssw0rd123" and simple substitutions?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modern cracking dictionaries use rulesets that automatically test substitutions like <code className="font-mono">@</code> for <code className="font-mono">a</code> and <code className="font-mono">0</code> for <code className="font-mono">o</code> in milliseconds.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Can jussword passwords be saved in password managers?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Yes! Click <strong>Copy</strong> or press <kbd className="font-mono px-1 py-0.5 bg-slate-200 dark:bg-white/10 rounded text-[10px]">C</kbd> to copy directly into 1Password, Bitwarden, Apple Keychain, Google Password Manager, or KeePass.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fade-in">
              <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" />
                Privacy & Offline Execution
              </h3>

              <p>
                Your privacy is guaranteed by architecture rather than just a policy:
              </p>

              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside">
                <li><strong>No Backend Transmission:</strong> Zero network API requests are made when generating passwords.</li>
                <li><strong>No Tracking or Analytics:</strong> We do not use third-party trackers, cookies, or user telemetry.</li>
                <li><strong>Works Offline:</strong> You can disconnect your internet or airplane mode and jussword will continue functioning flawlessly.</li>
                <li><strong>GDPR & CCPA Compliant:</strong> No personal identifiable information (PII) is ever collected or processed.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-[#0A0B12]/50 text-xs text-slate-400">
          <span>jussword • Free & Open Web Security</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function Speech(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M8.8 20v-4.1a6 6 0 0 1-3.8-5.6V10a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v.3a6 6 0 0 1-3.8 5.6V20l-3.2-2z"/>
    </svg>
  );
}
