HealthCare Pro - Your Personal Appointment Assistant

(https://virtual-clinic-app.netlify.app/)


An intelligent, full-stack application designed to empower patients by helping them prepare for their medical consultations.

From Concept to Cloud: A Full-Stack Health Application
The inspiration for HealthCare Pro comes from a common experience: leaving a doctor's office and realizing you forgot to ask important questions. This application bridges that gap.

A user can securely sign up, book an appointment with a specialist, and then leverage the core feature: an AI assistant powered by the Google Gemini API. By describing their symptoms, the user receives a curated list of insightful and relevant questions to bring to their appointment, ensuring a more productive and less stressful consultation.

This project was built end-to-end, from initial design to a fully deployed, live application, demonstrating a complete full-stack development cycle.

✨ Core Features at a Glance
🔑 Secure Authentication: Full user registration and login system via Firebase.

📅 Appointment System: Book appointments with various specialists and view your history.

🧠 AI-Powered Question Generation: The key feature, using the Gemini API to create relevant questions based on user-provided symptoms.

⚖️ BMI Calculator: An integrated tool for a quick health metric check.

🚀 Fully Deployed: The frontend is live on Netlify and the Python backend is live on Render.

🛠️ Technology & Architecture
This project is built with a modern decoupled architecture.

Frontend: A pure client-side application built with HTML5, CSS3, and JavaScript.

Backend: A Python Flask API that serves as the brain, handling business logic and communicating with the Google Gemini API.

Database & Authentication: Firebase serves as the backend-as-a-service, managing user accounts with Firebase Authentication and storing data in Firestore.

Deployment: The application is deployed with a CI/CD pipeline from GitHub to Netlify (frontend) and Render (backend).
