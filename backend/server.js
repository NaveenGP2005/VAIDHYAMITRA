const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route to handle frontend requests
app.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body;

        // Call Flask API
        const response = await axios.post("http://127.0.0.1:5000/chat", { prompt });

        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Node.js backend running on port ${PORT}`);
});
