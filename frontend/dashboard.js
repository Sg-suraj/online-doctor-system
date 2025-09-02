document.addEventListener('DOMContentLoaded', () => {
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

    if (!firebase.apps.length) {
        const firebaseConfig = {
            apiKey: "AIzaSyD3R5gxNPpRO2a-GPCTHEwBciaBZGrPD0U",
            authDomain: "online-doctor-system.firebaseapp.com",
            projectId: "online-doctor-system",
            storageBucket: "online-doctor-system.appspot.com",
            messagingSenderId: "297862158456",
            appId: "1:297862158456:web:9b763804c4fccd609d758d",
        };
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    const db = firebase.firestore();

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            userEmailSpan.textContent = user.email;
            loadAppointments();
            loadProfile(); // Load user profile
        } else {
            window.location.href = 'index.html';
        }
    });

    function loadProfile() {
        if (!currentUser) return;
        db.collection('users').doc(currentUser.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.height) heightInput.value = userData.height;
                if (userData.weight) weightInput.value = userData.weight;
                if (userData.dob) dobInput.value = userData.dob;
            }
        });
    }

    function saveProfile() {
        if (!currentUser) return;
        const profileData = {
            height: heightInput.value,
            weight: weightInput.value,
            dob: dobInput.value
        };
        db.collection('users').doc(currentUser.uid).set(profileData, { merge: true })
            .then(() => alert("Profile information saved!"))
            .catch(error => alert("Could not save profile information."));
    }

    saveProfileButton.addEventListener('click', saveProfile);

    function loadAppointments() {
        if (!currentUser) return;
        appointmentListDiv.innerHTML = '<p class="loading">Loading appointments...</p>';
        db.collection('appointments').where('userId', '==', currentUser.uid).orderBy('bookingTime', 'desc').get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    appointmentListDiv.innerHTML = '<p>You have no appointments booked.</p>';
                    return;
                }
                let appointmentsHTML = '';
                querySnapshot.forEach(doc => {
                    const appt = doc.data();
                    const apptDate = appt.bookingTime.toDate().toLocaleDateString();
                    appointmentsHTML += `<div class="appointment-card"><p><strong>Doctor:</strong> ${appt.doctor}</p><p><strong>Symptoms:</strong> ${appt.symptoms}</p><p><strong>Booked On:</strong> ${apptDate}</p></div>`;
                });
                appointmentListDiv.innerHTML = appointmentsHTML;
            });
    }

    logoutButton.addEventListener('click', () => { auth.signOut().then(() => window.location.href = 'index.html'); });
    
    calculateBmiButton.addEventListener('click', () => {
        // BMI logic remains the same...
    });

    bookAppointmentButton.addEventListener('click', () => {
        // Booking logic remains the same...
    });
    
    generateQuestionsButton.addEventListener('click', () => {
        // AI logic remains the same...
    });
});