require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const imageRoutes = require('./routes/images');
const profileRoutes = require('./routes/profile');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed =
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin);
    isAllowed ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);
      isAllowed ? callback(null, true) : callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/images', imageRoutes);
app.use('/api/v1/profile', profileRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
