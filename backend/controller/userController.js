const bcrypt = require('bcrypt')
const TempUser = require('../models/tempUser')
const User = require('../models/userModel')
const Skill = require('../models/skillSchema')
const sendOtp = require('../utils/sentOtp')
const Post = require('../models/postSchema')
const jwt = require('jsonwebtoken')
const ForgotPassword = require("../models/forgotSchema");




//frontend auth
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getRegisterPage = (req, res) => {
  res.json({ message: "Register page route" })
}

exports.getOtpPage = (req, res) => {
  res.json({ message: "OTP page route" })
}

exports.sendOtpController = async (req, res) => {
  const { name, email, password } = req.body

  console.log(name, email, password)

  try {
    const existingUser = await User.findOne({ email });
    console.log(existingUser)
    if (existingUser) {
      return res.status(400).json({ message: "User Already Existed" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await TempUser.findOneAndDelete({ email })

    await TempUser.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: new Date(Date.now() + 30 * 1000)
    })

    await sendOtp(email, otp)

    res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}


exports.verifyOtpController = async (req, res) => {
  const { email, otp } = req.body

  try {
    const user = await TempUser.findOne({ email })

    if (!user) return res.status(404).json({ message: 'No OTP found. Please resend.' })

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' })

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please resend.' });
    }

    user.isVerified = true
    await user.save()

    res.status(200).json({ success: true, message: 'OTP verified successfully' })
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
}


exports.registerSkillsController = async (req, res) => {
  const { email, skillsOffered, skillsWanted } = req.body;
  console.log(req.body);
  try {
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser || !tempUser.isVerified) {
      return res.status(404).json({ message: "User not verified or already registered" });
    }

    const allSkills = [...(skillsOffered || []), ...(skillsWanted || [])]
    for (const skillName of allSkills) {
      const trimmedName = skillName.trim()
      if (!trimmedName) continue

      const exists = await Skill.findOne({ name: trimmedName })
      if (!exists) {
        await Skill.create({ name: trimmedName, createdByAdmin: false })
      }
    }

    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      skillsOffered,
      skillsWanted
    })

    await newUser.save()
    await TempUser.deleteOne({ email })

    res.status(201).json({ message: "User registered successfully" })
  } catch (err) {
    console.error("Error in registerSkillsController:", err)
    res.status(500).json({ message: "Server error" })
  }
}

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdByAdmin: -1, name: 1 })
    res.json(skills)
  } catch (err) {
    console.error("Error fetching skills:", err)
    res.status(500).json({ message: "Server error" })
  }
}

exports.login = async (req, res) => {
  console.log('here')
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid email" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "password is wrong" })

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000
    })

    res.json({
      message: "Login successful", token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.home = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId).select("email name isPremium avatar")
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const posts = await Post.find()
      .populate("createdBy", "name email avatar")
      .populate("comments.commentedBy", "name avatar")
      .sort({ createdAt: -1 })

    const formattedPosts = posts.map(post => ({
      ...post.toObject(),
      likesCount: post.likes.length,
      likedByCurrentUser: post.likes.some(likeId => likeId.equals(userId))
    }))

    res.status(200).json({
      user,
      posts: formattedPosts,
    })

  } catch (error) {
    console.error("error in home:", error)
    res.status(500).json({ message: "Server error" })
  }
}


exports.resendOtpController = async (req, res) => {
  const { email } = req.body

  try {
    const user = await TempUser.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No registration found. Please register again.' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 30 * 1000);
    await user.save();

    await sendOtp(email, otp);

    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() +  30 * 1000); 

    await ForgotPassword.findOneAndUpdate(
      { email },
      { email, otp, otpExpiresAt, verified: false },
      { upsert: true, new: true }
    );

    await sendOtp(email, otp);

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Verify OTP
exports.verifyForgotPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const temp = await ForgotPassword.findOne({ email });
    if (!temp) return res.status(404).json({ message: "OTP not found" });

    if (temp.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (temp.otpExpiresAt < new Date()) {
      await ForgotPassword.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    temp.verified = true;
    await temp.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified, you may reset your password",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  console.log(email, newPassword)

  try {
    const temp = await ForgotPassword.findOne({ email });
    if (!temp || !temp.verified)
      return res.status(400).json({ message: "OTP verification required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    await ForgotPassword.deleteOne({ email });

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.resendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const temp = await ForgotPassword.findOne({ email });
    if (!temp) return res.status(404).json({ message: "No OTP request found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    temp.otp = otp;
    temp.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    temp.verified = false;
    await temp.save();

    await sendOtp(email, otp);

    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
}
