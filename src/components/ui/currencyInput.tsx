import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
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
  value?: string | number;
  onChange?: (value: string) => void;
};

export default function CurrencyInput({
  id,
  label,
  placeholder,
  className = '',
  inputProps,
  error,
  value: externalValue,
  onChange: externalOnChange,
}: Props) {
  // RHF may supply a callback ref function; keep our own DOM ref
  const innerRef = useRef<HTMLInputElement>(null);

  const {
    ref: rhfRef,
    onChange: originalOnChange,
    onBlur: originalOnBlur,
    value: rhfValue,
    ...restInputProps
  } = inputProps || {};

  // Merge refs utility
  const setInputRefs = (el: HTMLInputElement | null) => {
    innerRef.current = el;
    if (typeof rhfRef === 'function') {
      rhfRef(el);
    } else if (rhfRef && 'current' in rhfRef) {
      (rhfRef as MutableRefObject<HTMLInputElement | null>).current = el;
    }
  };
  
  // Support both react-hook-form (via inputProps) and plain state (via value/onChange props)
  const currentValue = externalValue !== undefined ? externalValue : rhfValue;
  const handleExternalChange = externalOnChange;
  
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  // Update display when value prop changes (for edit mode or external changes)
  useEffect(() => {
    if (isFocused) {
      // While focused, show raw numeric text (if external value changes mid-focus)
      if (currentValue !== undefined && currentValue !== null) {
        setDisplayValue(String(currentValue).replace(/[^\d.-]/g, ''));
      }
      return;
    }

    // Only react to external value if it is explicitly provided.
    if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
      const numericStr = String(currentValue).replace(/[^\d.-]/g, '');
      const num = parseFloat(numericStr);
      if (!isNaN(num) && isFinite(num)) {
        setDisplayValue(formatCurrency(num));
      }
    }
  }, [currentValue, isFocused]);

  // Handle uncontrolled RHF default value (edit mode)
  useEffect(() => {
    if (!isFocused && displayValue === '' && innerRef.current) {
      const el = innerRef.current;
      if (el && el.value) {
        const numericStr = el.value.replace(/[^\d.-]/g, '');
        const num = parseFloat(numericStr);
        if (!isNaN(num) && isFinite(num)) {
          setDisplayValue(formatCurrency(num));
        }
      }
    }
  }, [isFocused, displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^\d.-]/g, '');
    // update display with raw numeric (no formatting) while typing
    setDisplayValue(numericValue);

    // propagate to external handlers / RHF
    if (innerRef.current) {
      innerRef.current.value = numericValue;
    }
    if (handleExternalChange) handleExternalChange(numericValue);
    if (originalOnChange) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: numericValue },
      };
      originalOnChange(syntheticEvent as any);
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const numericStr = e.target.value.replace(/[^\d.-]/g, '');
    const num = parseFloat(numericStr);
    if (!isNaN(num) && isFinite(num)) {
      setDisplayValue(formatCurrency(num));
    } else {
      setDisplayValue('');
    }

    // propagate RHF onBlur
    if (originalOnBlur) {
      originalOnBlur(e);
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
          ref={setInputRefs}
          value={displayValue}
          {...restInputProps}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="block w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}
