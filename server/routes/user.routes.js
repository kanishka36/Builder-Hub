import express from "express";
import { editUser } from "../controller/user.controller.js";

export const userRoutes = express.Router();

userRoutes.put("/edit-user/:id", editUser);
