const asyncHandler = require("express-async-handler");
const productCategoryModel = require("../models/productCategoryModel");
const validateMongodbId = require("../utils/validateMongodbId");

// create category
module.exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await productCategoryModel.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw Error(error);
  }
});

// update category
module.exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedCategory = await productCategoryModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    throw Error(error);
  }
});

// delete category
module.exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedCategory = await productCategoryModel.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw Error(error);
  }
});

// get category
module.exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await productCategoryModel.findById(id);
    res.json(category);
  } catch (error) {
    throw Error(error);
  }
});

// get all category
module.exports.getAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await productCategoryModel.find();
    res.json(allCategory);
  } catch (error) {
    throw Error(error);
  }
});
