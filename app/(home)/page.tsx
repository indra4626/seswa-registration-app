"use client";

import { useEffect, useState } from 'react';
export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [modalContent, setModalContent] = useState<{ title: string; body: React.ReactNode } | null>(null);

  useEffect(() => {
    // Intro overlay
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    // Theme (simplified from home.js)
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    document.body.classList.add('home-page');

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('home-page');
    };
  }, []);

  const openModal = (title: string, bodyContent: React.ReactNode) => {
    setModalContent({ title, body: bodyContent });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const showAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal('About seswa.in', (
      <div className="modal-about-content">
        <p className="modal-intro"><strong>seswa.in</strong> is a next-generation digital registration and attendance platform designed to streamline event management.</p>

        <div className="modal-section">
          <h3 className="modal-subtitle">🎯 Our Mission</h3>
          <p>Eliminate paper-based attendance and long queues through secure, instant digital verification.</p>
        </div>

        <div className="modal-section">
          <h3 className="modal-subtitle">⚡ What We Offer</h3>
          <ul className="modal-list">
            <li><span className="icon">📱</span> <strong>Instant QR Generation</strong> — Unique code per student</li>
            <li><span className="icon">📷</span> <strong>Live Scanning</strong> — Fast camera-based verification</li>
            <li><span className="icon">🍽️</span> <strong>Meal Tracking</strong> — Prevent duplicate meals</li>
            <li><span className="icon">📊</span> <strong>Real-Time Stats</strong> — Live dashboard updates</li>
            <li><span className="icon">🔐</span> <strong>Secure Access</strong> — Role-based permissions</li>
          </ul>
        </div>

        <div className="modal-version-tag">
          <span className="version">v2.0.0</span>
          <span className="divider">|</span>
          <span className="year">2026 Edition</span>
        </div>
      </div>
    ));
  };

  const showSupport = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    openModal('Support & Contact', (
      <div className="modal-support-content">
        <p className="modal-intro">Need assistance? Our support team is here to help you ensuring smooth event operations.</p>

        <div className="contact-card">
          <h3 className="modal-subtitle">📬 Get in Touch</h3>
          <div className="contact-item">
            <span className="contact-label">Email Support</span>
            <a href="mailto:support@seswa.in" className="contact-link">support@seswa.in</a>
          </div>
          <div className="contact-item">
            <span className="contact-label">Mobile Support</span>
            <span className="contact-link">Contact Event Admin</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">Response Time</span>
            <span className="contact-value">Within 24 Hours</span>
          </div>
        </div>
      </div>
    ));
  };

  const showPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal('Privacy Policy', (
      <div className="modal-text-content">
        <p className="legal-meta">Last updated: February 2026</p>

        <div className="modal-section">
          <h3>1. Introduction</h3>
          <p>seswa.in ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our digital registration and attendance management platform.</p>
        </div>

        <div className="modal-section">
          <h3>2. Information We Collect</h3>
          <ul>
            <li><strong>Student Information:</strong> Name, college name, academic year, and food preference — provided voluntarily during QR code generation.</li>
            <li><strong>Attendance Data:</strong> Meal service records (breakfast, lunch, dinner), timestamps, and dietary preferences selected during scanning.</li>
            <li><strong>Representative Data:</strong> Login credentials (username) for authorized event representatives.</li>
          </ul>
          <p>We do <strong>not</strong> collect email addresses, phone numbers, payment information, or device identifiers.</p>
        </div>

        <div className="modal-section">
          <h3>3. How We Use Your Data</h3>
          <ul>
            <li>Generate unique QR codes for event registration</li>
            <li>Track meal service to prevent duplicate servings</li>
            <li>Display real-time attendance statistics on the dashboard</li>
            <li>Produce event reports and analytics</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>4. Data Storage</h3>
          <p>All data is stored <strong>locally in your browser</strong> using localStorage. No data is transmitted to external servers. Data persists only on the device where it was created and can be cleared at any time by clearing your browser data.</p>
        </div>

        <div className="modal-section">
          <h3>5. Data Sharing</h3>
          <p>We do <strong>not</strong> sell, trade, or share your personal information with any third parties. Data is accessible only to authorized event representatives logged into the system on the same device.</p>
        </div>

        <div className="modal-section">
          <h3>6. Your Rights</h3>
          <ul>
            <li><strong>Access:</strong> View your data through the participant detail page</li>
            <li><strong>Deletion:</strong> Clear all data by clearing browser localStorage</li>
            <li><strong>Portability:</strong> Export attendance data via the dashboard export feature</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>7. Third-Party Libraries</h3>
          <p>We use the following external libraries loaded via CDN:</p>
          <ul>
            <li><strong>QRCode.js</strong> — for QR code generation</li>
            <li><strong>jsQR</strong> — for QR code scanning (Firefox fallback)</li>
            <li><strong>Chart.js</strong> — for dashboard visualizations</li>
          </ul>
          <p>These libraries process data locally in your browser and do not transmit information externally.</p>
        </div>

        <div className="modal-section">
          <h3>8. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated revision date.</p>
        </div>

        <div className="modal-section">
          <h3>9. Contact</h3>
          <p>For questions about this Privacy Policy, please contact your event administrator or email us at <a href="mailto:support@seswa.in" className="contact-link">support@seswa.in</a>.</p>
        </div>
      </div>
    ));
  };

  const showTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal('Terms of Service', (
      <div className="modal-text-content">
        <p className="legal-meta">Last updated: February 2026</p>

        <div className="modal-section">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using seswa.in, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
        </div>

        <div className="modal-section">
          <h3>2. Description of Service</h3>
          <p>seswa.in provides a browser-based digital registration and attendance management system using QR code technology. The service includes QR code generation, scanning, meal tracking, and event dashboards.</p>
        </div>

        <div className="modal-section">
          <h3>3. User Responsibilities</h3>
          <ul>
            <li>Provide accurate information during QR code generation</li>
            <li>Do not share your QR code with others or attempt to use another person's QR code</li>
            <li>Representatives must keep login credentials secure and not share them</li>
            <li>Do not attempt to tamper with, reverse-engineer, or manipulate QR tokens</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>4. One QR Code Policy</h3>
          <p>Each student is entitled to <strong>one unique QR code</strong> per name and college combination. Duplicate generation is automatically prevented by the system. Attempts to circumvent this policy may result in access revocation.</p>
        </div>

        <div className="modal-section">
          <h3>5. Representative Access</h3>
          <p>Scanner, dashboard, and meal service features are restricted to authorized representatives. Unauthorized access attempts are prohibited.</p>
        </div>

        <div className="modal-section">
          <h3>6. Meal Service Rules</h3>
          <ul>
            <li>Meals are served within designated time windows only</li>
            <li>Each meal type (breakfast, lunch, dinner) can be served only once per participant</li>
            <li>Dietary preferences are recorded at the time of service</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>7. Limitation of Liability</h3>
          <p>seswa.in is provided "as is" without warranties of any kind. We are not liable for data loss due to browser clearing, device issues, or any indirect damages arising from use of the platform.</p>
        </div>

        <div className="modal-section">
          <h3>8. Modifications</h3>
          <p>We reserve the right to modify these Terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
        </div>

        <div className="modal-section">
          <h3>9. Contact</h3>
          <p>For questions about these Terms, please contact your event administrator or email us at <a href="mailto:support@seswa.in" className="contact-link">support@seswa.in</a>.</p>
        </div>
      </div>
    ));
  };

  // Handlers for navigation
  const navigateTo = (path: string) => {
    window.location.href = path; // Simple navigation for now to match legacy behavior
  };

  return (
    <>


      {/* Intro Overlay */}
      <div className={`intro-overlay ${!showIntro ? 'fade-out' : ''}`} id="introOverlay">
        <div className="intro-content">
          <img src="/assets/seswa.png" alt="seswa.in Logo" className="intro-logo" />
          <h2 className="intro-text">seswa.in</h2>
        </div>
      </div>

      {/* Background Video */}
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/assets/hero-dark.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/assets/seswa.png" alt="Logo" className="nav-logo" />
          <span className="nav-text">seswa.in</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#" className="nav-link" onClick={showAbout} id="aboutBtn">About</a>
          <a href="#" className="nav-link" onClick={showSupport} id="supportBtn">Support</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Smart Attendance <br />
              <span className="gradient-text">Made Simple</span>
            </h1>
            <p className="hero-subtitle">
              Streamline your attendance process with QR codes. Fast, accurate, and reliable.
            </p>
            <div className="hero-cta">
              <button className="cta-primary" onClick={() => navigateTo('/student')}>Get Started</button>
              <button className="cta-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Learn More</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <span className="card-icon">📱</span>
              <p>QR Code</p>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">✅</span>
              <p>Verified</p>
            </div>
            <div className="floating-card card-3">
              <span className="card-icon">⚡</span>
              <p>Instant</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features" id="features">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to manage attendance efficiently</p>

          <div className="features-grid">
            {/* Student QR */}
            <div className="feature-card feature-card-1">
              <div className="feature-icon-bg"><span className="feature-icon">🎓</span></div>
              <h3>Student QR Generator</h3>
              <p>Generate unique QR codes for every student.</p>
              <button className="feature-btn" onClick={() => navigateTo('/student')}>
                Start Generating <span className="btn-arrow">→</span>
              </button>
            </div>

            {/* Rep Login */}
            <div className="feature-card feature-card-2">
              <div className="feature-icon-bg"><span className="feature-icon">👤</span></div>
              <h3>Representative Login</h3>
              <p>Secure access for representatives.</p>
              <button className="feature-btn" onClick={() => navigateTo('/login')}>
                Sign In <span className="btn-arrow">→</span>
              </button>
            </div>

            {/* QR Scanner */}
            <div className="feature-card feature-card-3">
              <div className="feature-icon-bg"><span className="feature-icon">📸</span></div>
              <h3>QR Code Scanner</h3>
              <p>Fast and accurate scanning.</p>
              <button className="feature-btn" onClick={() => {
                const loggedIn = localStorage.getItem("loggedIn");
                if (loggedIn) {
                  navigateTo('/scan');
                } else {
                  navigateTo('/login');
                }
              }}>
                Open Scanner <span className="btn-arrow">→</span>
              </button>
            </div>

            {/* Help */}
            <div className="feature-card feature-card-4">
              <div className="feature-icon-bg"><span className="feature-icon">❓</span></div>
              <h3>Help & Support</h3>
              <p>Complete documentation and support.</p>
              <button className="feature-btn" onClick={(e) => showSupport(e)}>
                Get Help <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Accurate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">&lt;1s</div>
            <div className="stat-label">Response Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Scalable</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Available</div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2026 seswa.in. Smart Attendance Management System.</p>
          <div className="footer-links">
            <a href="#" onClick={showPrivacy}>Privacy Policy</a>
            <a href="#" onClick={showTerms}>Terms of Service</a>
            <a href="#" onClick={showSupport}>Contact</a>
          </div>
        </footer>
      </main>

      {/* Background Elements */}
      <div className="bg-elements">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Modal */}
      {modalContent && (
        <>
          <div className="modal show" id="infoModal">
            <div className="modal-content">
              <button className="modal-close" onClick={closeModal} id="modalClose">&times;</button>
              <div id="modalTitle"><h2>{modalContent.title}</h2></div>
              <div id="modalBody">{modalContent.body}</div>
            </div>
          </div>
          <div className="modal-overlay show" onClick={closeModal} id="modalOverlay"></div>
        </>
      )}
    </>
  );
}
