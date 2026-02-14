import type { Metadata } from "next";
import "../../styles/login.css";

export const metadata: Metadata = {
    title: "SESWA - Login",
    description: "Login to access the SESWA management system",
};

export default function LoginLayout({
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
