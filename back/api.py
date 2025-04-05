from gpt4all import GPT4All
from flask import Flask, request, jsonify

app = Flask(__name__)

# Path to your local GPT4All model
model_path = "C:/Users/navee/AppData/Local/nomic.ai/GPT4All/gpt4all-falcon-newbpe-q4_0.gguf"

# Force GPT4All to use local model only
gpt_model = GPT4All(model_path, allow_download=False)  # Prevents online download

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_prompt = data.get("prompt", "")

    if not user_prompt:
        return jsonify({"error": "No prompt provided"}), 400

    response = gpt_model.generate(user_prompt)
    
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(port=5000)
