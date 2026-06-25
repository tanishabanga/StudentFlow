import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import { CheckCircle, AlertCircle, Calendar, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks for profile stats', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="profile-container">
      <div className="dashboard-header" style={{ marginBottom: '30px' }}>
        <div>
          <h1>Student Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View your dashboard performance and account status</p>
        </div>
      </div>

      <div className="glass-card profile-card">
        <div className="profile-avatar">{getInitials(user?.username)}</div>
        <div style={{ flexGrow: 1 }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>{user?.username}</h2>
          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📧</span> {user?.email}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>Member since: {formatDate(user?.createdAt)}</span>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '20px',
            }}
          >
            <ShieldCheck size={14} />
            <span>Verified Student</span>
          </span>
        </div>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Workflow Productivity Analytics</h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
          Computing academic analytics...
        </div>
      ) : (
        <div className="profile-stats-grid">
          <div className="glass-card profile-stat-box">
            <span className="profile-stat-num">{totalTasks}</span>
            <div className="profile-stat-lbl">Tasks Registered</div>
          </div>
          
          <div className="glass-card profile-stat-box" style={{ borderLeft: '4px solid var(--success)' }}>
            <span className="profile-stat-num" style={{ color: 'var(--success)' }}>
              {completedTasks}
            </span>
            <div className="profile-stat-lbl">Tasks Completed</div>
          </div>

          <div className="glass-card profile-stat-box" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
            <span className="profile-stat-num" style={{ color: 'var(--accent-primary)' }}>
              {completionPercentage}%
            </span>
            <div className="profile-stat-lbl">Completion Rate</div>
          </div>
        </div>
      )}

      {/* Productivity Tips Glass panel */}
      <div className="glass-panel" style={{ marginTop: '30px', padding: '24px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          💡 <span>Study Success Guidelines</span>
        </h4>
        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
          <li>
            Use the <strong>Pomodoro Timer</strong> with 25-minute study splits followed by 5-minute walks to rest neural networks.
          </li>
          <li>
            Sort tasks by <strong>High Priority</strong> to attack blocker assignments before cognitive fatigue sets in.
          </li>
          <li>
            Set realistic <strong>Due Dates</strong> to prevent exam build-ups and cramming schedules.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
