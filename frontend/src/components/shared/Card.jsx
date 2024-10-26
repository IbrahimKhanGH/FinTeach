// src/components/shared/card.jsx
import React from 'react';

export const CardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;
export const CardDescription = ({ children }) => <p className="text-gray-500">{children}</p>;
export const CardContent = ({ children }) => <div className="p-4">{children}</div>;

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

export default Card;
