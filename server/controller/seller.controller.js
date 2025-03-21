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
    let { username, email, imageUrl, address, phoneNumber } = req.body;

    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      imageUrl = imageUrl[0];
    }
    console.log(username, email, imageUrl, address, phoneNumber);

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { username, email, address, phoneNumber, imageUrl },
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
    const suppliers = await Seller.find({ category: "supplier" })
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

export const updateSellerLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body; // Extract lat & lng from frontend

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { location: { type: "Point", coordinates: [lng, lat] } }, // GeoJSON format (lng first, lat second)
      { new: true, runValidators: true }
    );

    if (!updatedSeller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Seller location updated successfully",
      data: updatedSeller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating location",
      error: error.message,
    });
  }
};

export const nearbySellerSearch = async (req, res) => {
  try {
    const { longitude, latitude, radius } = req.query; // Get location from query parameters

    if (!longitude || !latitude || !radius) {
      return res
        .status(400)
        .json({ message: "Longitude, latitude, and radius are required." });
    }

    const sellers = await Seller.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(radius) * 1000, // Convert km to meters
        },
      },
    })
      .populate("role", "name")
      .select("username role category location.coordinates");

    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error });
  }
};

export const viewSuplliers = async (req, res) => {
  try {
    const sellers = await Seller.find({ category: "supplier" })
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
