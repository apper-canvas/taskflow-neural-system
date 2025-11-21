import React, { useState, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { useTasks } from "@/hooks/useTasks";
import { filterTasks } from "@/utils/taskUtils";
import { useAuth } from "@/layouts/Root";

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const formRef = useRef(null);
  const { logout } = useAuth();
  
  // Task management state and handlers from useTasks hook
  const taskManagement = useTasks();
  // Additional UI state for TaskManager
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Filter tasks based on current filters
  const filteredTasks = filterTasks(taskManagement.tasks, {
    status: statusFilter,
    priority: priorityFilter,
    search: searchText
  });

  // Calculate task counts
  const taskCounts = {
    all: taskManagement.tasks.length,
    pending: taskManagement.tasks.filter(t => !t.completed).length,
    completed: taskManagement.tasks.filter(t => t.completed).length,
    overdue: taskManagement.tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
  };

  const filteredTaskCounts = {
    all: filteredTasks.length,
    pending: filteredTasks.filter(t => !t.completed).length,
    completed: filteredTasks.filter(t => t.completed).length,
    overdue: filteredTasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
  };

  // Task handlers
  const handleCreateTask = (taskData) => {
    taskManagement.addTask(taskData);
    setShowForm(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
    scrollToForm();
  };

  const handleUpdateTask = (taskData) => {
    if (editingTask) {
      taskManagement.updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowForm(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Prepare context for TaskManager
  const outletContext = {
    tasks: taskManagement.tasks,
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
    completeTask: taskManagement.completeTask,
    uncompleteTask: taskManagement.uncompleteTask,
    deleteTask: taskManagement.deleteTask,
    formRef
  };

const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Analytics', href: '/analytics', icon: 'BarChart3' }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-primary to-secondary">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">TaskFlow</h1>
          </div>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => {
const isActive = item.href === '/' ? location.pathname === '/' : location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'
                  }`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-slate-500 hover:text-slate-600 lg:hidden"
                onClick={toggleSidebar}
              >
                <ApperIcon name="Menu" className="h-6 w-6" />
              </button>
              <div className="hidden lg:block">
<h2 className="text-lg font-semibold text-slate-900">
                  {navigation.find(nav => 
                    nav.href === '/' ? location.pathname === '/' : location.pathname === nav.href || location.pathname.startsWith(nav.href + '/')
                  )?.name || 'Dashboard'}
                </h2>
              </div>
</div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full">
                <ApperIcon name="Bell" className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full">
                <ApperIcon name="Settings" className="h-5 w-5" />
              </button>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full"
                title="Logout"
              >
                <ApperIcon name="LogOut" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
};

export default Layout;