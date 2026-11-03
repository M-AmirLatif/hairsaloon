import React, { useId, forwardRef } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  required,
  options,
  className = '',
  id: customId,
  ...rest
}, ref) => {
  const generatedId = useId();
  const selectId = customId || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={selectId} className="text-xs md:text-sm font-medium text-[#F5F0E8] flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-[#C9A96E] ml-1" aria-hidden="true">*</span>}
        </span>
      </label>

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full appearance-none rounded-lg bg-[#161618] border px-3.5 py-2.5 pr-10 text-base md:text-sm text-[#F5F0E8] transition-colors focus:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E] min-h-[44px] cursor-pointer ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-[#303034] hover:border-[#424248]'
          } ${className}`}
          {...rest}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#161618] text-[#F5F0E8]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#A8A39D]" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? (
        <span id={errorId} className="text-xs text-red-400 font-medium" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="text-xs text-[#8A857B]">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
