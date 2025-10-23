// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGCS9N9gifYuOUaFqLWf123IOq6rxC0cM",
  authDomain: "ecolearn-d4e72.firebaseapp.com",
  projectId: "ecolearn-d4e72",
  storageBucket: "ecolearn-d4e72.firebasestorage.app",
  messagingSenderId: "124286425125",
  appId: "1:124286425125:web:2a8054fce0f55848bcc7cc",
  measurementId: "G-X85VCJ4C6X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // app variable have all the firebase configuration
const analytics = getAnalytics(app);
const auth = getAuth(app); // auth

const submit = document.getElementById("submit");

submit.addEventListener("click", function (event) {
    event.preventDefault(); // prevent default action
    // inputs
    const email = document.getElementById("studentEmail").value;
    const password = document.getElementById("studentPassword").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        window.location.href = "dashboard.html";
    })
    .catch((error) => {
        const errorMessage = error.message.replace("Firebase: ", "");
        alert(`Error: ${errorMessage}`);
    });
});
