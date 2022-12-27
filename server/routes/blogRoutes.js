const express = require("express");
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog } = require("../controllers/blogController");
const { isAdmin, authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddleware, deleteBlog);




module.exports = router;
