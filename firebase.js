/* Firebase SDKs (v9 Modular – Browser) */
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* Firebase Configuration */
const firebaseConfig = {
  apiKey: "AIzaSyD-sVExCl2LDQ3ALbV2KsqJ4iOmgNLoA30",
  authDomain: "armtaxi-eadad.firebaseapp.com",
  projectId: "armtaxi-eadad",
  storageBucket: "armtaxi-eadad.firebasestorage.app",
  messagingSenderId: "180834233335",
  appId: "1:180834233335:web:dc363ac016dfad5275dcf2"
};

/* Initialize Firebase (Prevent double init) */
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

/* Services */
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/* Exports */
export { db, auth, googleProvider };
