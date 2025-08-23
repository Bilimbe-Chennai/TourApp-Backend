const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admincollection = require("../Models/AdminsModel");
const jwt = require("jsonwebtoken");
const Usercollection = require("../Models/UserModel");
const crudService = require("../Utils/crudService");
let tokenBlacklist = []; // temporary in-memory blacklist (use Redis/DB in production)
module.exports = {
  save: async (req, res) => {
     try {
      if (!req.body.password) {
        return res.status(400).json({ error: "Password is required" });
      }
// Check if admin already exists
      const existing = await crudService.getOne(Admincollection, { email: req.body.email });
      if (existing) {
        return res.status(409).json({ message: "Email already exists" });
      }
   // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
// Create Admin
      const result = await crudService.create(Admincollection, {
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
        password: hashedPassword,
      });
 // Once Admin created -> create User also
    const user = await crudService.create(Usercollection, {
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,       // or admin.name
      email: req.body.email,
      company_name: req.body.company_name,
      mobile_number:req.body.mobile_number,
      password: hashedPassword,  // same hashed password
      user_type: "admin",             // you can mark role = admin
      status: "Active",          // optional default
    });
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  adminGet: async (req, res) => {
    try {
      const admin = await crudService.getOne(Admincollection, { email: req.params.email });
      if (!admin) return res.status(400).send("Invalid Admin");
      res.json({ admin });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  allAdminGet: async (req, res) => {
    try {
      const admins = await crudService.getAll(Admincollection);
      res.json({ admins });
    } catch (error) {
       console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  editOneAdmin: async (req, res) => {
     try {
      const { _id, status } = req.body;
      const admin = await crudService.updateOne(Admincollection, { _id }, { status });
      if (!admin) return res.status(400).send("Invalid Admin");
      res.json({ admin });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
    },
  editManyFieldsInOneAdmin: async (req, res) => {
  try {
    const { _id, ...rest } = req.body;
    // whitelist of allowed fields
    const allowedFields = ["status","logo","contact_person_name","company_name", "name","trips","coordinators"];
    const updateData = {};

    // pick only allowed fields from req.body
    for (const key of allowedFields) {
      if (rest[key] !== undefined) {
        updateData[key] = rest[key];
      }
    }

    const admin = await crudService.updateOne(
      Admincollection,
      { _id },
      updateData
    );

    if (!admin) return res.status(400).send("Invalid Admin");

    res.json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
},

  deleteAdmin: async (req, res) => {
    try {
      const { _id } = req.body;
      const admin = await crudService.deleteOne(Admincollection, { _id });
      if (!admin) return res.status(400).send("Admin not found");
      res.json({ message: "Admin deleted", admin });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
