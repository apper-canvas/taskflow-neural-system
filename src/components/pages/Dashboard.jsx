import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { useTasks } from '@/hooks/useTasks';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
const { tasks, loading, error } = useTasks();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

useEffect(() => {
    if (tasks) {
      const now = new Date();
      const completed = tasks.filter(task => task.completed_c).length;
      const pending = tasks.filter(task => !task.completed_c).length;
      const overdue = tasks.filter(task => 
        !task.completed_c && task.due_date_c && new Date(task.due_date_c) < now
      ).length;

      setStats({
        total: tasks.length,
        completed,
        pending,
        overdue
      });
    }
  }, [tasks]);

  const recentTasks = tasks?.slice(0, 5) || [];
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <ApperIcon name="Loader2" size={24} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to TaskFlow</h1>
        <p className="text-blue-100">Manage your tasks efficiently and stay productive</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ApperIcon name="CheckSquare" size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <ApperIcon name="Clock" size={24} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Tasks</h2>
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
task.priority_c === 'high' ? 'bg-red-500' :
                      task.priority_c === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
{task.title_c}
                      </p>
{task.due_date_c && (
                        <p className="text-sm text-slate-500">
                          Due {formatDistanceToNow(new Date(task.due_date_c), { addSuffix: true })}
                        </p>
                      )}
                    </div>
</div>
                  <Badge variant={task.completed_c ? 'success' : 'secondary'}>
                    {task.completed_c ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckSquare" size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tasks yet. Create your first task to get started!</p>
                <Link to="/tasks" className="mt-3 inline-block">
                  <Button>Create Task</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Completion Rate</span>
                <span className="text-sm font-semibold text-slate-900">{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-600 mb-3">Priority Distribution</h3>
              <div className="space-y-2">
                {['high', 'medium', 'low'].map(priority => {
const count = tasks?.filter(task => task.priority_c === priority && !task.completed_c).length || 0;
                  const percentage = stats.pending > 0 ? Math.round((count / stats.pending) * 100) : 0;
                  const colorClass = priority === 'high' ? 'bg-red-500' : 
                                   priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500';
                  
                  return (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                        <span className="text-sm capitalize text-slate-600">{priority}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{count} ({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;