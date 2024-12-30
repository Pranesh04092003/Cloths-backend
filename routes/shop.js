const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

//To get all the products for the shop page and the admin page
router.get("/products/get", shopController.getAllProducts);

//for testing purposes this API is used to get the sizes of a product
router.get("/products/:id/sizes", shopController.getProductSizes);

//To purchase a product and update the quantity of the product
router.post("/products/:id/purchase", shopController.purchaseProduct);

module.exports = router;
 
