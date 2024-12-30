const Product = require("../models/Product");

//To get all the products for the shop page and the admin page
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

//for testing purposes this API is used to get the sizes of a product
exports.getProductSizes = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product.sizes || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sizes", error: error.message });
  }
};

//To purchase a product and update the quantity of the product
exports.purchaseProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { size: sizeName, quantity } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sizeIndex = product.sizes.findIndex((s) => s.name === sizeName);
    if (sizeIndex === -1) {
      return res.status(400).json({ message: "Invalid size selected" });
    }

    const selectedSize = product.sizes[sizeIndex];
    if (selectedSize.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock for the selected size" });
    }

    selectedSize.quantity -= quantity;
    selectedSize.disabled = selectedSize.quantity === 0;

    product.sizes[sizeIndex] = selectedSize;
    await product.save();

    // Get io instance and emit update
    const io = req.app.get('io');
    io.emit(`sizes-update-${id}`, {
      productId: id,
      sizes: product.sizes,
      updatedSize: { name: sizeName, quantity: selectedSize.quantity }
    });

    res.status(200).json({ message: "Purchase successful", product });
  } catch (err) {
    res.status(500).json({ error: "Failed to process purchase" });
  }
};

exports.updateProductSizes = async (req, res) => {
  try {
    const { sizeName, quantity } = req.body;
    const productId = req.params.id;
    
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const size = product.sizes.find((size) => size.name === sizeName);
    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }

    size.quantity = quantity;
    size.disabled = quantity === 0;

    await product.save();

    // Get io instance
    const io = req.app.get('io');
    
    // Emit size update event
    io.emit(`sizes-update-${productId}`, {
      productId,
      sizes: product.sizes,
      updatedSize: { name: sizeName, quantity }
    });

    res.status(200).json({
      message: "Quantity and size updated successfully",
      updatedSize: { name: sizeName, quantity },
      sizes: product.sizes
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating size quantity", error: error.message });
  }
};
 
