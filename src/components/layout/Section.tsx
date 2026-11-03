import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  variant?: 'dark' | 'dark-elevated' | 'light' | 'light-elevated';
  ariaLabelledby?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  variant = 'dark',
  ariaLabelledby,
  children,
  className = '',
  ...rest
}) => {
  const variantStyles = {
    dark: 'bg-[#0F0F10] text-[#F5F0E8]',
    'dark-elevated': 'bg-[#161618] text-[#F5F0E8]',
    light: 'bg-[#F5F0E8] text-[#1C1C1E]',
    'light-elevated': 'bg-[#ECE6DC] text-[#1C1C1E]',
  };

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`section-anchor py-16 md:py-24 relative overflow-hidden transition-colors ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
};
