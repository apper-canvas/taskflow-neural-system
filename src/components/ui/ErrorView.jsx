import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your tasks. Please try again.",
  onRetry,
  className 
}) => {
  return (
    <div className={cn("text-center py-12 px-4", className)}>
      <div className="bg-white rounded-xl shadow-card border border-slate-200 p-8 max-w-md mx-auto">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
        </div>

        {/* Error Content */}
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="flex items-center gap-2 mx-auto"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;