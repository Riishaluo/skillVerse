const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: String, required: true }, 
  paymentId: { type: String },                
  signature: { type: String },               
  amount: { type: Number, required: true },  
  currency: { type: String, default: "INR" },
  status: { type: String, default: "created" }, 
}, { timestamps: true })

module.exports = mongoose.model("Payment", PaymentSchema)
