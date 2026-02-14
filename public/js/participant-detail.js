// Participant Detail View (After QR Scan - Rep/Admin Only)
// Shows meal status, accommodation info, and complete activity log for a specific participant

// ===== AUTHENTICATION =====
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "rep-login.html";
}

// Show logged-in rep info and setup menu
window.addEventListener('load', () => {
  const currentRep = JSON.parse(localStorage.getItem("currentRep")) || {};
  const authNotice = document.getElementById('authNotice');
  const repNameSpan = document.getElementById('currentRepName');
  const roleDisplay = document.getElementById('roleDisplay');
  
  if (authNotice) authNotice.style.display = 'block';
  if (repNameSpan && currentRep.name) {
    repNameSpan.textContent = `${currentRep.name} (${currentRep.role || 'Volunteer'}) logged in`;
  }
  if (roleDisplay && currentRep.role) {
    roleDisplay.textContent = `Role: ${currentRep.role.toUpperCase()}`;
  }
  
  setupMenuToggle();
  populateParticipantDetails();
});

// Menu toggle functionality
function setupMenuToggle() {
  const slideMenu = document.getElementById('slideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const navBrand = document.querySelector('.nav-brand');

  if (navBrand) {
    navBrand.addEventListener('click', () => {
      slideMenu.classList.toggle('open');
      menuOverlay.classList.toggle('open');
    });
  }
  if (menuOverlay) {
    menuOverlay.addEventListener('click', () => {
      slideMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
    });
  }
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      slideMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
    });
  }
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentRep');
    window.location.href = 'rep-login.html';
  }
}

// ===== PARTICIPANT DATA =====
// Get participant ID from URL param
const params = new URLSearchParams(window.location.search);
const participantId = params.get("id");

// Load participants from localStorage
const participants = JSON.parse(localStorage.getItem("participants")) || [];

// Find the participant
const participant = participants.find(p => p.id === participantId);

// If not found, show error
if (!participant) {
  document.addEventListener('DOMContentLoaded', () => {
    alert("Participant not found");
    window.location.href = "event-dashboard.html";
  });
  throw new Error("Invalid participant ID");
}

// ===== POPULATE DETAILS =====
function populateParticipantDetails() {
  if (!participant) return;

  // Populate basic info
  const nameEl = document.getElementById("name");
  if (nameEl) nameEl.textContent = participant.name || "—";

  const pidEl = document.getElementById("pid");
  if (pidEl) pidEl.textContent = participant.id || "—";

  const whatsappEl = document.getElementById("whatsapp");
  if (whatsappEl) whatsappEl.textContent = participant.whatsapp || "—";

  // Populate meal status with badges
  const breakfastEl = document.getElementById("breakfast");
  if (breakfastEl) {
    if (participant.breakfast) {
      breakfastEl.textContent = "✅ Served";
      breakfastEl.className = "status-indicator status-served";
    } else {
      breakfastEl.textContent = "❌ Not Served";
      breakfastEl.className = "status-indicator status-pending";
    }
  }

  const lunchEl = document.getElementById("lunch");
  if (lunchEl) {
    if (participant.lunch) {
      lunchEl.textContent = "✅ Served";
      lunchEl.className = "status-indicator status-served";
    } else {
      lunchEl.textContent = "❌ Not Served";
      lunchEl.className = "status-indicator status-pending";
    }
  }

  const dinnerEl = document.getElementById("dinner");
  if (dinnerEl) {
    if (participant.dinner) {
      dinnerEl.textContent = "✅ Served";
      dinnerEl.className = "status-indicator status-served";
    } else {
      dinnerEl.textContent = "❌ Not Served";
      dinnerEl.className = "status-indicator status-pending";
    }
  }

  // Populate accommodation status
  const accEl = document.getElementById("acc");
  if (accEl) {
    accEl.textContent = participant.accommodation ? "🏨 Yes, needed" : "❌ No";
  }

  // Populate activity logs with timestamps
  const logsEl = document.getElementById("logs");
  if (logsEl) {
    logsEl.innerHTML = "";
    if (participant.logs && participant.logs.length > 0) {
      // Sort logs by timestamp (most recent first)
      const sortedLogs = [...participant.logs].sort((a, b) => {
        return new Date(b.ts || 0) - new Date(a.ts || 0);
      });
      
      sortedLogs.forEach((log, idx) => {
        const li = document.createElement("li");
        const mealIcon = {
          'breakfast': '🥣',
          'lunch': '🍲',
          'dinner': '🍽️'
        }[log.action.toLowerCase()] || '🔔';
        
        const timeStr = log.ts ? new Date(log.ts).toLocaleString() : log.time || 'Unknown time';
        li.innerHTML = `<strong>${mealIcon} ${log.action.toUpperCase()}</strong> served at ${timeStr}`;
        li.style.animation = `slideIn ${0.2 + idx * 0.1}s ease`;
        logsEl.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No activity yet";
      li.style.color = "#999";
      logsEl.appendChild(li);
    }
  }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;
document.head.appendChild(style);
