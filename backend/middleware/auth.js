const { requireAuth } = require('@clerk/express');

// Clerk's requireAuth() middleware populates req.auth with { userId, sessionId, ... }
// We map req.auth.userId → req.user.sub so downstream route handlers stay unchanged
function authMiddleware(req, res, next) {
  requireAuth()(req, res, (err) => {
    if (err) return res.status(401).json({ error: 'Authentication required' });
    // Map Clerk's auth shape to the old { sub, role } shape used by route handlers
    req.user = { sub: req.auth.userId, role: req.auth.sessionClaims?.metadata?.role || 'user' };
    next();
  });
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

module.exports = { authMiddleware, adminMiddleware };
