// Firebase configuration
const firebaseConfig = {
    
    authDomain: "online-doctor-system.firebaseapp.com",
    projectId: "online-doctor-system",
    storageBucket: "online-doctor-system.appspot.com",
    messagingSenderId: "297862158456",
    appId: "1:297862158456:web:9b763804c4fccd609d758d",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Get ALL DOM elements
const userEmailSpan = document.getElementById('user-email');
const logoutButton = document.getElementById('logout-button');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const calculateBmiButton = document.getElementById('calculate-bmi-button');
const bmiResultDiv = document.getElementById('bmi-result');
const dobInput = document.getElementById('dob');
const doctorSelect = document.getElementById('doctor-select');
const symptomsTextarea = document.getElementById('symptoms');
const bookAppointmentButton = document.getElementById('book-appointment-button');
const generateQuestionsButton = document.getElementById('generate-questions-button');
const aiQuestionsDiv = document.getElementById('ai-questions');
const appointmentListDiv = document.getElementById('appointment-list');
const saveProfileButton = document.getElementById('save-profile-button');

let currentUser = null;
let lastAppointmentData = null;

// Authentication check
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        userEmailSpan.textContent = user.email;
        loadAppointments();
        loadProfile();
    } else {
        window.location.href = 'index.html';
    }
});

function loadProfile() {
    // ... (load profile logic here)
}
saveProfileButton.addEventListener('click', () => {
    // ... (save profile logic here)
});
function loadAppointments() {
    // ... (load appointments logic here)
}
logoutButton.addEventListener('click', () => {
    // ... (logout logic here)
});
calculateBmiButton.addEventListener('click', () => {
    // ... (BMI logic here)
});

// Book Appointment Logic
bookAppointmentButton.addEventListener('click', () => {
    if (!currentUser) return;
    const dob = dobInput.value;
    const doctor = doctorSelect.value;
    const symptoms = symptomsTextarea.value.trim();

    if (!dob || !symptoms) {
        alert('Please fill all fields.');
        return;
    }
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    const appointmentData = { userId: currentUser.uid, userEmail: currentUser.email, doctor, symptoms, userAge: age, bookingTime: new Date() };
    
    db.collection('appointments').add(appointmentData).then(docRef => {
        alert('Appointment booked successfully!');
        lastAppointmentData = appointmentData;
        
        // THIS IS THE KEY LINE THAT ENABLES THE BUTTON
        generateQuestionsButton.disabled = false;
        
        loadAppointments(); // Refresh the list
    }).catch(error => {
        alert('Booking failed. Please try again.');
        console.error("Booking Error: ", error);
    });
});

// AI Question Generator Logic
generateQuestionsButton.addEventListener('click', () => {
    if (!lastAppointmentData) {
        alert('Please book an appointment first or select one from your list.');
        return;
    }
    aiQuestionsDiv.style.display = 'block';
    aiQuestionsDiv.innerHTML = '<p class="loading">Generating AI questions...</p>';
    fetch('https://healthcare-pro-backend-y8u5.onrender.com/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lastAppointmentData)
    })
    .then(response => response.json())
    .then(data => {
        aiQuestionsDiv.innerHTML = data.summary; // The AI response will be injected here
    })
    .catch(error => {
        aiQuestionsDiv.innerHTML = '<p>Error generating questions. Is the backend server running?</p>';
        console.error("AI Error:", error);
    });
});
