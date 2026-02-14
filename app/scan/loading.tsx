"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Loading() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            const loggedIn = localStorage.getItem("loggedIn");
            if (loggedIn) {
                router.push('/scan');
            } else {
                router.push('/login');
            }
        }, 1500); // 1.5s loading animation

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: 'white',
            zIndex: 9999
        }}>
            <div className="loader" style={{
                width: '50px',
                height: '50px',
                border: '5px solid rgba(255,255,255,0.1)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '20px'
            }}></div>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <h2>Verifying Access...</h2>
        </div>
    );
}
