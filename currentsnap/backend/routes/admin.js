// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Get list of pending member registrations
router.get('/members/pending', authenticate, requireAdmin, async (req, res) => {
  try {
    const pendingMembers = await User.findAll({ where: { role: 'member', approved: false } });
    res.json(pendingMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/members', authenticate, requireAdmin, async (req, res) => {
  try {
    const members = await User.findAll({
      where: { role: 'member' },
      attributes: ['id', 'username', 'approved', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve a member registration
router.post('/members/:id/approve', authenticate, requireAdmin, async (req, res) => {
  try {
    await User.update({ approved: true }, { where: { id: req.params.id } });
    res.json({ message: 'Member approved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a member
router.delete('/members/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
