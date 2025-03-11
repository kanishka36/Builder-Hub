import express from "express";
import {
  addService,
  deleteService,
  editService,
  viewService,
  viewSingleService,
} from "../controller/service.controller.js";

export const serviceRoutes = express.Router();

serviceRoutes.post("/add-service/:sellerId", addService);
serviceRoutes.get("/view-service", viewService);
serviceRoutes.get("/view-service/:id", viewSingleService);
serviceRoutes.put("/edit-service/:id", editService);
serviceRoutes.delete("/delete-service/:id", deleteService);
