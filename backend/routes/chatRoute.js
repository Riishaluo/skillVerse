// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController")
const userAuth = require('../middleware/userAuth')

router.get("/:userId/:receiverId", userAuth, chatController.getMessages);
router.post("/send", userAuth, chatController.sendMessage);
router.put("/:receiverId/mark-read", userAuth, chatController.markMessagesAsRead)
router.get("/overview/chats", userAuth, chatController.getChatsOverview);



module.exports = router;
