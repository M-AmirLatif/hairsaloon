import React from 'react';

export interface BadgeProps {
  variant?: 'verified' | 'sample' | 'demo' | 'popular' | 'neutral' | 'dark';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    verified: 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40',
    sample: 'bg-amber-950/80 text-amber-300 border border-amber-600/40',
    demo: 'bg-[#2A241A] text-[#E0B873] border border-[#A67C38]/40',
    popular: 'bg-[#C9A96E] text-[#0F0F10] font-semibold shadow-xs',
    neutral: 'bg-[#2A2A2D] text-[#D8D4CC] border border-[#3A3A3E]',
    dark: 'bg-[#161618] text-[#A8A39D] border border-[#2A2A2D]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {variant === 'verified' && (
        <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {children}
    </span>
  );
};
