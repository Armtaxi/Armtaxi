🚖 ARM Taxi – One Way & Round Trip Booking System

ARM Taxi is a full-stack web application for managing one-way and round-trip taxi bookings with an admin approval workflow.

---

🔥 Features

👤 Customer Side

- One Way & Round Trip booking forms
- Mobile-first responsive UI
- Vehicle selection with dynamic pricing
- Booking stored securely in Firestore
- Clean UX with validation

---

🛠 Admin Panel

- Secure Admin Login (Email & Google)
- Admin-only access (restricted by email)
- Dashboard with:
   - Total orders
   - Pending orders
   - Approved orders
   - Total revenue
- Orders page:
   - View all bookings
   - Approve fares
   - Real-time Firestore updates

---

🧱 Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Firebase Firestore
- Auth: Firebase Authentication (Email & Google)
- Hosting: Firebase Hosting / Vercel (recommended)

---

📁 Project Structure

/assets
/css
  ├─ style.css
  ├─ login.css
  ├─ admin.css
  ├─ dashboard.css
/js
  ├─ firebase.js
  ├─ form.js
  ├─ auth.js
  ├─ orders.js
  ├─ dashboard.js
index.html
login.html
dashboard.html
orders.html

---

🔐 Admin Access

Only the following email is allowed as admin:

armdroptaxi73@gmail.com

Unauthorized users are automatically redirected to the login page.

---

📌 Booking Flow

1. Customer submits booking
2. Data stored in Firestore ("onewaytrip" / "roundtrip")
3. Admin reviews booking
4. Admin approves fare
5. Order status updated
6. Revenue reflected in dashboard

---

🚀 Completed Enhancements

- PDF invoice generation
- Admin notifications for new bookings
- Customer notifications after fare approval
- Firestore security rules
- Final deployment checklist

---

✅ Status

🟢 Backend stable
🟢 Admin panel functional
🟡 Security rules pending
🟡 Notifications pending

---

👨‍💻 Maintained By

ARM Taxi Development Team
Production-ready architecture

---

🔥 Built to scale, not just to work.
