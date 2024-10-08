const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String, // e.g., Appetizers, Mains, etc.
  },
  image: {
    type: String, // Store the file path for the uploaded image
  },
  ingredients: [
    {
      name: { type: String }, // Default ingredient name
      removable: { type: Boolean, default: true }, // If the user can remove this ingredient
    },
  ],
  extras: [
    {
      name: { type: String, required: true }, // Name of the extra
      price: { type: Number, required: true }, // Additional price for this extra
    },
  ],
  discount: {
    percentage: { type: Number, default: 0 }, // Discount percentage
    category: { type: String }, // Discount category
  },
  sold: {
    type: { type: Number, default: 0 }, //counter of sales ToDo update sold after payment
  },
  bundle: {
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }], // List of items in the bundle
    bundlePrice: { type: Number }, // Bundle price for all items
    category: { type: String }, // Bundle category
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Added reviews field
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
