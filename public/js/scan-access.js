// copied from js/scanner.js and renamed to match scan-access page
// REPRESENTATIVE/ADMIN ONLY - Requires login

// Require representative login
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "rep-login.html";
}

// Show logged-in rep name and setup buttons
window.addEventListener('load', () => {
  const currentRep = JSON.parse(localStorage.getItem("currentRep")) || {};
  const logoutLink = document.getElementById('logoutLink');
  
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Setup section navigation
  setupSectionNavigation();
  
  // Setup dietary preference modal
  const modalClose = document.getElementById('modalClose');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      document.getElementById('dietaryModal').classList.add('hidden');
    });
  }
  
  // Setup preference buttons
  const preferenceButtons = document.querySelectorAll('.preference-btn');
  preferenceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const preference = e.currentTarget.getAttribute('data-preference');
      confirmMealWithPreference(preference);
    });
  });
  
  // Close modal when clicking outside
  const modal = document.getElementById('dietaryModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
  
  // Setup search for attendee meals
  const attendeeSearch = document.getElementById('attendeeSearch');
  if (attendeeSearch) {
    attendeeSearch.addEventListener('input', (e) => {
      filterAttendeeTable(e.target.value);
    });
  }
  
  // Load dashboard data
  loadDashboardData();

  // Setup scanner and meal buttons
  const start = document.getElementById('startScan');
  const stop = document.getElementById('stopScan');
  const file = document.getElementById('fileInput');
  const manualBtn = document.getElementById('manualBtn');
  const serveLunch = document.getElementById('serveLunch');
  const serveDinner = document.getElementById('serveDinner');

  if (start) start.addEventListener('click', startScanner);
  if (stop) stop.addEventListener('click', stopScanner);
  if (file) file.addEventListener('change', (e) => handleFileInput(e.target.files[0]));
  if (manualBtn) manualBtn.addEventListener('click', useManualInput);
  if (serveLunch) serveLunch.addEventListener('click', () => serveMeal('lunch'));
  if (serveDinner) serveDinner.addEventListener('click', () => serveMeal('dinner'));
});

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentRep');
    window.location.href = 'rep-login.html';
  }
}

let scannedId = null;

const participants = JSON.parse(localStorage.getItem("participants")) || [];

function save() {
  localStorage.setItem("participants", JSON.stringify(participants));
}

function isLunchTime() {
  const h = new Date().getHours();
  return h >= 12 && h < 15;
}

function isDinnerTime() {
  const h = new Date().getHours();
  return h >= 18 && h < 20;
}

// CALL THIS after QR scan success
// Accept either a plain ID string or a JSON payload encoded in QR.
function onQrScanned(payload) {
  try {
    // try parse JSON payload first
    const parsed = JSON.parse(payload);
    if (parsed && parsed.token) {
      // Register the participant from QR data if not already in the list
      let existing = participants.find(x => x.id === parsed.token || x.token === parsed.token);
      if (!existing) {
        participants.push({
          id: parsed.token,
          token: parsed.token,
          name: parsed.name || 'Unknown',
          college: parsed.college || '',
          academicYear: parsed.academicYear || '',
          foodItem: parsed.foodItem || '',
          whatsapp: parsed.whatsapp || '',
          breakfast: false,
          lunch: false,
          dinner: false,
          accommodation: false,
          logs: []
        });
        save();
      }
      scannedId = parsed.token;
    } else if (parsed && parsed.id) {
      scannedId = parsed.id;
    } else {
      scannedId = payload; // fallback
    }
  } catch (e) {
    scannedId = payload;
  }

  scannedId = String(scannedId || '').trim();
  // update UI if present
  const last = document.getElementById('lastScanned');
  if (last) last.textContent = scannedId;
  const status = document.getElementById('scanStatus');
  if (status) status.textContent = `Detected: ${scannedId}`;
  alert(`QR detected: ${scannedId}`);
}

function serveMeal(meal) {
  if (!scannedId) {
    alert("Scan QR first");
    return;
  }

  const p = participants.find(x => x.id === scannedId || x.token === scannedId);
  if (!p) {
    alert("Invalid participant");
    return;
  }

  if (meal === "lunch" && !isLunchTime()) {
    alert("Lunch allowed only 12–3 PM");
    return;
  }

  if (meal === "dinner" && !isDinnerTime()) {
    alert("Dinner allowed only 6–8 PM");
    return;
  }

  if (p[meal]) {
    alert(`${meal.toUpperCase()} already served`);
    return;
  }

  // Show dietary preference modal instead of immediately serving
  showDietaryModal(meal, p);
}

function showDietaryModal(meal, participant) {
  const modal = document.getElementById('dietaryModal');
  const modalTitle = document.getElementById('modalTitle');
  const mealInfo = document.getElementById('mealInfo');
  
  modalTitle.textContent = `${meal.toUpperCase()} - Select Preference`;
  mealInfo.textContent = `${participant.name} - Choose veg or non-veg`;
  
  // Store current meal and participant for preference selection
  window.currentMeal = meal;
  window.currentParticipant = participant;
  
  modal.classList.remove('hidden');
}

function confirmMealWithPreference(preference) {
  const meal = window.currentMeal;
  const p = window.currentParticipant;
  const modal = document.getElementById('dietaryModal');
  
  if (!meal || !p) {
    alert("Error: Meal or participant data missing");
    return;
  }

  // Mark meal as served
  p[meal] = true;
  
  // Add to meal logs
  const now = new Date();
  const mealLog = {
    id: p.id,
    name: p.name,
    meal: meal,
    preference: preference,
    timestamp: now.toISOString()
  };
  
  const mealLogs = JSON.parse(localStorage.getItem('mealLogs')) || [];
  mealLogs.push(mealLog);
  localStorage.setItem('mealLogs', JSON.stringify(mealLogs));
  
  // Update participant logs
  p.logs.push({
    action: meal,
    preference: preference,
    time: now.toLocaleTimeString(),
    ts: now.toISOString()
  });

  save();
  
  // Close modal
  modal.classList.add('hidden');
  
  // Show success message
  alert(`${meal.toUpperCase()} (${preference.toUpperCase()}) served to ${p.name} successfully! ✅`);
  
  // Reset
  scannedId = null;
  document.getElementById('lastScanned').textContent = '—';
  const status = document.getElementById('scanStatus');
  if (status) status.textContent = 'Ready to scan';
}

// --- Camera scanning logic ---
let _stream = null;
let _detector = null;
let _scanning = false;

async function startScanner() {
  if (_scanning) return;
  const status = document.getElementById('scanStatus');
  try {
    _stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    const video = document.getElementById('video');
    video.srcObject = _stream;
    await video.play();

    if ('BarcodeDetector' in window) {
      try {
        _detector = new BarcodeDetector({ formats: ['qr_code'] });
      } catch (e) {
        _detector = null;
      }
    }

    _scanning = true;
    document.getElementById('startScan').disabled = true;
    document.getElementById('stopScan').disabled = false;
    if (status) status.textContent = 'Scanning...';
    scanLoop();
  } catch (err) {
    if (status) status.textContent = 'Camera error or permission denied';
    alert('Cannot access camera: ' + err.message);
  }
}

function stopScanner() {
  _scanning = false;
  document.getElementById('startScan').disabled = false;
  document.getElementById('stopScan').disabled = true;
  const video = document.getElementById('video');
  if (video) {
    video.pause();
    video.srcObject = null;
  }
  if (_stream) {
    _stream.getTracks().forEach(t => t.stop());
    _stream = null;
  }
  const status = document.getElementById('scanStatus');
  if (status) status.textContent = 'Stopped';
}

async function scanLoop() {
  if (!_scanning) return;
  const video = document.getElementById('video');
  const status = document.getElementById('scanStatus');
  if (!video || video.readyState < 2) {
    requestAnimationFrame(scanLoop);
    return;
  }

  try {
    if (_detector) {
      const results = await _detector.detect(video);
      if (results && results.length) {
        onQrScanned(results[0].rawValue);
      }
    } else {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (window.BarcodeDetector) {
        const results = await new BarcodeDetector({ formats: ['qr_code'] }).detect(canvas);
        if (results && results.length) onQrScanned(results[0].rawValue);
      } else if (typeof jsQR === 'function') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code && code.data) onQrScanned(code.data);
      }
    }
  } catch (e) {
    console.debug('scan error', e);
  }

  requestAnimationFrame(scanLoop);
}

function handleFileInput(file) {
  const status = document.getElementById('scanStatus');
  if (!file) return;
  const img = new Image();
  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
    img.onload = async () => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      if ('BarcodeDetector' in window) {
        try {
          const det = new BarcodeDetector({ formats: ['qr_code'] });
          const results = await det.detect(canvas);
          if (results && results.length) {
            onQrScanned(results[0].rawValue);
            return;
          }
        } catch (e) {
          console.debug('file detection failed', e);
        }
      }
      // jsQR fallback for browsers without BarcodeDetector (e.g. Firefox)
      if (typeof jsQR === 'function') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code && code.data) {
          onQrScanned(code.data);
          return;
        }
      }
      if (status) status.textContent = 'No QR found in image';
    };
  };
  reader.readAsDataURL(file);
}

function useManualInput() {
  const val = document.getElementById('manualInput').value.trim();
  if (!val) return alert('Enter token or ID');
  onQrScanned(val);
}

// ===== SECTION NAVIGATION =====
function setupSectionNavigation() {
  const sectionLinks = document.querySelectorAll('[data-section]');
  
  sectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionName = link.getAttribute('data-section');
      showSection(sectionName);
      
      // Update active states
      document.querySelectorAll('[data-section]').forEach(el => {
        el.classList.remove('active');
      });
      link.classList.add('active');
    });
  });
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show the selected section
  const section = document.getElementById(`${sectionName}-section`);
  if (section) {
    section.classList.add('active');
    
    // Load data based on section
    if (sectionName === 'dashboard') {
      loadDashboardData();
      // Clear any existing refresh interval
      if (window.mealsRefreshInterval) {
        clearInterval(window.mealsRefreshInterval);
        window.mealsRefreshInterval = null;
      }
    } else if (sectionName === 'all-meals') {
      initializeMealsCharts();
      loadMealsData();
      // Refresh data every 5 seconds for real-time updates
      if (!window.mealsRefreshInterval) {
        window.mealsRefreshInterval = setInterval(() => {
          loadMealsData();
        }, 5000);
      }
    } else if (sectionName === 'attendee-meals') {
      loadAttendeeData();
      // Clear any existing refresh interval
      if (window.mealsRefreshInterval) {
        clearInterval(window.mealsRefreshInterval);
        window.mealsRefreshInterval = null;
      }
    } else {
      // Clear refresh interval for scanner or other sections
      if (window.mealsRefreshInterval) {
        clearInterval(window.mealsRefreshInterval);
        window.mealsRefreshInterval = null;
      }
    }
  }
}

// ===== DASHBOARD FUNCTIONS =====
function loadDashboardData() {
  const participants = JSON.parse(localStorage.getItem('participants')) || [];
  const mealLogs = JSON.parse(localStorage.getItem('mealLogs')) || [];
  
  // Calculate stats
  const totalParticipants = participants.length;
  const lunchServed = mealLogs.filter(log => log.meal === 'lunch').length;
  const dinnerServed = mealLogs.filter(log => log.meal === 'dinner').length;
  const accommodationNeeded = participants.filter(p => p.accommodation).length;
  const remainingMeals = (totalParticipants * 2) - (lunchServed + dinnerServed);
  
  // Update stat cards
  document.getElementById('totalParticipants').textContent = totalParticipants;
  document.getElementById('lunchCount').textContent = lunchServed;
  document.getElementById('dinnerCount').textContent = dinnerServed;
  document.getElementById('accommodationCount').textContent = accommodationNeeded;
  document.getElementById('remainingMeals').textContent = remainingMeals;
  
  // Update recent activity
  updateRecentActivity(mealLogs);
  
  // Update pending list
  updatePendingList(participants, mealLogs);
}

function updateRecentActivity(mealLogs) {
  const activityList = document.getElementById('recentActivity');
  activityList.innerHTML = '';
  
  // Show last 20 logs
  const recentLogs = mealLogs.slice(-20).reverse();
  
  if (recentLogs.length === 0) {
    activityList.innerHTML = '<li style="color: #999;">No meal distributions yet</li>';
    return;
  }
  
  recentLogs.forEach(log => {
    const li = document.createElement('li');
    const date = new Date(log.timestamp).toLocaleString();
    li.innerHTML = `<strong>${log.name || log.id}</strong> — ${log.meal.toUpperCase()} <span class="muted">${date}</span>`;
    activityList.appendChild(li);
  });
}

function updatePendingList(participants, mealLogs) {
  const pendingList = document.getElementById('pendingList');
  pendingList.innerHTML = '';
  
  const mealServed = {};
  mealLogs.forEach(log => {
    if (!mealServed[log.id]) {
      mealServed[log.id] = [];
    }
    mealServed[log.id].push(log.meal);
  });
  
  const pending = participants.filter(p => {
    const served = mealServed[p.id] || [];
    return served.length < 2; // Should have lunch and dinner
  });
  
  if (pending.length === 0) {
    pendingList.innerHTML = '<li style="color: #999;">All participants served!</li>';
    return;
  }
  
  pending.forEach(p => {
    const li = document.createElement('li');
    const served = mealServed[p.id] || [];
    const missing = ['lunch', 'dinner'].filter(m => !served.includes(m)).map(m => m.toUpperCase()).join(', ');
    li.innerHTML = `<strong>${p.name}</strong> — Missing: ${missing}`;
    pendingList.appendChild(li);
  });
}

// ===== ALL MEALS FUNCTIONS =====
let chartsInstance = {
  meals: null,
  diet: null,
  remaining: null
};

function initializeMealsCharts() {
  if (chartsInstance.meals) return; // Already initialized

  const primaryColor = '#3366ff';
  const accentColor = '#6c63ff';
  const successColor = '#10b981';
  const warningColor = '#f59e0b';

  // Meals Distribution Chart
  const mealsCtx = document.getElementById('mealsChart');
  if (mealsCtx) {
    chartsInstance.meals = new Chart(mealsCtx, {
      type: 'bar',
      data: {
        labels: ['Lunch', 'Dinner'],
        datasets: [{
          label: 'Meals Served',
          data: [0, 0],
          backgroundColor: [successColor, warningColor],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    });
  }

  // Diet Preference Chart
  const dietCtx = document.getElementById('dietChart');
  if (dietCtx) {
    chartsInstance.diet = new Chart(dietCtx, {
      type: 'doughnut',
      data: {
        labels: ['Veg', 'Non-Veg'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#10b981', '#f59e0b'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: 'bottom' }
        }
      }
    });
  }

  // Remaining Meals Chart
  const remainingCtx = document.getElementById('remainingChart');
  if (remainingCtx) {
    chartsInstance.remaining = new Chart(remainingCtx, {
      type: 'bar',
      data: {
        labels: ['Remaining Lunch', 'Remaining Dinner'],
        datasets: [{
          label: 'Meals Remaining',
          data: [0, 0],
          backgroundColor: ['#3366ff', '#6c63ff'],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

function loadMealsData() {
  const participants = JSON.parse(localStorage.getItem('participants')) || [];
  const mealLogs = JSON.parse(localStorage.getItem('mealLogs')) || [];

  const totalParticipants = participants.length;
  const lunchServed = mealLogs.filter(log => log.meal === 'lunch').length;
  const dinnerServed = mealLogs.filter(log => log.meal === 'dinner').length;
  const vegCount = mealLogs.filter(log => log.preference === 'veg').length;
  const nonVegCount = mealLogs.filter(log => log.preference === 'non-veg').length;

  const remainingLunch = totalParticipants - lunchServed;
  const remainingDinner = totalParticipants - dinnerServed;

  // Update stat cards
  document.getElementById('lunchServedCount').textContent = lunchServed;
  document.getElementById('dinnerServedCount').textContent = dinnerServed;
  document.getElementById('remainingLunch').textContent = remainingLunch;
  document.getElementById('remainingDinner').textContent = remainingDinner;

  // Update charts data
  updateMealsCharts(lunchServed, dinnerServed, vegCount, nonVegCount, remainingLunch, remainingDinner);

  // Update meals log table
  updateMealsLogTable(mealLogs);
}

function updateMealsCharts(lunchServed = 0, dinnerServed = 0, vegCount = 0, nonVegCount = 0, remLunch = 0, remDinner = 0) {
  if (chartsInstance.meals) {
    chartsInstance.meals.data.datasets[0].data = [lunchServed, dinnerServed];
    chartsInstance.meals.update('none');
  }

  if (chartsInstance.diet) {
    chartsInstance.diet.data.datasets[0].data = [vegCount, nonVegCount];
    chartsInstance.diet.update('none');
  }

  if (chartsInstance.remaining) {
    chartsInstance.remaining.data.datasets[0].data = [remLunch, remDinner];
    chartsInstance.remaining.update('none');
  }
}

function updateMealsLogTable(mealLogs) {
  const tbody = document.getElementById('mealsLogBody');
  tbody.innerHTML = '';

  if (mealLogs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No meals served yet</td></tr>';
    return;
  }

  // Show latest logs first
  const recentLogs = mealLogs.slice(-10).reverse();
  
  recentLogs.forEach(log => {
    const row = document.createElement('tr');
    const date = new Date(log.timestamp).toLocaleTimeString();
    row.innerHTML = `
      <td><strong>${log.name || 'N/A'}</strong></td>
      <td>${log.meal.toUpperCase()}</td>
      <td><span class="meal-badge ${log.preference === 'veg' ? 'veg' : 'non-veg'}">${(log.preference || 'N/A').toUpperCase()}</span></td>
      <td>${date}</td>
    `;
    tbody.appendChild(row);
  });
}

function loadAttendeeData() {
  const participants = JSON.parse(localStorage.getItem('participants')) || [];
  const mealLogs = JSON.parse(localStorage.getItem('mealLogs')) || [];

  const tbody = document.getElementById('attendeeTableBody');
  tbody.innerHTML = '';

  if (participants.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No participants</td></tr>';
    return;
  }

  const mealsServed = {};
  mealLogs.forEach(log => {
    if (!mealsServed[log.id]) {
      mealsServed[log.id] = { lunch: false, dinner: false, preference: log.preference || 'N/A' };
    }
    mealsServed[log.id][log.meal] = true;
  });

  participants.forEach(p => {
    const served = mealsServed[p.id] || { lunch: false, dinner: false, preference: 'N/A' };
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${p.name}</strong></td>
      <td>${p.id}</td>
      <td><span class="meal-badge ${served.lunch ? 'served' : 'not-served'}">${served.lunch ? '✓ Served' : '✗ Pending'}</span></td>
      <td><span class="meal-badge ${served.dinner ? 'served' : 'not-served'}">${served.dinner ? '✓ Served' : '✗ Pending'}</span></td>
      <td>${served.preference.toUpperCase()}</td>
    `;
    tbody.appendChild(row);
  });
}

function filterAttendeeTable(searchTerm) {
  const rows = document.querySelectorAll('#attendeeTableBody tr');
  const term = searchTerm.toLowerCase();

  rows.forEach(row => {
    const nameCell = row.querySelector('td:nth-child(1)');
    const idCell = row.querySelector('td:nth-child(2)');
    if (!nameCell || !idCell) return; // skip placeholder/colspan rows
    const name = nameCell.textContent.toLowerCase();
    const id = idCell.textContent.toLowerCase();
    
    if (name.includes(term) || id.includes(term)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}


