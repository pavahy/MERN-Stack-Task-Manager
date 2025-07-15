  import React, { useState, useEffect } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import axios from 'axios';
  import api from '../api';
  import './Login.css';
  
  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    // ✅ Redirect to dashboard if already logged in
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined') {
        navigate('/dashboard');
      }
    }, [navigate]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!email || !password) {
        setError('Please fill in both email and password');
        return;
      }
  
      try {
       const res = await axios.post('https://mern-stack-task-manager-s8sd.onrender.com/api/users/login', {
  email,
  password,
});
  
        const token = res.data.token;
  
        if (!token) {
          setError('No token returned from server');
          return;
        }
  
        localStorage.setItem('token', token);
  
        // ✅ Navigate to dashboard after login
        navigate('/dashboard');
      } catch (err) {
        const msg =
          err.response?.data?.msg ||
          err.response?.data?.message ||
          'Invalid email or password';
        setError(msg);
      }
    };
  
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
  
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
  
            <button type="submit">Login</button>
          </form>
  
          <div className="login-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;
