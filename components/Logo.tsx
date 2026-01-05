
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizes = {
    sm: { box: 'w-8 h-8', text: 'text-lg', icon: 'w-4 h-4' },
    md: { box: 'w-10 h-10', text: 'text-xl', icon: 'w-5 h-5' },
    lg: { box: 'w-16 h-16', text: 'text-4xl', icon: 'w-8 h-8' }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className={`${sizes[size].box} bg-indigo-600 dark:bg-white rounded-xl flex items-center justify-center relative shadow-xl shrink-0 group overflow-hidden`}>
        <div className="absolute inset-0 rx-accent-gradient opacity-100 transition-opacity"></div>
        <span className={`${sizes[size].icon} text-white dark:text-space-950 font-black flex items-center justify-center z-10 mono-num`}>
          X
        </span>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full border-2 border-white dark:border-space-950 shadow-sm"></div>
      </div>
      
      {showText && (
        <h1 className={`${sizes[size].text} font-black tracking-tighter text-space-950 dark:text-white leading-none`}>
          Rupee<span className="text-indigo-600 dark:text-indigo-500">X</span>
        </h1>
      )}
    </div>
  );
};

export default Logo;
