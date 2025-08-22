const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../Models/UserModel");
const { getTokenBlacklist } = require("../Controllers/UserController");
const authMiddleware = {
  verifyToken: async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }
    // Check blacklist
    if (getTokenBlacklist().includes(token)) {
      return res.status(401).json({ message: "Token has been logged out" });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(verified._id).select("password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user; // Store user payload (id, mobile_number, etc.)
      next();
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Invalid Token" });
    }
  },

  // Optional: If you want to check for roles (Admin/User)
  verifyRole: (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized. Token missing." });
      }

      if (req.body.user_type !== role && req.body.user_type !== "superadmin") {
        return res
          .status(403)
          .json({ message: "Forbidden. Insufficient permissions." });
      }
      next();
    };
  },
};

module.exports = authMiddleware;
