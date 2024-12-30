const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
    default: "PRODUCT NAME UNDEFINED"
  },
  image: {
    type: String,
    required: true
  },
  thumbnails: {
    type: [String],
    default: []
  },
  description: {
    type: [String],
    default: []
  },
  originalPrice: Number,
  salePrice: Number,
  onSale: {
    type: Boolean,
    default: false,
  },
  isOutOfStock: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  sizes: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 0 },
      disabled: { type: Boolean, default: false }
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
 
