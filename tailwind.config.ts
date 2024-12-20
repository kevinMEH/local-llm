import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        colors: {
            "transparent": "transparent",
            "current": "currentColor",

            // Backgrounds
            "bg-light": "#132325",
            "bg-mid": "#101C1E",
            "bg-dark": "#0D1719",

            // Border
            "highlight": "#15383E",

            // Text
            "main": "#E9F6EC",
            "sub": "#A1BFA3",
            "quiet": "#526659"
        },
        fontFamily: {
            "inter": ["var(--font-inter)"],
            "mono": ["var(--font-mono)"]
        }
    },
    plugins: [],
}

export default config;