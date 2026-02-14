import type { Metadata } from "next";
import "../../styles/scan-access.css";

export const metadata: Metadata = {
    title: "SESWA - Scanner & Attendance",
    description: "Scan QR codes and manage event attendance",
};

export default function ScanLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
