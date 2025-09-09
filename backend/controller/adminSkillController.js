const Skill = require("../models/skillSchema");
const User = require('../models/userModel')



exports.getSkills = async (req, res) => {
  try {
    const adminSkills = await Skill.find({ createdByAdmin: true })
    const userSkills = await Skill.find({ createdByAdmin: false })
    res.json({ adminSkills, userSkills });
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { name, createdByAdmin } = req.body;
    
    const newSkill = new Skill({ name, createdByAdmin });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Skill already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
}

exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    const oldName = skill.name;
    skill.name = name;
    const updated = await skill.save();

    await User.updateMany(
      { skillsOffered: oldName },
      { $set: { "skillsOffered.$": name } }
    );

    await User.updateMany(
      { skillsWanted: oldName },
      { $set: { "skillsWanted.$": name } }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating skill:", err);
    res.status(500).json({ message: "Server error" });
  }
}


exports.toggleSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    console.log(skill)
    skill.active = !skill.active;
    await skill.save();

    if (!skill.active) {
      await User.updateMany(
        { skillsOffered: skill.name },
        { $pull: { skillsOffered: skill.name } }
      );

      await User.updateMany(
        { skillsWanted: skill.name },
        { $pull: { skillsWanted: skill.name } }
      );
    }

    console.log('jjssj')

    res.json(skill);
  } catch (err) {
    console.error("Error toggling skill:", err);
    res.status(500).json({ message: "Server error" });
  }
};
