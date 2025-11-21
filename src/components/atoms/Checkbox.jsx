import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ className, checked = false, onChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-95",
        checked 
          ? "bg-gradient-to-r from-primary to-secondary border-primary text-white shadow-glow-primary" 
          : "border-slate-300 bg-white hover:border-primary/50",
        className
      )}
      onClick={() => onChange?.(!checked)}
      ref={ref}
      {...props}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          className="w-3 h-3 animate-scale-in" 
        />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;