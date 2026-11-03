import React from 'react';

export interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  variant?: 'dark' | 'light';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  eyebrow,
  title,
  subtitle,
  align = 'center',
  variant = 'dark',
  className = '',
}) => {
  const isLight = variant === 'light';

  const eyebrowColor = isLight ? 'text-[#5C4028] bg-[#DDD6CA]/60' : 'text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E]/20';
  const titleColor = isLight ? 'text-[#1C1C1E]' : 'text-[#F5F0E8]';
  const subtitleColor = isLight ? 'text-[#57534E]' : 'text-[#A8A39D]';

  return (
    <div
      className={`max-w-3xl mb-12 md:mb-16 ${
        align === 'center' ? 'mx-auto text-center' : 'text-left'
      } ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-xs md:text-sm font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3.5 ${eyebrowColor}`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className={`font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${titleColor}`}
        style={{ textWrap: 'balance' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
