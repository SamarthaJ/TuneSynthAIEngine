import os
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
from tempfile import NamedTemporaryFile
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Hugging Face API details
API_URL = "https://api-inference.huggingface.co/models/facebook/musicgen-small"
HEADERS = {"Authorization": "Bearer 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"}
 
def query_huggingface_api(payload):
    """Send a request to the Hugging Face API."""
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    if response.status_code == 200:
        return response.content
    else:
        raise Exception(f"API error: {response.status_code} - {response.text}")

@app.route('/generate-music', methods=['POST'])
def generate_music():
    """Endpoint to generate music and return the file."""
    try:
        # Parse the request JSON for the prompt
        data = request.get_json()
        prompt = data.get("prompt", "")
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        start_time = time.time()

        # Call the Hugging Face API with the prompt
        audio_bytes = query_huggingface_api({"inputs": prompt})
        end_time = time.time()
        elapsed_time = time.time() - start_time

        print(f"total time taken to generate:  {elapsed_time:.2f} sec")
        # Save the audio to a temporary file
        temp_file = NamedTemporaryFile(delete=False, suffix=".mp3")
        temp_file.write(audio_bytes)
        temp_file.close()

        # Send the audio file as a response
        return send_file(temp_file.name, mimetype="audio/mp3", as_attachment=True, download_name="generated_music.mp3")

    except Exception as e:
        return jsonify({"error": "An error occurred during music generation", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
