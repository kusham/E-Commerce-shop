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
  adminLogin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/userControllers");
const { authMiddleware, isAdmin } = require("../middleware/middleware");

const router = express.Router();

router.post("/register", createUser);
router.put("/password", authMiddleware, updatePassword);
router.post("/forget-password-token", forgetPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.post("/login", loginUser);
router.post("/admin-login", adminLogin);
router.post("/cart", userCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.get("/all-users", getAllUsers);
router.get("/all-orders", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.get("/wishlist", authMiddleware, getWishList);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unBlock-user/:id", authMiddleware, isAdmin, unBlockUser);
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
