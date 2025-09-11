const express = require('express')
const router = express.Router()
const adminLoginController = require('../controller/adminLoginController')
const verifyAdmin = require('../middleware/adminAuth')
const skillController = require('../controller/adminSkillController')
const userManagement = require('../controller/adminUserController')
const alertController = require('../controller/alertController')
const userAuth = require('../middleware/userAuth')
const dashboard = require('../controller/dashboard')
const feedbackController = require('../controller/feedbackController')

router.post("/adminLogin", adminLoginController.adminLogin)
router.get("/dashboard", verifyAdmin, dashboard.getDashboardStats)


router.get("/skills-management", skillController.getSkills);
router.post("/skills-management", skillController.addSkill);
router.put("/:id", skillController.updateSkill);
router.patch("/skills-management/:id/toggle", skillController.toggleSkill);





router.get("/users", userManagement.showUsers)     
router.get("/users/:id", userManagement.getUserById)
router.put("/block-user/:id",userManagement.blockUser)

router.post("/send-alert/:userId", alertController.sendAlert);


router.get("/feedbacks", feedbackController.getAllFeedbacks);


router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Admin logged out successfully" });
});







module.exports = router;
