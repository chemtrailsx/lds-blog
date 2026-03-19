const router = require('express').Router();
const auth = require('../middleware/auth');
const WordOfTheWeek = require('../models/WordOfTheWeek');

// GET current word
router.get('/', async (req, res) => {
  try {
    let doc = await WordOfTheWeek.findOne();
    if (!doc) doc = await WordOfTheWeek.create({ word: 'Iridescent', definition: 'Showing luminous colours that seem to change when seen from different angles.' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update word (admin only)
router.put('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { word, definition } = req.body;
    let doc = await WordOfTheWeek.findOne();
    if (!doc) doc = new WordOfTheWeek();
    doc.word = word;
    doc.definition = definition;
    doc.updatedAt = new Date();
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
