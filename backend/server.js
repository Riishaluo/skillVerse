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
const Alert = require("./models/alertSchema");

const app = express();
const server = http.createServer(app);

// ==================
// Middlewares
// ==================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ==================
// Socket.IO setup
// ==================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// ==================
// Socket Events
// ==================
function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // User joins their private room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`📌 User ${userId} joined their room`);
    });

    // 📩 Chat Messages
    socket.on("send-message", async (data) => {
      try {
        console.log("📩 Incoming message:", data);

        const { sender, receiver, message } = data;

        // Save message to DB
        const newMessage = await Message.create({ sender, receiver, message });

        console.log("✅ Message saved:", newMessage);

        // Emit to both sender & receiver rooms
        io.to(receiver).emit("receive-message", newMessage);
        io.to(sender).emit("receive-message", newMessage);
      } catch (error) {
        console.error("❌ Error saving message:", error.message);
      }
    });

    // 🚨 Alerts
    socket.on("send-alert", async (data) => {
      try {
        const { sender, receiver, title, description } = data;

        // Save alert to DB
        const newAlert = await Alert.create({
          sender,
          receiver,
          title,
          description,
        });

        console.log("✅ Alert saved:", newAlert);

        // Emit alert to receiver in real-time
        io.to(receiver).emit("receive-alert", newAlert);
      } catch (error) {
        console.error("❌ Error saving alert:", error.message);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

// initialize socket
initSocket(io);

// ==================
// MongoDB Connection
// ==================
mongoose
  .connect("mongodb://127.0.0.1:27017/skillverse")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ==================
// Routes
// ==================
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/api/messages", chatRoutes);

// ==================
// Start Server
// ==================
server.listen(9999, () => {
  console.log("🚀 Server running on port 9999");
});
