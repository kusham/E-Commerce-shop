const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");

// create product
module.exports.createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = await new productModel.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// get product
module.exports.getProduct = asyncHandler(async (req, res) => {
  try {
    const findProduct = await productModel.findById(id);
    req.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// get all product
module.exports.getAllProduct = asyncHandler(async (req, res) => {
  try {
    const findAllProduct = await productModel.find();
    req.json(findAllProduct);
  } catch (error) {
    throw new Error(error);
  }
});
