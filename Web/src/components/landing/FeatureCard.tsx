'use client';

import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <div 
      className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/50 transition-all duration-300 group hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-indigo-200 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{description}</p>
    </div>
  );
}
