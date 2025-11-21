import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { useTasks } from '@/hooks/useTasks';
import { formatDistanceToNow, startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks, isWithinInterval } from 'date-fns';
import Chart from 'react-apexcharts';

const Analytics = () => {
  const { tasks, loading, error } = useTasks();
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [chartData, setChartData] = useState({
    completion: { series: [], options: {} },
    priority: { series: [], options: {} },
    daily: { series: [], options: {} }
  });

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      generateChartData();
    }
  }, [tasks, timeRange]);

  const generateChartData = () => {
    const now = new Date();
    let filteredTasks = tasks;

    // Filter tasks based on time range
    if (timeRange === 'week') {
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      filteredTasks = tasks.filter(task => 
        task.createdAt && isWithinInterval(new Date(task.createdAt), { start: weekStart, end: weekEnd })
      );
    } else if (timeRange === 'month') {
      const monthStart = subWeeks(now, 4);
      filteredTasks = tasks.filter(task => 
        task.createdAt && new Date(task.createdAt) >= monthStart
      );
    }

    // Completion Chart Data
    const completed = filteredTasks.filter(task => task.completed).length;
    const pending = filteredTasks.filter(task => !task.completed).length;
    
    const completionChart = {
      series: [completed, pending],
      options: {
        chart: { type: 'donut', height: 300 },
        labels: ['Completed', 'Pending'],
        colors: ['#10b981', '#f59e0b'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: true, formatter: (val) => Math.round(val) + '%' },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Tasks',
                  formatter: () => filteredTasks.length
                }
              }
            }
          }
        }
      }
    };

    // Priority Distribution Chart
    const highPriority = filteredTasks.filter(task => task.priority === 'high').length;
    const mediumPriority = filteredTasks.filter(task => task.priority === 'medium').length;
    const lowPriority = filteredTasks.filter(task => task.priority === 'low').length;
    
    const priorityChart = {
      series: [{
        name: 'Tasks',
        data: [highPriority, mediumPriority, lowPriority]
      }],
      options: {
        chart: { type: 'bar', height: 300 },
        xaxis: { categories: ['High', 'Medium', 'Low'] },
        colors: ['#ef4444', '#f59e0b', '#3b82f6'],
        plotOptions: {
          bar: { horizontal: false, columnWidth: '50%' }
        },
        dataLabels: { enabled: true }
      }
    };

    // Daily Activity Chart (last 7 days)
    const last7Days = eachDayOfInterval({
      start: subWeeks(now, 1),
      end: now
    });

    const dailyData = last7Days.map(day => {
      const dayTasks = tasks.filter(task => 
        task.createdAt && format(new Date(task.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length;
      return dayTasks;
    });

    const dailyChart = {
      series: [{
        name: 'Tasks Created',
        data: dailyData
      }],
      options: {
        chart: { type: 'area', height: 300 },
        xaxis: {
          categories: last7Days.map(day => format(day, 'MMM dd')),
          title: { text: 'Date' }
        },
        yaxis: { title: { text: 'Number of Tasks' } },
        colors: ['#6366f1'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        stroke: { curve: 'smooth', width: 2 }
      }
    };

    setChartData({
      completion: completionChart,
      priority: priorityChart,
      daily: dailyChart
    });
  };

  const getProductivityScore = () => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getAverageTasksPerDay = () => {
    if (!tasks || tasks.length === 0) return 0;
    const now = new Date();
    const weekAgo = subWeeks(now, 1);
    const recentTasks = tasks.filter(task => 
      task.createdAt && new Date(task.createdAt) >= weekAgo
    );
    return Math.round(recentTasks.length / 7);
  };

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
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Analytics</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const productivityScore = getProductivityScore();
  const avgTasksPerDay = getAverageTasksPerDay();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600">Track your productivity and task completion patterns</p>
        </div>
        
        <div className="flex space-x-2">
          {['week', 'month', 'all'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range === 'all' ? 'All Time' : `This ${range}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Productivity Score</p>
              <p className="text-2xl font-bold text-green-600">{productivityScore}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Tasks/Day</p>
              <p className="text-2xl font-bold text-blue-600">{avgTasksPerDay}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ApperIcon name="Calendar" size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{tasks?.length || 0}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckSquare" size={24} className="text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {tasks?.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <ApperIcon name="Target" size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Task Completion Status</h2>
          {chartData.completion.series.length > 0 ? (
            <Chart
              options={chartData.completion.options}
              series={chartData.completion.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <ApperIcon name="PieChart" size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Priority Distribution</h2>
          {chartData.priority.series[0]?.data.some(val => val > 0) ? (
            <Chart
              options={chartData.priority.options}
              series={chartData.priority.series}
              type="bar"
              height={300}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <ApperIcon name="BarChart3" size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Daily Task Creation (Last 7 Days)</h2>
        <Chart
          options={chartData.daily.options}
          series={chartData.daily.series}
          type="area"
          height={300}
        />
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ApperIcon name="Lightbulb" size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Productivity Tip</h3>
                <p className="text-sm text-blue-700">
                  {productivityScore >= 80 
                    ? "Great job! Your productivity is excellent. Keep maintaining this consistency."
                    : productivityScore >= 60
                    ? "You're doing well! Try to focus on completing high-priority tasks first."
                    : "Consider breaking down large tasks into smaller, manageable chunks."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ApperIcon name="Trophy" size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-900 mb-1">Achievement</h3>
                <p className="text-sm text-green-700">
                  {tasks?.filter(t => t.completed).length || 0} tasks completed! 
                  {avgTasksPerDay >= 3 
                    ? " You're maintaining great momentum."
                    : " Keep up the steady progress."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;