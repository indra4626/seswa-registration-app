// Menu toggle (safe selectors + hover zone support)
const logoBtn = document.getElementById("logoBtn");
const slideMenu = document.getElementById("slideMenu") || document.querySelector('.slide-menu');
const menuOverlay = document.getElementById("menuOverlay") || document.querySelector('.menu-overlay');
const closeMenuBtn = document.getElementById("closeMenuBtn") || document.querySelector('.menu-close');
const hoverZone = document.querySelector('.menu-hover-zone');

function openMenu() {
  if (slideMenu) slideMenu.classList.add('open');
  if (menuOverlay) menuOverlay.classList.add('open');
  if (logoBtn) logoBtn.classList.add('hidden');
}

function closeMenu() {
  if (slideMenu) slideMenu.classList.remove('open');
  if (menuOverlay) menuOverlay.classList.remove('open');
  if (logoBtn) logoBtn.classList.remove('hidden');
}

function toggleMenu() {
  if (!slideMenu) return;
  slideMenu.classList.toggle('open');
  if (menuOverlay) menuOverlay.classList.toggle('open');
  if (logoBtn) logoBtn.classList.toggle('hidden');
}

// Attach event listeners only when elements exist
if (logoBtn) logoBtn.addEventListener('click', toggleMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

// Hover zone: open menu when pointer moves near left side, close when leaves
if (hoverZone && slideMenu) {
  let openTimer = null;
  hoverZone.addEventListener('mouseenter', () => {
    clearTimeout(openTimer);
    openTimer = setTimeout(openMenu, 120);
  });
  hoverZone.addEventListener('mouseleave', () => {
    clearTimeout(openTimer);
    openTimer = setTimeout(() => {
      // only close if menu isn't explicitly opened by click
      if (slideMenu && !slideMenu.classList.contains('open')) return;
      closeMenu();
    }, 220);
  });
}

// Password visibility toggle
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
});

// Form validation and submission
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formMessage = document.getElementById("formMessage");
const rememberMe = document.getElementById("rememberMe");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email
emailInput.addEventListener("blur", () => {
  if (!emailInput.value) {
    emailError.textContent = "Email is required";
  } else if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = "Please enter a valid email";
  } else {
    emailError.textContent = "";
  }
});

// Validate password
passwordInput.addEventListener("blur", () => {
  if (!passwordInput.value) {
    passwordError.textContent = "Password is required";
  } else if (passwordInput.value.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters";
  } else {
    passwordError.textContent = "";
  }
});

// Clear error on input
emailInput.addEventListener("input", () => {
  if (emailError.textContent) emailError.textContent = "";
});

passwordInput.addEventListener("input", () => {
  if (passwordError.textContent) passwordError.textContent = "";
});

// Form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Final validation
  let isValid = true;
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {
    emailError.textContent = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email";
    isValid = false;
  }

  if (!password) {
    passwordError.textContent = "Password is required";
    isValid = false;
  } else if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters";
    isValid = false;
  }

  if (!isValid) return;

  // Save credentials if remember me is checked
  if (rememberMe.checked) {
    localStorage.setItem("repEmail", email);
  } else {
    localStorage.removeItem("repEmail");
  }

  // Simulate login
  const btn = loginForm.querySelector(".btn-login");
  btn.disabled = true;
  btn.textContent = "Signing in...";
  formMessage.textContent = "";

  // Simulate API call (replace with real authentication)
  setTimeout(() => {
    formMessage.className = "form-message success";
    formMessage.textContent = "✓ Login successful! Redirecting...";

    // Store authentication status
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentRep", JSON.stringify({
      email: email,
      name: email.split("@")[0],
      role: "Representative",
      loginTime: new Date().toISOString()
    }));
    
    setTimeout(() => {
      // Redirect to scanner dashboard
      window.location.href = "scan-access.html";
    }, 1500);
  }, 800);
});

// Contact Administrator modal
const contactAdminLink = document.getElementById('contactAdminLink');
const contactModalOverlay = document.getElementById('contactModalOverlay');
const contactModalClose = document.getElementById('contactModalClose');

if (contactAdminLink && contactModalOverlay) {
  contactAdminLink.addEventListener('click', (e) => {
    e.preventDefault();
    contactModalOverlay.classList.add('active');
  });

  contactModalClose.addEventListener('click', () => {
    contactModalOverlay.classList.remove('active');
  });

  contactModalOverlay.addEventListener('click', (e) => {
    if (e.target === contactModalOverlay) {
      contactModalOverlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModalOverlay.classList.contains('active')) {
      contactModalOverlay.classList.remove('active');
    }
  });
}

// Load saved email if remember me was checked
window.addEventListener("load", () => {
  const savedEmail = localStorage.getItem("repEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMe.checked = true;
  }
});
