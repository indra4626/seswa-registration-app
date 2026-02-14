export default function StudentLoading() {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#0f172a",
                zIndex: 9999,
                gap: "20px",
            }}
        >
            <img
                src="/assets/seswa.png"
                alt="SESWA"
                width={100}
                height={100}
                style={{ objectFit: "contain" }}
            />
            <p
                style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#e0e7ff",
                    letterSpacing: "1px",
                    margin: 0,
                    fontFamily: "'Inter', system-ui, sans-serif",
                }}
            >
                seswa.in
            </p>
            <div
                style={{
                    width: 26,
                    height: 26,
                    border: "3px solid rgba(99,102,241,0.15)",
                    borderTopColor: "#818cf8",
                    borderRadius: "50%",
                    animation: "seswa-spin 0.8s linear infinite",
                }}
            />
            <style>{`
        @keyframes seswa-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
