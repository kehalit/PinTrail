from flask import Blueprint, request, jsonify
import requests
import os

chat_bp = Blueprint('chat', __name__)

# Hugging Face DialoGPT model endpoint
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-small"
HUGGINGFACE_API_KEY = os.getenv("HF_API_KEY")

if not HUGGINGFACE_API_KEY:
    raise ValueError("HF_API_KEY environment variable is not set!")

headers = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}"
}

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        messages = data.get("messages", [])
        user_input = messages[-1]["content"] if messages else "Hello!"

        payload = {
            "inputs": user_input,
            "parameters": {"max_new_tokens": 50}  # Controls the length of the response
        }

        res = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload)
        print("Hugging Face API response:", res.status_code, res.text)

        if res.status_code != 200:
            return jsonify({"error": f"Error code: {res.status_code} - {res.text}"}), res.status_code

        output = res.json()

        # Robust parsing: handle list or dict response
        if isinstance(output, list) and "generated_text" in output[0]:
            generated_text = output[0]["generated_text"]
        elif isinstance(output, dict) and "generated_text" in output:
            generated_text = output["generated_text"]
        else:
            # Fallback if the structure is different
            generated_text = str(output)

        return jsonify({
            "reply": {
                "role": "bot",
                "content": generated_text
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
