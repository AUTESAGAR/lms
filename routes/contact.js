import express from "express";
import { chatbotReply, contact } from "../controller/contact.js";

const router = express.Router();

router.get("/contact", contact);
router.post("/chatbot", chatbotReply);

export default router;