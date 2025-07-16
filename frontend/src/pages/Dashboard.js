import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapView from '../components/MapView';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 p-0">
            <Sidebar />
          </div>
          <div className="col-md-9 p-4">
            <h2>Welcome to your Dashboard</h2>
            <p>This is your main workspace. Use the sidebar to navigate.</p>
            <MapView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 