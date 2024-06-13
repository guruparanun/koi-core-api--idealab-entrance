const mongoose = require('mongoose');

const KOLSchema = new mongoose.Schema({
  name: { type: String, required: true },
  platform: { type: String, required: true },
  sex: { type: String, required: true },
  categories: { type: [String], required: true },
  tel: { type: String, required: true },
  link: { type: String, required: true },
  followers: { type: Number, required: true },
  photoCost: { type: Number, required: true },
  videoCost: { type: Number, required: true },
  er: { type: String, required: true },
}, {
  timestamps: true
});

KOLSchema.index({ name: 1, platform: 1 }, { unique: true }); // Composite index

module.exports = mongoose.model('KOL', KOLSchema);
