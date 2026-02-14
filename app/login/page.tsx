"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);


    useEffect(() => {
        // Load saved email
        const savedEmail = localStorage.getItem("repEmail");
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
        }
    }, []);



    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors on input
        if (name === 'email' || name === 'password') {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password, rememberMe } = formData;

        // Define system credentials
        const systemUsers = [
            { email: "rep.one@seswa.in", password: "seswa-rep-001" },
            { email: "rep.two@seswa.in", password: "seswa-rep-002" },
            { email: "rep.three@seswa.in", password: "seswa-rep-003" },
            { email: "rep.four@seswa.in", password: "seswa-rep-004" }
        ];

        const user = systemUsers.find(u => u.email === email && u.password === password);

        if (!user) {
            setErrors({ email: "Invalid system credentials", password: "Please check email and password" });
            return;
        }

        setIsSubmitting(true);

        if (rememberMe) {
            localStorage.setItem("repEmail", email);
        } else {
            localStorage.removeItem("repEmail");
        }

        // Simulate API call
        setTimeout(() => {
            // Success
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("currentRep", JSON.stringify({
                email: email,
                name: email.split("@")[0],
                role: "Representative",
                loginTime: new Date().toISOString()
            }));

            router.push('/scan'); // Redirect to scan page
        }, 800);
    };

    return (
        <div className="login-page">


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

            <main className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">👤</div>
                        <h1>Representative Login</h1>
                        <p className="subtitle">Access your attendance management dashboard</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📧</span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="your.email@college.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <span className="input-error">{errors.email}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔐</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Show/hide password"
                                >
                                    {showPassword ? "👁️‍🗨️" : "👁️"}
                                </button>
                            </div>
                            <span className="input-error">{errors.password}</span>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn-login" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </button>
                        {isSubmitting && <p className="form-message success" style={{ textAlign: 'center', marginTop: '10px' }}>✓ Login successful! Redirecting...</p>}

                        <p className="security-note">🔒 Secure login • Data encrypted</p>
                    </form>

                    <div className="login-footer">
                        <p>Don't have access? <a href="#" onClick={(e) => { e.preventDefault(); setShowContactModal(true); }}>Contact Administrator</a></p>
                    </div>
                </div>

                {/* Contact Modal */}
                <div className={`contact-modal-overlay ${showContactModal ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setShowContactModal(false) }}>
                    <div className="contact-modal">
                        <button className="contact-modal-close" onClick={() => setShowContactModal(false)}>&times;</button>
                        <div className="contact-modal-header">
                            <span className="contact-modal-icon">📬</span>
                            <h2>Contact Administrator</h2>
                            <p>Reach out for login credentials or access issues</p>
                        </div>
                        <div className="contact-modal-body">
                            <div className="contact-item">
                                <span className="contact-item-icon">📧</span>
                                <div>
                                    <strong>Email</strong>
                                    <a href="mailto:admin@seswa.in">admin@seswa.in</a>
                                </div>
                            </div>
                            <div className="contact-item">
                                <span className="contact-item-icon">📞</span>
                                <div>
                                    <strong>Phone</strong>
                                    <a href="tel:+919876543210">+91 98765 43210</a>
                                </div>
                            </div>
                            <div className="contact-item">
                                <span className="contact-item-icon">💬</span>
                                <div>
                                    <strong>WhatsApp</strong>
                                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">Send a message</a>
                                </div>
                            </div>
                            <div className="contact-note">
                                <p>⏰ Available Mon–Sat, 9 AM – 6 PM IST</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="blur-blob blob-1"></div>
                <div className="blur-blob blob-2"></div>
            </main>
        </div>
    );
}
