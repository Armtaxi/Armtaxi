/* ===============================
   Firebase Imports
================================ */
import { auth, googleProvider } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* ===============================
   ADMIN CONFIG
================================ */
const ADMIN_EMAIL = "armdroptaxi73@gmail.com";
const ADMIN_REDIRECT_URL = "/dashboard.html";

/* ===============================
   DOM ELEMENTS
================================ */
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const togglePassword = document.getElementById("togglePassword");

/* Forgot Password */
const forgotPasswordBtn = document.getElementById("forgotPassword");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const sendResetLinkBtn = document.getElementById("sendResetLink");
const resetEmailInput = document.getElementById("resetEmail");
const modalClose = document.getElementById("modalClose");
const cancelReset = document.getElementById("cancelReset");

/* ===============================
   HELPERS
================================ */
function showMessage(message, isError = true) {
  loginMessage.textContent = message;
  loginMessage.style.color = isError ? "#ff4d4d" : "#2ecc71";
}

function isAdmin(email) {
  return email === ADMIN_EMAIL;
}

/* ===============================
   EMAIL + PASSWORD LOGIN
================================ */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showMessage("Email and password are required");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userEmail = userCredential.user.email;

    if (!isAdmin(userEmail)) {
      showMessage("Access denied. You are not an admin.");
      await auth.signOut();
      return;
    }

    showMessage("Login successful. Redirecting...", false);

    setTimeout(() => {
      window.location.href = ADMIN_REDIRECT_URL;
    }, 1000);

  } catch (error) {
    showMessage(error.message);
  }
});

/* ===============================
   GOOGLE LOGIN
================================ */
googleLoginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const userEmail = result.user.email;

    if (!isAdmin(userEmail)) {
      showMessage("Access denied. Admin only.");
      await auth.signOut();
      return;
    }

    showMessage("Google login successful. Redirecting...", false);

    setTimeout(() => {
      window.location.href = ADMIN_REDIRECT_URL;
    }, 1000);

  } catch (error) {
    showMessage(error.message);
  }
});

/* ===============================
   TOGGLE PASSWORD VISIBILITY
================================ */
togglePassword.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password"
      ? "text"
      : "password";

  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

/* ===============================
   FORGOT PASSWORD
================================ */
forgotPasswordBtn.addEventListener("click", (e) => {
  e.preventDefault();
  forgotPasswordModal.style.display = "flex";
});

modalClose.addEventListener("click", () => {
  forgotPasswordModal.style.display = "none";
});

cancelReset.addEventListener("click", () => {
  forgotPasswordModal.style.display = "none";
});

sendResetLinkBtn.addEventListener("click", async () => {
  const email = resetEmailInput.value.trim();

  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent");
    forgotPasswordModal.style.display = "none";
  } catch (error) {
    alert(error.message);
  }
});