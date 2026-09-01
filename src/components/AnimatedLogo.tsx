import { useState, useEffect } from 'react';

export function AnimatedLogo() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Start collapsed as j*, then expand after a gentle delay
    const timer = setTimeout(() => {
      setExpanded(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleReplay = () => {
    setExpanded(false);
    setTimeout(() => setExpanded(true), 300);
  };

  return (
    <button
      type="button"
      onClick={handleReplay}
      className="group flex items-center text-left focus:outline-none select-none py-1 transition-transform active:scale-95 cursor-pointer"
      title="j* → jussword (click to replay)"
      aria-label="jussword logo"
    >
      <div className="flex items-center text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        <span className="text-indigo-600 dark:text-indigo-400">j</span>
        <span
          className={`inline-block overflow-hidden whitespace-nowrap transition-all duration-500 ease-out ${
            expanded ? 'max-w-[120px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-1'
          }`}
        >
          ussword
        </span>
        <span
          className={`text-indigo-500 dark:text-indigo-400 font-mono text-base transition-all duration-300 ${
            expanded ? 'opacity-0 max-w-0 scale-75' : 'opacity-100 max-w-[14px] scale-100'
          }`}
        >
          *
        </span>
      </div>
    </button>
  );
}
