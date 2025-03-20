import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  viewProduct,
  viewSingleProduct,
} from "../controller/product.controller.js";

export const productRoutes = express.Router();

productRoutes.post("/add-product/:sellerId", addProduct);
productRoutes.get("/view-products/:sellerId", viewProduct);
productRoutes.get("/view-product/:id", viewSingleProduct);
productRoutes.put("/edit-product/:id", editProduct);
productRoutes.delete("/delete-product/:id", deleteProduct);
