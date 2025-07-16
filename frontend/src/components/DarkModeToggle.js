import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', dark);
  }, [dark]);

  return (
    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={() => setDark(d => !d)}>
      {dark ? '☾ Dark' : '☀ Light'}
    </button>
  );
};

export default DarkModeToggle; 