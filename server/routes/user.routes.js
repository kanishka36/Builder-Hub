import express from "express";
import { editUser, editBillingAddress } from "../controller/user.controller.js";

export const userRoutes = express.Router();

userRoutes.put("/edit-user/:id", editUser);
userRoutes.put("/edit-billing-address/:id", editBillingAddress);
