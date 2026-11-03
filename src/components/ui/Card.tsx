import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'light';
  hoverEffect?: boolean;
  as?: 'div' | 'article';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'dark',
  hoverEffect = true,
  as = 'div',
  children,
  className = '',
  ...rest
}) => {
  const Component = as;

  const variantStyles = {
    dark: 'bg-[#161618] border border-[#2A2A2D] text-[#F5F0E8]',
    light: 'bg-[#ECE6DC] border border-[#DDD6CA] text-[#1C1C1E]',
  };

  const hoverStyles = hoverEffect
    ? variant === 'dark'
      ? 'hover:border-[#C9A96E]/50 hover:shadow-lg hover:shadow-black/40 transition-all duration-300'
      : 'hover:border-[#5C4028]/40 hover:shadow-md transition-all duration-300'
    : '';

  return (
    <Component
      className={`rounded-xl overflow-hidden ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};
