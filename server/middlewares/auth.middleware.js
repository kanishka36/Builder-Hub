import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decode;

      next();
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired admin token" });
  }
};
