const jwt = require("jsonwebtoken");
const asyncHandler = require("asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.header?.authorization?.startsWith("Bearer")) {
    token = req.header.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
      }
    } catch (error) {
      throw new Error("Not Authorized, token expired. Please login again.");
    }
  } else {
    throw new Error("There is no token attached to header.");
  }
});


module.exports = authMiddleware;