 
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');


//To add a product with sizes.
exports.addProduct = async (req, res) => {
  try {
    const newProduct = req.body;

    // Set default values
    newProduct.onSale = newProduct.onSale || false;
    newProduct.isOutOfStock = false;
    newProduct.brand = newProduct.brand || 'PRODUCT NAME UNDEFINED';
    newProduct.sizes = newProduct.sizes || [
      { name: 'S', quantity: 10, disabled: false },
      { name: 'M', quantity: 10, disabled: false },
      { name: 'L', quantity: 10, disabled: false },
      { name: 'XL', quantity: 10, disabled: false },
    ];

    // Validate required fields
    if (!newProduct.title || !newProduct.image) {
      return res.status(400).json({ error: 'Title and main image are required' });
    }

    // Validate sizes
    if (!Array.isArray(newProduct.sizes)) {
      return res.status(400).json({ error: 'Sizes must be an array' });
    }

    const isValidSizes = newProduct.sizes.every(
      (size) =>
        size.name &&
        typeof size.name === 'string' &&
        typeof size.quantity === 'number' &&
        typeof size.disabled === 'boolean'
    );

    if (!isValidSizes) {
      return res.status(400).json({
        error: 'Each size must have a name (string), quantity (number), and disabled (boolean) property',
      });
    }

    // Check for duplicate product
    const existingProduct = await Product.findOne({ title: newProduct.title });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this title already exists' });
    }

    // Upload main image
    const mainImageUpload = await cloudinary.uploader.upload(newProduct.image, {
      folder: 'products/main',
    });
    newProduct.image = mainImageUpload.secure_url;

    // Upload thumbnails if provided
    if (Array.isArray(newProduct.thumbnails) && newProduct.thumbnails.length > 0) {
      const thumbnailPromises = newProduct.thumbnails.map(thumbnail =>
        cloudinary.uploader.upload(thumbnail, {
          folder: 'products/thumbnails',
        })
      );
      const thumbnailResults = await Promise.all(thumbnailPromises);
      newProduct.thumbnails = thumbnailResults.map(result => result.secure_url);
    } else {
      newProduct.thumbnails = [mainImageUpload.secure_url]; // Use main image as thumbnail if none provided
    }

    // Ensure description is an array
    if (!Array.isArray(newProduct.description)) {
      newProduct.description = newProduct.description 
        ? [newProduct.description] 
        : [];
    }

    // Check stock status
    const totalQuantity = newProduct.sizes.reduce((sum, size) => sum + size.quantity, 0);
    newProduct.isOutOfStock = totalQuantity === 0;

    const product = new Product(newProduct);
    await product.save();

    res.status(201).json({ 
      message: 'Product added successfully', 
      product: {
        id: product._id,
        title: product.title,
        brand: product.brand,
        image: product.image,
        thumbnails: product.thumbnails,
        description: product.description,
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        onSale: product.onSale,
        isOutOfStock: product.isOutOfStock,
        isFeatured: product.isFeatured,
        sizes: product.sizes
      }
    });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};



//To update a product with sizes.
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProductData = req.body;

    updatedProductData.isOutOfStock = !updatedProductData.onSale;

    if (updatedProductData.image) {
      const uploadResponse = await cloudinary.uploader.upload(updatedProductData.image, {
        folder: 'products',
      });
      updatedProductData.image = uploadResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};


//To delete a product with sizes.
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
 