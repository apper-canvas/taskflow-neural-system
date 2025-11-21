import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, itemCount = 3 }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-card border border-slate-200 p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            {/* Checkbox skeleton */}
            <div className="flex-shrink-0 pt-1">
              <div className="w-5 h-5 rounded border-2 border-slate-200 bg-slate-100" />
            </div>

            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between gap-2">
                {/* Title */}
                <div className="h-5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded flex-1 max-w-xs" />
                {/* Priority badge */}
                <div className="h-6 w-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-full" />
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-3/4" />
              </div>

              {/* Due date */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded" />
                <div className="h-6 w-20 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;