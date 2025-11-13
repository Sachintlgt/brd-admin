// src/components/ui/FormInput.tsx
import React from "react";
import { FieldError } from "react-hook-form";

type Props = {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: FieldError | undefined;
};

export default function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  icon,
  right,
  className = "",
  inputProps,
  error,
}: Props) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-blue-100">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 text-white placeholder-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
          {...inputProps}
        />
        {right && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{right}</div>}
      </div>
      {error && <p className="text-red-200 text-sm">{error.message}</p>}
    </div>
  );
}
