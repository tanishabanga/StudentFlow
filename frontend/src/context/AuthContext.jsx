import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('student-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // --- Toast Manager Utility ---
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // --- Actions ---
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      setUser(data);
      localStorage.setItem('student-user', JSON.stringify(data));
      triggerToast('Welcome back! Login successful.', 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      triggerToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const data = await authService.register(username, email, password);
      setUser(data);
      localStorage.setItem('student-user', JSON.stringify(data));
      triggerToast('Account created successfully! Welcome onboard.', 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed. Try again.';
      triggerToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('student-user');
    triggerToast('Logged out successfully. See you soon!', 'success');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    toasts,
    triggerToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      
      {/* Toast Notification Mount Layout */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} glass-panel`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};
