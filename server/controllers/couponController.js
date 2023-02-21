const asyncHandler = require("express-async-handler");
const couponModel = require("../models/couponModel");
const validateMongodbId = require("../utils/validateMongodbId");

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

// update coupon
module.exports.updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCoupon);
  } catch (error) {
    throw Error(error);
  }
});
