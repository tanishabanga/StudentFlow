import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Flame, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  // If already authenticated, bypass landing and go directly to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      title: 'Task Management',
      description: 'Easily organize your school assignments, exams, and projects. Prioritize and track completion status.',
      icon: <CheckSquare size={24} />,
    },
    {
      title: 'Pomodoro Focus Timer',
      description: 'Maintain high cognitive endurance with customizable study intervals. Block distractions and track focus sessions.',
      icon: <Flame size={24} />,
    },
    {
      title: 'Analytical Statistics',
      description: 'Receive real-time progress ratios detailing completed tasks, tasks pending, and indicators of items due today.',
      icon: <BarChart3 size={24} />,
    },
    {
      title: 'Secured Session Locks',
      description: 'All tasks and profile structures are secured with JWT and cryptographic passwords verification algorithms.',
      icon: <ShieldCheck size={24} />,
    },
  ];

  return (
    <div className="full-width-content" style={{ position: 'relative' }}>
      {/* Background Glow Deco */}
      <div className="glow-blob blob-1"></div>
      <div className="glow-blob blob-2" style={{ top: '600px', right: '-150px' }}></div>

      {/* Nav Header */}
      <header className="landing-navbar">
        <div className="landing-logo">
          🎓 <span>StudentFlow</span>
        </div>
        <div className="nav-cta">
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>
            Supercharge Your Academic Productivity with <span>StudentFlow</span>
          </h1>
          <p>
            An elegant, all-in-one student workspace combining glassmorphic task management, customizable focus timers, and intelligent statistics to elevate your learning routines.
          </p>
          <div className="landing-hero-actions">
            <Link to="/register" className="btn btn-primary btn-block" style={{ width: 'auto', padding: '16px 36px', fontSize: '1.1rem' }}>
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ width: 'auto', padding: '16px 36px', fontSize: '1.1rem' }}>
              Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="features-title">Everything you need to succeed</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card feature-card">
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer banner */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', width: '100%' }}>
        <p>&copy; {new Date().getFullYear()} StudentFlow. Created with MERN Stack & CSS Glassmorphism.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
