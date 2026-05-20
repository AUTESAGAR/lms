import express from "express";
import { changePassword, changePasswordSubmit, editProfile, editProfileSubmit, forgotPassword, forgotPasswordSubmit, login, loginSubmit, logout, reg, regSubmit } from "../controller/user.js";
import upload from "../middleware/fileHandler.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/reg",reg);
router.post("/reg",upload.single("photo"),regSubmit);
router.get("/login",login);
router.post("/login",loginSubmit);
router.get("/forgot-password",forgotPassword);
router.post("/forgot-password",forgotPasswordSubmit);
router.get("/change-password",changePassword);
router.post("/change-password",changePasswordSubmit);
router.get("/edit-profile",authMiddleware,editProfile);
router.post("/edit-profile",authMiddleware,upload.single("photo"),editProfileSubmit);
router.get("/logout",authMiddleware,logout);

export default router;
