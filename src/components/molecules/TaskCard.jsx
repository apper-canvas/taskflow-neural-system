import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { formatDueDate, getDueDateStatus } from "@/utils/dateUtils";
import { getPriorityColor, getPriorityGlow } from "@/utils/taskUtils";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TaskCard = ({ 
  task, 
  onComplete, 
  onUncomplete, 
  onEdit, 
  onDelete 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dueDateStatus = getDueDateStatus(task.dueDate);

  const handleToggleComplete = () => {
    if (task.completed) {
      onUncomplete(task.id);
    } else {
      onComplete(task.id);
    }
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const getDueDateColor = (status) => {
    switch (status) {
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200";
      case "soon":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "upcoming":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group bg-white rounded-xl shadow-card border border-slate-200 p-4 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1",
        task.completed && "opacity-75",
        !task.completed && getPriorityGlow(task.priority)
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={cn(
              "font-medium text-slate-900 leading-tight",
              task.completed && "line-through text-slate-500"
            )}>
              {task.title}
            </h3>
            
            {/* Priority Badge */}
            <Badge variant={task.priority} className="flex-shrink-0">
              <ApperIcon 
                name={task.priority === "high" ? "AlertTriangle" : 
                      task.priority === "medium" ? "AlertCircle" : "Info"} 
                className="w-3 h-3 mr-1" 
              />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>

          {/* Description */}
          {task.description && (
            <p className={cn(
              "text-sm text-slate-600 mb-3 leading-relaxed",
              task.completed && "line-through text-slate-400"
            )}>
              {task.description}
            </p>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-2 mb-3">
              <ApperIcon 
                name="Calendar" 
                className={cn(
                  "w-4 h-4",
                  dueDateStatus === "overdue" && "text-red-500",
                  dueDateStatus === "soon" && "text-amber-500",
                  dueDateStatus === "upcoming" && "text-green-500"
                )} 
              />
              <Badge 
                className={cn(
                  "text-xs",
                  getDueDateColor(dueDateStatus)
                )}
              >
                {formatDueDate(task.dueDate)}
              </Badge>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="small"
              onClick={() => onEdit(task)}
              className="text-slate-500 hover:text-primary"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-slate-500 hover:text-red-500"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 pt-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">Delete this task?</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;