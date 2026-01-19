/* =====================================================
   ARM TAXI – ADMIN ORDERS
   Secure | Mobile Safe | Production Ready
===================================================== */

import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* ---------------- AUTH ---------------- */
const auth = getAuth();

/* ---------------- DOM ---------------- */
const ordersBody = document.getElementById("ordersBody");
const logoutBtn = document.getElementById("logoutBtn");

/* ---------------- LOGOUT ---------------- */
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("arm_admin_email");
    window.location.href = "login.html";
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Logout failed. Try again.");
  }
});

/* ---------------- LOAD ORDERS ---------------- */
async function loadOrders() {
  ordersBody.innerHTML = "";

  try {
    const onewaySnap = await getDocs(collection(db, "onewaytrip"));
    const roundSnap = await getDocs(collection(db, "roundtrip"));

    const orders = [];

    onewaySnap.forEach(docSnap => {
      orders.push({ id: docSnap.id, ...docSnap.data() });
    });

    roundSnap.forEach(docSnap => {
      orders.push({ id: docSnap.id, ...docSnap.data() });
    });

    orders.sort((a, b) =>
      (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );

    orders.forEach(renderOrderRow);

  } catch (err) {
    console.error("Load Orders Error:", err);
    ordersBody.innerHTML =
      `<tr><td colspan="9">Failed to load orders</td></tr>`;
  }
}

/* ---------------- RENDER ROW ---------------- */
function renderOrderRow(order) {
  const tr = document.createElement("tr");

  const route = `${order.pickupLocation} → ${order.dropLocation}`;
  const date =
    order.journeyType === "oneway"
      ? order.travelDate
      : order.departureDate;

  tr.innerHTML = `
    <td>${order.bookingId}</td>
    <td>${order.journeyType}</td>
    <td>
      ${order.customerName}<br>
      <small>${order.customerPhone}</small>
    </td>
    <td>${route}</td>
    <td>${order.vehicleType}</td>
    <td>${date}</td>
    <td>${order.fareStatus}</td>
    <td>
      ${
        order.totalFare
          ? `₹${order.totalFare}`
          : `<input type="number" min="1" placeholder="Enter fare" id="fare-${order.id}" />`
      }
    </td>
    <td>
      ${
        order.fareStatus === "pending"
          ? `<button class="approve-btn"
              onclick="approveFare('${order.id}','${order.journeyType}')">
              Approve
            </button>`
          : "Approved"
      }
    </td>
  `;

  ordersBody.appendChild(tr);
  markAdminNotified(order);

}
async function markAdminNotified(order) {
  if (order.adminNotified === false) {
    const collectionName =
      order.journeyType === "oneway" ? "onewaytrip" : "roundtrip";

    await updateDoc(doc(db, collectionName, order.id), {
      adminNotified: true,
      lastUpdatedAt: serverTimestamp()
    });
  }
}

/* ---------------- APPROVE FARE ---------------- */
window.approveFare = async (docId, journeyType) => {
  const input = document.getElementById(`fare-${docId}`);
  if (!input || !input.value) {
    alert("Enter total fare");
    return;
  }

  const fare = Number(input.value);
  if (fare <= 0) {
    alert("Invalid fare amount");
    return;
  }

  const collectionName =
    journeyType === "oneway" ? "onewaytrip" : "roundtrip";

  try {
    const ref = doc(db, collectionName, docId);

    await updateDoc(ref, {
      totalFare: fare,
      fareStatus: "approved",
      fareApprovedBy: localStorage.getItem("arm_admin_email"),
      fareApprovedAt: serverTimestamp(),
      customerNotified: false, // CUSTOMER NOT YET INFORMED
      adminNotified: true,
      lastUpdatedAt: serverTimestamp(),
      orderStatus: "approved"
    });

    alert("Fare approved successfully");
    loadOrders();

  } catch (err) {
    console.error("Approve Fare Error:", err);
    alert("Failed to approve fare");
  }
};

/* ---------------- INIT ---------------- */
loadOrders();