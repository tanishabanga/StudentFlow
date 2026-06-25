import React from 'react';
import { Trash2, Edit3, Calendar } from 'lucide-react';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const formatDueDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const priorityClass = `priority-${task.priority.toLowerCase()}`;
  const completedClass = task.isCompleted ? 'completed' : '';

  return (
    <div className={`task-card ${priorityClass} ${completedClass}`}>
      <div className="task-left">
        {/* Custom checkmark checkbox */}
        <label className="task-checkbox-container">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => onToggleComplete(task)}
          />
          <span className="checkmark"></span>
        </label>
        
        <div className="task-details">
          <span className="task-title">{task.title}</span>
          {task.description && <p className="task-desc">{task.description}</p>}
        </div>
      </div>

      <div className="task-right">
        {/* Priority Badge */}
        <span className={`task-badge badge-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>

        {/* Due Date Indicator */}
        <div className="task-due">
          <Calendar />
          <span>{formatDueDate(task.dueDate)}</span>
        </div>

        {/* Action Controls */}
        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="action-btn"
            title="Edit Task"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="action-btn btn-delete"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
