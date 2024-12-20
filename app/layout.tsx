import { Inter, Space_Mono } from "next/font/google";
import type { Metadata } from "next";

import "./global.css";

const inter = Inter({
    subsets: ["latin"],
    display: "block",
    variable: "--font-inter"
});

const spaceMono = Space_Mono({
    subsets: ["latin"],
    display: "block",
    weight: ["400", "700"],
    variable: "--font-mono"
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
        <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
            <body className="bg-bg-dark text-main font-inter tracking-[0.0125em]">{children}</body>
        </html>
    );
}
