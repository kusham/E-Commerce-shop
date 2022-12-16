const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModal = require("../models/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.header?.authorization?.startsWith("Bearer")) {
    token = req.header.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModal.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized, token expired. Please login again.");
    }
  } else {
    throw new Error("There is no token attached to header.");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await userModal.findOne({ email });
  if (adminUser?.role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
