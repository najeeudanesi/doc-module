// src/components/ui/Label.jsx
import React from 'react';
// import './Label.css';

const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="label">
      {children}
    </label>
  );
};

export default Label;
