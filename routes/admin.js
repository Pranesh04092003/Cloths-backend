const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/add-products", adminController.addProduct);
router.put("/update-product/:id", adminController.updateProduct);
router.delete("/delete-product/:id", adminController.deleteProduct);

module.exports = router; 
