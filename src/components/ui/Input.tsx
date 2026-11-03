import React, { useId, forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  variant?: 'dark' | 'light';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  required,
  variant = 'dark',
  className = '',
  id: customId,
  ...rest
}, ref) => {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const isLight = variant === 'light';
  const labelColor = isLight ? 'text-[#1C1C1E]' : 'text-[#F5F0E8]';
  const helperColor = isLight ? 'text-[#57534E]' : 'text-[#D1CCC2]';
  const inputStyle = isLight
    ? 'bg-[#F5F0E8] text-[#1C1C1E] placeholder-[#736E65] border-[#DDD6CA] hover:border-[#5C4028]/40 focus:bg-white focus:ring-[#5C4028]'
    : 'bg-[#161618] text-[#F5F0E8] placeholder-[#9E9A91] border-[#303034] hover:border-[#424248] focus:bg-[#1C1C1E] focus:ring-[#C9A96E]';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className={`text-xs md:text-sm font-medium ${labelColor} flex items-center justify-between`}>
        <span>
          {label}
          {required && <span className={isLight ? 'text-[#5C4028] ml-1' : 'text-[#C9A96E] ml-1'} aria-hidden="true">*</span>}
        </span>
      </label>

      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-base md:text-sm transition-colors focus:outline-none focus:ring-2 min-h-[44px] ${
          error ? 'border-red-500 focus:ring-red-500' : inputStyle
        } ${className}`}
        {...rest}
      />

      {error ? (
        <span id={errorId} className="text-xs text-red-500 font-medium" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className={`text-xs ${helperColor}`}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
