/* =====================================================
   ARM TAXI – FORM HANDLER (PRODUCTION SAFE)
   Firestore Write ONLY
   Amount approved by Admin later
===================================================== */

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "./firebase.js";

/* -----------------------------------------------------
   TARIFF CONFIG (REFERENCE ONLY)
----------------------------------------------------- */
const TARIFF = {
  oneway: {
    SEDAN:  { rate: 14, bata: 300 },
    ETIOS:  { rate: 15, bata: 300 },
    SUV:    { rate: 19, bata: 400 },
    INNOVA: { rate: 20, bata: 400 }
  },
  roundtrip: {
    SEDAN:  { rate: 13, bata: 300 },
    ETIOS:  { rate: 14, bata: 300 },
    SUV:    { rate: 18, bata: 400 },
    INNOVA: { rate: 19, bata: 400 }
  }
};

/* -----------------------------------------------------
   HELPERS
----------------------------------------------------- */
const isValidPhone = phone => /^[6-9]\d{9}$/.test(phone);

const getSelectedCar = name =>
  document.querySelector(`input[name="${name}"]:checked`);

const generateBookingId = () =>
  "ARM-" + Math.floor(10000 + Math.random() * 90000);

const showError = (input, message) => {
  input.focus();
  input.value = "";
  input.placeholder = message;
  input.style.borderColor = "#ff4757";
};

const clearErrors = form => {
  form.querySelectorAll("input").forEach(i => {
    i.style.borderColor = "";
  });
};

/* -----------------------------------------------------
   INIT
----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  console.log("form.js loaded, Firestore DB:", db);

  const oneWayForm = document.getElementById("oneWayForm");
  const roundTripForm = document.getElementById("roundTripForm");

  /* ===================== ONE WAY ===================== */
  oneWayForm?.addEventListener("submit", async e => {
    e.preventDefault();
    clearErrors(oneWayForm);

    try {
      const name   = document.getElementById("onewayName");
      const phone  = document.getElementById("onewayPhone");
      const alt    = document.getElementById("onewayAltPhone");
      const pickup = document.getElementById("onewayPickup");
      const drop   = document.getElementById("onewayDrop");
      const email  = document.getElementById("onewayEmail");
      const date   = document.getElementById("onewayDate");
      const time   = document.getElementById("onewayTime");
      const car    = getSelectedCar("onewayCar");

      if (!name.value.trim()) return showError(name, "Name required");
      if (!isValidPhone(phone.value)) return showError(phone, "Valid mobile required");
      if (!pickup.value.trim()) return showError(pickup, "Pickup required");
      if (!drop.value.trim()) return showError(drop, "Drop required");
      if (!date.value) return showError(date, "Date required");
      if (!time.value) return showError(time, "Time required");
      if (!car) return alert("Please select a vehicle");

      const vehicleType = car.dataset.vehicle;
      const tariff = TARIFF.oneway[vehicleType];
      if (!tariff) throw new Error("Invalid vehicle type");

      const docRef = await addDoc(collection(db, "onewaytrip"), {
        bookingId: generateBookingId(),
        journeyType: "oneway",

        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),

        customerName: name.value.trim(),
        customerPhone: phone.value,
        alternatePhone: alt.value.trim() || null,
        customerEmail: email.value.trim() || null,

        pickupLocation: pickup.value.trim(),
        dropLocation: drop.value.trim(),
        travelDate: date.value,
        travelTime: time.value,

        vehicleType,
        ratePerKm: tariff.rate,
        driverBata: tariff.bata,

        tripDistanceKm: null,
        tollCharges: null,

        fareStatus: "pending",
        totalFare: null,

        orderStatus: "new",
        adminNotes: null,
        customerNotified: false,
        adminNotified: true
      });

      console.log("OneWay booking stored with ID:", docRef.id);
      alert("One Way booking submitted successfully!");
      oneWayForm.reset();


    } catch (err) {
      console.error("OneWay Booking Error:", err);
      alert("Booking failed. Please try again.");
    }
  });

  /* =================== ROUND TRIP ==================== */
  roundTripForm?.addEventListener("submit", async e => {
    e.preventDefault();
    clearErrors(roundTripForm);

    try {
      const name   = document.getElementById("roundName");
      const phone  = document.getElementById("roundPhone");
      const pickup = document.getElementById("roundPickup");
      const drop   = document.getElementById("roundDrop");
      const email  = document.getElementById("roundEmail");
      const dDate  = document.getElementById("roundDepartureDate");
      const dTime  = document.getElementById("roundDepartureTime");
      const rDate  = document.getElementById("roundReturnDate");
      const car    = getSelectedCar("roundCar");

      if (!name.value.trim()) return showError(name, "Name required");
      if (!isValidPhone(phone.value)) return showError(phone, "Valid mobile required");
      if (!pickup.value.trim()) return showError(pickup, "Pickup required");
      if (!drop.value.trim()) return showError(drop, "Drop required");
      if (!dDate.value) return showError(dDate, "Departure date required");
      if (!dTime.value) return showError(dTime, "Departure time required");
      if (!rDate.value) return showError(rDate, "Return date required");
      if (!car) return alert("Please select a vehicle");

      const vehicleType = car.dataset.vehicle;
      const tariff = TARIFF.roundtrip[vehicleType];
      if (!tariff) throw new Error("Invalid vehicle type");

      const docRef = await addDoc(collection(db, "roundtrip"), {
        bookingId: generateBookingId(),
        journeyType: "roundtrip",

        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),

        customerName: name.value.trim(),
        customerPhone: phone.value,
        customerEmail: email.value.trim() || null,

        pickupLocation: pickup.value.trim(),
        dropLocation: drop.value.trim(),

        departureDate: dDate.value,
        departureTime: dTime.value,
        returnDate: rDate.value,

        vehicleType,
        ratePerKm: tariff.rate,
        minimumKmPerDay: 250,
        driverBataPerDay: tariff.bata,

        fareStatus: "pending",
        totalFare: null,

        orderStatus: "new",
        adminNotes: null,
        customerNotified: false,
        adminNotified: true
      });
      
      console.log("RoundTrip booking stored with ID:", docRef.id);
      alert("Round Trip booking submitted successfully!");
      roundTripForm.reset();


    } catch (err) {
      console.error("RoundTrip Booking Error:", err);
      alert("Booking failed. Please try again.");
    }
  });

});
