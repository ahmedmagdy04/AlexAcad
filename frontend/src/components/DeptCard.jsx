import React from 'react';
import {
  Cpu, Calculator, Briefcase, Truck, PieChart,
  TrendingUp, BookOpen, BarChart2, Globe, Award
} from 'lucide-react';
import '../styles/Departments.css';

const ICONS = {
  cpu: Cpu,
  calculator: Calculator,
  briefcase: Briefcase,
  truck: Truck,
  'pie-chart': PieChart,
  'trending-up': TrendingUp,
  book: BookOpen,
  'bar-chart': BarChart2,
  globe: Globe,
  award: Award,
};

export default function DeptCard({ dept }) {
  const IconComp = ICONS[dept.icon] || BookOpen;

  return (
    <div className="dept-card">
      <div className="dept-card__icon-wrap">
        <IconComp size={22} />
      </div>
      <h3 className="dept-card__name">{dept.name}</h3>
      <p className="dept-card__desc">{dept.desc}</p>
    </div>
  );
}
