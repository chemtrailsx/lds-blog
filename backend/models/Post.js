const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  author:     { type: String, required: true },
  category:   { type: String, required: true, enum: ['Literature', 'Debate', 'Philosophy', 'Poetry', 'Essays'] },
  coverImage: { type: String, default: '' },
  body:       { type: String, required: true },
  editor:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
