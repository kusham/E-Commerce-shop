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
} = require("../controllers/userControllers");
const {authMiddleware, isAdmin} = require("../middleware/middleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/allUsers", isAdmin, getAllUsers);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", updateUser);
router.put("/block-user/:id", blockUser);
router.put("/unBlock-user/:id", unBlockUser);



module.exports = router;
