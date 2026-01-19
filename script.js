/* =====================================================
   ARM TAXI – FRONTEND UI SCRIPT (UI ONLY)
   NO FIRESTORE | NO AUTH | NO REDIRECTS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PDF LIBRARY INITIALIZATION
  ========================= */
  let jsPDF;
  // Load jsPDF dynamically
  if (typeof window.jspdf !== 'undefined') {
    jsPDF = window.jspdf.jsPDF;
  }

  /* =========================
     GLOBAL VARIABLES
  ========================= */
  let currentFormData = null;
  const confirmationSection = document.getElementById('confirmation');

  /* =========================
     NAVBAR + HAMBURGER MENU
  ========================= */
  // ... rest of your existing code continues ...
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (mobileMenuBtn && navLinks) {
    const navItems = navLinks.querySelectorAll("a");

    const closeMenu = () => {
      navLinks.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      mobileMenuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
      body.style.overflow = "";
    };

    mobileMenuBtn.addEventListener("click", e => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
      mobileMenuBtn.innerHTML = isOpen
        ? `<i class="fas fa-times"></i>`
        : `<i class="fas fa-bars"></i>`;
      body.style.overflow = isOpen ? "hidden" : "";
    });

    navItems.forEach(link =>
      link.addEventListener("click", closeMenu)
    );

    document.addEventListener("click", e => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* =========================
     TAB SWITCH (ONE WAY / ROUND)
  ========================= */
  const tabButtons = document.querySelectorAll(".tab-btn");
  let activeTab = "one-way";

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      if (tabId === activeTab) return;

      const currentForm = document.getElementById(`${activeTab}-form`);
      const nextForm = document.getElementById(`${tabId}-form`);

      if (!currentForm || !nextForm) return;

      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentForm.classList.remove("active");
      nextForm.classList.add("active");

      activeTab = tabId;
    });
  });

/* =========================
   DATE LIMITS
========================= */
const today = new Date().toISOString().split("T")[0];

["onewayDate", "roundDepartureDate", "roundReturnDate"].forEach(id => {
  const input = document.getElementById(id);
  if (input) input.min = today;
});

/* =========================
   FORM SUBMISSION HANDLERS
========================= */
const oneWayForm = document.getElementById('oneWayForm');
const roundTripForm = document.getElementById('roundTripForm');

if (oneWayForm) {
  oneWayForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmission('one-way');
  });
}

if (roundTripForm) {
  roundTripForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmission('round-trip');
  });
}

function handleFormSubmission(formType) {
  // Get form data based on form type
  if (formType === 'one-way') {
    currentFormData = {
      name: document.getElementById('onewayName').value,
      phone: document.getElementById('onewayPhone').value,
      altPhone: document.getElementById('onewayAltPhone').value,
      email: document.getElementById('onewayEmail').value,
      pickup: document.getElementById('onewayPickup').value,
      drop: document.getElementById('onewayDrop').value,
      date: document.getElementById('onewayDate').value,
      time: document.getElementById('onewayTime').value,
      carType: document.querySelector('input[name="onewayCar"]:checked')?.dataset.vehicle || 'Not Selected',
      journeyType: 'One Way',
      rate: document.querySelector('input[name="onewayCar"]:checked')?.dataset.rate || 'N/A'
    };
  } else {
    currentFormData = {
      name: document.getElementById('roundName').value,
      phone: document.getElementById('roundPhone').value,
      altPhone: '', // Round trip doesn't have alternate phone
      email: document.getElementById('roundEmail').value,
      pickup: document.getElementById('roundPickup').value,
      drop: document.getElementById('roundDrop').value,
      date: document.getElementById('roundDepartureDate').value,
      time: document.getElementById('roundDepartureTime').value,
      returnDate: document.getElementById('roundReturnDate').value,
      carType: document.querySelector('input[name="roundCar"]:checked')?.dataset.vehicle || 'Not Selected',
      journeyType: 'Round Trip',
      rate: document.querySelector('input[name="roundCar"]:checked')?.dataset.rate || 'N/A'
    };
  }

  // Show confirmation section
  showConfirmation(currentFormData);
  
  // Scroll to confirmation
  document.getElementById('confirmation').scrollIntoView({ behavior: 'smooth' });
}

/* =========================
   SHOW CONFIRMATION
========================= */
function showConfirmation(formData) {
  if (!confirmationSection) return;
  
  // Format date
  const formattedDate = formatDate(formData.date);
  const formattedTime = formatTime(formData.time);
  
  // Create summary HTML
  let summaryHTML = `
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Phone:</strong> ${formData.phone}</p>
    ${formData.altPhone ? `<p><strong>Alternate Phone:</strong> ${formData.altPhone}</p>` : ''}
    ${formData.email ? `<p><strong>Email:</strong> ${formData.email}</p>` : ''}
    <p><strong>Pickup Location:</strong> ${formData.pickup}</p>
    <p><strong>Drop Location:</strong> ${formData.drop}</p>
    <p><strong>Vehicle Type:</strong> ${formData.carType}</p>
    <p><strong>Journey Type:</strong> ${formData.journeyType}</p>
    <p><strong>Travel Date & Time:</strong> ${formattedDate} ${formattedTime}</p>
  `;
  
  if (formData.journeyType === 'Round Trip' && formData.returnDate) {
    const formattedReturnDate = formatDate(formData.returnDate);
    summaryHTML += `<p><strong>Return Date:</strong> ${formattedReturnDate}</p>`;
  }
  
  summaryHTML += `
    <p><strong>Rate per KM:</strong> ₹${formData.rate}/KM</p>
    <p><strong>Total Trip Fare:</strong> <em>Admin will inform you</em></p>
    <p><strong>Extra Charges:</strong> Toll charges extra (Approximately ₹350)</p>
  `;
  
  // Update summary content
  document.getElementById('summaryContent').innerHTML = summaryHTML;
  
  // Show confirmation section
  confirmationSection.style.display = 'block';
  
  // Setup download button
  setupDownloadButton(formData);
  
  // Setup new booking button
  const newBookingBtn = document.getElementById('newBookingBtn');
  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', function() {
      confirmationSection.style.display = 'none';
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* =========================
   DATE/TIME FORMATTING
========================= */
function formatDate(dateString) {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

/* =========================
   PDF GENERATION
========================= */
function setupDownloadButton(formData) {
  const downloadBtn = document.getElementById('downloadPdfBtn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', function() {
    generatePDF(formData);
  });
}

function generatePDF(formData) {
  // Check if jsPDF is available
  if (typeof jsPDF === 'undefined') {
    alert('PDF library not loaded. Please try again.');
    return;
  }

  try {
    const doc = new jsPDF();
    
    // Format date and time
    const formattedDate = formatDate(formData.date);
    const formattedTime = formatTime(formData.time);
    
    // Add content to PDF (EXACTLY as per client requirement)
    let yPos = 20;
    const lineHeight = 8;
    const leftMargin = 20;
    
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Thanks for Choosing *ARM DROPTAXI*", leftMargin, yPos);
    yPos += lineHeight * 2;
    
    // Booking Details header
    doc.setFontSize(14);
    doc.text("Booking Details", leftMargin, yPos);
    yPos += lineHeight * 1.5;
    
    // Booking information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${formData.name}`, leftMargin, yPos);
    yPos += lineHeight;
    
    if (formData.email) {
      doc.text(`Email ID: ${formData.email}`, leftMargin, yPos);
      yPos += lineHeight;
    }
    
    doc.text(`Phone: ${formData.phone}`, leftMargin, yPos);
    yPos += lineHeight;
    
    if (formData.altPhone) {
      doc.text(`Another number: ${formData.altPhone}`, leftMargin, yPos);
      yPos += lineHeight;
    }
    
    yPos += lineHeight; // Add space
    doc.text(`Pickup Location: ${formData.pickup}`, leftMargin, yPos);
    yPos += lineHeight;
    doc.text(`Drop Location: ${formData.drop}`, leftMargin, yPos);
    yPos += lineHeight;
    
    // Add Tamil Nadu example ONLY if locations are very short (less than 15 chars)
    // This is optional - you can remove this entire block if you don't want examples at all
    if (formData.pickup.length < 15 || formData.drop.length < 15) {
      yPos += 5; // Small space
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100); // Gray color for examples
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Reset to black
    }
    
    yPos += lineHeight;
    doc.text(`Vehicle Type: ${formData.carType}`, leftMargin, yPos);
    yPos += lineHeight;
    doc.text(`Journey Type: ${formData.journeyType}`, leftMargin, yPos);
    yPos += lineHeight;
    doc.text(`Travel Date & Time: ${formattedDate} ${formattedTime}`, leftMargin, yPos);
    yPos += lineHeight;
    
    // Return date for round trip
    if (formData.journeyType === 'Round Trip' && formData.returnDate) {
      const formattedReturnDate = formatDate(formData.returnDate);
      doc.text(`Return Date: ${formattedReturnDate}`, leftMargin, yPos);
      yPos += lineHeight;
    }
    
    yPos += lineHeight;
    doc.text(`Total Trip Fare: Admin will inform you`, leftMargin, yPos);
    yPos += lineHeight;
    doc.text(`Extra per KM: ₹${formData.rate}`, leftMargin, yPos); // FIXED: Added ₹ symbol
    yPos += lineHeight;
    doc.text(`Toll charges extra`, leftMargin, yPos);
    yPos += lineHeight;
    doc.text(`Approximately 350rs`, leftMargin, yPos);
    yPos += lineHeight * 2;
    
    // Contact information
    doc.text(`For Question Contact:`, leftMargin, yPos);
    yPos += lineHeight;
    doc.text(`Regards By RAJA`, leftMargin, yPos);
    yPos += lineHeight;
    doc.text(`98941 36801`, leftMargin, yPos);
    
    // Save PDF with customer name
    const fileName = `ARMTAXI_Booking_${formData.name.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Error generating PDF. Please try again.');
  }
}

/* =========================
   SCROLL ANIMATION (OPTIONAL)
========================= */
// ... your existing scroll animation code continues ...
  const animatedEls = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, { threshold: 0.2 });

  animatedEls.forEach(el => observer.observe(el));
  window.scrollToBooking = function() {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  };


});
