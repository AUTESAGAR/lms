import express from "express";
import { home } from "../controller/home.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";


const router = express.Router();

router.get("/home",authMiddleware,roleMiddleware("user"),home);

export default router;