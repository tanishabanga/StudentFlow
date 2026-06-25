import React from 'react';
import { ListTodo, CheckCircle, Clock, Percent, AlertCircle } from 'lucide-react';

const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate tasks due today (ignoring hours/minutes)
  const today = new Date();
  const todayStr = today.toDateString();
  const tasksDueToday = tasks.filter((t) => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate).toDateString() === todayStr;
  }).length;

  const statCards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: <ListTodo className="stat-icon" />,
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: <CheckCircle className="stat-icon" style={{ color: 'var(--priority-low)' }} />,
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: <AlertCircle className="stat-icon" style={{ color: 'var(--priority-medium)' }} />,
    },
    {
      title: 'Completion Rate',
      value: `${completionPercentage}%`,
      icon: <Percent className="stat-icon" />,
    },
    {
      title: 'Due Today',
      value: tasksDueToday,
      icon: <Clock className="stat-icon" style={{ color: 'var(--priority-high)' }} />,
    },
  ];

  return (
    <div className="stats-container">
      {statCards.map((stat, idx) => (
        <div key={idx} className="glass-card stat-card">
          {stat.icon}
          <span className="stat-title">{stat.title}</span>
          <span className="stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
