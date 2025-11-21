import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    high: "bg-red-50 text-red-700 border-red-200 shadow-sm",
    medium: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm",
    low: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm",
    success: "bg-green-50 text-green-700 border-green-200 shadow-sm"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;