const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hasMovement: { type: Boolean, required: true },
  count: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Movement', movementSchema);
