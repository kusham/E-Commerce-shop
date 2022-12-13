const userModal = require("../models/userModal");
const asyncHandler = require("express-async-handler");

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
    res.json(findUserF);
  } else {
    throw Error("Invalid Credentials");
  }
});
