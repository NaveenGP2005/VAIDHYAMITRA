const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

const app = express();
app.use(cors());
app.use(express.json());

let medicalData = [];
let model;
let embeddings = [];

// Load CSV Data
fs.createReadStream("medical_data.csv")
  .pipe(csv())
  .on("data", (row) => {
    medicalData.push(row);
  })
  .on("end", async () => {
    console.log("CSV loaded. Loading model...");
    model = await use.load();
    console.log("Model loaded. Generating embeddings...");

    const questions = medicalData.map((row) => row.Question);
    const questionEmbeddings = await model.embed(questions);
    embeddings = await questionEmbeddings.array();

    console.log("Embeddings generated!");
  });

// Function to find the best match
async function findBestMatch(userInput) {
  if (!model || embeddings.length === 0) {
    return "Model is still loading...";
  }

  const inputEmbedding = await model.embed([userInput]);
  const inputVector = inputEmbedding.arraySync()[0];

  let bestIndex = -1;
  let bestScore = -Infinity;

  embeddings.forEach((vector, index) => {
    const score = tf.losses.cosineDistance(tf.tensor1d(vector), tf.tensor1d(inputVector), 0).dataSync()[0];
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex !== -1 ? medicalData[bestIndex].Answer : "Sorry, I don't understand.";
}

// API route
app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question;
  const answer = await findBestMatch(userQuestion);
  res.json({ answer });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
