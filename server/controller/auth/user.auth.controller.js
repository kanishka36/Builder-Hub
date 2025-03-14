import { User } from "../../model/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const regUser = async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    city,
  } = req.body;

  try {
    if (
      !username ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !city
    ) {
      return res.status(400).json({
        succuss: false,
        message: "Please fill in all required fields",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        succuss: false,
        message: "Username Already Exists",
      });
    }

    const hashPassword = bcryptjs.hashSync(password, 10);

    await User.create({
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      phoneNumber: phoneNumber,
      address: address,
      city: city
    });

    res.status(201).json({
      succuss: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      succuss: false,
      message: "Failed to register user",
    });
  }
};

// Login User
export const logUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({
        succuss: false,
        message: "User not found!",
      });
      return;
    }

    const matchPassword = bcryptjs.compareSync(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        succuss: false,
        message: "Invalid credentials!",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    const {
      password: _,
      resetPasswordToken,
      resetPasswordExpires,
      ...rest
    } = user._doc;

    res.status(200).json({
      succuss: true,
      user: rest,
      token: token,
      message: "Login successful",
    });
  } catch (err) {
    console.log("Error during login:", err);
    res.status(500).json({
      succuss: false,
      message: "Login failed",
    });
  }
};

// Forget Password
export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        succuss: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        succuss: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password: 
      ${process.env.ORIGIN_1}/reset-password/${resetToken}

      If you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send password reset email" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      succuss: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      succuss: false,
      message: "Logout failed",
    });
  }
};

export const checkUserAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      res.status(200).json({
        success: true,
        message: "Authorized",
        admin: decoded,
      });
    });
  } catch (error) {
    console.error("Error during checkAuth:", error);
    res.status(500).json({
      success: false,
      message: "CheckAuth failed",
    });
  }
};
