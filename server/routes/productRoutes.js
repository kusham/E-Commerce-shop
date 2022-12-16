const express = require("express");
const { createProduct, getProduct, getAllProduct } = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getProduct);
router.get("/all-product", getAllProduct);



module.exports = router;
