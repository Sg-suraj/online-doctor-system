import os
import firebase_admin
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

# --- INITIALIZATION ---

# Initialize Flask App and enable CORS
# Initialize Flask App and enable CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://healthcare-pro.netlify.app"}})
# Load environment variables from .env file
load_dotenv()

# Initialize Firebase Admin SDK
# The serviceAccountKey.json file must be in the same directory
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Configure the Gemini API
# Get the API key from the environment variables
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not found. Please set it in the .env file.")
genai.configure(api_key=gemini_api_key)

# --- API ROUTES ---

@app.route('/')
def index():
    """A simple route to test if the server is running."""
    return jsonify({"status": "success", "message": "Backend is running!"})


@app.route('/api/generate-summary', methods=['POST'])
def generate_summary():
    """
    The main endpoint to generate the pre-visit summary using Gemini.
    """
    try:
        # Get the data sent from the frontend
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        user_age = data.get('userAge')
        symptoms = data.get('symptoms')
        doctor = data.get('doctor')

        # --- Prompt Engineering ---
        # Create a detailed prompt for the Gemini API
        prompt = f"""
        You are a helpful assistant preparing a patient for a doctor's appointment.
        Your goal is to summarize the patient's information in a clear, easy-to-understand way and suggest relevant questions to ask the doctor.
        Your tone should be reassuring and supportive.

        **IMPORTANT: DO NOT provide any diagnosis, medical advice, or treatment recommendations.**

        Here is the patient's information:
        - Age: {user_age}
        - Doctor/Department: {doctor}
        - Reported Symptoms: "{symptoms}"

        Based on this, please generate the following:
        1.  **Summary for the Patient:** A brief, one-paragraph summary of their stated issue in simple language.
        2.  **Questions to Ask:** A list of 3 to 4 relevant questions the patient could ask their doctor to better understand their situation.

        Structure your response clearly with headings for each section.
        """

        # Create the Gemini model instance and generate content
        # THIS IS THE CORRECTED LINE:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)

        # Return the generated text to the frontend
        return jsonify({"summary": response.text})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Failed to generate summary due to an internal error."}), 500


# --- RUN THE APP ---

if __name__ == '__main__':
    # The server will run on http://127.0.0.1:5000
    app.run(debug=True, port=5000)