const mongoose = require("mongoose")

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["admin", "follow","comment"],
      default: "admin",
    },
    isRead: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
)

module.exports = mongoose.model("Alert", alertSchema)
