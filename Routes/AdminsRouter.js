const express = require("express");
const adminsController = require("../Controllers/AdminsController");
const { verifyToken, verifyRole } = require("../Utils/authMiddleware");
const router = express.Router();
// Public routes
router.post(process.env.BASE_ADMINCOLLECTION_REG_URI, adminsController.save);
// Admin-only route
router.put(process.env.BASE_ADMINCOLLECTION_EDITADMIN_URI,verifyToken, verifyRole("admin"), adminsController.editManyFieldsInOneAdmin);
router.delete(process.env.BASE_ADMINCOLLECTION_DELETEONEADMIN_URI, verifyToken, verifyRole("admin"), adminsController.deleteAdmin);
// Protected routes
router.get(process.env.BASE_ADMINCOLLECTION_GETADMIN_URI+"/:email", verifyToken,adminsController.adminGet);
router.get(process.env.BASE_ADMINCOLLECTION_GETAllADMIN_URI,verifyToken, adminsController.allAdminGet);
module.exports = router;
