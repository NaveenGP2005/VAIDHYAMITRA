from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import fasttext
import numpy as np

app = Flask(__name__)

# Load models
similarity_model = SentenceTransformer("all-MiniLM-L6-v2")
classification_model = fasttext.load_model("healthcare_model.ftz")  # Pre-trained fastText model

# Sample dataset for similarity search
medical_cases = [
    {"symptoms": "fever, cough, sore throat", "diagnosis": "Common cold"},
    {"symptoms": "fever, body ache, chills", "diagnosis": "Flu"},
    {"symptoms": "headache, nausea, dizziness", "diagnosis": "Migraine"},
]
case_embeddings = similarity_model.encode([case["symptoms"] for case in medical_cases])

def find_similar_case(query):
    query_embedding = similarity_model.encode([query])
    similarities = np.dot(case_embeddings, query_embedding.T).flatten()
    best_match = np.argmax(similarities)
    return medical_cases[best_match]["diagnosis"]

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    query = data.get("query", "")

    # Classify symptoms using fastText
    classification = classification_model.predict(query)[0][0].replace("__label__", "")

    # Find similar case
    similar_case = find_similar_case(query)

    response = {
        "classification": classification,
        "suggested_diagnosis": similar_case
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
