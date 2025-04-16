const orderModel = require("../models/order");
const userModel = require("../models/user");
const moment = require("moment");

exports.addToWishlist = async (req, res) => {
  let userId = req.body.userId;
  let productId = req.body.productId;
  let title = req.body.title;
  let size = req.body.size;
  let price = req.body.price;
  let quantity = req.body.quantity;
  let imageUrl = req.body.imageUrl;

  try {
    let user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    let exists = user.wishList.some((item) => item.productId === productId);
    if (exists) {
      return res.json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    user.wishList.push({ productId, title, size, price, quantity, imageUrl });
    await user.save();

    res.json({
      success: true,
      message: "Added to wishlist",
      data: user.wishList,
    });
  } catch (err) {
    console.error("Add to Wishlist Error:", err);
    res.json({ success: false, message: "Failed to add to wishlist" });
  }
};

exports.addToCart = async (req, res) => {
  let userId = req.body.userId;
  let productId = req.body.productId;
  let title = req.body.title;
  let size = req.body.size;
  let price = req.body.price;
  let quantity = req.body.quantity;
  let imageUrl = req.body.imageUrl;

  try {
    let user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    let existingItem = user.cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ productId, title, size, price, quantity, imageUrl });
    }

    await user.save();

    res.json({ success: true, message: "Added to cart", data: user.cart });
  } catch (err) {
    console.error("Add to Cart Error:", err);
    res.json({ success: false, message: "Failed to add to cart" });
  }
};

exports.createOrder = async (req, res) => {
  let reqBody = req.body;

  let orderId = `ORD-${Date.now()}`;
  let userId = reqBody.userId;
  let date = reqBody.date || new Date();
  let total = reqBody.total;
  let status = reqBody.status || "pending";

  let customerName = reqBody.customer?.name || "";
  let customerEmail = reqBody.customer?.email || "";
  let customerPhone = reqBody.customer?.phone || "";

  let paymentMethod = reqBody.payment?.method || "";
  let paymentDetails = reqBody.payment?.details || "";
  let paymentStatus = reqBody.payment?.status || "pending";

  let shippingName = reqBody.shipping?.name || "";
  let shippingAddressLine1 = reqBody.shipping?.addressLine1 || "";
  let shippingAddressLine2 = reqBody.shipping?.addressLine2 || "";
  let shippingCity = reqBody.shipping?.city || "";
  let shippingState = reqBody.shipping?.state || "";
  let shippingZip = reqBody.shipping?.zip || "";
  let shippingCountry = reqBody.shipping?.country || "";

  let billingName = reqBody.billing?.name || "";
  let billingAddressLine1 = reqBody.billing?.addressLine1 || "";
  let billingAddressLine2 = reqBody.billing?.addressLine2 || "";
  let billingCity = reqBody.billing?.city || "";
  let billingState = reqBody.billing?.state || "";
  let billingZip = reqBody.billing?.zip || "";
  let billingCountry = reqBody.billing?.country || "";

  let items =
    reqBody.items?.map((item) => ({
      productId: item.productId || "",
      title: item.title || "",
      size: item.size || "",
      price: item.price || 0,
      quantity: item.quantity || 1,
      imageUrl: item.imageUrl || "",
    })) || [];

  let subtotal = reqBody.summary?.subtotal || 0;
  let shippingCharge = reqBody.summary?.shipping || 0;
  let tax = reqBody.summary?.tax || 0;
  let grandTotal = reqBody.summary?.total || 0;

  let timeline =
    reqBody.timeline?.map((t) => ({
      status: t.status || "",
      date: t.date || new Date(),
      note: t.note || "",
    })) || [];

  try {
    let newOrder = new orderModel({
      orderId,
      userId,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      date,
      total,
      status,
      payment: {
        method: paymentMethod,
        details: paymentDetails,
        status: paymentStatus,
      },
      shipping: {
        name: shippingName,
        addressLine1: shippingAddressLine1,
        addressLine2: shippingAddressLine2,
        city: shippingCity,
        state: shippingState,
        zip: shippingZip,
        country: shippingCountry,
      },
      billing: {
        name: billingName,
        addressLine1: billingAddressLine1,
        addressLine2: billingAddressLine2,
        city: billingCity,
        state: billingState,
        zip: billingZip,
        country: billingCountry,
      },
      items,
      summary: {
        subtotal,
        shipping: shippingCharge,
        tax,
        total: grandTotal,
      },
      timeline,
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (err) {
    console.log("Create Order Error:", err);
    res.json({
      success: false,
      message: "Failed to create order",
    });
  }
};

exports.getAllOrders = async (req, res) => {
  let reqBody = req.body;

  let page = parseInt(reqBody.page) || 1;
  let limit = parseInt(reqBody.limit) || 10;

  let status = reqBody.status;
  let paymentStatus = reqBody.paymentStatus;
  let fromDate = reqBody.fromDate;
  let toDate = reqBody.toDate;
  let search = reqBody.search;

  let query = {};

  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.email": { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (paymentStatus) {
    query["payment.status"] = paymentStatus;
  }

  if (fromDate && toDate) {
    query.createdAt = {
      $gte: moment(fromDate).startOf("day").toDate(),
      $lte: moment(toDate).endOf("day").toDate(),
    };
  } else if (fromDate) {
    query.createdAt = { $gte: moment(fromDate).startOf("day").toDate() };
  } else if (toDate) {
    query.createdAt = { $lte: moment(toDate).endOf("day").toDate() };
  }

  try {
    let [orderData, totalCount] = await Promise.all([
      orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      orderModel.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orderData,
      totalRecords: totalCount,
    });
  } catch (error) {
    console.log("Get All Orders Error:", error);
    res.json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

exports.getUserOrders = async (req, res) => {
  let page = parseInt(req.body.page) || 1;
  let limit = parseInt(req.body.limit) || 10;
  let userId = req.body.userId;

  try {
    let [orderData, totalCount] = await Promise.all([
      orderModel
        .find({ userId: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      orderModel.countDocuments(),
    ]);

    res.json({ success: true, data: orderData, totalRecords: totalCount });
  } catch (error) {
    console.log("getUserOrders Error : " + error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findOne({ orderId });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.json({ success: false, message: "Failed to fetch order" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    let reqBody = req.body;

    let orderId = reqBody?.orderId || undefined;
    let status = reqBody?.status;
    let note = reqBody?.note || "NA";

    let order = await orderModel.findOne({ orderId: orderId });
    if (!order) return res.json({ success: false, message: "Order not found" });

    order.status = status;
    order.timeline.push({ status, date: new Date(), note });
    await order.save();

    res.json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.json({ success: false, message: "Failed to update order status" });
  }
};

exports.cancelOrderByUser = async (req, res) => {
  const { orderId, note } = req.body;

  try {
    const order = await orderModel.findOne({ orderId });

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "cancelled") {
      return res.json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    order.status = "cancelled";
    order.timeline.push({
      status: "cancelled",
      date: new Date(),
      note: note || "Order cancelled.",
    });

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    console.log("User cancel order error:", err);
    res.json({
      success: false,
      message: "User failed to cancel order",
    });
  }
};

exports.cancelOrderByAdmin = async (req, res) => {
  const { orderId, note } = req.body;

  try {
    const order = await orderModel.findOne({ orderId });

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "cancelled") {
      return res.json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    order.status = "cancelled";
    order.timeline.push({
      status: "cancelled",
      date: new Date(),
      note: note || "Order cancelled.",
    });

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (err) {
    console.log("Admin cancel order error:", err);
    res.json({
      success: false,
      message: "Admin failed to cancel order",
    });
  }
};

module.exports = exports;
