import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { formatDateForInput } from "@/utils/dateUtils";
import { cn } from "@/utils/cn";
import { toast } from "react-hot-toast";

const FileUpload = ({ attachments, onAttachmentsChange, maxFiles = 5, maxSize = 5 * 1024 * 1024 }) => {
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }
    return null;
  };

  const processFiles = (files) => {
    const fileList = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileList.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else if (attachments.length + validFiles.length < maxFiles) {
        validFiles.push(file);
      } else {
        errors.push(`Maximum ${maxFiles} files allowed`);
      }
    });

    if (errors.length > 0) {
      toast.error(`Upload failed: ${errors[0]}`);
    }

    if (validFiles.length > 0) {
      const newAttachments = [...attachments];
      
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const attachment = {
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: e.target.result,
            uploadedAt: new Date().toISOString()
          };
          newAttachments.push(attachment);
          onAttachmentsChange([...newAttachments]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(newAttachments);
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-slate-300 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <ApperIcon name="Upload" className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 mb-1">
            Drag files here or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-slate-500">
            Max {maxFiles} files, up to {Math.round(maxSize / (1024 * 1024))}MB each
          </p>
        </label>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Attached Files</h4>
          {attachments.map((attachment, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                <ApperIcon 
                  name={attachment.type?.startsWith('image/') ? 'Image' : 'File'} 
                  size={16} 
                  className="text-slate-500" 
                />
                <div>
                  <p className="text-sm font-medium text-slate-700">{attachment.name}</p>
                  <p className="text-xs text-slate-500">
                    {(attachment.size / 1024).toFixed(0)}KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-slate-400 hover:text-red-500 transition-colors duration-200"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
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
    dueDate: "",
    attachments: []
  });

  const [errors, setErrors] = useState({});

// Initialize form with task data if editing
  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || "",
        description: initialTask.description || "",
        priority: initialTask.priority || "medium",
        dueDate: initialTask.dueDate ? formatDateForInput(initialTask.dueDate) : "",
        attachments: initialTask.attachments || []
      });
    }
  }, [initialTask]);

  const handleAttachmentsChange = (newAttachments) => {
    setFormData(prev => ({
      ...prev,
      attachments: newAttachments
    }));
  };
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
      dueDate: formData.dueDate || null,
      attachments: formData.attachments || []
    };

    onSubmit(taskData);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        title: "",
        description: "",
priority: "medium",
        dueDate: "",
        attachments: []
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
        dueDate: "",
        attachments: []
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
        
        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Attachments
          </label>
          <FileUpload 
            attachments={formData.attachments}
            onAttachmentsChange={handleAttachmentsChange}
          />
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