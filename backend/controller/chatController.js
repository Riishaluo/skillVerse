const Message = require("../models/messageSchema");

// Get messages between two users with unread messages on top
exports.getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ],
    })
      .sort({ isRead: 1, createdAt: 1 }) // unread first, then by time
      .lean();

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message,
      isRead: false, // new messages are unread
    });

    // emit message to both sender and receiver
    req.io.to(receiverId.toString()).emit("receive-message", newMessage);
    req.io.to(req.user.id.toString()).emit("receive-message", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark messages as read when user opens chat
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { receiverId } = req.params;

    await Message.updateMany(
      { sender: receiverId, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getChatsOverview = async (req, res) => {
  try {
    // Only users you are following
    const following = await User.find({ followers: req.user.id }).lean();

    const chats = await Promise.all(
      following.map(async (f) => {
        // Last message between you and this user
        const lastMsg = await Message.findOne({
          $or: [
            { sender: req.user.id, receiver: f._id },
            { sender: f._id, receiver: req.user.id }
          ]
        }).sort({ createdAt: -1 }).lean();

        // Unread messages count
        const unreadCount = await Message.countDocuments({
          sender: f._id,
          receiver: req.user.id,
          isRead: false
        });

        return {
          ...f,
          lastMessage: lastMsg?.message || "",
          lastTime: lastMsg?.createdAt,
          unreadCount
        };
      })
    );

    // Sort: unread first, then by last message time
    chats.sort((a, b) => {
      if (a.unreadCount && !b.unreadCount) return -1;
      if (!a.unreadCount && b.unreadCount) return 1;
      return new Date(b.lastTime || 0) - new Date(a.lastTime || 0);
    });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};