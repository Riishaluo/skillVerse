const Razorpay = require("razorpay");
const Payment = require("../models/paymentSchema");
const User = require("../models/userModel");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; 
    console.log(amount)
    const options = {
      amount: amount, 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };
    console.log(req.user.id)
    const order = await instance.orders.create(options);

    console.log(order)

    await Payment.create({
      user: req.user.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
    });

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order" });
  }
};


exports.verifyPayment = async (req, res) => {
    console.log('entered to verification')
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, signature: razorpay_signature, status: "paid" }
    );

    await User.findByIdAndUpdate(req.user.id, { isPremium: true });

    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
}
