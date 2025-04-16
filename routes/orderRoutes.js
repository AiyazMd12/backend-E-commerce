const express = require("express");
const app = express();
const authonticationController = require("../middleware/auth");
const productsController = require("../controller/orderController");


app.post(
  "/addToWishlist",
  // authonticationController.validateUserToken,
  productsController.addToWishlist
);

app.post(
  "/addToCart",
  // authonticationController.validateUserToken,
  productsController.addToCart
);

app.post(
  "/order/create",
  // authonticationController.validateUserToken,
  productsController.createOrder
);

app.post(
  "/order/getAllOrders",
  // authonticationController.validateAdminToken,
  productsController.getAllOrders
);

app.post(
  "/order/user/all",
  // authonticationController.validateUserToken,
  productsController.getUserOrders
);

app.post(
  "/order/updateStatus",
  // authonticationController.validateAdminToken,
  productsController.updateOrderStatus
);

app.post(
  "/order/user/cancel",
  // authonticationController.validateUserToken,
  productsController.cancelOrderByUser
);

app.post(
  "/order/admin/cancel",
  // authonticationController.validateAdminToken,
  productsController.cancelOrderByAdmin
);



module.exports = app;