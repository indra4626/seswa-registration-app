"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ParticipantDetail() {
    const router = useRouter();
    const params = useParams();
    const participantId = params.id as string;

    const [participant, setParticipant] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [rep, setRep] = useState<any>(null);

    useEffect(() => {
        // Auth check
        const loggedIn = localStorage.getItem("loggedIn");
        if (!loggedIn) {
            router.push('/login');
            return;
        }

        const currentRep = JSON.parse(localStorage.getItem("currentRep") || "{}");
        setRep(currentRep);

        // Load data from API
        const fetchData = async () => {
            try {
                const res = await fetch('/api/participant');
                const data = await res.json();

                if (data.success) {
                    const allParticipants = data.data;
                    const p = allParticipants.find((x: any) => x.token === participantId || x._id === participantId);

                    if (!p) {
                        alert("Participant not found");
                        router.push('/dashboard');
                        return;
                    }
                    setParticipant(p);
                } else {
                    console.error("Failed to fetch participants");
                    alert("Error loading data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [participantId, router]);

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('currentRep');
            router.push('/login');
        }
    };

    if (!participant) return (
        <>
            <style>{`
                .seswa-loading-screen {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #0f172a;
                    z-index: 9999;
                    margin: 0 !important;
                    padding: 0 !important;
                    text-align: center;
                }
                .seswa-loading-logo-ring {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.3), 0 0 50px rgba(99,102,241,0.15);
                    animation: seswaLogoPulse 2s ease-in-out infinite;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                .seswa-loading-logo-ring img {
                    width: 88px;
                    height: 88px;
                    object-fit: contain;
                    border-radius: 50%;
                    display: block;
                }
                .seswa-loading-brand {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #e0e7ff;
                    letter-spacing: 1px;
                    font-family: 'Inter', system-ui, sans-serif;
                    margin: 0;
                    padding: 0;
                    line-height: 1;
                }
                .seswa-loading-spinner {
                    width: 26px;
                    height: 26px;
                    border: 3px solid rgba(99,102,241,0.15);
                    border-top-color: #818cf8;
                    border-radius: 50%;
                    animation: seswaSpinLoader 0.8s linear infinite;
                    margin-top: 18px;
                }
                @keyframes seswaLogoPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes seswaSpinLoader {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <div className="seswa-loading-screen">
                <div className="seswa-loading-logo-ring">
                    <img src="/assets/seswa.png" alt="SESWA Logo" />
                </div>
                <p className="seswa-loading-brand">seswa.in</p>
                <div className="seswa-loading-spinner" />
            </div>
        </>
    );

    return (
        <>

            <style jsx>{`
        .status-indicator {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 600;
            margin: 5px 0;
        }
        .status-served {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
        .status-pending {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }
        .detail-value {
            font-size: 1rem;
            font-weight: 500;
            color: #333;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .auth-badge {
            background: linear-gradient(135deg, #3366ff, #6c63ff);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 15px;
        }
      `}</style>

            {/* Auth Notice */}
            <div id="authNotice" style={{ display: 'block', background: 'linear-gradient(135deg, #3366ff 0%, #6c63ff 100%)', color: 'white', padding: '12px 20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>{rep?.name ? `${rep.name} (${rep.role || 'Volunteer'}) logged in` : 'Representative logged in'}</span> | <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, marginLeft: '10px' }}>Logout</button>
            </div>

            {/* Slide Menu */}
            <div className={`slide-menu ${menuOpen ? 'open' : ''}`} id="slideMenu">
                <div className="menu-header">
                    <h2>Menu</h2>
                    <button className="menu-close" onClick={() => setMenuOpen(false)}>&times;</button>
                </div>
                <nav className="menu-nav">
                    <Link href="/dashboard" className="menu-item">📊 Dashboard</Link>
                    <Link href="/scan" className="menu-item">📱 QR Scanner</Link>
                    <Link href="/" className="menu-item">🏠 Home</Link>
                    <Link href="/student" className="menu-item">👤 Student Reg</Link>
                    <a href="#" className="menu-item" onClick={() => alert('Help & Review coming soon')}>❓ Help & Review</a>
                    <a href="#" className="menu-item" onClick={handleLogout} style={{ color: '#ef4444' }}>🔓 Logout</a>
                </nav>
            </div>
            <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>

            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-brand" onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer' }}>
                    <img src="/assets/seswa.png" alt="Logo" className="nav-logo" />
                    <span className="nav-text">seswa.in</span>
                </div>
                <div className="nav-links">
                    <Link href="/dashboard" className="nav-link">📊 Dashboard</Link>
                    <Link href="/scan" className="nav-link">📱 Scanner</Link>
                    <Link href="/" className="nav-link">🏠 Home</Link>
                </div>
            </nav>

            <main className="main-content">
                <section className="generator-section">
                    <div className="generator-container">
                        <div className="form-card">
                            <h2 className="form-title">📋 Participant Details</h2>
                            <p className="form-subtitle">Meal status and activity information</p>

                            {rep?.role && <div className="auth-badge">Role: {rep.role.toUpperCase()}</div>}

                            <div className="form-group">
                                <label className="form-label">🆔 Participant ID</label>
                                <div className="detail-value">{participant.id}</div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">👤 Name</label>
                                <div className="detail-value">{participant.name}</div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">📱 WhatsApp</label>
                                <div className="detail-value">{participant.whatsapp || '—'}</div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">🥣 Breakfast (8–10 AM)</label>
                                <div className="detail-value">
                                    <span className={`status-indicator ${participant.breakfast ? 'status-served' : 'status-pending'}`}>
                                        {participant.breakfast ? '✅ Served' : '❌ Not Served'}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">🍲 Lunch (12–3 PM)</label>
                                <div className="detail-value">
                                    <span className={`status-indicator ${participant.lunch ? 'status-served' : 'status-pending'}`}>
                                        {participant.lunch ? '✅ Served' : '❌ Not Served'}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">🍽️ Dinner (6–8 PM)</label>
                                <div className="detail-value">
                                    <span className={`status-indicator ${participant.dinner ? 'status-served' : 'status-pending'}`}>
                                        {participant.dinner ? '✅ Served' : '❌ Not Served'}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">🏨 Accommodation Needed</label>
                                <div className="detail-value">{participant.accommodation ? "🏨 Yes, needed" : "❌ No"}</div>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3 className="info-title">📊 Activity Log</h3>
                            <p style={{ color: '#999', fontSize: '0.9rem', margin: '0 0 15px' }}>All meal service timestamps</p>
                            <ul className="info-list" style={{ listStyle: 'none', padding: 0 }}>
                                {participant.logs && participant.logs.length > 0 ? (
                                    [...participant.logs].sort((a: any, b: any) => new Date(b.ts || 0).getTime() - new Date(a.ts || 0).getTime()).map((log: any, i: number) => {
                                        const mealIcons: Record<string, string> = { 'breakfast': '🥣', 'lunch': '🍲', 'dinner': '🍽️' };
                                        const mealIcon = mealIcons[log.action.toLowerCase()] || '🔔';
                                        return (
                                            <li key={i} style={{ padding: '10px', borderBottom: '1px solid #eee', animation: 'slideIn 0.3s ease' }}>
                                                <strong>{mealIcon} {log.action.toUpperCase()}</strong> served at {new Date(log.ts || log.timestamp).toLocaleString()}
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li style={{ color: '#999' }}>No activity yet</li>
                                )}
                            </ul>

                            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                <Link href="/scan" className="btn-generate" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 15px', background: '#3366ff', color: 'white', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>
                                    ← Back to Scanner
                                </Link>
                                <Link href="/dashboard" className="btn-generate" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 15px', background: '#6c63ff', color: 'white', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>
                                    Go to Dashboard →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
