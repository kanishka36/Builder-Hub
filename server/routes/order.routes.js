import express from "express";
import {
  createOrderFromBuyNow,
  createOrderFromCart,
  updateOrderStatus,
  viewSellerOrders,
  viewUserOrders,
} from "../controller/order.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const orderRoutes = express.Router();

orderRoutes.post("/add-order/buy-now", auth, createOrderFromBuyNow);
orderRoutes.post("/add-order/from-cart", auth, createOrderFromCart);
orderRoutes.get("/view-orders/user", auth, viewUserOrders);
orderRoutes.get("/view-orders/seller", auth, viewSellerOrders);
orderRoutes.put("/update-order-status/:orderId", updateOrderStatus)
