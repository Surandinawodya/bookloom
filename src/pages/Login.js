import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      const token = res.data.token;
      if (rememberMe) {
        localStorage.setItem('token', res.data.token);  // Save JWT token
        localStorage.setItem('userId', res.data.user._id); // Save user ID
        
      } else {
        sessionStorage.setItem('token', token);
      }

      alert('Login successful!');
      navigate('/homepage'); // ⬅️ Use navigate instead of window.location.href
    } catch (err) {
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2 className="form-title">Welcome Back to BookLoom </h2>

        <input
          type="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        <button type="submit" className="btn-primary">Login</button>

        <div className="auth-links">
          <Link to="/register">Create New Account</Link>
          <Link to="/forgot-password" style={{ float: 'right' }}>Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
