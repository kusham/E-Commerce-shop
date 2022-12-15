const userModal = require("../models/userModal");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");

module.exports.createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await userModal.findOne({ email: email });
  if (!findUser) {
    // create new user
    const newUser = await userModal.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already exists");
  }
});

module.exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check whether user exists
  const findUser = await userModal.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw Error("Invalid Credentials");
  }
});

// get all users
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await userModal.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// get single user
module.exports.getSingleUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const getUser = await userModal.findById(id);
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// delete user
module.exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedUser = await userModal.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// update user
module.exports.updateUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    validateMongodbId(id);
    const updatedUser = await userModal.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Block user
module.exports.blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await userModal.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    req.json({
      message: "user is blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// unBlock user
module.exports.unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await userModal.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    req.json({
      message: "user is un-blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
