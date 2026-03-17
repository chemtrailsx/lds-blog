const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['user', 'admin'], default: 'user' },
  name:        { type: String, default: '' },
  gender:      { type: String, enum: ['', 'Male', 'Female', 'Non-binary', 'Prefer not to say'], default: '' },
  memberSince: { type: String, default: '' },
  bio:         { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
