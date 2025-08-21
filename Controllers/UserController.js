const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Usercollection = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const crudService = require("../Utils/crudService");
let tokenBlacklist = []; // temporary in-memory blacklist (use Redis/DB in production)
module.exports = {
  save: async (req, res) => {
     try {
      if (!req.body.password) {
        return res.status(400).json({ error: "Password is required" });
      }

      const existing = await crudService.getOne(Usercollection, { email: req.body.email });
      if (existing) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const result = await crudService.create(Usercollection, {
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
        password: hashedPassword,
      });

      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  userLogin: async (req, res) => {
    try {
      const user = await crudService.getOne(Usercollection, { email: req.body.email });
      if (!user) return res.status(400).send("Invalid User");

      if (user.status === "Inactive") {
        return res.status(400).send("This user declined by admin");
      }

      const passCheck = await bcrypt.compare(req.body.password, user.password);
      if (!passCheck) return res.status(400).send("Invalid Credentials");

      const token = jwt.sign(
        { _id: user._id, mobile_number: user.mobile_number },
        process.env.JWT_SECRET
      );

      res.json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  userGet: async (req, res) => {
    try {
      const user = await crudService.getOne(Usercollection, { email: req.params.email });
      if (!user) return res.status(400).send("Invalid User");
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  alluserGet: async (req, res) => {
    try {
      const users = await crudService.getAll(Usercollection);
      res.json({ users });
    } catch (error) {
       console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  editOneUser: async (req, res) => {
     try {
      const { _id, status } = req.body;
      const user = await crudService.updateOne(Usercollection, { _id }, { status });
      if (!user) return res.status(400).send("Invalid User");
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
    },
  deleteUser: async (req, res) => {
    try {
      const { _id } = req.body;
      const user = await crudService.deleteOne(Usercollection, { _id });
      if (!user) return res.status(400).send("User not found");
      res.json({ message: "User deleted", user });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
   userLogout: async (req, res) => {
    try {
      const token = req.header("Authorization");

      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
      // Add token to blacklist
      tokenBlacklist.push(token);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // export blacklist so middleware can check it
  getTokenBlacklist: () => tokenBlacklist,
};
