const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type:    { type: String, default: 'new_post' },
  title:   { type: String, required: true },
  author:  { type: String, required: true },
  category:{ type: String },
  postId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
