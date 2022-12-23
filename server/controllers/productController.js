const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");

// create product
module.exports.createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
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
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
     excludeFields.forEach((element) => {
      delete queryObj[element];
    });
    const findAllProduct = await productModel.find(queryObj);
    req.json(findAllProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// update product
module.exports.updateProduct = asyncHandler(async (req, res) => {
  try {
    const id = req.params;
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await productModel.findOneAndUpdate(
      { id },
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// delete product
module.exports.deleteProduct = asyncHandler(async (req, res) => {
  try {
    const id = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});
