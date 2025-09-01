const User = require('../models/userModel')
const Post = require('../models/postSchema')




exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("followers", "name email")
      .populate("following", "name email")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const posts = await Post.find({ createdBy: req.user.id })
      .populate("createdBy", "name email")
      .populate("comments.commentedBy", "name email avatar")
      .populate("reports.reportedBy", "name email")
      .sort({ createdAt: -1 })
      .lean() 

    const formattedPosts = posts.map((post) => ({
      ...post,
      likesCount: post.likes?.length || 0,
      likedByCurrentUser: post.likes?.some(
        (id) => id.toString() === req.user.id.toString()
      ),
    }))

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        skillsOffering: user.skillsOffered || [],
        followers: user.followers || [],
        following: user.following || [],
        avatar: user.avatar,
        posts: formattedPosts, 
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.updateBio = async (req, res) => {
    try {
        const { bio } = req.body

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { bio } },
            { new: true }
        ).select("-password")

        res.json({ message: "Bio updated successfully", user })
    } catch (err) {
        res.status(500).json({ message: "Failed to update bio", error: err.message })
    }
}

exports.updateSkills = async (req, res) => {
    try {
        const updateData = {};

        if (req.body.skillsOffered !== undefined) {
            updateData.skillsOffered = req.body.skillsOffered;
        }
        if (req.body.skillsWanted !== undefined) {
            updateData.skillsWanted = req.body.skillsWanted;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        res.json({ message: "Skills updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Failed to update skills", error: err.message });
    }
}

exports.updateProfilePictureController = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrl = req.file.path;
    console.log(imageUrl)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: imageUrl },
      { new: true }
    );
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating profile picture" });
  }
}

exports.getRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const learnMatches = await User.find({
      skillsOffered: { $in: currentUser.skillsWanted },
      _id: { $ne: currentUser._id } 
    }).select("name avatar skillsOffered");

    const teachMatches = await User.find({
      skillsWanted: { $in: currentUser.skillsOffered },
      _id: { $ne: currentUser._id }
    }).select("name avatar skillsWanted");

    res.json({
      learnFrom: learnMatches,
      teachTo: teachMatches
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error });
  }
}