export const generateTaskId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const filterTasks = (tasks, statusFilter, priorityFilter, searchText = "") => {
  return tasks.filter(task => {
    const statusMatch = statusFilter === "all" || 
                       (statusFilter === "active" && !task.completed) ||
                       (statusFilter === "completed" && task.completed);
    
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter;
    
    const searchMatch = !searchText || 
                       task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                       task.description?.toLowerCase().includes(searchText.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });
};

export const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    // First, sort by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority (high, medium, low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }
    
    // Finally by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
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