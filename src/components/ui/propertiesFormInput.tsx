// src/components/ui/FormInput.tsx
import React from 'react';
import { FieldError } from 'react-hook-form';

type RHFCompatibleInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

type Props = {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  inputProps?: RHFCompatibleInputProps;
  error?: FieldError | undefined;
};

export default function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  icon,
  right,
  className = '',
  inputProps,
  error,
}: Props) {
  const { ref: inputRef, ...restInputProps } = inputProps || {};

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          ref={inputRef as any}
          className="block w-full pl-10 pr-12 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
          {...restInputProps}
        />
        {right && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{right}</div>}
      </div>
      {error && (
        <>
          <p className="text-red-600 text-sm">{error.message}</p>
        </>
      )}
    </div>
  );
}
