const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified; // Store user payload (id, mobile_number, etc.)
      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }
  },

  // Optional: If you want to check for roles (Admin/User)
  verifyRole: (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Token missing." });
      }
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
      }
      next();
    };
  },
};

module.exports = authMiddleware;
