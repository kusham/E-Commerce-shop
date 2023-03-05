const userModal = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");

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

// admin login
module.exports.adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check whether user exists
  const findAdmin = await userModal.findOne({ email: email });
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updatedUser = await userModal.findByIdAndUpdate(
      findAdmin._id,
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
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw Error("Invalid Credentials");
  }
});

// save user address
module.exports.saveAddress = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    validateMongodbId(id);
    const updatedUser = await userModal.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
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

// update password
module.exports.updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const password = req.body;
  validateMongodbId(_id);

  const user = await userModal.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

// forget password token
module.exports.forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModal.findOne({ email });
  if (!user) throw Error("User not found with this email");

  try {
    const token = await userModal.createPasswordResetToken();
    await userModal.save();
    const resetURL = `Hi, please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;
    const data = {
      to: email,
      text: "Hey user",
      subject: "forget password link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw Error(error);
  }
});

// reset password
module.exports.resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await userModal.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw Error("Token Expired, please try again later");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await userModal.save();
  req.json(user);
});

// get wishList
module.exports.getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(id);
  try {
    const findUser = await userModal.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});
