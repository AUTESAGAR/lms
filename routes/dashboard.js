import express from "express";
import { dashboard, ourCourses } from "../controller/dashboard.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";


const router = express.Router();

router.get("/dashboard",authMiddleware,roleMiddleware("admin"),dashboard);
router.get("/our-courses",authMiddleware,roleMiddleware("admin"),ourCourses);

export default router;