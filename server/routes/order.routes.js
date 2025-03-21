import express from "express";
import {
  createOrderFromBuyNow,
  createOrderFromCart,
  viewSellerOrders,
  viewUserOrders,
} from "../controller/order.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const orderRoutes = express.Router();

orderRoutes.post("/add-order/buy-now", auth, createOrderFromBuyNow);
orderRoutes.post("/add-order/from-cart", auth, createOrderFromCart);
orderRoutes.get("/view-orders/user", viewUserOrders);
orderRoutes.get("/view-orders/seller", viewSellerOrders);
