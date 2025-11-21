import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { formatDateForInput } from "@/utils/dateUtils";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskForm = ({ 
  onSubmit, 
  onCancel, 
  initialTask = null,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });

  const [errors, setErrors] = useState({});

  // Initialize form with task data if editing
  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || "",
        description: initialTask.description || "",
        priority: initialTask.priority || "medium",
        dueDate: initialTask.dueDate ? formatDateForInput(initialTask.dueDate) : ""
      });
    }
  }, [initialTask]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null
    };

    onSubmit(taskData);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: ""
      });
    }
    
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (!isEditing) {
      // Reset form for new task
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: ""
      });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="task-title" className="block text-sm font-medium text-slate-700">
          Task Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="task-title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="What needs to be done?"
          className={cn(errors.title && "border-red-300 focus:border-red-500 focus:ring-red-500/20")}
        />
        {errors.title && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <ApperIcon name="AlertCircle" className="w-4 h-4" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="task-description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <Textarea
          id="task-description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add more details... (optional)"
          rows={3}
        />
      </div>

      {/* Priority and Due Date Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Priority */}
        <div className="space-y-2">
          <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700">
            Priority
          </label>
          <Select
            id="task-priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label htmlFor="task-due-date" className="block text-sm font-medium text-slate-700">
            Due Date
          </label>
          <Input
            id="task-due-date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            className={cn(errors.dueDate && "border-red-300 focus:border-red-500 focus:ring-red-500/20")}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <ApperIcon name="AlertCircle" className="w-4 h-4" />
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button 
          type="submit" 
          className="flex items-center gap-2"
          disabled={!formData.title.trim()}
        >
          <ApperIcon name={isEditing ? "Save" : "Plus"} className="w-4 h-4" />
          {isEditing ? "Update Task" : "Add Task"}
        </Button>
        
        {(isEditing || formData.title || formData.description) && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ApperIcon name="X" className="w-4 h-4" />
            {isEditing ? "Cancel" : "Clear"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;