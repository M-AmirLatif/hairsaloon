import React from 'react';
import type { SalonIdentity } from '../../config/schema';

interface BrandLogoProps {
  identity: SalonIdentity;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  identity,
  variant = 'dark',
  size = 'md',
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-[#1C1C1E]' : 'text-[#F5F0E8]';
  const accentColor = 'text-[#C9A96E]';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-2xl md:text-3xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Refined Geometric Scissors & Comb Emblem */}
      <div
        className={`${iconSizes[size]} rounded-lg bg-[#161618] border border-[#C9A96E]/30 flex items-center justify-center p-1.5 shadow-sm shrink-0`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-[#C9A96E]">
          <path
            d="M12 11C12 9.5 13.5 8 15 8C16.5 8 18 9.5 18 11C18 12.5 16.5 14 15 14H13.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M16.5 13.5L27 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M27 11C27 9.5 25.5 8 24 8C22.5 8 21 9.5 21 11C21 12.5 22.5 14 24 14H25.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M22.5 13.5L12 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="19.5" cy="21.5" r="2" fill="currentColor" />
          <path d="M11 34H28" stroke="#9C7A56" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 34V37M18 34V37M22 34V37M26 34V37" stroke="#9C7A56" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-heading font-bold tracking-wider ${textColor} ${textSizes[size]}`}>
          {identity.logoText}
        </span>
        <span className={`text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold ${accentColor}`}>
          {identity.logoAccentText}
        </span>
      </div>
    </div>
  );
};
