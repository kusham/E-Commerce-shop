const express = require("express");
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog } = require("../controllers/blogController");
const { isAdmin, authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.put("/likes", authMiddleware, isAdmin, likeBlog);





module.exports = router;
