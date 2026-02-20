const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptom: { type: String, required: true },
  risk: { type: String, enum: ['Safe', 'Medium', 'High'], default: 'Safe' },
  advice: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Symptom', symptomSchema);
