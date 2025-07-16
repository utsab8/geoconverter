import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="bg-light border-end vh-100 p-3" style={{ minWidth: 200 }}>
    <h5>Dashboard</h5>
    <ul className="nav flex-column">
      <li className="nav-item mb-2">
        <Link className="nav-link" to="/dashboard">Home</Link>
      </li>
      <li className="nav-item mb-2">
        <Link className="nav-link" to="/dashboard/upload">Upload File</Link>
      </li>
      <li className="nav-item mb-2">
        <Link className="nav-link" to="/dashboard/files">My Files</Link>
      </li>
      <li className="nav-item mb-2">
        <Link className="nav-link" to="/dashboard/convert">Convert</Link>
      </li>
      <li className="nav-item mb-2">
        <Link className="nav-link" to="/dashboard/profile">Profile</Link>
      </li>
    </ul>
  </div>
);

export default Sidebar; 