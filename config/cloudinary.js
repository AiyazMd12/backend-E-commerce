const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

let videoStorage = null;
let imageStorage = null;

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'videos',
      resource_type: 'video',
      allowed_formats: ['mp4', 'mov', 'avi'],
    },
  });

  imageStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const folder = 'images';
      const originalName = file.originalname.split('.').slice(0, -1).join('');
      const title = req.body?.title?.trim() || originalName;
      return {
        folder,
        resource_type: 'image',
        public_id: title + '-' + Date.now(),
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      };
    },
  });

} catch (err) {
  console.error('Error initializing Cloudinary:', err.message);
}

const uploadImages = multer({ storage: imageStorage });

module.exports = {
  cloudinary,
  videoStorage,
  imageStorage,
  uploadImages
};