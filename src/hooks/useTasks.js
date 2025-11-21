import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateTaskId, sortTasks } from "@/utils/taskUtils";
import { toast } from "react-toastify";

export const useTasks = () => {
  const [tasks, setTasks] = useLocalStorage("taskflow-tasks", []);

  const addTask = (taskData) => {
    try {
      const newTask = {
        id: generateTaskId(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      };

      setTasks(prevTasks => sortTasks([...prevTasks, newTask]));
      toast.success("Task created successfully!");
      return newTask;
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  const updateTask = (id, updates) => {
    try {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        );
        return sortTasks(updatedTasks);
      });
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const completeTask = (id) => {
    try {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === id 
            ? { 
                ...task, 
                completed: true, 
                completedAt: new Date().toISOString() 
              }
            : task
        );
        return sortTasks(updatedTasks);
      });
      toast.success("Task completed! 🎉");
    } catch (error) {
      toast.error("Failed to complete task");
      console.error("Error completing task:", error);
    }
  };

  const uncompleteTask = (id) => {
    try {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === id 
            ? { 
                ...task, 
                completed: false, 
                completedAt: null 
              }
            : task
        );
        return sortTasks(updatedTasks);
      });
      toast.success("Task marked as active");
    } catch (error) {
      toast.error("Failed to uncomplete task");
      console.error("Error uncompleting task:", error);
    }
  };

  const deleteTask = (id) => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  return {
    tasks: sortTasks(tasks),
    addTask,
    updateTask,
    completeTask,
    uncompleteTask,
    deleteTask
  };
};