// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      alert('Registration successful. Please wait for admin approval.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="register-container">
      <h2>Register</h2>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button onClick={handleRegister}>Register</button>
    </motion.div>
  );
};

export default Register;
