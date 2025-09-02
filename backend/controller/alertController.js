const Alert = require("../models/alertSchema");
const User = require('../models/userModel')

exports.sendAlert = async (req, res) => {
    try {
        const { userId } = req.params;   
        const { message } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "UserId is required in params" });
        }
        if (!message) {
            return res.status(400).json({ message: "Message is required in body" });
        }
        console.log(message);

        const alert = new Alert({
            user: userId,   
            message: message,
        });

        await alert.save();

        res.json({
            message: `Alert sent to user ${userId}`,
            alert
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id })
      .populate("sender", "name avatar") 
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { isRead: true },
      { new: true }
    );
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


