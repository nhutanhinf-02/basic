import React from 'react';

export default function Option({ text, onClick, disabled }) {
  return (
    <button className="option" onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
