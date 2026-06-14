import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
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
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Login failed. Please check your credentials.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__icon">
          <LogIn size={22} />
        </div>
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__sub">Sign in to your student account</p>

        {serverError && (
          <div className="auth-server-error">
            <AlertCircle size={15} />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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

          <div className="auth-form__group">
            <label className="auth-form__label">Password</label>
            <div className="auth-form__input-wrap">
              <span className="auth-form__icon"><Lock size={15} /></span>
              <input
                className={`auth-form__input ${errors.password ? 'error' : ''}`}
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-form__toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <div className="auth-form__error">{errors.password}</div>}
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -8 }}>
            <a href="#forgot" className="auth-form__forgot">Forgot password?</a>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            <LogIn size={16} />
            {loading ? 'Signing in...' : 'Login to Portal'}
          </button>
        </form>

        <p className="auth-card__switch">
          Don't have an account?{' '}
          <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
