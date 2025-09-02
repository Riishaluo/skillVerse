const express = require('express');
const router = express.Router();
const authController = require('../controller/userController')
const userAuth = require('../middleware/userAuth')
const postController = require('../controller/postController')
const multer = require("multer");
const paymentController = require('../controller/paymentController')
const networkController = require('../controller/networkController')
const profileController = require('../controller/profile')
const {postStorage} = require('../utils/cloudinary')
const {profileStorage} = require('../utils/cloudinary')
const User = require('../models/userModel')
const alertController = require('../controller/alertController')

const uploadPost = multer({ storage: postStorage });
const uploadProfile = multer({ storage: profileStorage });





router.get("/me", userAuth, authController.getMe);



router.get("/", userAuth, authController.home)
router.get('/register', authController.getRegisterPage)
router.get('/renderOtp', authController.getOtpPage)
router.post('/send-otp', authController.sendOtpController)
router.post('/verify-otp', authController.verifyOtpController)
router.get("/skills", authController.getSkills)
router.post("/register-skills", authController.registerSkillsController)
router.post('/login', authController.login)
router.post('/resend-otp', authController.resendOtpController);
router.post("/logout", authController.logout);



//post
router.post("/createPost", userAuth, uploadPost.single("photo"), postController.createPost);
router.post("/:postId/like", userAuth, postController.toggleLike);
router.post("/:postId/comment", userAuth, postController.addComment);
router.post("/:postId/report", userAuth, postController.addReport);



//payment
router.post("/create-order", userAuth, paymentController.createOrder)
router.post("/verify", userAuth, paymentController.verifyPayment)


//network
router.get("/network", userAuth, networkController.getNetwork);
router.post("/follow/:userId", userAuth, networkController.followUser);


//forgot 
router.post("/forgot-password", authController.sendForgotPasswordOtp)
router.post("/verify-forgot-otp", authController.verifyForgotPasswordOtp)
router.post("/reset-password", authController.resetPassword)
router.post("/resend-forgot-otp", authController.resendForgotPasswordOtp)


//profile
router.get("/profile/:userId", userAuth, profileController.getMe)
router.put("/update-skills", userAuth, profileController.updateSkills);
router.put("/update-bio", userAuth, profileController.updateBio);
router.put("/updateProfilePicture",userAuth, uploadProfile.single("avatar"),profileController.updateProfilePictureController);


router.get("/following", userAuth, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" })

    const user = await User.findById(req.user.id)
      .populate("following", "name email avatar") 
      .exec();

    res.json({ following: user.following });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch following list" });
  }
});


// alert
router.get("/alerts", userAuth,alertController.getUserAlerts)
router.put("/alerts/:alertId/read",userAuth, alertController.markAsRead)



module.exports = router;
