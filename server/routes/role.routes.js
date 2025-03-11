import express from "express";
import {
  addRole,
  deleteRole,
  editRole,
  viewRole,
  viewRoleCategory,
  viewSingleRole,
} from "../controller/role.controller.js";

export const roleRoutes = express.Router();

roleRoutes.post("/add-role", addRole);
roleRoutes.get("/view-role", viewRole);
roleRoutes.get("/view-role/:category", viewRoleCategory);
roleRoutes.get("/view-role/:id", viewSingleRole);
roleRoutes.put("/edit-role/:id", editRole);
roleRoutes.delete("/delete-role/:id", deleteRole);