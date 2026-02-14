"use client";

import Script from 'next/script';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

declare global {
    interface Window {
        QRCode: any;
    }
}

export default function Student() {
    const [formData, setFormData] = useState({
        name: '',
        college: '',
        academicYear: '',
        foodItem: '',
        whatsapp: ''
    });
    const [qrPayload, setQrPayload] = useState<any>(null);

    const [whatsappStatus, setWhatsappStatus] = useState<any>(null); // { type: 'sending' | 'success' | 'demo' | 'error', message: string }
    const qrRef = useRef<HTMLDivElement>(null);





    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const generateQR = async () => {
        const { name, college, academicYear, foodItem, whatsapp } = formData;
        const consent = (document.getElementById('consent') as HTMLInputElement)?.checked;

        if (!name || !college || !academicYear || !foodItem || !whatsapp) {
            alert("Please fill all required fields.");
            return;
        }

        if (!consent) {
            alert("Please agree to the terms to proceed.");
            return;
        }

        if (!/^[0-9]{10}$/.test(whatsapp)) {
            alert("Please enter a valid 10-digit WhatsApp number.");
            return;
        }

        // Generate Token
        const initials = (name.split(/\s+/).filter(Boolean).length === 1)
            ? name.substring(0, 2).toUpperCase()
            : (name.split(/\s+/)[0][0] + name.split(/\s+/).slice(-1)[0][0]).toUpperCase();

        const collegeAcr = college.split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join('');
        const random8 = Math.floor(10000000 + Math.random() * 90000000).toString();
        const token = `${initials}${collegeAcr}${random8}`;

        const payload = {
            name,
            college,
            academicYear,
            foodItem,
            whatsapp,
            token
        };

        try {
            const response = await fetch('/api/participant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                if (data.message === 'Participant already exists') {
                    alert(`QR code already generated for ${name} (${college}).\nToken: ${data.data.token}\nShowing your existing QR code.`);
                    showQRResult(data.data);
                } else {
                    showQRResult(payload);
                }
            } else {
                alert('Failed to save registration. Please try again.');
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error saving participant:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const showQRResult = (payload: any) => {
        setQrPayload(payload);

        // Render QR
        setTimeout(() => {
            if (qrRef.current && window.QRCode) {
                qrRef.current.innerHTML = "";
                new window.QRCode(qrRef.current, {
                    text: JSON.stringify(payload),
                    width: 250,
                    height: 250,
                    colorDark: "#000000",
                    colorLight: "#ffffff"
                });
            }
        }, 100);

        // Mock WhatsApp
        if (payload.whatsapp) {
            sendWhatsAppMessage(payload);
        }
    };

    const sendWhatsAppMessage = async (payload: any) => {
        setWhatsappStatus({ type: 'sending', message: 'Sending registration details to WhatsApp...' });

        // Simulate API call
        setTimeout(() => {
            // Demo mode
            setWhatsappStatus({ type: 'demo', message: 'Demo mode — WhatsApp API not configured yet. Message logged to console.' });
            console.log('WhatsApp payload:', payload);
        }, 1500);
    };

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = `SESWA-QR-${qrPayload.token}.png`;
            link.click();
        }
    };

    const copyToken = () => {
        if (qrPayload?.token) {
            navigator.clipboard.writeText(qrPayload.token);
            alert("Token copied!");
        }
    };

    return (
        <div className="student-page">
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" strategy="afterInteractive" />

            {/* Navbar */}
            <nav className="navbar">
                <Link href="/" className="nav-brand">
                    <img src="/assets/seswa.png" alt="Logo" className="nav-logo" />
                    <span className="nav-text">seswa.in</span>
                </Link>
                <div className="nav-links">
                    <Link href="/" className="nav-link">Home</Link>


                </div>
            </nav>

            <main className="main-content">
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="page-title">Generate Your <span className="gradient-text">QR Code</span></h1>
                        <p className="page-subtitle">Create a unique QR code with just a few clicks.</p>
                    </div>
                </section>

                <section className="generator-section">
                    <div className="generator-container">
                        <div className="form-card">
                            <h2 className="form-title">📋 Student Information</h2>
                            <p className="form-subtitle">Fill in your details</p>

                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Full Name *</label>
                                <input type="text" id="name" className="form-input" placeholder="Enter your full name" required onChange={handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="college" className="form-label">College Name *</label>
                                <input type="text" id="college" className="form-input" placeholder="Enter college name" required onChange={handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="academicYear" className="form-label">Academic Year *</label>
                                <input type="text" id="academicYear" className="form-input" placeholder="e.g., 2024-2025" required onChange={handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="foodItem" className="form-label">Food Preference *</label>
                                <input type="text" id="foodItem" className="form-input" placeholder="e.g., Vegetarian" required onChange={handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="whatsapp" className="form-label">WhatsApp Number *</label>
                                <input type="tel" id="whatsapp" className="form-input" placeholder="e.g., 9876543210" required pattern="[0-9]{10}" maxLength={10} onChange={handleInputChange} />
                            </div>

                            <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                                <input type="checkbox" id="consent" required style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                <label htmlFor="consent" style={{ fontSize: '0.9rem', color: '#555', cursor: 'pointer' }}>
                                    I agree to share my details for event registration purposes.
                                </label>
                            </div>

                            <button className="btn-generate" onClick={generateQR}>Generate QR Code ✨</button>
                        </div>

                        <div className="info-card">
                            <h3 className="info-title">🎯 How It Works</h3>
                            <ul className="info-list">
                                <li><span className="step-badge">1</span> Enter your details above</li>
                                <li><span className="step-badge">2</span> Click "Generate QR Code"</li>
                                <li><span className="step-badge">3</span> Download and use your QR code</li>
                                <li><span className="step-badge">4</span> Show your QR code at the counter</li>
                                <li><span className="step-badge">5</span> Enjoy your meal!</li>
                            </ul>
                            <div className="feature-box">
                                <h4>✅ Instant Generation</h4>
                                <p>Your QR code is created instantly</p>
                            </div>
                        </div>
                    </div>
                </section>

                {qrPayload && (
                    <section id="qrSection" className="qr-result-section">
                        <div className="qr-result-container">
                            <div className="qr-success-header">
                                <div className="success-icon">✅</div>
                                <h2>QR Code Generated!</h2>
                            </div>

                            <div className="qr-result-grid">
                                <div className="qr-code-card">
                                    <h3 className="qr-card-title">📱 Your QR Code</h3>
                                    <div className="qr-display">
                                        <div ref={qrRef} className="qr-container"></div>
                                    </div>
                                    <button className="btn-download" onClick={downloadQR}>Download QR Code</button>
                                </div>

                                <div className="details-card">
                                    <h3 className="details-title">📋 Your Information</h3>
                                    <div className="student-details">
                                        <div><strong>👤 Name:</strong> <span>{qrPayload.name}</span></div>
                                        <div><strong>🏫 College:</strong> <span>{qrPayload.college}</span></div>
                                        <div><strong>📅 Year:</strong> <span>{qrPayload.academicYear}</span></div>
                                        <div><strong>Token:</strong> <span>{qrPayload.token}</span></div>
                                    </div>

                                    {whatsappStatus && (
                                        <div className={`whatsapp-status ${whatsappStatus.type}`}>
                                            {whatsappStatus.message}
                                        </div>
                                    )}

                                    <div className="token-section">
                                        <div className="token-label">🔐 Unique Token</div>
                                        <div className="token-display">
                                            <span id="tokenValue">{qrPayload.token}</span>
                                            <button className="btn-copy" onClick={copyToken}>📋 Copy</button>
                                        </div>
                                    </div>

                                    <button className="btn-generate-new" onClick={() => window.location.reload()}>
                                        Generate Another
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
