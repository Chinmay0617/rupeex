
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
      {/* Container for the logo image */}
      <div className={`${sizes[size].box} relative shrink-0`}>
        <img
          src="/logo.png"
          alt="RupeeX Logo"
          className="w-full h-full object-contain drop-shadow-2xl filter brightness-110 saturate-125"
        />
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
