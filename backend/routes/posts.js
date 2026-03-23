const router = require('express').Router();
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const { authMiddleware, writerMiddleware } = require('../middleware/auth');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('editor', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('editor', 'name');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', authMiddleware, writerMiddleware, async (req, res) => {
  try {
    const { title, author, category, coverImage, body } = req.body;
    if (!title || !author || !category || !body)
      return res.status(400).json({ error: 'Validation failed', fields: ['title', 'author', 'category', 'body'] });

    const post = await Post.create({ title, author, category, coverImage, body, editor: req.user.sub });

    // Save notification to DB
    await Notification.create({ title: post.title, author: post.author, category: post.category, postId: post._id });

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('new_post', { title: post.title, author: post.author, category: post.category, postId: post._id });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT edit
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isOwner = post.editor.toString() === req.user.sub;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' });

    const { title, author, category, coverImage, body } = req.body;
    if (title) post.title = title;
    if (author) post.author = author;
    if (category) post.category = category;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (body) post.body = body;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isOwner = post.editor.toString() === req.user.sub;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
