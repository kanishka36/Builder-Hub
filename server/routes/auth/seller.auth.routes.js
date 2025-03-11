import express from "express";

import {
  forgetPassword,
  logoutSeller,
  logSeller,
  regSeller,
} from "../../controller/auth/seller.auth.controller.js";

export const authSellerRoutes = express.Router();

authSellerRoutes.post("/seller/register", regSeller);
authSellerRoutes.post("/seller/login", logSeller);
authSellerRoutes.post("/seller/forget-password", forgetPassword);
authSellerRoutes.post("/seller/logout", logoutSeller);