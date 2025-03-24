import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Healthcare Chatbot Endpoint
app.post("/api/chatbot", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a healthcare assistant. Provide accurate, concise, and helpful responses to medical questions. If necessary, advise users to consult a professional. Here is the user's query: ${userMessage}`,
            },
          ],
        },
      ],
    });

    const botReply = result.response.candidates[0].content.parts[0].text;

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch response. Please try again later." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Healthcare Chatbot running on port ${PORT}`)
);
