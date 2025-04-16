const express = require("express");
const app = express();
const authonticationController = require("../middleware/auth");
const productsController = require("../controller/productsController");
const multer = require('multer');
const { videoStorage, imageStorage, uploadImages } = require('../config/cloudinary');
const { upload } = require("../config/imagekitConfig");

const videoUpload = multer({ storage: videoStorage }); // cloudinary
const imageUpload = multer({ storage: imageStorage });


app.post(
  "/uploadVideo",
  // authonticationController.validateToken,
  // videoUpload.single("video"), // cloudinary
  upload.single("video"),
  productsController.uploadVideo
);

app.post(
  "/getVideos",
  // authonticationController.validateToken,
  productsController.getVideos
);

app.post(
  "/video/delete",
  // authonticationController.validateToken,
  productsController.deleteVideo
);

app.post(
  "/product/add",
  // authonticationController.validateToken,
  uploadImages.fields([
    { name: 'displayImageUrl', maxCount: 1 },
    { name: 'productImageUrls', maxCount: 10 },
  ]),
  productsController.addProduct
);

app.post(
  "/product/editOrDelete",
  // authonticationController.validateToken,
  imageUpload.single("image"),
  productsController.productEditOrDelete
);

app.post(
  "/product/all",
  // authonticationController.validateToken,
  productsController.getAllProducts
);

app.post(
  "/product/data",
  // authonticationController.validateToken,
  productsController.productData
);

app.post(
  "/product/details",
  // authonticationController.validateToken,
  productsController.produceDetails
);

app.post(
  "/product/suggestions",
  // authonticationController.validateToken,
  productsController.productSuggestions
);

app.post(
  "/getPincodeDetails",
  // authonticationController.validateToken,
  productsController.getPincodeDetails
);




module.exports = app;