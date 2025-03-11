import express from "express";

import {
  forgetPassword,
  logoutUser,
  logUser,
  regUser,
  checkUserAuth
} from "../../controller/auth/user.auth.controller.js";

export const authUserRoutes = express.Router();

authUserRoutes.post("/user/register", regUser);
authUserRoutes.post("/user/login", logUser);
authUserRoutes.post("/user/forget-password", forgetPassword);
authUserRoutes.post("/logout", logoutUser);
authUserRoutes.get("/check-auth", checkUserAuth);
