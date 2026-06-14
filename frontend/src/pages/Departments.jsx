import React from 'react';
import DeptCard from '../components/DeptCard';
import { departments } from '../data/mock';
import '../styles/Departments.css';

export default function Departments() {
  return (
    <main className="depts-page">
      <div className="depts-page__hero">
        <div className="container">
          <div className="section-tag">Academic Programs</div>
          <h1 className="section-title">Our Departments</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Diverse specializations to fuel your professional ambitions.
          </p>
        </div>
      </div>

      <div className="depts-page__grid-section">
        <div className="container">
          <div className="depts-page__grid">
            {departments.map((dept) => (
              <DeptCard key={dept.id} dept={dept} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
