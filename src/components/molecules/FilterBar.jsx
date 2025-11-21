import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  statusFilter, 
  priorityFilter, 
  searchText = "",
  onStatusFilterChange, 
  onPriorityFilterChange,
  onSearchTextChange,
  taskCounts = { all: 0, active: 0, completed: 0 }
}) => {
  const statusFilters = [
    { key: "all", label: "All Tasks", count: taskCounts.all, icon: "List" },
    { key: "active", label: "Active", count: taskCounts.active, icon: "Clock" },
    { key: "completed", label: "Completed", count: taskCounts.completed, icon: "CheckCircle" }
  ];

  const priorityFilters = [
    { key: "all", label: "All Priorities", icon: "Filter" },
    { key: "high", label: "High", icon: "AlertTriangle" },
    { key: "medium", label: "Medium", icon: "AlertCircle" },
    { key: "low", label: "Low", icon: "Info" }
  ];

return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 p-4 space-y-4">
      {/* Search Bar */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">Search Tasks</h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" className="w-4 h-4 text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchText && (
            <button
              onClick={() => onSearchTextChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {/* Status Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={statusFilter === filter.key ? "primary" : "secondary"}
              size="small"
              onClick={() => onStatusFilterChange(filter.key)}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                statusFilter === filter.key && "shadow-glow-primary"
              )}
            >
              <ApperIcon name={filter.icon} className="w-4 h-4" />
              <span>{filter.label}</span>
              {typeof filter.count === "number" && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs font-medium",
                  statusFilter === filter.key 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 text-slate-600"
                )}>
                  {filter.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">Filter by Priority</h3>
        <div className="flex flex-wrap gap-2">
          {priorityFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={priorityFilter === filter.key ? "primary" : "secondary"}
              size="small"
              onClick={() => onPriorityFilterChange(filter.key)}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                priorityFilter === filter.key && "shadow-glow-primary"
              )}
            >
              <ApperIcon 
                name={filter.icon} 
                className={cn(
                  "w-4 h-4",
                  filter.key === "high" && priorityFilter !== filter.key && "text-red-500",
                  filter.key === "medium" && priorityFilter !== filter.key && "text-amber-500",
                  filter.key === "low" && priorityFilter !== filter.key && "text-blue-500"
                )} 
              />
              <span>{filter.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;