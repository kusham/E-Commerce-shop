const express = require("express");
const { createCategory, updateCategory } = require("../controllers/productCategoryController");
const { isAdmin, authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);


module.exports = router;
