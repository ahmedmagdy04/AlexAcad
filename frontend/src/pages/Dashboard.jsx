import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, TrendingUp, AlertTriangle,
  Award, RefreshCw, ChevronRight, User, Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user: authUser } = useAuth();

  // Always fetch fresh user data so registeredCourses reflects latest upload
  const [freshUser, setFreshUser]           = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError]     = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        setFreshUser(data.user);
      } catch (err) {
        setProfileError(
          err?.response?.data?.message || 'Failed to load profile.'
        );
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Use freshUser when available, fall back to auth context
  const user              = freshUser || authUser;
  const registeredCourses = freshUser?.registeredCourses || [];

  const gpa      = user?.cumulativeGPA ?? user?.gpa;
  const warnings = user?.warnings ?? 0;

  const getGpaColor = (g) => {
    if (!g) return 'var(--text-muted)';
    if (g >= 3.5) return '#16a34a';
    if (g >= 2.5) return '#b8953a';
    return '#dc2626';
  };

  const getGpaLabel = (g) => {
    if (!g) return '—';
    if (g >= 3.7) return 'Excellent';
    if (g >= 3.0) return 'Very Good';
    if (g >= 2.0) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="dashboard-page">
      {/* Hero / Welcome */}
      <section className="dashboard-hero">
        <div className="container">
          <div className="dashboard-hero__inner">
            <div className="dashboard-hero__avatar">
              <User size={32} />
            </div>
            <div>
              <h1 className="dashboard-hero__title">
                Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
              </h1>
              <p className="dashboard-hero__sub">
                {user?.department || 'Faculty of Business'} &nbsp;·&nbsp; Year {user?.level || '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container dashboard-body">
        {/* Stat Cards */}
        <div className="dashboard-stats">

          {/* GPA Card */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <TrendingUp size={20} />
            </div>
            <div className="dashboard-stat-card__body">
              <p className="dashboard-stat-card__label">Cumulative GPA</p>
              <p className="dashboard-stat-card__value" style={{ color: getGpaColor(gpa) }}>
                {gpa != null ? parseFloat(gpa).toFixed(2) : '—'}
              </p>
              <p className="dashboard-stat-card__sub">{getGpaLabel(gpa)}</p>
            </div>
          </div>

          {/* Warnings Card */}
          <div className="dashboard-stat-card">
            <div
              className="dashboard-stat-card__icon"
              style={{
                background: warnings > 0 ? '#fef3c7' : '#f0fdf4',
                color:      warnings > 0 ? '#b45309' : '#16a34a',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div className="dashboard-stat-card__body">
              <p className="dashboard-stat-card__label">Academic Warnings</p>
              <p
                className="dashboard-stat-card__value"
                style={{ color: warnings > 0 ? '#b45309' : '#16a34a' }}
              >
                {warnings}
              </p>
              <p className="dashboard-stat-card__sub">
                {warnings === 0
                  ? 'Standing clear'
                  : warnings === 1 ? 'First warning'
                  : warnings === 2 ? 'Second warning'
                  : 'Final warning'}
              </p>
            </div>
          </div>

          {/* Level Card */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <GraduationCap size={20} />
            </div>
            <div className="dashboard-stat-card__body">
              <p className="dashboard-stat-card__label">Academic Year</p>
              <p className="dashboard-stat-card__value" style={{ color: '#1d4ed8' }}>
                Year {user?.level || '—'}
              </p>
              <p className="dashboard-stat-card__sub">{user?.department || '—'}</p>
            </div>
          </div>

          {/* Registered Courses Count + Quick Links */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__icon" style={{ background: '#fdf4ff', color: '#7c3aed' }}>
              <Award size={20} />
            </div>
            <div className="dashboard-stat-card__body">
              <p className="dashboard-stat-card__label">Registered Courses</p>
              <p className="dashboard-stat-card__value" style={{ color: '#7c3aed' }}>
                {registeredCourses.length}
              </p>
              <div className="dashboard-quick-links">
                <Link to="/chat" className="dashboard-quick-link">
                  Ask AI Advisor <ChevronRight size={12} />
                </Link>
                <Link to="/profile" className="dashboard-quick-link">
                  Edit Profile <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Your Courses Section */}
        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <BookOpen size={20} />
            <h2 className="dashboard-section__title">Your Courses</h2>
            <span className="dashboard-section__badge">Current Semester Registration</span>
          </div>

          {profileLoading ? (
            <div className="dashboard-loading">
              <RefreshCw size={20} className="spin" />
              <span>Loading courses...</span>
            </div>
          ) : profileError ? (
            <div className="dashboard-error">{profileError}</div>
          ) : registeredCourses.length === 0 ? (
            <div className="dashboard-empty">
              <Upload size={40} />
              <p>No registration uploaded yet.</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Go to the{' '}
                <Link to="/chat" style={{ color: 'var(--accent)' }}>
                  AI Advisor chat
                </Link>{' '}
                and upload your registration PDF to see your courses here.
              </p>
            </div>
          ) : (
            <div className="dashboard-courses">
              {registeredCourses.map((courseName, idx) => (
                <div key={idx} className="dashboard-course-card">
                  <div className="dashboard-course-card__header">
                    <span className="dashboard-course-card__code">{idx + 1}</span>
                  </div>
                  <p className="dashboard-course-card__name">{courseName}</p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
