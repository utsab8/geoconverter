import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import UploadFile from './pages/UploadFile';
import FileListPage from './pages/FileListPage';
import ConvertFile from './pages/ConvertFile';

function Home() {
  return <h2>Home Page</h2>;
}
function Placeholder({ title }) {
  return <h3>{title} (Coming soon)</h3>;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/upload" element={<ProtectedRoute><UploadFile /></ProtectedRoute>} />
        <Route path="/dashboard/files" element={<ProtectedRoute><FileListPage /></ProtectedRoute>} />
        <Route path="/dashboard/convert" element={<ProtectedRoute><ConvertFile /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><Placeholder title="Profile" /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
