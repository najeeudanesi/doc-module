// src/components/ui/Input.jsx
import React from 'react';
// import './Input.css';

const Input = ({ id, value, onChange, type = 'text', placeholder, readOnly = false }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className="input"
    />
  );
};

export default Input;
