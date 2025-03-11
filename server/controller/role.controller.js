import { Role } from "../model/role.model.js";

export const addRole = async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(404).json({
      success: false,
      message: "Please fill in all required fields",
    });
  }

  try {
    await Role.create({
      name: name,
      category: category,
    });

    return res.status(201).json({
      success: true,
      message: "Role added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      succuss: false,
      message: "An error occurred while creating role",
      error: error.message,
    });
  }
};

export const viewRole = async (req, res) => {
  try {
    const roles = await Role.find();

    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No roles found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Role retrieved successfully",
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching roles",
      error: error.message,
    });
  }
};

export const viewRoleCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const role = await Role.find({category});

    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Role retrieved successfully",
      data: role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching role",
      error: error.message,
    });
  }
};

export const viewSingleRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Role retrieved successfully",
      data: role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching role",
      error: error.message,
    });
  }
};

export const editRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name, category },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating role",
      error: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting role",
      error: error.message,
    });
  }
};
