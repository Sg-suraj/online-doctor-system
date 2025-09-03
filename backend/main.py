import os
import firebase_admin
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

# --- INITIALIZATION ---

# Initialize Flask App
app = Flask(__name__)

# ✅ Allow local + deployed frontend
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://virtual-clinic-app.netlify.app",
    "https://healthcare-pro.netlify.app"
]}})

# Load environment variables
load_dotenv()

# --- Firebase (optional, only if creds exist) ---
if os.path.exists("serviceAccountKey.json"):
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
else:
    print("⚠️ Firebase serviceAccountKey.json not found. Skipping Firebase init.")

# --- Gemini API ---
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("❌ GEMINI_API_KEY not found. Please set it in the .env or Render env vars.")
genai.configure(api_key=gemini_api_key)

# --- ROUTES ---

@app.route('/')
def index():
    """Health check route"""
    return jsonify({"status": "success", "message": "Backend is running!"})


@app.route('/api/generate-summary', methods=['POST'])
def generate_summary():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        user_age = data.get('userAge')
        symptoms = data.get('symptoms')
        doctor = data.get('doctor')

        prompt = f"""
        You are a helpful assistant preparing a patient for a doctor's appointment.
        Do NOT provide diagnosis, medical advice, or treatment.

        Patient Info:
        - Age: {user_age}
        - Doctor/Department: {doctor}
        - Reported Symptoms: "{symptoms}"

        Generate:
        1. Summary for the patient
        2. 3–4 relevant questions to ask the doctor
        """

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)

        # Debug log
        print("✅ Gemini raw response:", response)

        # Handle different response formats
        summary_text = getattr(response, "text", None)
        if not summary_text and hasattr(response, "candidates"):
            summary_text = response.candidates[0].content.parts[0].text

        return jsonify({"summary": summary_text or "⚠️ No summary generated."})

    except Exception as e:
        import traceback
        print("❌ Error Traceback:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


# --- RUN ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
