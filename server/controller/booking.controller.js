import { Booking } from "../model/booking.model.js";

export const Booked = async (req, res) => {
  const { date, customerId, sellerId, serviceId, transactionId } = req.body;

  if (
    !date ||
    !customerId ||
    !sellerId ||
    !transactionId ||
    !serviceId ||
    !Array.isArray(date) ||
    date.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide at least one date, along with customer and seller IDs.",
    });
  }

  try {
    await Booking.create({
      date: date,
      customer: customerId,
      seller: sellerId,
      service: serviceId,
      transactionId: transactionId,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully Booked",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
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

    const bookings = await Booking.find({
      seller: sellerId,
    })
      .populate("customer", "username email phoneNumber")
      .populate("service", "title description price")
      .exec();

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

export const viewUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const bookings = await Booking.find({
      customer: userId,
    })
      .populate("seller", "username email phoneNumber")
      .populate("service", "title description price")
      .exec();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user bookings",
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

export const updateJobStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { jobStatus } = req.body;

    console.log(bookingId, jobStatus)

    if (!jobStatus) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const updateBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { jobStatus },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job Status Updated Successfully",
      data: updateBooking,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating job status",
      error: error.message,
    });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { selectedDates, serviceId } = req.body;

    if (
      !selectedDates ||
      !Array.isArray(selectedDates) ||
      selectedDates.length === 0 ||
      !serviceId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid request. Please provide selected dates and service ID.",
      });
    }

    // Check if any of the selected dates are already booked
    const existingBookings = await Booking.find({
      date: { $in: selectedDates },
      service: serviceId,
    });

    if (existingBookings.length > 0) {
      return res.status(200).json({
        success: true,
        available: false,
        message: "Some selected dates are already booked.",
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: "All selected dates are available for booking.",
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking availability.",
      error: error.message,
    });
  }
};
