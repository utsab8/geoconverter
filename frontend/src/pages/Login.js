import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const navigate = useNavigate();

  const validate = () => {
    if (!username.trim()) return 'Username is required.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('auth/login/', { username, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials.');
      } else {
        setError('Network error. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleRetry = () => {
    setRetry(r => r + 1);
    setError('');
    setSuccess('');
    setLoading(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control${error && !username ? ' is-invalid' : ''}`}
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          {error && !username && <div className="invalid-feedback">Username is required.</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control${error && (!password || password.length < 6) ? ' is-invalid' : ''}`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && !password && <div className="invalid-feedback">Password is required.</div>}
          {error && password && password.length < 6 && <div className="invalid-feedback">Password must be at least 6 characters.</div>}
        </div>
        {error && <Notification message={error} type="error" onClose={() => setError('')} />}
        {success && <Notification message={success} type="success" onClose={() => setSuccess('')} />}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && error.includes('Network') && (
          <button type="button" className="btn btn-link w-100 mt-2" onClick={handleRetry}>
            Retry
          </button>
        )}
      </form>
    </div>
  );
};

export default Login; 