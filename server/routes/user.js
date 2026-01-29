const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/role', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;