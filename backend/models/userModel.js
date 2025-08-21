const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  },
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
  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  following: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
