import React from 'react';
import { Lightbulb, Scale, Heart, Users } from 'lucide-react';
import { teamMembers, values } from '../data/mock';
import '../styles/About.css';

const VALUE_ICONS = {
  lightbulb: Lightbulb,
  scale: Scale,
  heart: Heart,
};

export default function About() {
  return (
    <main className="about-page">
      {/* History & Mission */}
      <section className="about-section">
        <div className="container">
          <div className="about__layout">
            <div className="about__img-wrap">
              <div className="about__img-card">Faculty Building</div>
              <div className="about__img-overlay">
                <div className="about__img-overlay-val">80+</div>
                <div className="about__img-overlay-label">Years of Excellence</div>
              </div>
            </div>

            <div className="about__content">
              <div className="about__eyebrow">
                <div className="section-tag">About Us</div>
              </div>
              <h1 className="about__heading">History &amp; Mission</h1>
              <p className="about__founded">Founded in 1942</p>
              <p className="about__body">
                The Faculty of Business at Alexandria University has been a pioneer in
                commercial education in the region for over eight decades. We are committed
                to graduating professionals who are ready to compete and lead in a rapidly
                evolving global marketplace.
              </p>
              <div className="about__mission-quote">
                <p>
                  Our mission is to inspire innovation, foster critical thinking, and
                  develop ethical business leaders who make a lasting impact on society.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-section about-section--gray">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div className="section-tag">What We Stand For</div>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
              The principles that guide everything we do at the Faculty of Business.
            </p>
          </div>
          <div className="about__values">
            {values.map((v, i) => {
              const Icon = VALUE_ICONS[v.icon] || Lightbulb;
              return (
                <div key={i} className="about__value-card">
                  <div className="about__value-icon">
                    <Icon size={22} />
                  </div>
                  <div className="about__value-title">{v.title}</div>
                  <p className="about__value-desc">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision section */}
      <section className="about-section">
        <div className="container">
          <div className="about__layout reverse">
            <div className="about__content">
              <div className="section-tag">Our Vision</div>
              <h2 className="about__heading">Leading Business Education in the Region</h2>
              <p className="about__body" style={{ marginTop: 16 }}>
                We envision a Faculty that stands at the forefront of academic innovation,
                producing research that shapes policy and practice across the MENA region.
                Our graduates are equipped not only with technical expertise but with the
                leadership skills, ethical compass, and global perspective necessary to
                thrive in a complex, interconnected world.
              </p>
              <p className="about__body" style={{ marginTop: 12 }}>
                Through continuous curriculum renewal, strong industry partnerships, and
                investment in faculty development, we aim to be consistently recognized
                among the top business schools in Africa and the Arab world.
              </p>
            </div>
            <div className="about__img-wrap">
              <div className="about__img-card">Campus & Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="about-section about-section--gray">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <div className="section-tag">Leadership</div>
            <h2 className="section-title">Faculty Leadership</h2>
          </div>
          <div className="about__team-grid">
            {teamMembers.map((member, i) => (
              <div key={i} className="about__team-card">
                <div className="about__team-avatar">
                  {member.initials}
                </div>
                <div className="about__team-name">{member.name}</div>
                <div className="about__team-role">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '80px 0',
        background: 'var(--navy)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 32,
            textAlign: 'center',
          }}>
            {[
              { val: '1942', label: 'Year Founded' },
              { val: '12,000+', label: 'Alumni Worldwide' },
              { val: '200+', label: 'Faculty Members' },
              { val: '6', label: 'Departments' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 40,
                  fontWeight: 800,
                  color: 'var(--gold)',
                  lineHeight: 1,
                  marginBottom: 8,
                }}>{s.val}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
