const express = require("express");
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishList } = require("../controllers/productController");
const { isAdmin } = require("../middleware/middleware");

const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/wishlist", addToWishList);

router.put("/:id", updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.get("/", getAllProduct);

module.exports = router;
