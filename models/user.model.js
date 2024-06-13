const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Storing hashed passwords
  name: { type: String, required: true },
  googleId: { type: String }, // For Google OAuth
}, {
  timestamps: true
});

UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
