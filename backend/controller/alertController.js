const Alert = require("../models/alertSchema");
const User = require('../models/userModel')

exports.sendAlert = async (req, res) => {
  try {
    const { userId } = req.params
    const { message } = req.body

    if (!userId) {
      return res.status(400).json({ message: "UserId is required in params" });
    }
    if (!message) {
      return res.status(400).json({ message: "Message is required in body" });
    }

    const alert = new Alert({
      user: userId,
      message: message,
    });

    await alert.save()

    const io = req.app.get("io");
    io.to(userId).emit("receive-alert", alert);

    res.json({
      message: `Alert sent to user ${userId}`,
      alert
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 });

    const unreadCount = await Alert.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.json({ alerts, unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { user: req.user.id, isRead: false },  
      { $set: { isRead: true } }
    );
    res.json({ success: true, message: "All alerts marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



