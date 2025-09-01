const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cors = require('cors')
require('dotenv').config();
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser');
const http = require('http')
const { Server } = require("socket.io");
const Message = require('./models/messageSchema')


const server = http.createServer(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});


// server.js
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Join room with userId (after frontend sends it)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  // Listen for messages (if you want socket-only messaging)
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const newMessage = await Message.create({ sender: senderId, receiver: receiverId, message });

    // Emit to receiver only
    io.to(receiverId).emit("newMessage", newMessage);

    // Optionally emit back to sender so his UI updates instantly
    io.to(senderId).emit("newMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});



mongoose.connect('mongodb://127.0.0.1:27017/skillverse')
  .then(() => console.log(' MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));


app.use('/user',userRoutes)
app.use('/admin',adminRoutes)


server.listen(9999, () => {
  console.log("Server running on port 9999");
})
