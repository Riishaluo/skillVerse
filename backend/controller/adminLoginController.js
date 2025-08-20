const User = require('../models/userModel')
require("dotenv").config()
const jwt = require("jsonwebtoken");



exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email" });

        if (password !== user.password) {
            return res.status(400).json({ message: "Password is wrong" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Not an admin" });
        }

        const token = jwt.sign(
            { id: user._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log(token)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 60 * 60 * 1000
        });

        res.json({ message: "Admin login successful", token });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
