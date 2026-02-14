import type { Metadata } from "next";
import "../../styles/common.css";
import "../../styles/student.css";

export const metadata: Metadata = {
    title: "SESWA - Student Registration",
    description: "Generate your unique QR code for event registration",
};

export default function StudentLayout({
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
