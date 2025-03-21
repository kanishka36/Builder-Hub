export const authorizedRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.admin.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
  };
  