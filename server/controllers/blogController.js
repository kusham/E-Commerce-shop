const asyncHandler = require("express-async-handler");
const blogModel = require("../models/blogModel");

// create blog
module.exports.createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await blogModel.save(req.body);
    res.json(newBlog);
  } catch (error) {
    throw Error(error);
  }
});

// update blog
module.exports.updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    throw Error(error);
  }
});

// get blog
module.exports.getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getBlog = await blogModel.findById(id);
    await blogModel.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw Error(error);
  }
});
