import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Empty from "@/components/ui/Empty";
import TaskCard from "@/components/molecules/TaskCard";
import { filterTasks } from "@/utils/taskUtils";

const TaskList = ({ 
  tasks, 
  statusFilter, 
  priorityFilter, 
  searchText,
  onComplete, 
  onUncomplete, 
  onEdit, 
  onDelete,
  onCreateTask
}) => {
const filteredTasks = filterTasks(tasks, statusFilter, priorityFilter, searchText);
  const activeTasks = filteredTasks.filter(task => !task.completed_c);
  const completedTasks = filteredTasks.filter(task => task.completed_c);
  // Show empty state if no tasks exist at all
  if (tasks.length === 0) {
    return (
      <Empty
        title="Ready to get organized?"
        message="Create your first task and start managing your workflow efficiently."
        actionLabel="Create Your First Task"
        onAction={onCreateTask}
        icon="CheckSquare"
      />
    );
  }

  // Show filtered empty state
  if (filteredTasks.length === 0) {
    const getEmptyMessage = () => {
      if (statusFilter === "active" && priorityFilter === "all") {
        return "No active tasks found. Time to create some!";
      } else if (statusFilter === "completed" && priorityFilter === "all") {
        return "No completed tasks yet. Finish some tasks to see them here.";
      } else if (priorityFilter !== "all") {
        return `No ${priorityFilter} priority tasks found.`;
      }
      return "No tasks match your current filters.";
    };

    return (
      <Empty
        title="No tasks found"
        message={getEmptyMessage()}
        actionLabel="Clear Filters"
        onAction={onCreateTask}
        icon="Filter"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            Active Tasks
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {activeTasks.length}
            </span>
          </h2>
          
<motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                  onUncomplete={onUncomplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
</AnimatePresence>
          </motion.div>
        </section>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
            Completed Tasks
            <span className="text-sm font-normal text-slate-500 bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {completedTasks.length}
            </span>
          </h2>
          
<motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                  onUncomplete={onUncomplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
))}
            </AnimatePresence>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default TaskList;