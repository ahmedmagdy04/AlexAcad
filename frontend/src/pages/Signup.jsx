import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus, User, Mail, Lock, Eye, EyeOff,
  Phone, Calendar, BookOpen, TrendingUp, AlertTriangle, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const DEPARTMENTS = [
  'Management Information Systems',
  'Accounting',
  'Business Administration',
  'Customs',
  'Statistics',
  'Economics',
];

const LEVELS = ['1', '2', '3', '4'];

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthdate: '',
    department: '',
    level: '',
    cumulativeGPA: '',
    warnings: '0',
    terms: false,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min. 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.birthdate) errs.birthdate = 'Birthdate is required';
    if (!form.department) errs.department = 'Department is required';
    if (!form.level) errs.level = 'Level is required';
    if (!form.terms) errs.terms = 'You must agree to the terms';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      // Build payload expected by backend (no confirmPassword, no terms)
      const { confirmPassword, terms, ...rest } = form;
      const payload = {
        ...rest,
        level: parseInt(rest.level, 10),
        cumulativeGPA: rest.cumulativeGPA ? parseFloat(rest.cumulativeGPA) : undefined,
        warnings: rest.warnings ? parseInt(rest.warnings, 10) : 0,
      };
      await register(payload);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <div className="auth-card__icon">
          <UserPlus size={22} />
        </div>
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__sub">Join the Faculty of Business student portal</p>

        {serverError && (
          <div className="auth-server-error">
            <AlertCircle size={15} />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="auth-form__group">
            <label className="auth-form__label">Full Name</label>
            <div className="auth-form__input-wrap">
              <span className="auth-form__icon"><User size={14} /></span>
              <input
                className={`auth-form__input ${errors.name ? 'error' : ''}`}
                name="name"
                placeholder="Ahmed Mohamed"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {errors.name && <div className="auth-form__error">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="auth-form__group">
            <label className="auth-form__label">University Email</label>
            <div className="auth-form__input-wrap">
              <span className="auth-form__icon"><Mail size={15} /></span>
              <input
                className={`auth-form__input ${errors.email ? 'error' : ''}`}
                name="email"
                type="email"
                placeholder="you@alexu.edu.eg"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <div className="auth-form__error">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="auth-form__group">
            <label className="auth-form__label">Password</label>
            <div className="auth-form__input-wrap">
              <span className="auth-form__icon"><Lock size={15} /></span>
              <input
                className={`auth-form__input ${errors.password ? 'error' : ''}`}
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="auth-form__toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <div className="auth-form__error">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="auth-form__group">
            <label className="auth-form__label">Confirm Password</label>
            <div className="auth-form__input-wrap">
              <span className="auth-form__icon"><Lock size={15} /></span>
              <input
                className={`auth-form__input ${errors.confirmPassword ? 'error' : ''}`}
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="auth-form__toggle" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && <div className="auth-form__error">{errors.confirmPassword}</div>}
          </div>

          {/* Phone & Birthdate */}
          <div className="auth-form__row">
            <div className="auth-form__group">
              <label className="auth-form__label">Phone</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon"><Phone size={14} /></span>
                <input
                  className={`auth-form__input ${errors.phone ? 'error' : ''}`}
                  name="phone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <div className="auth-form__error">{errors.phone}</div>}
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label">Birthdate</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon"><Calendar size={14} /></span>
                <input
                  className={`auth-form__input ${errors.birthdate ? 'error' : ''}`}
                  name="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={handleChange}
                  style={{ paddingLeft: 40 }}
                />
              </div>
              {errors.birthdate && <div className="auth-form__error">{errors.birthdate}</div>}
            </div>
          </div>

          {/* Department & Level */}
          <div className="auth-form__row">
            <div className="auth-form__group">
              <label className="auth-form__label">Department</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon"><BookOpen size={14} /></span>
                <select
                  className={`auth-form__input auth-form__select ${errors.department ? 'error' : ''}`}
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select dept.</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              {errors.department && <div className="auth-form__error">{errors.department}</div>}
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label">Level</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon"><BookOpen size={14} /></span>
                <select
                  className={`auth-form__input auth-form__select ${errors.level ? 'error' : ''}`}
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                >
                  <option value="">Select level</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>Year {l}</option>
                  ))}
                </select>
              </div>
              {errors.level && <div className="auth-form__error">{errors.level}</div>}
            </div>
          </div>

          {/* GPA & Warnings */}
          <div className="auth-form__row">
            <div className="auth-form__group">
              <label className="auth-form__label">Cumulative GPA</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon"><TrendingUp size={14} /></span>
                <input
                  className="auth-form__input"
                  name="cumulativeGPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="e.g. 3.20"
                  value={form.cumulativeGPA}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label">Academic Warnings</label>
              <div className="auth-form__input-wrap">
                <span className="auth-form__icon"><AlertTriangle size={14} /></span>
                <input
                  className="auth-form__input"
                  name="warnings"
                  type="number"
                  min="0"
                  max="3"
                  placeholder="0"
                  value={form.warnings}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="auth-form__terms">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            <label htmlFor="terms" className="auth-form__terms-text">
              I agree to the{' '}
              <a href="#terms" className="auth-form__terms-link">Terms of Service</a>
              {' '}and{' '}
              <a href="#privacy" className="auth-form__terms-link">Privacy Policy</a>
              {' '}of the Faculty of Business student portal.
            </label>
          </div>
          {errors.terms && (
            <div className="auth-form__error" style={{ marginTop: -12, marginBottom: 12 }}>
              {errors.terms}
            </div>
          )}

          <button type="submit" className="btn-auth" disabled={loading}>
            <UserPlus size={16} />
            {loading ? 'Creating Account...' : 'Create My Account'}
          </button>
        </form>

        <p className="auth-card__switch">
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
