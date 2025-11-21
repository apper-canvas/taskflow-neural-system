import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";
import { sortTasks } from "@/utils/taskUtils";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await taskService.getAll();
      setTasks(sortTasks(fetchedTasks || []));
    } catch (err) {
      setError(err.message);
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      // Map form data to database fields
      const dbTaskData = {
        title_c: taskData.title || taskData.title_c,
        description_c: taskData.description || taskData.description_c,
        priority_c: taskData.priority || taskData.priority_c || "medium",
        due_date_c: taskData.dueDate || taskData.due_date_c,
        completed_c: false,
        completed_at_c: null,
        attachments_c: taskData.attachments || taskData.attachments_c || [],
        Tags: taskData.tags || taskData.Tags || ""
      };

      const newTask = await taskService.create(dbTaskData);
      if (newTask) {
        await loadTasks(); // Reload to get fresh data
        return newTask;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setError(error.message);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      // Map form data to database fields
      const dbUpdates = {
        title_c: updates.title || updates.title_c,
        description_c: updates.description || updates.description_c,
        priority_c: updates.priority || updates.priority_c,
        due_date_c: updates.dueDate || updates.due_date_c,
        completed_c: updates.completed !== undefined ? updates.completed : updates.completed_c,
        completed_at_c: updates.completedAt || updates.completed_at_c,
        attachments_c: updates.attachments || updates.attachments_c,
        Tags: updates.tags || updates.Tags
      };

      const updatedTask = await taskService.update(id, dbUpdates);
      if (updatedTask) {
        await loadTasks(); // Reload to get fresh data
        return updatedTask;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError(error.message);
    }
  };

  const completeTask = async (id) => {
    try {
      const updates = {
        completed_c: true,
        completed_at_c: new Date().toISOString()
      };
      
      const updatedTask = await taskService.update(id, updates);
      if (updatedTask) {
        await loadTasks(); // Reload to get fresh data
        return updatedTask;
      }
    } catch (error) {
      console.error("Error completing task:", error);
      setError(error.message);
    }
  };

  const uncompleteTask = async (id) => {
    try {
      const updates = {
        completed_c: false,
        completed_at_c: null
      };
      
      const updatedTask = await taskService.update(id, updates);
      if (updatedTask) {
        await loadTasks(); // Reload to get fresh data
        return updatedTask;
      }
    } catch (error) {
      console.error("Error uncompleting task:", error);
      setError(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const success = await taskService.delete(id);
      if (success) {
        await loadTasks(); // Reload to get fresh data
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setError(error.message);
    }
    return false;
  };

  return {
    tasks: sortTasks(tasks),
    loading,
    error,
    addTask,
    updateTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    refreshTasks: loadTasks
  };
};