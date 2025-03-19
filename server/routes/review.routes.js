import express from "express";
import {addReview} from "../controller/review.controller.js";

export const reviewRoutes = express.Router();

reviewRoutes.post("/add-reviews", addReview);
