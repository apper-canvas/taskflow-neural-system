import React from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import TaskList from "@/components/organisms/TaskList";
import Header from "@/components/organisms/Header";
import TaskForm from "@/components/molecules/TaskForm";
import FilterBar from "@/components/molecules/FilterBar";
import { filterTasks } from "@/utils/taskUtils";

const TaskManager = () => {
  // Get all state and handlers from outlet context
  const {
tasks,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchText,
    setSearchText,
    editingTask,
    showForm,
    setShowForm,
    taskCounts,
    filteredTaskCounts,
    handleCreateTask,
    handleEditTask,
    handleUpdateTask,
    handleCancelEdit,
    scrollToForm,
    completeTask,
    uncompleteTask,
    deleteTask
  } = useOutletContext();
  return (
<div className="p-6">
      {/* Dashboard Stats */}
      <Header taskCount={taskCounts} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Task Form Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            id="task-form"
            className="bg-white rounded-xl shadow-card border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Plus" className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingTask ? "Edit Task" : "Create New Task"}
                </h2>
              </div>
              
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  <ApperIcon name="ChevronDown" className="w-5 h-5" />
                </button>
              )}
            </div>

            {(showForm || editingTask) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskForm
                  onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                  onCancel={editingTask ? handleCancelEdit : () => setShowForm(false)}
                  initialTask={editingTask}
                  isEditing={!!editingTask}
                />
              </motion.div>
            )}
          </motion.section>

          {/* Filters Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
<FilterBar
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              searchText={searchText}
              onStatusFilterChange={setStatusFilter}
              onPriorityFilterChange={setPriorityFilter}
              onSearchTextChange={setSearchText}
              taskCounts={filteredTaskCounts}
            />
          </motion.section>

          {/* Task List Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
<TaskList
              tasks={tasks}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              searchText={searchText}
              onComplete={completeTask}
              onUncomplete={uncompleteTask}
              onEdit={handleEditTask}
              onDelete={deleteTask}
              onCreateTask={scrollToForm}
            />
          </motion.section>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        onClick={scrollToForm}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 active:scale-95 lg:hidden"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default TaskManager;