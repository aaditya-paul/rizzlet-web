import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({
  className = "",
  children,
  hoverEffect = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`glass-panel rounded-3xl p-8 ${
        hoverEffect
          ? "hover:bg-[var(--color-surface-hover)] hover:-translate-y-1 hover:border-[var(--color-primary)]/30 transition-all duration-300"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
