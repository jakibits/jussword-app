import { useTheme } from '../context/theme-context';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { hapticClick } from '../utils/haptics';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        closeDropdown();
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDropdown]);

  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'System', icon: Monitor },
  ] as const;

  const currentOption = options.find((opt) => opt.value === theme) || options[2];
  const CurrentIcon = currentOption.icon;

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          hapticClick();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current theme: ${theme}. Click to change theme`}
        className="group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-white/80 dark:bg-[#141622]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-white dark:hover:bg-[#1C1F30] hover:border-slate-300 dark:hover:border-white/20 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
        <span className="capitalize">{currentOption.label}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label="Theme options"
          className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-[#141622] border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-900/10 dark:shadow-black/40 z-50 p-1 dropdown-enter backdrop-blur-xl"
        >
          {options.map(({ value, label, icon: Icon }) => {
            const isSelected = theme === value;
            return (
              <button
                key={value}
                role="menuitem"
                onClick={() => {
                  hapticClick();
                  setTheme(value);
                  closeDropdown();
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
