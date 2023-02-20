const express = require("express");
const { createCoupon } = require("../controllers/couponController");
const { isAdmin, authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);


module.exports = router;
