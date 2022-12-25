const asyncHandler = require("express-async-handler");
const blogModel = require("../models/blogModel");

// create blog
module.exports.createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await blogModel.save(req.body);
    res.json({
      status: "success",
      newBlog,
    });
  } catch (error) {
    throw Error(error);
  }
});
