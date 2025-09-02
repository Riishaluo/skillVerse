const User = require("../models/userModel")
const Alert = require('../models/alertSchema')

exports.getNetwork = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id)
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const allUsers = await User.find({
      _id: { $ne: currentUser._id },
      role: { $ne: "admin" }
    }).select("-password")

    const recommended = []
    const others = []

    allUsers.forEach(user => {
      const hasMatch = user.skillsOffered.some(skill =>
        currentUser.skillsWanted.includes(skill)
      )

      const userObj = {
        ...user.toObject(),
        isFollowing: currentUser.following.includes(user._id)
      }

      if (hasMatch) {
        recommended.push(userObj)
      } else {
        others.push(userObj)
      }
    })

    return res.json({
      currentUser,
      recommended,
      others
    })
  } catch (err) {
    console.error("Network fetch error:", err)
    res.status(500).json({ message: "Server error" })
  }
}



exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id; 
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.following.includes(targetUserId)) {  
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });

      return res.json({ message: "Unfollowed successfully", status: "Unfollowed" });
    } else {
      // Follow logic
      await User.findByIdAndUpdate(currentUserId, { $push: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $push: { followers: currentUserId } });

      const newAlert = new Alert({
        user: targetUserId, // the one receiving the alert
        sender: currentUserId, // who triggered it
        message: "You got a new connection",
        type: "follow",
      });
      await newAlert.save();

      return res.json({ message: "Followed successfully", status: "Connected" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


