const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cors = require('cors')
require('dotenv').config();
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser');


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/skillverse')
  .then(() => console.log(' MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));


app.use('/user',userRoutes)
app.use('/admin',adminRoutes)


app.listen(9999, () => {
  console.log("Server running on port 9999");
})
