"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({
        total: 0,
        lunch: 0,
        dinner: 0,
        accommodation: 0
    });
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auth check
        const loggedIn = localStorage.getItem("loggedIn");
        if (!loggedIn) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch('/api/participant');
                const data = await res.json();

                if (data.success) {
                    const parts = data.data;
                    setParticipants(parts);
                    setStats({
                        total: parts.length,
                        lunch: parts.filter((p: any) => p.scanned).length, // Using scanned as a proxy for "served" for now
                        dinner: 0,
                        accommodation: 0
                    });
                }
            } catch (error) {
                console.error("Failed to fetch participants", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('currentRep');
            router.push('/login');
        }
    };

    return (
        <>
            <header className="topbar">
                <h1>seswa.in</h1>
                <button id="logoutBtn" onClick={handleLogout} style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600
                }}>Logout</button>
            </header>

            <main className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/" style={{ color: '#3366ff', textDecoration: 'none', fontWeight: 600 }}>← Back Home</Link>
                    <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
                    <Link href="/scan" style={{ color: '#3366ff', textDecoration: 'none', fontWeight: 600 }}>Go to Scanner →</Link>
                </div>

                <section className="stats">
                    <div className="card stat-primary">
                        <h3>Total Participants</h3>
                        <p>{stats.total}</p>
                    </div>

                    <div className="card stat-success">
                        <h3>Verified/Scanned</h3>
                        <p>{stats.lunch}</p>
                    </div>
                </section>

                <section style={{ marginTop: '40px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>Participant List</h2>

                    {loading ? (
                        <p>Loading participants...</p>
                    ) : (
                        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                    <tr>
                                        <th style={{ padding: '15px' }}>Name</th>
                                        <th style={{ padding: '15px' }}>College</th>
                                        <th style={{ padding: '15px' }}>Token</th>
                                        <th style={{ padding: '15px' }}>Food</th>
                                        <th style={{ padding: '15px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.length > 0 ? (
                                        participants.map((p, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '15px' }}>{p.name}</td>
                                                <td style={{ padding: '15px' }}>{p.college}</td>
                                                <td style={{ padding: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>{p.token}</td>
                                                <td style={{ padding: '15px' }}>{p.foodItem}</td>
                                                <td style={{ padding: '15px' }}>
                                                    {p.scanned ? (
                                                        <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Verified</span>
                                                    ) : (
                                                        <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Pending</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No participants registered yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
