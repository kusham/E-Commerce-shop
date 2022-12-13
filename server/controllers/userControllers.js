const userModal = require("../models/userModal");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");

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


