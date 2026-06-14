import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, ArrowRight, Users, Award, Cpu, Globe,
  Zap, Building2, BookOpen, ChevronRight
} from 'lucide-react';
import DeptCard from '../components/DeptCard';
import { departments, stats, whyChooseUs } from '../data/mock';
import '../styles/Home.css';

const WHY_ICONS = { award: Award, users: Users, globe: Globe, zap: Zap };

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="home-hero__content">
            <div className="home-hero__badge">
              <span className="home-hero__badge-dot" />
              Est. 1942 — Alexandria, Egypt
            </div>

            <h1 className="home-hero__title">
              Alexandria
              <br />University
            </h1>
            <span className="home-hero__title-italic">Faculty of Business</span>

            <p className="home-hero__subtitle">
              A world-class business faculty driven by technological innovation,
              shaping leaders ready to compete in the global market.
            </p>

            <div className="home-hero__ctas">
              <button className="btn-primary" onClick={() => {}}>
                <Bot size={16} />
                Ask AI Assistant
              </button>
              <Link to="/departments" className="btn-outline">
                Explore Departments
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="home-hero__visual">
            <div className="home-hero__img-wrap">
              <div className="home-hero__img-placeholder">
                Faculty of Business Building
              </div>
            </div>
            <div className="home-hero__stat" style={{ top: '18%', left: '-30px' }}>
              <div className="home-hero__stat-icon">
                <Users size={18} />
              </div>
              <div>
                <div className="home-hero__stat-val">12,000+</div>
                <div className="home-hero__stat-label">Alumni</div>
              </div>
            </div>
            <div className="home-hero__stat" style={{ bottom: '22%', left: '-10px' }}>
              <div className="home-hero__stat-icon">
                <Award size={18} />
              </div>
              <div>
                <div className="home-hero__stat-val">80+ Years</div>
                <div className="home-hero__stat-label">Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS PREVIEW */}
      <section className="home-depts">
        <div className="container">
          <div className="home-depts__header">
            <div className="section-tag">Academic Programs</div>
            <h2 className="section-title">Our Departments</h2>
            <p className="section-subtitle">
              Diverse specializations to fuel your professional ambitions.
            </p>
          </div>
          <div className="home-depts__grid">
            {departments.map((dept) => (
              <DeptCard key={dept.id} dept={dept} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/departments" className="btn-outline">
              View All Departments
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="home-stats">
        <div className="container">
          <div className="home-stats__grid">
            {stats.map((s, i) => (
              <div key={i} className="home-stats__item">
                <div className="home-stats__item-val">{s.value}</div>
                <div className="home-stats__item-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="home-why">
        <div className="container">
          <div className="home-why__grid">
            <div>
              <div className="section-tag">Why Choose Us</div>
              <h2 className="section-title">
                Shaping Tomorrow's Business Leaders
              </h2>
              <div className="home-why__features">
                {whyChooseUs.map((item, i) => {
                  const Icon = WHY_ICONS[item.icon] || Award;
                  return (
                    <div key={i} className="home-why__feature">
                      <div className="home-why__feature-icon">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="home-why__feature-title">{item.title}</div>
                        <p className="home-why__feature-desc">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="home-why__img">
              <div className="home-why__img-card">
                Faculty Building
              </div>
              <div className="home-why__badge">
                <div className="home-why__badge-val">80+</div>
                <div className="home-why__badge-label">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #0d2344 0%, #1a3a6b 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div className="section-tag" style={{ margin: '0 auto 16px', display: 'inline-flex' }}>
            Join Us
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px,4vw,46px)',
            fontWeight: 800,
            color: 'white',
            marginBottom: 16
          }}>
            Begin Your Journey With Us
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 36 }}>
            Join thousands of students shaping the future of business in Egypt and beyond.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-primary" style={{ background: 'var(--gold)' }}>
              <Building2 size={16} />
              Apply Now
            </Link>
            <Link to="/about" className="btn-outline" style={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.4)'
            }}>
              Learn More
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
