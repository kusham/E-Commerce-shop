const express = require("express");
const { createCategory } = require("../controllers/categoryController");
const { isAdmin, authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.post("/", authMiddleware, createCategory);

module.exports = router;
