const asyncHandler = require("express-async-handler");
const brandModel = require("../models/brandModel");
const validateMongodbId = require("../utils/validateMongodbId");

// create Brand
module.exports.createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await brandModel.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw Error(error);
  }
});

// update Brand
module.exports.updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedBrand = await brandModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedBrand);
  } catch (error) {
    throw Error(error);
  }
});

// delete Brand
module.exports.deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedBrand = await brandModel.findByIdAndDelete(id);
    res.json(deletedBrand);
  } catch (error) {
    throw Error(error);
  }
});

// get Brand
module.exports.getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await brandModel.findById(id);
    res.json(brand);
  } catch (error) {
    throw Error(error);
  }
});

// get all Bran
module.exports.getAllBran = asyncHandler(async (req, res) => {
  try {
    const allBrand = await brandModel.find();
    res.json(allBrand);
  } catch (error) {
    throw Error(error);
  }
});
