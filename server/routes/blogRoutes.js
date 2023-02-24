const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
} = require("../controllers/blogController");
const { isAdmin, authMiddleware } = require("../middleware/middleware");
const {
  uploadPhoto, blogImageResize,
} = require("../middleware/uploadImages");

const router = express.Router();

router.post("/", authMiddleware, createBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImageResize,
  uploadImages
);

router.put("/likes", authMiddleware, isAdmin, likeBlog);
router.put("/dislikes", authMiddleware, isAdmin, disLikeBlog);

router.put("/:id", authMiddleware, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;
