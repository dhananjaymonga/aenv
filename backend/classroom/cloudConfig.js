const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary.config({
//     cloud_name:process.env.CLOUD_NAME,
//     api_key:process.env.CLOUD_API_KEY,
//     api_secret:process.env.CLOUD_API_SECRET
    
// })
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "uploads", // Folder name in Cloudinary
//       allowedFormats: ["jpeg", "png", "jpg"],
//     },
//   });
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "uploads", // ✅ Ensure folder is defined
        allowed_formats: ["jpeg", "png", "jpg"],
    },
});

  const upload = multer({ storage });

module.exports = { upload };