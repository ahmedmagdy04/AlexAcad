import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, Calendar, BookOpen, TrendingUp,
    AlertTriangle, Save, Edit2, CheckCircle, AlertCircle, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import '../styles/Profile.css';

const DEPARTMENTS = [
    'Management Information Systems',
    'Accounting',
    'Business Administration',
    'Customs',
    'Statistics',
    'Economics',
];

export default function Profile() {
    const { user, fetchProfile } = useAuth();
    const [form, setForm] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Load profile from backend on mount
    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get('/profile');
                setForm(data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await api.put('/profile', form);
            await fetchProfile(); // refresh global auth state
            setSuccess('Profile updated successfully!');
            setEditMode(false);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Restore from server data / auth user
        setForm(user || form);
        setEditMode(false);
        setError('');
        setSuccess('');
    };

    if (loading) {
        const uploadTranscript = async () => {
            try {
                const file = form?.pdf
                if (!file) {
                    setError("Please select a PDF first")
                    return
                }

                const formData = new FormData()
                formData.append("certificate", file)

                const { data } = await api.post(
                    "/documents/certificate",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )

                setSuccess(
                    `Transcript processed: GPA ${data.gpa || "N/A"}`
                )

                await fetchProfile()
            } catch (err) {
                setError(err?.response?.data?.message || "Upload failed")
            }
        }
        return (
            <div className="profile-page">
                <div className="container profile-loading">
                    <RefreshCw size={24} className="spin" />
                    <p>Loading profile…</p>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="profile-error-state">{error || 'Could not load profile.'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-wrapper">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-avatar">
                            <User size={48} />
                        </div>
                        <h2 className="profile-sidebar__name">{form.name || '—'}</h2>
                        <p className="profile-sidebar__dept">{form.department || '—'}</p>
                        <p className="profile-sidebar__level">Year {form.level || '—'}</p>

                        <div className="profile-sidebar__stats">
                            <div className="profile-sidebar__stat">
                                <TrendingUp size={16} />
                                <span>GPA: {form.cumulativeGPA != null ? parseFloat(form.cumulativeGPA).toFixed(2) : '—'}</span>
                            </div>
                            <div className="profile-sidebar__stat">
                                <AlertTriangle size={16} />
                                <span>Warnings: {form.warnings ?? 0}</span>
                            </div>
                        </div>

                        {!editMode && (
                            <button className="profile-edit-btn" onClick={() => setEditMode(true)}>
                                <Edit2 size={15} />
                                Edit Profile
                            </button>
                        )}
                    </aside>

                    {/* Main form */}
                    <main className="profile-main">
                        {/* Transcript Upload */}
                        <div className="profile-form__group profile-form__group--full">
                            <label className="profile-form__label">
                                <BookOpen size={13} /> Upload Transcript (PDF)
                            </label>

                            <input
                                type="file"
                                accept="application/pdf"
                                className="profile-form__input"
                                onChange={(e) => setForm({ ...form, pdf: e.target.files[0] })}
                            />
                        </div>
                        <div className="profile-main__header">
                            <h1 className="profile-main__title">My Profile</h1>
                            <p className="profile-main__sub">Manage your academic information</p>
                        </div>

                        {success && (
                            <div className="profile-alert success">
                                <CheckCircle size={16} /> {success}
                            </div>
                        )}
                        {error && (
                            <div className="profile-alert error">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSave}>
                            <div className="profile-form__grid">
                                {/* Name */}
                                <div className="profile-form__group profile-form__group--full">
                                    <label className="profile-form__label">
                                        <User size={13} /> Full Name
                                    </label>
                                    <input
                                        className="profile-form__input"
                                        name="name"
                                        value={form.name || ''}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                {/* Email */}
                                <div className="profile-form__group">
                                    <label className="profile-form__label">
                                        <Mail size={13} /> Email
                                    </label>
                                    <input
                                        className="profile-form__input"
                                        name="email"
                                        type="email"
                                        value={form.email || ''}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                {/* Phone */}
                                <div className="profile-form__group">
                                    <label className="profile-form__label">
                                        <Phone size={13} /> Phone
                                    </label>
                                    <input
                                        className="profile-form__input"
                                        name="phone"
                                        type="tel"
                                        value={form.phone || ''}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                {/* Birthdate */}
                                <div className="profile-form__group">
                                    <label className="profile-form__label">
                                        <Calendar size={13} /> Birthdate
                                    </label>
                                    <input
                                        className="profile-form__input"
                                        name="birthdate"
                                        type="date"
                                        value={form.birthdate ? form.birthdate.split('T')[0] : ''}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                {/* Department */}
                                <div className="profile-form__group">
                                    <label className="profile-form__label">
                                        <BookOpen size={13} /> Department
                                    </label>
                                    {editMode ? (
                                        <select
                                            className="profile-form__input"
                                            name="department"
                                            value={form.department || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select department</option>
                                            {DEPARTMENTS.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className="profile-form__input"
                                            value={form.department || '—'}
                                            disabled
                                        />
                                    )}
                                </div>

                                {/* Level */}
                                <div className="profile-form__group">
                                    <label className="profile-form__label">
                                        <BookOpen size={13} /> Academic Level
                                    </label>
                                    {editMode ? (
                                        <select
                                            className="profile-form__input"
                                            name="level"
                                            value={form.level || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select level</option>
                                            {['1', '2', '3', '4'].map((l) => (
                                                <option key={l} value={l}>Year {l}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className="profile-form__input"
                                            value={form.level ? `Year ${form.level}` : '—'}
                                            disabled
                                        />
                                    )}
                                </div>

                                {/* GPA */}
                                <div className="profile-form__group">
                                    <label className="profile-form__label">
                                        <TrendingUp size={13} /> Cumulative GPA
                                    </label>
                                    <input
                                        className="profile-form__input"
                                        name="cumulativeGPA"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="4"
                                        value={form.cumulativeGPA ?? ''}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                {/* Warnings */}
                                <div className="profile-form__group">
                                    <label className="profile-form__label">
                                        <AlertTriangle size={13} /> Academic Warnings
                                    </label>
                                    <input
                                        className="profile-form__input"
                                        name="warnings"
                                        type="number"
                                        min="0"
                                        max="3"
                                        value={form.warnings ?? 0}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>

                            {editMode && (
                                <div className="profile-form__actions">
                                    <button type="button" className="profile-cancel-btn" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="profile-save-btn" disabled={saving}>
                                        <Save size={15} />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
}
