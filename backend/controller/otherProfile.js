const User = require('../models/userModel')
const Post = require('../models/postSchema')


exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password -email") 
      .populate("followers", "name avatar")
      .populate("following", "name avatar")

      console.log(user)

    if (!user) return res.status(404).json({ message: "User not found" })

    const posts = await Post.find({ createdBy: id })
      .populate("createdBy", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ user: { ...user.toObject(), posts } })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
};