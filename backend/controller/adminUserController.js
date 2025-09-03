const User = require('../models/userModel')
const Post = require('../models/postSchema')


// Show all users (basic info only)
exports.showUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .lean();

    const userData = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      isBlocked: user.isBlocked,
      isPremium: user.isPremium,
      skillsOfferedCount: user.skillsOffered?.length || 0,
      skillsWantedCount: user.skillsWanted?.length || 0,
      reportsCount: user.reports?.length || 0,
    }));

    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ createdBy: user._id }).lean();

    const postReports = [];
    posts.forEach((post) => {
      if (Array.isArray(post.reports) && post.reports.length > 0) {
        post.reports.forEach((r) => {
          postReports.push({
            reason: r.reason,
            reportedBy: r.reportedBy,
          });
        });
      }
    });

    const detailedUser = {
      ...user,
      posts: posts.map((p) => {
        const hasReports = Array.isArray(p.reports) && p.reports.length > 0;
        return {
          _id: p._id,
          type: p.type,
          description: p.description,
          photo: p.photo,
          createdAt: p.createdAt,
          isReported: hasReports,
          reportReason: hasReports ? p.reports[0].reason : null,
        };
      }),
      postReports,
      userReports: user.reports || [],
    };

    res.json(detailedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found" })

        user.isBlocked = !user.isBlocked
        await user.save()

        res.json({ message: user.isBlocked ? "User blocked" : "User unblocked", user })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

exports.sendAlert = async (req, res) => {
    try {
        const { message } = req.body
        res.json({ message: `Alert sent to user ${req.params.id}`, alert: message })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}