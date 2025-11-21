import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No tasks yet",
  message = "Create your first task to get started with organizing your work.",
  actionLabel = "Create Task",
  onAction,
  icon = "CheckSquare",
  className 
}) => {
  return (
    <div className={cn("text-center py-16 px-4", className)}>
      <div className="max-w-md mx-auto">
        {/* Empty State Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-slate-500" />
        </div>

        {/* Empty State Content */}
        <h3 className="text-2xl font-semibold text-slate-900 mb-3">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Call to Action */}
        {onAction && (
          <Button 
            onClick={onAction}
            className="flex items-center gap-2 mx-auto shadow-glow-primary"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionLabel}
          </Button>
        )}

        {/* Visual Enhancement */}
        <div className="mt-8 opacity-50">
          <div className="flex justify-center items-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;