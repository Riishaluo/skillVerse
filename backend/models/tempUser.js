const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TempUserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpiresAt: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = model('TempUser', TempUserSchema);
