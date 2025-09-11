const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/messageSchema");
const chatRoutes = require("./routes/chatRoute");
const Alert = require("./models/alertSchema")


const app = express()
const server = http.createServer(app)


app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())



const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

const onlineUsers = new Map();
app.set("onlineUsers", onlineUsers);

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      onlineUsers.set(userId.toString(), socket.id);
      console.log(`✅ User ${userId} joined. Online users:`, onlineUsers);
    });

    socket.on("send-message", async (data) => {
      try {
        console.log("📩 Incoming message:", data);

        const { sender, receiver, message } = data;

        const newMessage = await Message.create({ sender, receiver, message });
        const messageObj = newMessage.toObject();

        io.to(receiver.toString()).emit("receive-message", messageObj);
        io.to(sender.toString()).emit("receive-message", messageObj);
      } catch (error) {
        console.error("❌ Error saving message:", error.message);
      }
    });

    socket.on("send-alert", async (data) => {
      try {
        const { user,sender, receiver, title, description } = data;

        const newAlert = await Alert.create({
          user,
          sender,
          receiver,
          title,
          description,
        });

        console.log("✅ Alert saved:", newAlert);

        io.to(receiver).emit("receive-alert", newAlert);
      } catch (error) {
        console.error("❌ Error saving alert:", error.message);
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

initSocket(io);

mongoose
  .connect("mongodb://127.0.0.1:27017/skillverse")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/api/messages", chatRoutes);

server.listen(9999, () => {
  console.log("🚀 Server running on port 9999");
});
