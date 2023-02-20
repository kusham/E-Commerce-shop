const asyncHandler = require("express-async-handler");
const couponModel = require("../models/couponModel");

// create coupon
module.exports.createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await couponModel.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw Error(error);
  }
});
