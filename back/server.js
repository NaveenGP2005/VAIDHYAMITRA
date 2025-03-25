import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // For local testing
  "https://5173-idx-testinggit-1742906567576.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev", // Your frontend URL
];

app.use(
  cors({
    origin:
      "https://5173-idx-testinggit-1742906567576.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Explicitly handle preflight (OPTIONS) requests
app.options("*", cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Healthcare Chatbot Endpoint
app.post("/api/chatbot", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

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

    const botReply =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm unable to process your request.";

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
