const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/categoryModel");


// create category
module.exports.createCategory = asyncHandler(async (req, res) => {
    try {
      const newCategory = await categoryModel.save(req.body);
      res.json(newCategory);
    } catch (error) {
      throw Error(error);
    }
  });