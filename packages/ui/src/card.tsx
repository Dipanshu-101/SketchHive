import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}