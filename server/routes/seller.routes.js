import express from "express";
import {
  deleteSeller,
  editSeller,
  updateSellerLocation,
  viewSeller,
  viewSingleSeller,
  viewSupplier,
} from "../controller/seller.controller.js";

export const sellerRoutes = express.Router();

sellerRoutes.get("/view-seller", viewSeller);
sellerRoutes.get("/view-seller/:id", viewSingleSeller);
sellerRoutes.put("/edit-seller/:id", editSeller);
sellerRoutes.delete("/delete-seller/:id", deleteSeller);
sellerRoutes.put("/location/:id", updateSellerLocation)


sellerRoutes.get("/view-suppliers", viewSupplier);