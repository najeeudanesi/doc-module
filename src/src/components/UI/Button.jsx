// src/components/ui/Button.jsx
import React from 'react';
// import './Button.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'medium', disabled = false }) => {
  return (
    <button
      className={`btn ${variant} ${size}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
