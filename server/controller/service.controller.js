import { Service } from "../model/service.model.js";
import { Seller } from "../model/seller.model.js";

export const addService = async (req, res) => {
  const { title, description, price } = req.body;
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
    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    await Service.create({
      title: title,
      description: description,
      price: price,
      seller: seller._id,
    });

    return res.status(201).json({
      succuss: true,
      message: "Service added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      succuss: false,
      message: "An error occurred while creating service",
      error: error.message,
    });
  }
};

// View All Services
export const viewService = async (req, res) => {
  try {
    const services = await Service.find().populate("seller", "username").exec();

    if (!services || services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No services found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Service retrieved successfully",
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching services",
      error: error.message,
    });
  }
};

export const viewSingleService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id)
      .populate("seller", "username")
      .exec();

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching service",
      error: error.message,
    });
  }
};

export const editService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { title, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating service",
      error: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting service",
      error: error.message,
    });
  }
};
