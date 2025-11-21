import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { formatDateForInput } from "@/utils/dateUtils";
import { cn } from "@/utils/cn";

const TaskForm = ({ 
  onSubmit, 
  onCancel, 
  initialTask = null,
  isEditing = false 
}) => {
const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    priority_c: "medium",
    due_date_c: "",
    attachments_c: []
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [errors, setErrors] = useState({});

// Initialize form with task data if editing
useEffect(() => {
    if (initialTask) {
      setFormData({
        title_c: initialTask.title_c || "",
        description_c: initialTask.description_c || "",
        priority_c: initialTask.priority_c || "medium",
        due_date_c: initialTask.due_date_c ? formatDateForInput(initialTask.due_date_c) : "",
        attachments_c: initialTask.attachments_c || []
      });
      setUploadedFiles(initialTask.attachments_c || []);
    }
  }, [initialTask]);

const handleSubmitWithFiles = async (submissionData) => {
    try {
      // Get files from ApperFileFieldComponent
      const { ApperFileUploader } = window.ApperSDK;
      const files = await ApperFileUploader.FileField.getFiles('attachments_c');
      
      // Merge form data with files
      const finalData = {
        ...submissionData,
        attachments_c: files || uploadedFiles
      };
      
      onSubmit(finalData);
    } catch (error) {
      console.error('Error getting files:', error);
      // Fallback to form data without files
      onSubmit({
        ...submissionData,
        attachments_c: uploadedFiles
      });
    }
  };
  const validateForm = () => {
    const newErrors = {};

if (!formData.title_c.trim()) {
      newErrors.title_c = "Task title is required";
    }

    if (formData.due_date_c) {
      const selectedDate = new Date(formData.due_date_c);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.due_date_c = "Due date cannot be in the past";
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
      title_c: formData.title_c.trim(),
      description_c: formData.description_c.trim(),
      due_date_c: formData.due_date_c || null,
      attachments_c: formData.attachments_c || []
    };

handleSubmitWithFiles(taskData);
    
    // Reset form if not editing
if (!isEditing) {
      setFormData({
        title_c: "",
        description_c: "",
        priority_c: "medium",
        due_date_c: "",
        attachments_c: []
      });
      setErrors({});
      setUploadedFiles([]);
    }
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
        title_c: "",
        description_c: "",
        priority_c: "medium",
        due_date_c: "",
        attachments_c: []
      });
      setUploadedFiles([]);
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
          value={formData.title_c}
          onChange={(e) => handleChange("title_c", e.target.value)}
          placeholder="What needs to be done?"
          className={cn(
            "w-full",
            errors.title_c && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {errors.title_c && (
          <p className="text-sm text-red-600">{errors.title_c}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="task-description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <Textarea
          id="task-description"
value={formData.description_c}
          onChange={(e) => handleChange("description_c", e.target.value)}
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
value={formData.priority_c}
            onChange={(e) => handleChange("priority_c", e.target.value)}
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
            value={formData.due_date_c}
            onChange={(e) => handleChange("due_date_c", e.target.value)}
            className={cn(errors.due_date_c && "border-red-300 focus:border-red-500 focus:ring-red-500/20")}
          />
          {errors.due_date_c && (
            <p className="text-sm text-red-600">{errors.due_date_c}</p>
          )}
</div>
      </div>
      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Attachments
        </label>
        <ApperFileFieldComponent
          elementId="task-attachments"
          config={{
            fieldKey: 'attachments_c',
            fieldName: 'attachments_c',
            tableName: 'tasks_c',
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
            existingFiles: uploadedFiles,
            fileCount: uploadedFiles.length
          }}
        />
      </div>
      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button 
          type="submit" 
          className="flex items-center gap-2"
disabled={!formData.title_c.trim()}
        >
          <ApperIcon name={isEditing ? "Save" : "Plus"} className="w-4 h-4" />
          {isEditing ? "Update Task" : "Add Task"}
        </Button>
        
{(isEditing || formData.title_c || formData.description_c) && (
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