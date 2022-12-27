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

// get all blogs
module.exports.getAllBlog = asyncHandler(async (req, res) => {
  try {
    const getAllBlogs = await blogModel.find();
    res.json(getAllBlogs);
  } catch (error) {
    throw Error(error);
  }
});

// delete blog
module.exports.deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error) {
    throw Error(error);
  }
});

// like blog
module.exports.likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const blog = await blogModel.findById(blogId);
  const loginUserId = req?.user?._id;
  const isLiked = blog?.isLiked;
  const alreadyDisLiked = blog?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisLiked) {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});



// dis like blog
module.exports.disLikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    const blog = await blogModel.findById(blogId);
    const loginUserId = req?.user?._id;
    const isDisLiked = blog?.isLiked;
    const alreadyLiked = blog?.disLikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { disLikes: loginUserId },
          isDisLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { disLikes: loginUserId },
          isDisLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  });
  