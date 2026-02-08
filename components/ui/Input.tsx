import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-bold text-gray-300 mb-2 ml-2 uppercase tracking-wider text-xs">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:bg-black/40 focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all duration-200 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
            : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-error)] ml-2">{error}</p>
      )}
    </div>
  );
}
