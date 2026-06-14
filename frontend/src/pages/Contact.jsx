import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import '../styles/Contact.css';

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'El-Horreya Road, Alexandria, Egypt',
    active: true,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+20 3 391 5678',
    active: false,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@business.alexu.edu.eg',
    active: false,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    }, 1400);
  };

  return (
    <main className="contact-page">
      <div className="contact-page__hero">
        <div className="container">
          <h1>We're Here to Help</h1>
          <p>Reach us through any of the channels below or send a direct message.</p>
        </div>
      </div>

      <div className="contact-page__body">
        <div className="container">
          <div className="contact-page__layout">
            {/* Info */}
            <div className="contact-info-list">
              {CONTACT_INFO.map((info, i) => (
                <div key={i} className={`contact-info-card ${info.active ? 'active' : ''}`}>
                  <div className="contact-info-card__icon">
                    <info.icon size={18} />
                  </div>
                  <div>
                    <div className="contact-info-card__label">{info.label}</div>
                    <div className="contact-info-card__value">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="contact-form-card">
              {sent && (
                <div className="contact-success">
                  <CheckCircle2 size={20} className="contact-success__icon" />
                  <p className="contact-success__text">
                    Your message was sent successfully! We'll get back to you shortly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="contact-form__group">
                  <label className="contact-form__label">Full Name</label>
                  <input
                    className="contact-form__input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name..."
                    required
                  />
                </div>

                <div className="contact-form__group">
                  <label className="contact-form__label">Email Address</label>
                  <input
                    className="contact-form__input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="contact-form__group">
                  <label className="contact-form__label">Your Message</label>
                  <textarea
                    className="contact-form__textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`btn-send ${sending ? 'sending' : ''}`}
                  disabled={sending}
                >
                  <Send size={16} />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
