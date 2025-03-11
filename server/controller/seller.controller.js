import { Seller } from "../model/seller.model.js";

export const viewSeller = async (req, res) => {
  try {
    const sellers = await Seller.find()
      .populate("role", "name")
      .select("-password -resetPasswordToken -fcmToken")
      .exec();

    if (!sellers || sellers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sellers found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Seller retrieved successfully",
      data: sellers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching sellers",
      error: error.message,
    });
  }
};

export const viewSingleSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);

    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Seller retrieved successfully",
      data: seller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching seller",
      error: error.message,
    });
  }
};

export const editSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, category, role } = req.body;

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { username, email, password, category, role },
      { new: true, runValidators: true }
    );

    if (!updatedSeller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Seller updated successfully",
      data: updatedSeller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating seller",
      error: error.message,
    });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSeller = await Seller.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Seller deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting seller",
      error: error.message,
    });
  }
};

export const viewSupplier = async (req, res) => {
  try {
    const suppliers = await Seller.find({category:"supplier"})
      .populate("role", "name")
      .select("-password -resetPasswordToken -fcmToken")
      .exec();

    if (!suppliers || suppliers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No suppliers found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Seller retrieved successfully",
      data: suppliers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching suppliers",
      error: error.message,
    });
  }
};
