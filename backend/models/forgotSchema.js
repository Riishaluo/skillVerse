const mongoose = require("mongoose");

const ForgotPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },  
  createdAt: { type: Date, default: Date.now, expires: 300 } 
});

module.exports = mongoose.model("ForgotPassword", ForgotPasswordSchema);
