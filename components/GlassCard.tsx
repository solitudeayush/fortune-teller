
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-700 ease-out transform ${className}`}>
      {children}
    </div>
  );
};
