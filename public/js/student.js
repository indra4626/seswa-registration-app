// Menu toggle
const logoBtn = document.getElementById("logoBtn");
const slideMenu = document.getElementById("slideMenu");
const menuOverlay = document.getElementById("menuOverlay");
const closeMenuBtn = document.getElementById("closeMenuBtn");

function toggleMenu() {
  slideMenu.classList.toggle("open");
  menuOverlay.classList.toggle("open");
  if (logoBtn) logoBtn.classList.toggle("hidden");
}

if (logoBtn) logoBtn.addEventListener("click", toggleMenu);
closeMenuBtn.addEventListener("click", toggleMenu);
menuOverlay.addEventListener("click", toggleMenu);

// QR Generator
document.getElementById("generateBtn").addEventListener("click", generateQR);
document.getElementById("downloadBtn").addEventListener("click", downloadQR);

function generateQR() {
    const name = document.getElementById("name").value.trim();
    const college = document.getElementById("college").value.trim();
    const academicYear = document.getElementById("academicYear").value.trim();
    const foodItem = document.getElementById("foodItem").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();

    if (!name || !college || !academicYear || !foodItem || !whatsapp) {
        alert("Please fill all required fields: Name, College, Academic Year, Food Preference, and WhatsApp Number.");
        return;
    }

    if (!/^[0-9]{10}$/.test(whatsapp)) {
        alert("Please enter a valid 10-digit WhatsApp number.");
        return;
    }

    // Check if this student already has a QR code
    const generatedQRs = JSON.parse(localStorage.getItem("generatedQRs")) || {};
    const studentKey = `${name.toLowerCase()}|${college.toLowerCase()}`;

    if (generatedQRs[studentKey]) {
        const existing = generatedQRs[studentKey];
        alert(`QR code already generated for ${name} (${college}).\nToken: ${existing.token}\nShowing your existing QR code.`);
        // Show the existing QR
        showQRResult(existing);
        return;
    }

    // Build token prefix from name initials + college acronym
    function getNameInitials(n) {
        const parts = n.split(/\s+/).filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
        return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
    }

    function getCollegeAcronym(c) {
        return c.split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join('');
    }

    const initials = getNameInitials(name);
    const collegeAcr = getCollegeAcronym(college);

    // Generate random 8-digit suffix
    function random8() {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    }

    const token = `${initials}${collegeAcr}${random8()}`;

    // Prepare the data to encode in QR
    const qrPayload = {
        name,
        college,
        academicYear,
        foodItem,
        whatsapp,
        token
    };

    // Save to localStorage so same student can't generate again
    generatedQRs[studentKey] = qrPayload;
    localStorage.setItem("generatedQRs", JSON.stringify(generatedQRs));

    showQRResult(qrPayload);
}

function showQRResult(qrPayload) {
    const { name, college, academicYear, foodItem, whatsapp, token } = qrPayload;

    // Show QR section with token info
    document.getElementById("qrSection").classList.remove("hidden");
    
    // Format and display student info
    const detailsHTML = `
        <div><strong>👤 Name:</strong> <span>${name}</span></div>
        <div><strong>🏫 College:</strong> <span>${college}</span></div>
        ${academicYear ? `<div><strong>📅 Year:</strong> <span>${academicYear}</span></div>` : ''}
        ${foodItem ? `<div><strong>🍽️ Preference:</strong> <span>${foodItem}</span></div>` : ''}
        ${whatsapp ? `<div><strong>📱 WhatsApp:</strong> <span>${whatsapp}</span></div>` : ''}
    `;
    document.getElementById("studentInfo").innerHTML = detailsHTML;
    
    // Display token
    document.getElementById("tokenValue").textContent = token;

    // Clear old QR and generate new one
    const qrContainer = document.getElementById("qr");
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: JSON.stringify(qrPayload),
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff"
    });
    
    // Scroll to QR section
    setTimeout(() => {
        document.getElementById("qrSection").scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);

    // Auto-send WhatsApp message via backend API
    if (whatsapp) {
        sendWhatsAppMessage(qrPayload);
    }

    // Auto-download QR image
    setTimeout(() => {
        const canvas = document.querySelector("#qr canvas");
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = `SESWA-QR-${token}.png`;
            link.click();
        }
    }, 500);
}

// Send WhatsApp message via backend API (automatic, like OTP)
async function sendWhatsAppMessage(payload) {
    const statusEl = document.getElementById('whatsappStatus');
    const statusIcon = document.getElementById('whatsappStatusIcon');
    const statusText = document.getElementById('whatsappStatusText');

    // Show sending status
    if (statusEl) {
        statusEl.classList.remove('hidden');
        statusIcon.textContent = '⏳';
        statusText.textContent = 'Sending registration details to WhatsApp...';
        statusEl.className = 'whatsapp-status sending';
    }

    try {
        const response = await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: payload.whatsapp,
                name: payload.name,
                token: payload.token,
                college: payload.college,
                academicYear: payload.academicYear,
                foodItem: payload.foodItem
            })
        });

        const data = await response.json();

        if (data.success) {
            if (data.demo) {
                // Demo mode — server not configured with real credentials yet
                statusIcon.textContent = '⚙️';
                statusText.textContent = 'Demo mode — WhatsApp API not configured yet. Message logged on server.';
                statusEl.className = 'whatsapp-status demo';
            } else {
                // Real message sent!
                statusIcon.textContent = '✅';
                statusText.textContent = 'Registration details sent to your WhatsApp!';
                statusEl.className = 'whatsapp-status success';
            }
        } else {
            statusIcon.textContent = '⚠️';
            statusText.textContent = `WhatsApp send failed: ${data.error || 'Unknown error'}`;
            statusEl.className = 'whatsapp-status error';
        }
    } catch (err) {
        statusIcon.textContent = '⚠️';
        statusText.textContent = 'Could not reach server. Make sure the backend is running (node server/server.js).';
        statusEl.className = 'whatsapp-status error';
    }
}

function downloadQR() {
    let canvas = document.querySelector("#qr canvas");
    if (!canvas) {
        alert("Please generate a QR code first.");
        return;
    }
    let url = canvas.toDataURL("image/png");

    let link = document.createElement("a");
    link.href = url;
    link.download = "StudentQR.png";
    link.click();
}

// Copy token to clipboard
function copyToken() {
    const tokenValue = document.getElementById("tokenValue").textContent;
    navigator.clipboard.writeText(tokenValue).then(() => {
        const copyBtn = document.querySelector(".btn-copy");
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}