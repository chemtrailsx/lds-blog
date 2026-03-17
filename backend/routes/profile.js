const router = require('express').Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// GET my profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, gender, memberSince, bio } = req.body;
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (gender !== undefined) user.gender = gender;
    if (memberSince !== undefined) user.memberSince = memberSince;
    if (bio !== undefined) user.bio = bio;

    await user.save();
    res.json({ id: user._id, username: user.username, name: user.name, role: user.role, gender: user.gender, memberSince: user.memberSince, bio: user.bio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
