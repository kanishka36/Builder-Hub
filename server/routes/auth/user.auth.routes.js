import express from "express";

import {
  forgetPassword,
  logoutUser,
  logUser,
  regUser,
} from "../../controller/auth/user.auth.controller.js";

export const authUserRoutes = express.Router();

authUserRoutes.post("/user/register", regUser);
authUserRoutes.post("/user/login", logUser);
authUserRoutes.post("/user/forget-password", forgetPassword);
authUserRoutes.post("/user/logout", logoutUser);
