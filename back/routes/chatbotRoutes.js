import express from "express";
import { chatWithGemini } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/online", chatWithGemini);

export default router;
