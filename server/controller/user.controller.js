import { User } from "../model/user.model.js";

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      username,
      firstName,
      lastName,
      email,
      imageUrl,
      address,
      phoneNumber,
      city,
    } = req.body;

    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      imageUrl = imageUrl[0]; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        imageUrl,
        city,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating user",
      error: error.message,
    });
  }
};
