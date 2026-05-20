import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { createOrder, verifyPayment } from "../controller/courseOrder.js";

const router = express.Router();

router.post("/buy-now",authMiddleware,roleMiddleware("user"),createOrder);
router.post("/verify-payment",authMiddleware,roleMiddleware("user"),verifyPayment);

export default router;