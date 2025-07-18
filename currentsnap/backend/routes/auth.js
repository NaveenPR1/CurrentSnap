// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { SECRET_KEY } = require('../middleware/auth');

const ADMIN_PASSWORD = 'admin123'; // Adjust as needed

// Member Registration – new members must await admin approval
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, role: 'member', approved: false });
    res.json({ message: 'Registration successful. Await admin approval.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Member Login – only approved members can log in
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (!user.approved) return res.status(403).json({ message: 'Awaiting admin approval' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login – using secret admin password
router.post('/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token, role: 'admin' });
  }
  res.status(401).json({ message: 'Invalid admin credentials' });
});

module.exports = router;
