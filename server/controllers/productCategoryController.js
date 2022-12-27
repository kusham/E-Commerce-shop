const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/productCategoryModel");
const validateMongodbId = require("../utils/validateMongodbId");

// create category
module.exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await categoryModel.create(req.body);
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
    const updatedCategory = await categoryModel.findByIdAndUpdate(
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
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
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
    const category = await categoryModel.findById(id);
    res.json(category);
  } catch (error) {
    throw Error(error);
  }
});
