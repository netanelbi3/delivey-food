const MenuItem = require("../models/menuItemModel");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Create a new MenuItem with image upload
exports.createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  let imagePath;
  if (req.file) {
    const filename = `menuitem-${Date.now()}.jpeg`;
    imagePath = path.join(__dirname, `../uploads/${filename}`);

    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(imagePath);
  }

  const newMenuItem = new MenuItem({
    name,
    description,
    price,
    category,
    image: imagePath ? `/uploads/${path.basename(imagePath)}` : null,
  });

  const savedMenuItem = await newMenuItem.save();
  res.status(201).json(savedMenuItem);
});

// Get all MenuItems
exports.getMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find();
  res.json(menuItems);
});

// Get a single MenuItem by ID
exports.getMenuItemById = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  res.json(menuItem);
});

// Update a MenuItem by ID with optional image upload
exports.updateMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  let imagePath;
  if (req.file) {
    const filename = `menuitem-${Date.now()}.jpeg`;
    imagePath = path.join(__dirname, `../uploads/${filename}`);

    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(imagePath);

    // Delete the old image if it exists
    if (
      menuItem.image &&
      fs.existsSync(
        path.join(__dirname, `../uploads/${path.basename(menuItem.image)}`)
      )
    ) {
      fs.unlinkSync(
        path.join(__dirname, `../uploads/${path.basename(menuItem.image)}`)
      );
    }

    menuItem.image = `/uploads/${path.basename(imagePath)}`;
  }

  menuItem.name = name || menuItem.name;
  menuItem.description = description || menuItem.description;
  menuItem.price = price || menuItem.price;
  menuItem.category = category || menuItem.category;

  const updatedMenuItem = await menuItem.save();
  res.json(updatedMenuItem);
});
// Delete menuItemById
exports.deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  // Delete the image if it exists
  if (
    menuItem.image &&
    fs.existsSync(
      path.join(__dirname, `../uploads/${path.basename(menuItem.image)}`)
    )
  ) {
    fs.unlinkSync(
      path.join(__dirname, `../uploads/${path.basename(menuItem.image)}`)
    );
  }

  // Use deleteOne instead of remove
  await menuItem.deleteOne();

  res.json({ message: "Menu item removed" });
});

// Apply discount to a menu item
exports.applyDiscountToMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // MenuItem ID
  const { discountPercentage, discountCategory } = req.body;

  const menuItem = await MenuItem.findById(id);

  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  menuItem.discount = {
    percentage: discountPercentage || 0,
    category: discountCategory || "general",
  };

  const updatedMenuItem = await menuItem.save();
  res.json({
    message: "Discount applied successfully",
    menuItem: updatedMenuItem,
  });
});

// Create a bundle for menu items
exports.createBundle = asyncHandler(async (req, res) => {
  const { bundleItems, bundlePrice, bundleCategory } = req.body;

  // Ensure that bundleItems is an array of valid MenuItem IDs
  const validItems = await MenuItem.find({ _id: { $in: bundleItems } });

  if (!validItems || validItems.length !== bundleItems.length) {
    return res
      .status(400)
      .json({ message: "One or more menu items not found" });
  }

  // Apply bundle to all selected items
  await MenuItem.updateMany(
    { _id: { $in: bundleItems } },
    {
      bundle: {
        items: bundleItems,
        bundlePrice: bundlePrice || 0,
        category: bundleCategory || "general",
      },
    }
  );

  res.json({ message: "Bundle created successfully" });
});
