import type { Metadata } from "next";
import "../../styles/common.css";
import "../../styles/dashboard.css";

export const metadata: Metadata = {
    title: "SESWA - Event Dashboard",
    description: "Real-time event statistics and attendance management",
};

export default function DashboardLayout({
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
