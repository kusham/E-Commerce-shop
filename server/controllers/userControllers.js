const userModal = require("../models/userModal");

module.exports.createUser = async (req, res) => {
  const email = req.body.email;
  const findUser = await userModal.findOne(email);
  if (!findUser) {
    // create new user
    const newUser = userModal.create(req.body);
  } else {
    res.json({
      message: "User already exists",
      success: false,
    });
  }
};
