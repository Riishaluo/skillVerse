const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
})

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

module.exports = { cloudinary, postStorage, profileStorage }
