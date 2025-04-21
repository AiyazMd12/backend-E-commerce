const videoModel = require("../models/video");
const imageModel = require("../models/image");
const productModel = require("../models/product");
const orderModel = require("../models/order");
const userModel = require("../models/user");
const pinCodeModel = require("../models/pinCode");
const { v4: uuidv4 } = require("uuid");
const { uploadToImageKit } = require("../config/imagekitConfig");
const axios = require("axios");

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No video uploaded" });
    }

    const uploadResponse = await uploadToImageKit({
      fileBuffer: req.file.buffer,
      originalname: req.file.originalname,
      title: req.body?.title,
      folder: "videos",
    });

    const video = new videoModel({
      title: req.body.title || req.file.originalname,
      filter: req.body.filter || "None",
      videoUrl: uploadResponse.url,
    });

    await video.save();

    res.json({
      success: true,
      message: "Video uploaded successfully",
      data: {
        title: video.title,
        videoUrl: uploadResponse.url,
        fileId: uploadResponse.fileId,
      },
    });
  } catch (error) {
    console.log("Upload error:", error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

exports.editVideo = async (req, res) => {
  let videoId = req.body.videoId;
  try {
    if (!req.file && !videoId) {
      return res.status(400).json({ success: false, message: "Please provide the manditory fields" });
    }

    const uploadResponse = await uploadToImageKit({
      fileBuffer: req.file.buffer,
      originalname: req.file.originalname,
      title: req.body?.title,
      folder: "videos",
    });

    let updateVideo = await videoModel.findByIdAndUpdate(videoId, { videoUrl: uploadResponse.url }, { new: true });

    res.json({
      success: true,
      message: "Video updated successfully",
      data: {
        title: updateVideo.title,
        videoUrl: uploadResponse.url,
        fileId: uploadResponse.fileId,
      },
    });
  } catch (error) {
    console.log("Error in editVideo: " + error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

exports.getVideos = async (req, res) => {
  let reqBody = req.body;
  try {
    let matchObj = {
      isDelete: false,
    };

    if (reqBody.filter === "all") {
    } else {
      matchObj.filter = reqBody.filter;
    }

    let videoData = await videoModel.find(matchObj).lean();
    return res.json({
      success: true,
      data: videoData,
    });
  } catch (err) {
    console.log("Error in getVideos: " + err);
    return res.json({
      success: false,
      message: "Internal Server Error!. Please try again later.",
      data: [],
    });
  }
};

exports.deleteVideo = async (req, res) => {
  let reqBody = req.body;
  try {
    if (!reqBody.imageId) {
      return res.json({
        success: false,
        message: "Image ID is required for delete video",
      });
    }

    let videoData = await videoModel.findByIdAndUpdate(
      reqBody.imageId,
      { isDelete: true },
      { new: true }
    );

    if (videoData) {
      return res.json({
        success: true,
        message: "Video deleted successfully!",
      });
    } else {
      return res.json({
        success: false,
        message: "Failed to delete video!",
      });
    }
  } catch (err) {
    console.log("Error in getVideos: " + err);
    return res.json({
      success: false,
      message: "Internal Server Error!. Please try again later.",
    });
  }
};

exports.addProduct = async (req, res) => {
  let reqBody = req.body;

  try {
    let parsedProductDetails = {
      brand: reqBody.brand,
      brandFitName: reqBody.brandFitName,
      color: reqBody.color,
      pattern: reqBody.pattern,
      occasion: reqBody.occasion,
      packedBy: reqBody.packedBy,
      marketedBy: reqBody.marketedBy,
    };

    let displayImage = req?.files?.["displayImageUrl"]?.[0];
    let productImages = req?.files?.["productImageUrls"] || [];

    let newProduct = new productModel({
      title: reqBody.title,
      subTitle: reqBody.subTitle,
      description: reqBody.description,
      productId: `PROD-${uuidv4()}`,
      price: reqBody.price,
      productDetails: parsedProductDetails,
      category: JSON.parse(reqBody.category || "[]"),
      inStock: reqBody.inStock === "true",
      availableStocks: reqBody.availableStocks,
      availableSize: JSON.parse(reqBody.availableSizes || "[]"),
      suggestions: JSON.parse(reqBody.suggestions || "[]"),
      filter: JSON.parse(reqBody.filter || "[]"),
      gender: reqBody.gender,
      isActive: true,
      displayImageUrl: displayImage?.path || "",
      productImageUrls: productImages.map((f) => f.path),
    });

    await newProduct.save();

    if (displayImage) {
      await imageModel.create({
        title: reqBody.title || displayImage.originalname,
        filter: reqBody.gender || "",
        videoUrl: displayImage.path,
      });
    }

    if (productImages.length > 0) {
      let galleryImageDocs = productImages.map((img) => ({
        title: reqBody.title || img.originalname,
        filter: reqBody.gender || "",
        videoUrl: img.path,
      }));
      await imageModel.insertMany(galleryImageDocs);
    }

    res.status(201).json({
      success: true,
      message: "Product and images added successfully",
    });
  } catch (err) {
    console.log("Error in addProduct:", err);
    res.json({
      success: false,
      message: "Failed to add product",
    });
  }
};

exports.productEditOrDelete = async (req, res) => {
  try {
  } catch (err) {
    console.log("Error in productEditOrDelete: " + err);
    return res.json({
      success: false,
      message: "Internal Server Error!. Please try again later.",
    });
  }
};

exports.getAllProducts = async (req, res) => {
  let reqBody = req.body;

  let page = parseInt(reqBody.page) || 1;
  let limit = parseInt(reqBody.limit) || 10;

  try {
    const [total, products] = await Promise.all([
      productModel.countDocuments({ isDelete: false }),
      productModel
        .find({ isDelete: false })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.json({
      success: true,
      totalRecords: total,
      data: products,
    });
  } catch (error) {
    console.log("Error in getAllProducts:", error);
    res.json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

exports.productData = async (req, res) => {
  try {
    let search = req.body?.search || "";
    let page = parseInt(req.body?.page) || 1;
    let limit = parseInt(req.body?.limit) || 20;
    let sortBy = req.body?.sortBy || "createdAt";
    let sortOrder = req.body?.sortOrder === "lowToHigh" ? 1 : -1;
    let category = req.body?.category;
    let gender = req.body?.gender;
    let minPrice = parseFloat(req.body?.minPrice);
    let maxPrice = parseFloat(req.body?.maxPrice);

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subTitle: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $in: Array.isArray(category) ? category : [category] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    let skip = (page - 1) * limit;

    let sort = {};
    sort[sortBy] = sortOrder;

    let [products, total] = await Promise.all([
      productModel.find(query).sort(sort).skip(skip).limit(limit),
      productModel.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      totalRecords: total,
    });
  } catch (err) {
    console.log("Error in productData:", err);
    res.json({
      success: false,
      message: "Failed to fetch product data",
    });
  }
};

exports.produceDetails = async (req, res) => {
  let reqBody = req.body;
  let produceId = reqBody.produceId;

  try {
    if (!produceId) {
      return res.json({
        success: false,
        message: "produceId is required",
      });
    }

    let data = await productModel.findById(produceId);

    if (!data) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log("Error in produceDetails:", err);
    res.json({
      success: false,
      message: "Failed to fetch product details",
    });
  }
};

exports.productSuggestions = async (req, res) => {
  try {
    let category = req.body.category;
    let page = parseInt(req.body.page) || 1;
    let limit = parseInt(req.body.limit) || 10;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    let query = {
      category: { $in: Array.isArray(category) ? category : [category] },
      isActive: true,
    };

    let skip = (page - 1) * limit;

    let [products, total] = await Promise.all([
      productModel.find(query).skip(skip).limit(limit),
      productModel.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      totalRecords: total,
    });
  } catch (err) {
    console.log("Error in productSuggestions:", err);
    res.json({
      success: false,
      message: "Something went wrong while fetching suggestions",
    });
  }
};

exports.getPincodeDetails = async (req, res) => {
  let { pincode } = req.body;

  if (!pincode || pincode.length !== 6) {
    return res.json({
      success: false,
      message: "Invalid or missing pincode",
    });
  }

  try {
    let response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    let data = response.data;

    if (data[0].Status === "Success" && data[0].PostOffice?.length) {
      let postOffice = data[0].PostOffice[0];
      return res.json({
        success: true,
        data: {
          city: postOffice.Block,
          district: postOffice.District,
          state: postOffice.State,
          pincode: postOffice.Pincode,
        },
      });
    } else {
      return res.json({
        success: false,
        message: "Pincode not found",
      });
    }
  } catch (err) {
    console.log("Error in getPincodeDetails:", err.message);
    res.json({
      success: false,
      message: "Failed to fetch pincode details",
    });
  }
};

module.exports = exports;