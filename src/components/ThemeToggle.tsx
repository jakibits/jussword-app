import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 200);
    } else {
      setIsOpen(true);
      setIsAnimating(true);
    }
  };

  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Monitor }
  ] as const;

  const currentOption = options.find(opt => opt.value === theme);
  const CurrentIcon = currentOption?.icon || Monitor;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={handleToggle}
        className="p-2.5 rounded-lg border border-[#E5E5E5] bg-white hover:border-[#0055FF] hover:bg-[#FAFAFA] dark:bg-[#1A1A1A] dark:border-[#333333] dark:hover:border-[#0055FF] dark:hover:bg-[#252525] transition-all duration-200 flex items-center gap-2"
        title={`Theme: ${theme}`}
      >
        <CurrentIcon className="w-4 h-4 text-[#111111] dark:text-[#EEEEEE]" />
        <span className="text-xs font-medium text-[#666666] dark:text-[#999999]">
          {theme === 'auto' ? 'Auto' : theme.charAt(0).toUpperCase() + theme.slice(1)}
        </span>
      </button>

      {(isOpen || isAnimating) && (
        <div className={`absolute right-0 mt-2 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333333] rounded-lg shadow-lg z-50 min-w-[180px] py-1 ${isOpen ? 'dropdown-enter' : 'dropdown-exit'}`}>
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setIsAnimating(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsAnimating(false);
                }, 200);
              }}
              className={`w-full px-4 py-2.5 flex items-center gap-2 text-sm transition-all duration-150 ${
                theme === value
                  ? 'bg-[#F0F0F0] dark:bg-[#252525] text-[#0055FF] font-medium'
                  : 'text-[#666666] dark:text-[#999999] hover:bg-[#F9F9F9] dark:hover:bg-[#202020]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {theme === value && (
                <span className="ml-auto text-[#0055FF]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
