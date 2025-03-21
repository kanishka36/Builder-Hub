import { Product } from "../model/product.model.js";
import { Seller } from "../model/seller.model.js";

export const addProduct = async (req, res) => {
  let { name, description, price, quantity, images } = req.body;
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );

  if (!seller) {
    return res.status(404).json({
      success: false,
      message: "Seller not found",
    });
  }

  try {
    if (!name || !description || !price || !quantity || !images) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    await Product.create({
      name: name,
      description: description,
      price: price,
      quantity: quantity,
      imageUrl: images,
      seller: seller._id,
    });

    return res.status(201).json({
      succuss: true,
      message: "Product added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      succuss: false,
      message: "An error occurred while creating product",
      error: error.message,
    });
  }
};

// View All Products
export const viewProduct = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ seller: sellerId })
      .populate("seller", "username imageUrl")
      .exec();

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching products",
      error: error.message,
    });
  }
};

export const viewSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("seller", "username imageUrl")
      .exec();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching product",
      error: error.message,
    });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, images } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, quantity, imageUrl: images },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting product",
      error: error.message,
    });
  }
};
