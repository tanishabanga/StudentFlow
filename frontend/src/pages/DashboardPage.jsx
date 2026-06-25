import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskStats from '../components/TaskStats';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import PomodoroTimer from '../components/PomodoroTimer';

const DashboardPage = () => {
  const { user, triggerToast } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Completed, Pending
  const [priorityFilter, setPriorityFilter] = useState('All'); // All, High, Medium, Low

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load user tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks', error);
      triggerToast('Could not sync tasks with server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        const updated = await taskService.updateTask(editingTask._id, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? updated : t))
        );
        triggerToast('Task updated successfully.', 'success');
      } else {
        // Create new task
        const created = await taskService.createTask(taskData);
        setTasks((prev) => [...prev, created]);
        triggerToast('Task created successfully.', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to save task', error);
      triggerToast('Failed to save task details.', 'error');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = await taskService.updateTask(task._id, {
        isCompleted: !task.isCompleted,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
      if (updated.isCompleted) {
        triggerToast('Task completed! Keep it up. 🚀', 'success');
      } else {
        triggerToast('Task marked active.', 'success');
      }
    } catch (error) {
      console.error('Failed to toggle completion status', error);
      triggerToast('Error updating completion status.', 'error');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      triggerToast('Task deleted successfully.', 'success');
    } catch (error) {
      console.error('Failed to delete task', error);
      triggerToast('Failed to delete task.', 'error');
    }
  };

  const openAddTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Filter and Search logic (snappy client side rendering)
  const filteredTasks = tasks.filter((task) => {
    // Search query matches title or description
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status matching
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Completed' && task.isCompleted) ||
      (statusFilter === 'Pending' && !task.isCompleted);

    // Priority matching
    const matchesPriority =
      priorityFilter === 'All' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="dashboard-wrapper">
      {/* Dashboard Top Row Header */}
      <div className="dashboard-header">
        <div>
          <h1>Student Workspace</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user?.username || 'Student'}! Plan your day and stay focused.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddTaskModal}>
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task Statistics Widgets */}
      <TaskStats tasks={tasks} />

      {/* Main Grid: Tasks panel and Pomodoro timer side panel */}
      <div className="dashboard-grid">
        {/* Left Side: Tasks Operations */}
        <div className="tasks-panel">
          {/* Task searching and selectors filters */}
          <div className="filter-bar">
            <div className="search-box-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="input-control search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-selectors">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                className="filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priority</option>
                <option value="High">High 🔴</option>
                <option value="Medium">Medium 🟡</option>
                <option value="Low">Low 🟢</option>
              </select>
            </div>
          </div>

          {/* List render container */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Syncing tasks with server...
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="tasks-list">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card no-tasks">
              <h3>No tasks found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                Try adjusting your search criteria or create a new task to get started!
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Pomodoro Timer */}
        <div className="pomodoro-sidebar">
          <PomodoroTimer />
        </div>
      </div>

      {/* Task Creation & Modification Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdateTask}
        task={editingTask}
      />
    </div>
  );
};

export default DashboardPage;
