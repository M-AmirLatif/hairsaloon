import React from 'react';

export interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  target,
  rel,
  disabled,
  type = 'button',
  children,
  className = '',
  ...rest
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs md:text-sm px-3.5 py-2 min-h-[40px]',
    md: 'text-sm md:text-base px-5 py-2.5 min-h-[44px]',
    lg: 'text-base md:text-lg px-6 py-3 min-h-[48px]',
  };

  const variantStyles = {
    primary:
      'bg-[#C9A96E] text-[#0F0F10] hover:bg-[#DFC28E] active:bg-[#B89454] shadow-sm font-semibold focus-visible:outline-[#C9A96E]',
    secondary:
      'bg-[#2A2A2D] text-[#F5F0E8] hover:bg-[#35353A] border border-[#3A3A3E] focus-visible:outline-[#F5F0E8]',
    outline:
      'bg-transparent border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E]/10 active:bg-[#C9A96E]/20 focus-visible:outline-[#C9A96E]',
    'outline-light':
      'bg-transparent border border-[#5C4028] text-[#5C4028] hover:bg-[#5C4028]/10 active:bg-[#5C4028]/20 focus-visible:outline-[#5C4028]',
    ghost:
      'bg-transparent text-inherit hover:bg-white/5 active:bg-white/10 focus-visible:outline-current',
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
    fullWidth ? 'w-full' : ''
  } ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' && !rel ? 'noopener noreferrer' : rel}
        className={combinedStyles}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedStyles}
      disabled={disabled}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};
