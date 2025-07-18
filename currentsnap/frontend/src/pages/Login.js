// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '', admin: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      if (form.admin) {
        const { data } = await axios.post('http://localhost:3000/api/auth/admin-login', { password: form.password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        navigate('/');
      } else {
        const { data } = await axios.post('http://localhost:3000/api/auth/login', { username: form.username, password: form.password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId);
        navigate('/');
      }
    } catch (error) {
      alert(error.response?.data.message || 'Login failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        disabled={form.admin}
      />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <div>
        <label>
          <input
            type="checkbox"
            name="admin"
            onChange={(e) => setForm({ ...form, admin: e.target.checked })}
          /> Admin Login
        </label>
      </div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate('/register')}>Register as Member</button>
      <button onClick={() => { localStorage.setItem('role', 'guest'); navigate('/'); }}>
        Continue as Guest
      </button>
    </motion.div>
  );
};

export default Login;
