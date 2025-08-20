const User = require('../models/userModel')
const Post = require('../models/postSchema')



exports.showUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } })
            .select("-password")
            .lean()

        const userData = await Promise.all(
            users.map(async (user) => {
                const posts = await Post.find({ createdBy: user._id }).lean()

                const postReports = []
                posts.forEach((post) => {
                    if (Array.isArray(post.reports) && post.reports.length > 0) {
                        post.reports.forEach((r) => {
                            postReports.push({
                                reason: r.reason,
                                reportedBy: r.reportedBy,
                            })
                        })
                    }
                })

                return {
                    ...user,
                    skillsOfferedCount: user.skillsOffered?.length || 0,
                    skillsWantedCount: user.skillsWanted?.length || 0,
                    posts: posts.map((p) => {
                        const hasReports = Array.isArray(p.reports) && p.reports.length > 0
                        return {
                            _id: p._id,
                            type: p.type,
                            description: p.description,
                            photo: p.photo,
                            createdAt: p.createdAt,
                            isReported: hasReports,
                            reportReason: hasReports ? p.reports[0].reason : null,
                        }
                    }),
                    postReports,
                    userReports: user.reports || [],
                }
            })
        )
        console.log(userData)
        res.json(userData)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}


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