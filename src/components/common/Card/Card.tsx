import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  actions,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
          {title && (
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
          )}
          {actions && <div className="w-full sm:w-auto">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

