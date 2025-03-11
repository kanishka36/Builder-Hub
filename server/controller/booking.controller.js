import { Booking } from "../model/booking.model.js";

export const Booked = async (req, res) => {
  const { date, customerId, sellerId, serviceId } = req.body;

  if (!date || !customerId || !sellerId || !serviceId) {
    return res.status(404).json({
      success: false,
      message: "Please fill in all required fields",
    });
  }

  try {
    await Booking.create({
      date: date,
      customer: customerId,
      seller: sellerId,
      service: serviceId,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully Booked",
    });
  } catch (error) {
    return res.status(500).json({
      succuss: false,
      message: "An error occurred while booking date",
      error: error.message,
    });
  }
};

export const viewSellerBookings = async (req, res) => {
  
  try {
    const { sellerId } = req.params;
  
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    const bookings= await Booking.find({
      seller: sellerId
    })
    .populate("customer", "username email phoneNumber")
    .populate("service", "title description price")
    .exec();

    console.log(bookings, "bookings")

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this seller",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seller bookings retrieved successfully",
      data: bookings,
    });

  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "An error occurred while fetching seller bookings",
      error: error.message,
    });
  }
};

export const viewAllBookings = async (req, res) => {
  try {
    const books = await Booking.find();

    if (!books || books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No booking dates found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching bookings",
      error: error.message,
    });
  }
}; 
