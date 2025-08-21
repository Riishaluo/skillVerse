const express = require('express');
const router = express.Router();
const authController = require('../controller/userController')
const userAuth = require('../middleware/userAuth')
const postController = require('../controller/postController')
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const paymentController = require('../controller/paymentController')
const networkController = require('../controller/networkController')




const upload = multer({ storage });





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
router.post("/createPost", userAuth, upload.single("photo"),postController.createPost);
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


module.exports = router;
