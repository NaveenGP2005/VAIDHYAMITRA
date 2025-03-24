import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat with Gemini Healthcare AI
export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent([message]);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
