const userModal = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

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
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updatedUser = await userModal.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
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

// handle refresh token
module.exports.handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  const user = await userModal.findOne({ refreshToken });
  if (!user) {
    throw new Error("No refresh token present in db or not matched");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// handle refresh token
module.exports.logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await userModal.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await userModal.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
   res.sendStatus(204);
});
