const express = require("express");
const router = express.Router();
const cookieParser = require('cookie-parser')

router.use(cookieParser());

// router.use(require("./loginRoutes"));
router.use(require("./productsRoutes"));
router.use(require("./orderRoutes"));


module.exports = router;