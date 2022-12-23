const express = require("express");
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { isAdmin } = require("../middleware/middleware");

const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.get("/", getAllProduct);

module.exports = router;
