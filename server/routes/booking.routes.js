import express from "express";
import {
  Booked,
  viewSellerBookings,
  viewAllBookings
} from "../controller/booking.controller.js";

export const bookingRoutes = express.Router();

bookingRoutes.post("/book", Booked);
bookingRoutes.get("/view-bookings/:sellerId", viewSellerBookings)
bookingRoutes.get("/view-bookings", viewAllBookings)