import React, { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { formatCurrency } from '@/utils/currencyFormatter';

type RHFCompatibleInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

type Props = {
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
  inputProps?: RHFCompatibleInputProps;
  error?: FieldError | undefined;
};

export default function CurrencyInput({
  id,
  label,
  placeholder,
  className = '',
  inputProps,
  error,
}: Props) {
  const { ref: inputRef, onChange: originalOnChange, value, ...restInputProps } = inputProps || {};
  const [displayValue, setDisplayValue] = useState<string>(String(value || '') || '');

  // Update display when value prop changes (for edit mode)
  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Store only numeric value in the input's actual value
    const numericValue = inputValue.replace(/[^\d.-]/g, '');

    // Update the input's actual value (this gets stored in form state)
    if (inputRef && 'current' in inputRef) {
      (inputRef.current as HTMLInputElement).value = numericValue;
    }

    // Update display value with formatting
    if (numericValue === '' || numericValue === '-') {
      setDisplayValue('');
    } else {
      const num = parseFloat(numericValue);
      if (!isNaN(num)) {
        setDisplayValue(formatCurrency(num));
      }
    }

    // Call the original onChange from react-hook-form
    if (originalOnChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericValue,
        },
      };
      originalOnChange(syntheticEvent as any);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // When focused, show just the numeric value for editing
    const numericValue = e.target.value.replace(/[^\d.-]/g, '');
    setDisplayValue(numericValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // When blurred, show formatted value
    const numericValue = e.target.value;
    if (numericValue && numericValue !== '-') {
      const num = parseFloat(numericValue);
      if (!isNaN(num)) {
        setDisplayValue(formatCurrency(num));
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          ref={inputRef as any}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="block w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
          {...restInputProps}
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}
