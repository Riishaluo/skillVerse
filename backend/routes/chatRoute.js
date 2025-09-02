// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController")
const userAuth = require('../middleware/userAuth')

router.get("/:userId/:receiverId", userAuth, chatController.getMessages);
router.post("/send", userAuth, chatController.sendMessage);

module.exports = router;
