import express from "express";
import {addReview, viewReview, viewUserReview} from "../controller/review.controller.js";

export const reviewRoutes = express.Router();

reviewRoutes.post("/add-reviews", addReview);
reviewRoutes.get("/view-review/:jobId", viewReview)
reviewRoutes.get("/view-user-review/:userId", viewUserReview)
