import { Seller } from "../../model/seller.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const regSeller = async (req, res) => {
  const { username, email, password, category, role } = req.body;

  try {
    if (!username || !password || !email || !category || !role) {
      return res.status(400).json({
        succuss: false,
        message: "Please fill in all required fields",
      });
    }
    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      return res.status(400).json({
        succuss: false,
        message: "Email Already Exists",
      });
    }

    const hashPassword = bcryptjs.hashSync(password, 10);

    await Seller.create({
      username: username,
      email: email,
      password: hashPassword,
      category: category,
      role: role,
    });

    res.status(201).json({
      succuss: true,
      message: "Seller registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      succuss: false,
      message: "Failed to register seller",
    });
  }
};

// Login Seller
export const logSeller = async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ email: email })
      .populate("role", "name")
      .exec();
    if (!seller) {
      res.status(404).json({
        succuss: false,
        message: "Seller not found!",
      });
      return;
    }

    const matchPassword = bcryptjs.compareSync(password, seller.password);

    if (!matchPassword) {
      return res.status(401).json({
        succuss: false,
        message: "Invalid credentials!",
      });
    }

    const token = jwt.sign(
      { id: seller.id, email: seller.email, role: seller.role.name },
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
    } = seller._doc;

    res.status(200).json({
      succuss: true,
      seller: { ...rest, role: seller.role.name },
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

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({
        succuss: false,
        message: "Seller not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    seller.resetPasswordToken = hashedToken;
    seller.resetPasswordExpires = Date.now() + 3600000;
    await seller.save();

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        seller: process.env.EMAIL,
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

export const logoutSeller = async (req, res) => {
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
