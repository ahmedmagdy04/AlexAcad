import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Twitter, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__gold-bar" />
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <GraduationCap size={18} />
              </div>
              <div>
                <div className="footer__logo-text">Faculty of Business</div>
                <div className="footer__logo-sub">Alexandria University</div>
              </div>
            </div>
            <p className="footer__desc">
              A world-class business faculty driven by technological innovation,
              shaping leaders ready to compete in the global market since 1942.
            </p>
            <div className="footer__social">
              {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="footer__social-btn" aria-label="social">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="footer__col-title">Quick Links</div>
            <div className="footer__col-links">
              {[
                { label: 'Home', to: '/' },
                { label: 'Departments', to: '/departments' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="footer__col-link">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="footer__col-title">Academic</div>
            <div className="footer__col-links">
              {[
                'Undergraduate Programs',
                'Postgraduate Programs',
                'PhD Programs',
                'Academic Calendar',
                'E-Learning Portal',
              ].map((l) => (
                <span key={l} className="footer__col-link">{l}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="footer__col-title">Student Life</div>
            <div className="footer__col-links">
              {[
                'Student Portal',
                'Library',
                'Career Center',
                'Alumni Network',
                'Student Activities',
              ].map((l) => (
                <span key={l} className="footer__col-link">{l}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__bottom-text">
            © {new Date().getFullYear()} Faculty of Business, Alexandria University. All rights reserved.
          </span>
          <div className="footer__bottom-links">
            <span className="footer__bottom-link">Privacy Policy</span>
            <span className="footer__bottom-link">Terms of Service</span>
            <span className="footer__bottom-link">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
