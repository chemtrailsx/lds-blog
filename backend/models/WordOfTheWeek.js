const mongoose = require('mongoose');

const wotw = new mongoose.Schema({
  word:       { type: String, default: '' },
  definition: { type: String, default: '' },
  updatedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('WordOfTheWeek', wotw);
