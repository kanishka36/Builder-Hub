import express from "express";
import {
  addToCart,
  removeFromCart,
  viewCart,
} from "../controller/cart.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const cartRoutes = express.Router();

cartRoutes.post("/add-cart", auth, addToCart);
cartRoutes.get("/view-cart", auth, viewCart);
cartRoutes.delete("/remove/:productId", auth, removeFromCart);
