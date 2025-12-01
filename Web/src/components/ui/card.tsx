import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-panel rounded-xl p-6 transition-all duration-300",
          hoverEffect && "hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,163,255,0.15)] hover:border-primary/30",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
