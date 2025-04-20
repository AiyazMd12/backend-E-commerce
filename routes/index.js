const express = require("express");
const router = express.Router();
const cookieParser = require('cookie-parser')

router.use(cookieParser());

router.use(require("./productsRoutes"));
router.use(require("./orderRoutes"));
router.use(require("./loginRoutes"));


module.exports = router;