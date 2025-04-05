from flask import Flask, request, jsonify
import pickle
import os

app = Flask(__name__)

# Load the trained model and vectorizer
model_path = os.path.join(os.path.dirname(__file__), "models/healthcare_bot.pkl")
with open(model_path, "rb") as f:
    vectorizer, model = pickle.load(f)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")

    # Convert input question into vector
    X_test = vectorizer.transform([question])
    
    # Predict the answer
    answer = model.predict(X_test)[0]
    
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
