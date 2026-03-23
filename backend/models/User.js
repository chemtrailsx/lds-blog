const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  password:         { type: String, required: true },
  role:             { type: String, enum: ['reader', 'writer', 'admin'], default: 'reader' },
  gender:           { type: String, enum: ['', 'Male', 'Female', 'Non-binary', 'Prefer not to say'], default: '' },
  memberSince:      { type: String, default: '' },
  bio:              { type: String, default: '' },
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date },
  createdAt:        { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
