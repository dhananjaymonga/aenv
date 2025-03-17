const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary Name:", process.env.CLOUD_NAME);
console.log("Cloudinary Name:", process.env.CLOUDINARY_API_KEY);
console.log("Cloudinary Name:", process.env.CLOUDINARY_API_SECRET);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "listings", // Change to your desired folder name
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
