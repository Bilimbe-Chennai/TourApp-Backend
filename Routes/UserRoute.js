const express = require("express");
const userController = require("../Controllers/UserController");
const { verifyToken, verifyRole } = require("../Utils/authMiddleware");
const router = express.Router();
// Public routes
router.post(process.env.BASE_USERCOLLECTION_REG_URI, userController.save);
router.post(process.env.BASE_USERCOLLECTION_LOGIN_URI, userController.userLogin);
// Admin-only route
router.put(process.env.BASE_USERCOLLECTION_EDITUSER_URI,verifyToken, verifyRole("Admin"), userController.editOneUser);
router.delete(process.env.BASE_USERCOLLECTION_DELETEONEUSER_URI, verifyToken, verifyRole("Admin"), userController.deleteUser);
// Protected routes
router.get(process.env.BASE_USERCOLLECTION_GETUSER_URI+"/:email", verifyToken,userController.userGet);
router.get(process.env.BASE_USERCOLLECTION_GETAllUSER_URI,verifyToken, userController.alluserGet);
router.post(process.env.BASE_USERCOLLECTION_LOGOUT_URI,verifyToken, userController.userLogout);
module.exports = router;
