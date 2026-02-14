document.addEventListener('DOMContentLoaded', () => {
  // Intro overlay - fade out after 3 seconds
  const introOverlay = document.getElementById('introOverlay');
  setTimeout(() => {
    introOverlay.classList.add('fade-out');
  }, 3000);

  // Set theme from storage
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', currentTheme);
  
  // Modal management
  const modal = document.getElementById('infoModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');
  
  function showModal(title, content) {
    modalBody.innerHTML = `<h2>${title}</h2><div>${content}</div>`;
    modal.classList.add('show');
    modalOverlay.classList.add('show');
  }
  
  function closeModal() {
    modal.classList.remove('show');
    modalOverlay.classList.remove('show');
  }
  
  // About button
  document.getElementById('aboutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showModal('About seswa.in', `
      <p style="font-size: 1.05rem; line-height: 1.7;"><strong>seswa.in</strong> is a next-generation digital registration and attendance platform built for events, institutions, and organizations that need fast, reliable check-in workflows.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">🎯 Our Mission</h3>
      <p>Eliminate paper-based attendance and long queues. We make registration seamless through QR code technology — from generation to scanning to real-time reporting.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">⚡ What We Offer</h3>
      <ul style="line-height: 2;">
        <li><strong>Instant QR Generation</strong> — Students create unique, secure QR codes in seconds</li>
        <li><strong>Live Scanning</strong> — Camera-based and file-based QR scanning with jsQR fallback</li>
        <li><strong>Meal Tracking</strong> — Breakfast, lunch, and dinner service with time-window enforcement</li>
        <li><strong>Real-Time Dashboard</strong> — Live stats, charts, and exportable attendance data</li>
        <li><strong>Role-Based Access</strong> — Secure representative login with activity logging</li>
      </ul>

      <h3 style="color: var(--accent); margin-top: 20px;">🔒 Security</h3>
      <p>Each QR token is cryptographically unique. One student = one QR code. Duplicate generation is automatically prevented.</p>

      <div style="margin-top: 20px; padding: 12px 16px; background: rgba(51,102,255,0.08); border-radius: 10px; font-size: 0.9rem;">
        <strong>Version:</strong> 2.0.0 &nbsp;|&nbsp; <strong>Year:</strong> 2026 &nbsp;|&nbsp; <strong>Platform:</strong> Web (all modern browsers)
      </div>
    `);
  });
  
  // Support button
  document.getElementById('supportBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showSupportModal();
  });

  function showSupportModal() {
    showModal('Support & Contact', `
      <p style="font-size: 1.05rem; line-height: 1.7;">Got a question or ran into an issue? We\'re here to help you get the most out of seswa.in.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">📬 Contact Us</h3>
      <ul style="line-height: 2.2; list-style: none; padding-left: 0;">
        <li>📧 <strong>Email:</strong> <a href="mailto:support@seswa.in" style="color: var(--primary);">support@seswa.in</a></li>
        <li>📞 <strong>Phone:</strong> +91 98765 43210 (Mon–Sat, 9 AM – 6 PM IST)</li>
        <li>💬 <strong>Live Chat:</strong> Available on the dashboard during event hours</li>
      </ul>

      <h3 style="color: var(--accent); margin-top: 20px;">📖 Help Center</h3>
      <ul style="line-height: 2;">
        <li><strong>Getting Started</strong> — How to generate your first QR code</li>
        <li><strong>For Representatives</strong> — Login, scanning, and meal service guide</li>
        <li><strong>Dashboard Guide</strong> — Understanding stats, charts, and exports</li>
        <li><strong>Troubleshooting</strong> — Camera permissions, browser compatibility, common errors</li>
      </ul>

      <h3 style="color: var(--accent); margin-top: 20px;">❓ FAQ</h3>
      <ul style="line-height: 2;">
        <li><strong>Can I regenerate my QR code?</strong> — No, each student gets one unique QR to prevent duplicates.</li>
        <li><strong>Which browsers are supported?</strong> — Chrome, Edge, Safari, and Firefox (with jsQR fallback).</li>
        <li><strong>What if scanning doesn\'t work?</strong> — Use the manual token input or file upload option.</li>
      </ul>

      <div style="margin-top: 20px; padding: 12px 16px; background: rgba(16,185,129,0.08); border-radius: 10px; font-size: 0.9rem;">
        ⏱️ <strong>Response time:</strong> Typically within 12 hours on business days.
      </div>
    `);
  }

  // Expose for Help & Support card button
  window.showSupportModal = showSupportModal;

  // Privacy Policy modal
  function showPrivacyPolicy() {
    showModal('Privacy Policy', `
      <p style="font-size: 0.9rem; color: var(--text-light);">Last updated: February 2026</p>

      <h3 style="color: var(--accent); margin-top: 20px;">1. Introduction</h3>
      <p>seswa.in ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our digital registration and attendance management platform.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">2. Information We Collect</h3>
      <ul style="line-height: 2;">
        <li><strong>Student Information:</strong> Name, college name, academic year, and food preference — provided voluntarily during QR code generation.</li>
        <li><strong>Attendance Data:</strong> Meal service records (breakfast, lunch, dinner), timestamps, and dietary preferences selected during scanning.</li>
        <li><strong>Representative Data:</strong> Login credentials (username) for authorized event representatives.</li>
      </ul>
      <p>We do <strong>not</strong> collect email addresses, phone numbers, payment information, or device identifiers.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">3. How We Use Your Data</h3>
      <ul style="line-height: 2;">
        <li>Generate unique QR codes for event registration</li>
        <li>Track meal service to prevent duplicate servings</li>
        <li>Display real-time attendance statistics on the dashboard</li>
        <li>Produce event reports and analytics</li>
      </ul>

      <h3 style="color: var(--accent); margin-top: 20px;">4. Data Storage</h3>
      <p>All data is stored <strong>locally in your browser</strong> using localStorage. No data is transmitted to external servers. Data persists only on the device where it was created and can be cleared at any time by clearing your browser data.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">5. Data Sharing</h3>
      <p>We do <strong>not</strong> sell, trade, or share your personal information with any third parties. Data is accessible only to authorized event representatives logged into the system on the same device.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">6. Your Rights</h3>
      <ul style="line-height: 2;">
        <li><strong>Access:</strong> View your data through the participant detail page</li>
        <li><strong>Deletion:</strong> Clear all data by clearing browser localStorage</li>
        <li><strong>Portability:</strong> Export attendance data via the dashboard export feature</li>
      </ul>

      <h3 style="color: var(--accent); margin-top: 20px;">7. Third-Party Libraries</h3>
      <p>We use the following external libraries loaded via CDN:</p>
      <ul style="line-height: 2;">
        <li><strong>QRCode.js</strong> — for QR code generation</li>
        <li><strong>jsQR</strong> — for QR code scanning (Firefox fallback)</li>
        <li><strong>Chart.js</strong> — for dashboard visualizations</li>
      </ul>
      <p>These libraries process data locally in your browser and do not transmit information externally.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">8. Changes to This Policy</h3>
      <p>We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated revision date.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">9. Contact</h3>
      <p>For questions about this Privacy Policy, contact us at <a href="mailto:support@seswa.in" style="color: var(--primary);">support@seswa.in</a>.</p>
    `);
  }
  window.showPrivacyPolicy = showPrivacyPolicy;

  // Terms of Service modal
  function showTermsOfService() {
    showModal('Terms of Service', `
      <p style="font-size: 0.9rem; color: var(--text-light);">Last updated: February 2026</p>

      <h3 style="color: var(--accent); margin-top: 20px;">1. Acceptance of Terms</h3>
      <p>By accessing and using seswa.in, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">2. Description of Service</h3>
      <p>seswa.in provides a browser-based digital registration and attendance management system using QR code technology. The service includes QR code generation, scanning, meal tracking, and event dashboards.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">3. User Responsibilities</h3>
      <ul style="line-height: 2;">
        <li>Provide accurate information during QR code generation</li>
        <li>Do not share your QR code with others or attempt to use another person\'s QR code</li>
        <li>Representatives must keep login credentials secure and not share them</li>
        <li>Do not attempt to tamper with, reverse-engineer, or manipulate QR tokens</li>
      </ul>

      <h3 style="color: var(--accent); margin-top: 20px;">4. One QR Code Policy</h3>
      <p>Each student is entitled to <strong>one unique QR code</strong> per name and college combination. Duplicate generation is automatically prevented by the system. Attempts to circumvent this policy may result in access revocation.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">5. Representative Access</h3>
      <p>Scanner, dashboard, and meal service features are restricted to authorized representatives. Unauthorized access attempts are prohibited.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">6. Meal Service Rules</h3>
      <ul style="line-height: 2;">
        <li>Meals are served within designated time windows only</li>
        <li>Each meal type (breakfast, lunch, dinner) can be served only once per participant</li>
        <li>Dietary preferences are recorded at the time of service</li>
      </ul>

      <h3 style="color: var(--accent); margin-top: 20px;">7. Limitation of Liability</h3>
      <p>seswa.in is provided "as is" without warranties of any kind. We are not liable for data loss due to browser clearing, device issues, or any indirect damages arising from use of the platform.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">8. Modifications</h3>
      <p>We reserve the right to modify these Terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>

      <h3 style="color: var(--accent); margin-top: 20px;">9. Contact</h3>
      <p>For questions about these Terms, contact us at <a href="mailto:support@seswa.in" style="color: var(--primary);">support@seswa.in</a>.</p>
    `);
  }
  window.showTermsOfService = showTermsOfService;
  
  // Close modal
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  
  // Navigation for all buttons with data-target attribute
  const allButtons = document.querySelectorAll('[data-target]');
  allButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const target = button.getAttribute('data-target');
      if (!target) return;
      // Handle anchor scroll targets (e.g. #features)
      if (target.startsWith('#')) {
        const section = document.querySelector(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      document.body.style.opacity = '0.95';
      setTimeout(() => { window.location.href = target; }, 200);
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});