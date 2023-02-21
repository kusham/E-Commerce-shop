const express = require("express");
const { createCoupon, getAllCoupon } = require("../controllers/couponController");
const { isAdmin, authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupon);



module.exports = router;
