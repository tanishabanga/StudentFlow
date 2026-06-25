import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  // Helper to format Date object or ISO string to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setDueDate(formatDateForInput(task.dueDate));
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      
      // Default due date to today
      setDueDate(formatDateForInput(new Date()));
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!title.trim()) {
      validationErrors.title = 'Title is required';
    }
    if (!dueDate) {
      validationErrors.dueDate = 'Due date is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      title,
      description,
      priority,
      dueDate,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-container">
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'Add New Task'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="modal-title" className="form-label">Task Title</label>
            <input
              id="modal-title"
              type="text"
              placeholder="e.g. Study for CS 101 Midterm"
              className="input-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span style={{ color: 'var(--priority-high)', fontSize: '0.8rem' }}>{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="modal-desc" className="form-label">Description (Optional)</label>
            <textarea
              id="modal-desc"
              placeholder="Add details about your task..."
              className="input-control"
              style={{ minHeight: '80px', resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label htmlFor="modal-priority" className="form-label">Priority</label>
              <select
                id="modal-priority"
                className="input-control filter-select"
                style={{ width: '100%', borderRadius: '8px' }}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low 🟢</option>
                <option value="Medium">Medium 🟡</option>
                <option value="High">High 🔴</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modal-due" className="form-label">Due Date</label>
              <input
                id="modal-due"
                type="date"
                className="input-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {errors.dueDate && <span style={{ color: 'var(--priority-high)', fontSize: '0.8rem' }}>{errors.dueDate}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
