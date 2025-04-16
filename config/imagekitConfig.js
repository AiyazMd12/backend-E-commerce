const ImageKit = require('imagekit');
const multer = require('multer');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToImageKit = async ({ fileBuffer, originalname, title, folder = 'videos' }) => {
  try {
    const nameWithoutExt = originalname.split('.').slice(0, -1).join('');
    const fileName = `${title || nameWithoutExt}-${Date.now()}`;

    const response = await imagekit.upload({
      file: fileBuffer, 
      fileName: fileName,
      folder: folder,
      useUniqueFileName: false,
    });

    return response;
  } catch (err) {
    console.log('ImageKit Upload Error:', err.message);
    throw err;
  }
};

module.exports = {
  imagekit,
  upload,
  uploadToImageKit,
};