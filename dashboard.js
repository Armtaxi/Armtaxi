import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* ---------------- ADMIN CONFIG ---------------- */
const ADMIN_EMAIL = "armdroptaxi73@gmail.com";

/* ---------------- DOM ---------------- */
const totalOrdersEl = document.getElementById("totalOrders");
const pendingOrdersEl = document.getElementById("pendingOrders");
const approvedOrdersEl = document.getElementById("approvedOrders");
const totalRevenueEl = document.getElementById("totalRevenue");
const recentOrdersBody = document.getElementById("recentOrdersBody");

/* ---------------- AUTH GUARD ---------------- */
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== ADMIN_EMAIL) {
    alert("Unauthorized access");
    window.location.href = "login.html";
    return;
  }

  localStorage.setItem("arm_admin_email", user.email);
  loadDashboard();
});

/* ---------------- LOAD DASHBOARD ---------------- */
async function loadDashboard() {
  try {
    recentOrdersBody.innerHTML = "";

    const onewaySnap = await getDocs(collection(db, "onewaytrip"));
    const roundSnap = await getDocs(collection(db, "roundtrip"));

    const orders = [];

    onewaySnap.forEach(d => orders.push(d.data()));
    roundSnap.forEach(d => orders.push(d.data()));

    /* ---- STATS ---- */
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.fareStatus === "pending").length;
    const approvedOrders = orders.filter(o => o.fareStatus === "approved").length;

    const totalRevenue = orders
      .filter(o => o.totalFare)
      .reduce((sum, o) => sum + Number(o.totalFare), 0);

    totalOrdersEl.textContent = totalOrders;
    pendingOrdersEl.textContent = pendingOrders;
    approvedOrdersEl.textContent = approvedOrders;
    totalRevenueEl.textContent = `₹${totalRevenue}`;

    /* ---- RECENT 5 ORDERS ---- */
    orders
      .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      .slice(0, 5)
      .forEach(renderRecentOrder);

  } catch (error) {
    console.error("Dashboard load error:", error);
    alert("Failed to load dashboard data");
  }
    const newOrders = orders.filter(
      o => o.adminNotified === false && o.orderStatus === "new"
    ).length;

    if (newOrders > 0) {
      alert(`🚕 ${newOrders} New Booking(s) Received`);
    }

}

/* ---------------- RENDER RECENT ORDER ---------------- */
function renderRecentOrder(order) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${order.bookingId || "-"}</td>
    <td>${order.journeyType || "-"}</td>
    <td>${order.customerName || "-"}</td>
    <td>${order.vehicleType || "-"}</td>
    <td>${order.fareStatus || "-"}</td>
  `;

  recentOrdersBody.appendChild(tr);
}

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