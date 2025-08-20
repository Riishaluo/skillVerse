const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  skillsOffered: [String],
  skillsWanted: [String],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
