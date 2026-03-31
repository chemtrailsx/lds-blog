const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { isValidEmailDomain } = require('../utils/validateEmail');
const { sendPasswordReset } = require('../utils/mailer');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const makeToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  gender: user.gender,
  memberSince: user.memberSince,
  bio: user.bio,
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    if (!isValidEmailDomain(email))
      return res.status(400).json({ error: 'Please use a valid email address from a recognised provider' });

    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

    // Notify admin of new registration
    await Notification.create({
      type: 'new_user',
      title: `New member: ${user.name}`,
      author: user.name,
      category: 'Registration',
      userId: user._id,
    });
    const io = req.app.get('io');
    io.emit('new_user', { userId: user._id, name: user.name, email: user.email });

    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordReset(user.email, resetUrl);

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ error: 'Token and new password required' });

    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired reset link' });

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET pending users (readers awaiting writer approval)
router.get('/pending-users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: 'reader' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH approve user as writer
router.patch('/approve-writer/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'writer' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH revoke writer back to reader
router.patch('/revoke-writer/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'reader' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users (for members carousel)
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find().select('name _id').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;