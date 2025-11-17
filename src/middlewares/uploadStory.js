const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "stories",
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
