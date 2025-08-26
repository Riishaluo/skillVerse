  const mongoose = require("mongoose");

  const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
  });


  const ReportSchema = new mongoose.Schema({
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  })

  const PostSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref:   "User", required: true },
    type: { type: String, enum: ["Post", "Event"], required: true },
    description: { type: String, required: true },
    photo: { type: String }, 
    createdAt: { type: Date, default: Date.now },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
    reports: [ReportSchema]
  });

  module.exports = mongoose.model("Post", PostSchema);
