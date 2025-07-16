import React, { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose && onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`alert alert-${type === 'error' ? 'danger' : type} position-fixed top-0 end-0 m-3`} style={{ zIndex: 2000, minWidth: 250 }}>
      {message}
      <button type="button" className="btn-close float-end" aria-label="Close" onClick={onClose}></button>
    </div>
  );
};

export default Notification; 