import { Inter } from "next/font/google";
import type { Metadata } from "next";

import "./global.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter"
});

export const metadata: Metadata = {
    title: "Offline LLM"
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable}`}>
            <body>{children}</body>
        </html>
    );
}
