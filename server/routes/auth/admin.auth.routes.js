import express from "express";

import {
  forgetPassword,
  logoutAdmin,
  logAdmin,
  regAdmin,
} from "../../controller/auth/admin.auth.controller.js";

export const authAdminRoutes = express.Router();

authAdminRoutes.post("/admin/register", regAdmin);
authAdminRoutes.post("/admin/login", logAdmin);
authAdminRoutes.post("/admin/forget-password", forgetPassword);
authAdminRoutes.post("/admin/logout", logoutAdmin);