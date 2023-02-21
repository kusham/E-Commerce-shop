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

// get all coupon
module.exports.getAllCoupon = asyncHandler(async (req, res) => {
  try {
    const allCoupon = await couponModel.find();
    res.json(allCoupon);
  } catch (error) {
    throw Error(error);
  }
});
