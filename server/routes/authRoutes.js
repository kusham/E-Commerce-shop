const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
} = require("../controllers/userControllers");
const { authMiddleware, isAdmin } = require("../middleware/middleware");

const router = express.Router();

router.post("/register", createUser);
router.put("/password", authMiddleware, updatePassword);
router.post("/forget-password-token", forgetPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUser);
router.get("/all-users", isAdmin, getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteUser);

router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unBlock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
