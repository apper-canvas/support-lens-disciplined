import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    critical: "bg-error-100 text-error-800",
    warning: "bg-warning-100 text-warning-800",
    info: "bg-primary-100 text-primary-800",
    success: "bg-success-100 text-success-800",
    technical: "bg-orange-100 text-orange-800"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;