const User = require("../models/userModel");
const Skill = require("../models/skillSchema");

exports.getDashboardStats = async (req, res) => {
  try {
    console.log("here")
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentSkills = await Skill.find().sort({ createdAt: -1 }).limit(5);

    console.log(totalUsers)
    console.log(totalSkills)
    console.log(recentUsers)
    console.log(recentSkills)


    res.json({
      totalUsers,
      totalSkills,
      recentUsers,
      recentSkills: recentSkills.map((s) => s.name),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
