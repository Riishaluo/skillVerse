// controllers/chatController.js
const Message = require("../models/messageSchema");

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params; 
    const myId = req.user.id; 

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message,
    });

    req.io.to(receiverId.toString()).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
