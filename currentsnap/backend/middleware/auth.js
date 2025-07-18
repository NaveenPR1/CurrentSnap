// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = '3f1e4f6c9a2b7e8c0d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d'; // Change for production

// Verify JWT token and attach decoded info to req.user
function authenticate(req, res, next) {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Middleware to require admin role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Middleware to require member (or admin)
function requireMember(req, res, next) {
  if (!req.user || (req.user.role !== 'member' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Member access required' });
  }
  next();
}

module.exports = { authenticate, requireAdmin, requireMember, SECRET_KEY };
