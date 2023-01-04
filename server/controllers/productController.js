const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

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
    // filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element) => {
      delete queryObj[element];
    });
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `${match}`);
    const findAllProduct = await productModel.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields
    if (req.query.fields) {
      const fields = req.query.sort.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await productModel.countDocuments();
      if (skip >= productCount) throw new Error("This page does not exists");
    }
    const product = await query;
    req.json(product);
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

// add product to wish list
module.exports.addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    const user = await userModel.findById(_id);
    const alreadyAdded = user.wishList.find((id) => id.toString() === prodId);

    if (alreadyAdded) {
      let user = await userModel.findByIdAndUpdate(
        _id,
        {
          $pull: { wishList: prodId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await userModel.findByIdAndUpdate(
        _id,
        {
          $push: { wishList: prodId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// add rating
module.exports.rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId } = req.body;

  try {
    const product = await productModel.findById(prodId);
    let alreadyRated = product.ratings.find((userId) =>
      userId.postedBy.toString()
    );

    if (alreadyRated) {
      const updateRating = await productModel.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await productModel.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getAllRatings = await productModel.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);

    const finalProduct = await productModel.findByIdAndUpdate(
      prodId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
  } catch (error) {
    throw Error(error);
  }
});
