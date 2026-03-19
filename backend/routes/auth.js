// Auth routes are no longer needed — Clerk handles all authentication.
// Keeping this file as an empty router so server.js doesn't crash on import.
const router = require('express').Router();

router.get('/health', (req, res) => res.json({ status: 'Auth handled by Clerk' }));

module.exports = router;
