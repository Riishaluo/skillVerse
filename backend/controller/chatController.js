const Message = require("../models/messageSchema");

exports.getMessages = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;
    console.log('kjhgf')
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
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
    })

    req.io.to(receiverId.toString()).emit("receive-message", newMessage);
    req.io.to(req.user.id.toString()).emit("receive-message", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

