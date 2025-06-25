import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false 
}) => {
  const baseClasses = "rounded-xl shadow-sm border border-gray-200 bg-white";
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-300" : "";
  const gradientClasses = gradient ? "bg-gradient-to-br from-white to-gray-50" : "";

  return (
    <div className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;