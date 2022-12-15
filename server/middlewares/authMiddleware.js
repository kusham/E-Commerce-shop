const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModal = require("../models/userModal");

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

module.exports = authMiddleware;
