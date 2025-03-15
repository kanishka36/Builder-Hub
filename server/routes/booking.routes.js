import express from "express";
import {
  Booked,
  viewSellerBookings,
  viewUserBookings,
  viewAllBookings,
  checkAvailability,
  updateJobStatus,
} from "../controller/booking.controller.js";

export const bookingRoutes = express.Router();

bookingRoutes.post("/book", Booked);
bookingRoutes.get("/view-bookings/:sellerId", viewSellerBookings);
bookingRoutes.get("/view-user-bookings/:userId", viewUserBookings);
bookingRoutes.get("/view-bookings", viewAllBookings);
bookingRoutes.put("/update-jobstatus/:bookingId", updateJobStatus);
bookingRoutes.post("/check-availability", checkAvailability);
