const express = require('express')
const router = express.Router()
const adminLoginController = require('../controller/adminLoginController')
const verifyAdmin = require('../middleware/adminAuth')
const skillController = require('../controller/adminSkillController')
const userAuth = require('../middleware/userAuth')
const userManagement = require('../controller/adminUserController')



router.post("/adminLogin", adminLoginController.adminLogin)
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome Admin!" })
})


//skills section
router.get("/skills-management", skillController.getSkills);
router.post("/skills-management", skillController.addSkill);
router.put("/:id", skillController.updateSkill);
router.patch("/skills-management/:id/toggle", skillController.toggleSkill);




router.get("/users",userManagement.showUsers)
router.put("/block-user/:id",userManagement.blockUser)
router.post("/send-alert/:id",userManagement.sendAlert)



router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Admin logged out successfully" });
});







module.exports = router;
