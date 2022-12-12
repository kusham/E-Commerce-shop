const userModal = require("../models/userModal");

module.exports.createUser = async (req, res) => {
  const email = req.body.email;
  const findUser = await userModal.findOne({ email: email });
  if (!findUser) {
    // create new user
    const newUser = await userModal.create(req.body);
    res.json(newUser);
  } else {
    res.json({
      success: false,
      message: "User already exists",
    });
  }
};
