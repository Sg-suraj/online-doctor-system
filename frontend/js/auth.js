// Get references to all the HTML elements we'll be working with
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const errorMessage = document.getElementById('error-message');

// --- Form Toggling ---
// When the "Sign Up" link is clicked, hide the login form and show the signup form
showSignup.addEventListener('click', (e) => {
    e.preventDefault(); // Prevents the link from trying to navigate
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    errorMessage.textContent = ''; // Clear any old error messages
});

// When the "Login" link is clicked, hide the signup form and show the login form
showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    errorMessage.textContent = '';
});

// --- Firebase Signup ---
const signupButton = document.getElementById('signup-button');
signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up successfully
            console.log('User signed up:', userCredential.user);
            // Redirect to the dashboard page
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            // Handle Errors here.
            errorMessage.textContent = error.message;
            console.error('Signup Error:', error.message);
        });
});

// --- Firebase Login ---
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in successfully
            console.log('User logged in:', userCredential.user);
            // Redirect to the dashboard page
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
            console.error('Login Error:', error.message);
        });
});

// --- Check Auth State ---
// This function checks if a user is already logged in.
// If they are, it automatically redirects them to the dashboard.
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is already logged in. Redirecting to dashboard.');
        // Make sure we are not already on the dashboard page to avoid a redirect loop
        if (!window.location.pathname.endsWith('dashboard.html')) {
            window.location.href = 'dashboard.html';
        }
    }
});