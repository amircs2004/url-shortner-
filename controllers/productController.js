const Product = require("../models/product");
const mongoose = require("mongoose");

const addNewProduct = async (req, res) => {
  const { name, description, price, category, stock, barcode, imageUrl } =
    req.body;

  // Enforcing your required schema fields
  if (!name || price === undefined || !category || stock === undefined) {
    return res
      .status(400)
      .json({ Message: "PLS PROVIDE COMPLETE PRODUCT DETAILS" });
  }

  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      barcode,
      imageUrl,
    });

    return res.status(201).json({
      success: true, // Fixed your 'sucess' typo from employee code!
      data: newProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ Message: "SOMETHING WENT WRONG DURING PRODUCT CREATION" });
  }
};
const searchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const foundProduct = await Product.findById(id);
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      data: foundProduct,
      msg: "product found successfully",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json({
      data: products,
      message: "Products retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "SOMETHING WENT WRONG",
    });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params; // Grabbing ID from URL parameter (e.g., /api/products/:id)
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ Message: "PLS PROVIDE PRODUCT ID IN PATH" });
  }

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide at least one field to update" });
  }

  try {
    // Uses the ID from req.params to safely update dynamic body data
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ Message: "SOMETHING WENT WRONG DURING UPDATE" });
  }
};

// 3. DELETE PRODUCT
const deletedProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ Message: "PLS PROVIDE PRODUCT ID IN PATH" });
  }

  try {
    const targetDeletedProduct = await Product.findByIdAndDelete(id);

    if (!targetDeletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: targetDeletedProduct,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong during deletion" });
  }
};

// Exporting them exactly like your employee setup
module.exports = {
  addNewProduct,
  editProduct,
  deletedProduct,
  searchProductById, 
  getAllProducts 
};
