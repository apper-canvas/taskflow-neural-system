export const generateTaskId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const filterTasks = (tasks, statusFilter, priorityFilter, searchText = "") => {
  return tasks.filter(task => {
    const statusMatch = statusFilter === "all" || 
                       (statusFilter === "active" && !task.completed_c) ||
                       (statusFilter === "completed" && task.completed_c);
    
    const priorityMatch = priorityFilter === "all" || task.priority_c === priorityFilter;
    
    const searchMatch = !searchText || 
                       task.title_c?.toLowerCase().includes(searchText.toLowerCase()) ||
                       task.description_c?.toLowerCase().includes(searchText.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });
};

export const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    // First, sort by completion status (incomplete first)
    if (a.completed_c !== b.completed_c) {
      return a.completed_c ? 1 : -1;
    }
    
    // Then by priority (high, medium, low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority_c !== b.priority_c) {
      return priorityOrder[a.priority_c] - priorityOrder[b.priority_c];
    }
    
    // Then by due date (earliest first)
    if (a.due_date_c && b.due_date_c) {
      return new Date(a.due_date_c) - new Date(b.due_date_c);
    } else if (a.due_date_c) {
      return -1;
    } else if (b.due_date_c) {
      return 1;
    }
    
    // Finally by creation date (newest first)
    return new Date(b.CreatedOn) - new Date(a.CreatedOn);
  });
};

export const getPriorityColor = (priority) => {
  const colors = {
    high: "text-red-600 bg-red-50 border-red-200",
    medium: "text-amber-600 bg-amber-50 border-amber-200",
    low: "text-blue-600 bg-blue-50 border-blue-200"
  };
  return colors[priority] || colors.low;
};

export const getPriorityGlow = (priority) => {
  const glows = {
    high: "priority-glow-high",
    medium: "priority-glow-medium", 
    low: "priority-glow-low"
  };
  return glows[priority] || "";
};