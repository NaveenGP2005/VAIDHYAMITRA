import axios from "axios";
import dotenv from "dotenv";

dotenv.config();  // ✅ Load .env variables

const testOpenAI = async () => {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;  // ✅ Read API key from .env

    if (!OPENAI_API_KEY) {
      throw new Error("API key is missing! Check your .env file.");
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello" }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,  // ✅ Use Bearer format
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error(
      "OpenAI API Test Error:",
      error.response?.data || error.message
    );
  }
};

testOpenAI();
