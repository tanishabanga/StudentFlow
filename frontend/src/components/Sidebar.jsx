import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, LogOut, Sun, Moon, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="mobile-nav-toggle" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Sidebar Wrapper */}
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          🎓 <span>StudentFlow</span>
        </div>

        <nav className="sidebar-menu">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
              onClick={() => setIsOpen(false)}
            >
              <User size={20} />
              <span>Profile</span>
            </NavLink>
          </li>
        </nav>

        <div className="sidebar-footer">
          {/* Theme Toggle Widget */}
          <div className="theme-toggle-container">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <label className="theme-switch">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="user-snippet">
              <div className="avatar">
                {getInitials(user.username)}
              </div>
              <div className="user-details">
                <span className="username-text">{user.username}</span>
                <span className="email-text">{user.email}</span>
              </div>
            </div>
          )}

          <button onClick={handleLogout} className="sidebar-link" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
